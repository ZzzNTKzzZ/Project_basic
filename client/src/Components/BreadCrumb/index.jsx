import styles from "./BreadCrumb.module.scss";
import { useLocation, Link } from "react-router-dom";

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export default function Breadcrumb({ currentPath }) {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  let buildPath = "";

  return (
    <nav className={styles.breadcrumb}>
      <Link to="/">Home</Link>

      {paths.map((p, index) => {
        const isLast = index === paths.length - 1;
        buildPath += `/${p}`;
        return (
          <span key={index}>
            {" > "}
            {isLast ? (
              <span className={styles.current}>
                {capitalize(currentPath || decodeURIComponent(p))}
              </span>
            ) : (
              <Link to={buildPath}>{capitalize(decodeURIComponent(p))}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
