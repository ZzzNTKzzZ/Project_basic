import Banner from "../../Components/Banner";
import { BrandCooperate } from "../../Assets";
import styles from "./Home.module.scss";
import ProductList from "../../Components/ProductList";
import TopSection from "../../Components/TopSection";
import Collection from "../../Components/Collection";
export default function Home() {


  return (
    <div className={styles.wrapper}>
      <div className="container">
        <Banner />
        <div className={styles.brandBanner}>
          <img src={BrandCooperate} alt="BrandsImage" />
        </div>
        <ProductList />
        <TopSection />
        <Collection />
      </div>
    </div>
  );
}
