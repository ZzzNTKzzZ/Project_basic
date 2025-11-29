import { useEffect, useState } from "react";
import { Filter, Sort } from "../../Assets";
import styles from "./Shop.module.scss";
import SortDropdown from "./Components/SortDropdown.jsx";
import FilterPopup from "./Components/FilterPopup";
import ProductCard from "../../Components/ProductCard";
import Pagination from "../../Components/Pagination/index.jsx";
import { useLocation, useSearchParams } from "react-router-dom";

export default function Shop() {
  const location = useLocation();
  const [sortType, setSortType] = useState("Best Seller");
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState([]);
  const [options, setOptions] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState({});

  const pageSize = 20;
  const filterOption = ["Category", "Price"];
  const sortOptions = ["Best Seller", "Newest", "Low to High", "High to Low"];

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("http://localhost:5000/category");
      const data = await res.json();
      setOptions({ category: data });
    };
    fetchCategories();
  }, []);

  // Fetch products whenever searchParams change
  useEffect(() => {
    const segments = location.pathname.split("/");
    let tag = "";

    if (segments.includes("new_arrival")) {
      tag = "tag/new_arrival";
    }
    if (segments.includes("sale")) {
      tag = "tag/sale";
    }

    const category = searchParams.get("category");
    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");
    const fetchProducts = async () => {
      const query = new URLSearchParams();
      if (category) query.append("category", category);
      if (min) query.append("minPrice", min);
      if (max) query.append("maxPrice", max);
      if (sort) query.append("sort", sort);

      const res = await fetch(
        `http://localhost:5000/products/${tag}?${query.toString()}`
      );
      const data = await res.json();
      setProducts(data);
      console.log(data)
      setLoading(false);
    };

    fetchProducts();

    // Restore filter state from URL
    const newFilter = {};
    if (category) newFilter.category = category.split(",");
    if (min) newFilter.minPrice = min;
    if (max) newFilter.maxPrice = max;
    setFilter(newFilter);
  }, [location.pathname, searchParams]);

  // Pagination
  useEffect(() => {
    const start = (currentIndex - 1) * pageSize;
    const end = start + pageSize;
    setPage(products.slice(start, end));

    setTimeout(() => window.scrollTo({ top: 0 }), 5);
  }, [currentIndex, products]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.wrapper}>
      <div className="container">
        {/* HEADER */}
        <div className={styles.shopHeader}>
          <div className={styles.sortSection}>
            <span className={styles.sortIcon}>
              <Sort />
            </span>
            <SortDropdown
              sortType={sortType}
              sortOptions={sortOptions}
              openSort={openSort}
              setOpenSort={setOpenSort}
              setSortType={setSortType}
              setSearchParams={setSearchParams}
              searchParams={searchParams}
            />
          </div>

          <div
            className={styles.filterButton}
            onClick={() => setOpenFilter(!openFilter)}
          >
            <p>Filters</p>
            <span className={styles.filterIcon}>
              <Filter />
            </span>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className={styles.products}>
          {page.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>

        {/* PAGINATION */}
        <Pagination
          totalIndex={Math.ceil(products.length / pageSize)}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          arrow
        />

        {/* FILTER POPUP */}
        {openFilter && (
          <FilterPopup
            filterOption={filterOption}
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            options={options}
            filter={filter}
            setFilter={setFilter}
            setSearchParams={setSearchParams}
            searchParams={searchParams}
          />
        )}
      </div>
    </div>
  );
}
