import clsx from "clsx";
import styles from "./Tag.module.scss";
import { SaleFrame } from "../../Assets";

export default function Tag({ className, tag }) {
  const isSale = /\bsales?\b/i.test(tag);
  const classNames = clsx(styles.wrapper, className, {
    [styles.newArrival]: tag !== "Sale",
    [styles.sales]: isSale,
  });

  return (
    <div className={classNames}>
      {isSale && <SaleFrame className={styles.frame} />}
      <span className={styles.text}>{tag}</span>
    </div>
  );
}
