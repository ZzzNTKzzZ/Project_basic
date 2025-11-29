import { Star, StarActive } from "../../Assets/Icons";
import styles from "./Rating.module.scss";

export default function Rating({ rating }) {
  const star = Math.round(rating);

  return (
    <div className={styles.wrapper}>
      {rating}
      <div>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i}>{i <= star ? <StarActive /> : <Star />}</span>
        ))}
      </div>
    </div>
  );
}
