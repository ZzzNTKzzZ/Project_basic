import { useState } from "react";
import Button from "../Button";
import styles from "./ProductList.module.scss";
import ProductCard from "../ProductCard";
import { Arrow } from "../../Assets";
import Pagination from "../Pagination";
import { useEffect } from "react";

export default function ProductList() {
  const listCategory = [
    "New Arrivals",
    "Sale",
    "Dress",
    "Jean",
  ];
  const [isActive, setIsActive] = useState("New Arrivals");
  const [currentIndex, setCurrentIndex] = useState(1);
  const [totalIndex, setTotalIndex] = useState();
  const [products, setProducts] = useState([]);
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 === 0 ? totalIndex : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex(currentIndex + 1 > totalIndex ? 1 : currentIndex + 1);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/products/");
        const data = await res.json();
        setTotalIndex(Math.ceil(data.length / 4));
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1>POPULAR CATEGORY</h1>
      <div className={styles.listCategory}>
        {listCategory.map((category, index) => (
          <Button
            key={index}
            className={`${styles.category} ${
              isActive === category ? styles.activeCategory : ""
            }`}
            type={2}
            onClick={() => setIsActive(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className={styles.list}>
        <span
          className={`${styles.iconLeft} ${styles.arrowIcon}`}
          onClick={handlePrev}
        >
          <Arrow />
        </span>
        <div className={styles.sliderWrapper}>
          <div
            className={styles.productList}
            style={{ transform: `translateX(-${(currentIndex - 1) * 100}%)` }}
          >
            {products.map((product) =>{
              return (
                <ProductCard key={product._id} product={product} />
              )})}
          </div>
        </div>
        <span
          className={`${styles.iconRight} ${styles.arrowIcon}`}
          onClick={handleNext}
        >
          <Arrow />
        </span>
      </div>
      <Pagination
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        totalIndex={5}
      />
    </div>
  );
}
