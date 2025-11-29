import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./TopSection.module.scss";

const DEFAULT_ITEM = {
  name: "Product Name",
  des: {
    material: "Soft premium cotton",
    fit: "Relaxed fit",
    comfort: "Breathable and wrinkle-resistant",
  },
};

export default function TopSection({ item = DEFAULT_ITEM }) {
  const [isHovered, setIsHovered] = useState(false);
  const IMAGE_COUNT = 5;

  const handleHover = (state) => () => setIsHovered(state);

  return (
    <section className={styles.wrapper}>
      {/* === HEADER === */}
      <header className={styles.header}>
        <h1>TOP PRODUCT</h1>
      </header>

      <div className={styles.layout}>
        {/* === SIDE PRODUCTS === */}
        <aside className={styles.sideProducts}>
          <div className={styles.curve}></div>

          <div className={styles.smallImages}>
            {Array.from({ length: IMAGE_COUNT }, (_, i) => {
              const index = i + 1;
              return (
                <div
                  key={index}
                  className={`${styles.smallImage} ${styles[`locationImage_${index}`]}`}
                >
                  <img
                    src={`/images/product-${index}.jpg`}
                    alt={`Product ${index}`}
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </aside>

        {/* === MAIN PRODUCT === */}
        <div className={styles.mainProduct}>
          <div className={styles.curve}></div>

          <div
            className={`${styles.imageProduct} ${isHovered ? styles.isHover : ""}`}
            onMouseEnter={handleHover(true)}
            onMouseLeave={handleHover(false)}
          >
            <img
              src="/images/product.jpg"
              alt={item.name}
              draggable={false}
            />

            <div className={styles.backgroundName}>
              {isHovered ? (
                <Link to="/product-detail" className={styles.nameItem}>
                  See Detail
                </Link>
              ) : (
                <div className={styles.nameItem}>
                  <p>{item.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === DESCRIPTION BUBBLES === */}
        <div className={styles.desProduct}>
          {Object.entries(item.des).map(([key, value]) => (
            <div key={key} className={styles.des}>
              {value}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
