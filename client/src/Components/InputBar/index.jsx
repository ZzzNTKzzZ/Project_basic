import { Search } from "../../Assets";
import clsx from "clsx";
import styles from "./InputBar.module.scss";

export default function InputBar({
  placeholder = "Search",
  icon = true,
  onChange,
  forId = "",
  className,
  type = "text" 
}) {
  const classNames = clsx(styles.wrapper, className, {
    [styles.withIcon]: icon,
  });

  return (
    <div className={classNames}>
      <input
        className={styles.input}
        id={forId}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
        type={type}
      />
      {icon && (
        <button className={styles.icon} type="button">
          <Search />
        </button>
      )}
    </div>
  );
}
