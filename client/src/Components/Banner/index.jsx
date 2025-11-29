import { Banner_1, BrandCooperate } from "../../Assets";
import Button from "../Button";
import styles from "./Banner.module.scss";

export default function Banner() {
  return (
    <div className={styles.wrapper}>
        <div className={`${styles.content} col-6`}>
          <div className={styles.heading}>
            <h1>ELORA STORE</h1>
            <span className={styles.line}></span>
          </div>
          <div className={styles.des}>
            <h2>Elevate your lifestyle with Elora Store</h2>
            <p>
              Explore timeless designs, premium quality, and exclusive offers
              made to bring elegance into every moment.
            </p>
          </div>
          <div className={styles.btnGroup}>
            <Button type={1} className={styles.btnBanner}>
              Buy Now
            </Button>
            <Button type={2} className={styles.btnBanner}>
              Explore Collection
            </Button>
          </div>
        </div>
        <div className={"col-5"}>
          <img src={Banner_1} alt="Banner Image" />
        </div>
     
    </div>
  );
}
