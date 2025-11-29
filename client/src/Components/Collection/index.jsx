import styles from "./Collection.module.scss";
import { Collection_1, Collection_2 } from "../../Assets";
import { Link } from "react-router-dom";
export default function Collection() {
  const Collections = [Collection_1, Collection_2];
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Collection</h1>
      </div>
      <div className={styles.collectionWrapper}>
        {Collections.map((collection, i) => (
          <div className={styles.collection} key={i}>
            <img src={collection} alt="Collection Image" />
            <Link to={"Collection"} className={styles.collectionInfo}>
                <p>Collection

                <span className={styles.line}></span>
                </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
