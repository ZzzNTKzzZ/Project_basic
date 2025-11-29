import { Link } from "react-router-dom";
import Tag from "../Tag";
import styles from "./ProductCard.module.scss";

export default function ProductCard({ product, ...passProps }) {
  const { name, price, sale, tags, slug, image, sold } = product;
  if (!product) return null;

  
  return (
    <Link
      to={`/shop/products/` + slug}
      className={`${styles.wrapper} col-3`}
      {...passProps}
    >
      <div className={styles.background}>
        <img src={`http://localhost:5000${image}`} alt="alt image" />
        <div className={styles.des}>
          <p className={styles.name}>{name}</p>
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <Tag key={index} tag={tag} />
            ))}
          </div>
          <div className={styles.info}>
            {sale ? (
              <span className={styles.sale}>
                <span className={styles.price}>
                {sale}
                </span>
                <span className={styles.oldPrice}>{price}</span>
              </span>
) : (
              <span className={styles.price}>{price}</span>
            )}
            <span className={styles.sold}>
              Sold <strong>{sold}</strong>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
