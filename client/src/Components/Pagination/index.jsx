import styles from "./Pagination.module.scss";
import { Arrow } from "../../Assets";

export default function Pagination({
  totalIndex,
  currentIndex,
  setCurrentIndex,
  arrow = false,
}) {
  
  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1 > totalIndex ? totalIndex : prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1 < 1 ? 1 : prev - 1);
  };

  return (
    <div className={styles.wrapper}>
     {arrow && <span className={styles.left} onClick={handlePrev}>
        <Arrow />
      </span>}
      {Array.from({ length: totalIndex }, (_, i) => (
        <div
          key={i}
          className={`${styles.circle} ${
            i === currentIndex - 1 ? styles.active : ""
          }`}
          onClick={() => setCurrentIndex(i + 1)}
        />
      ))}
      {arrow && <span className={styles.right} onClick={handleNext}>
        <Arrow />
      </span>}
    </div>
  );
}
