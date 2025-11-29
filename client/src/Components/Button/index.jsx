import { Link } from "react-router-dom";
import styles from "./Button.module.scss";
import clsx from "clsx";

export default function Button({
  type,
  icon,
  href,
  active,
  children,
  className,
  disabled,
  ...passProps
}) {
  const Component = href ? Link : "button";
  const classNames = clsx(styles.wrapper, className, {
    [styles.type_1]: type === 1,
    [styles.type_2]: type === 2,
    [styles.icon]: icon,
    [styles.isLink]: href,           
    [styles.isButton]: !href,
    [styles.isActive]: active,
    [styles.disabled]: disabled,
  });
  return (
    <Component className={classNames} to={href} {...passProps}>
      {icon}
      <span className={styles.content}>
        {children}
      </span>
    </Component>
  );
}

