import { useEffect, useState } from "react";
import { Eyes, Pen, Trash } from "../../Assets";
import Button from "../../Components/Button";
import InputBar from "../../Components/InputBar";
import Pagination from "../../Components/Pagination";
import styles from "./Admin.module.scss";
import Breadcrumb from "../../Components/BreadCrumb";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    price: "",
    sold: "",
    sale: "",
    revenue: "",
  });
  useEffect(() => {
    const fetchProduct = async () => {
      const resProduct = await fetch("http://localhost:5000/products/");
      const dataProduct = await resProduct.json();
      setProducts(dataProduct);
      setLoading(false);
    };
    fetchProduct();
  }, []);
  if (loading) return <div>Loadding...</div>;
  return (
    <div className={styles.productWrapper}>
      <div className={styles.header}>
      <h2>Product List</h2>
      <Breadcrumb />
      </div>
      <div className={`${styles.tableStatistics} ${styles.product}`}>
          <div className={styles.note}>
          Tip search by Product ID: Each product is provided with a unique ID, which you can rely on to find the exact product you need.
          </div>
        <span className={styles.groupAction}>
          <InputBar className={styles.search} />
          <Button className={styles.add}>+ Add new</Button>
        </span>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Product</div>
            <div>Product Id</div>
            <div>Price</div>
            <div>Sold</div>
            <div>Sale</div>
            <div>Action</div>
          </div>

          <div className={styles.tableBody}>
            {products.map((product) => (
              <div className={styles.tableRow} key={product._id}>
                <div className={styles.info}>
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt="alt image"
                  />
                  <p className={styles.name}>
                  {product.name}

                  </p>
                </div>
                <div>{product._id.slice(12)}</div>
                <div>
                  {product.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
                <div>{product.sold}</div>
                <div>
                  {(product.sold * product.price).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
                <div className={styles.action}>
                  <Eyes />
                  <Pen />
                  <Trash />
                </div>
              </div>
            ))}
          </div>
          <Pagination totalIndex={5} currentIndex={1} />
        </div>
      </div>
    </div>
  );
}
