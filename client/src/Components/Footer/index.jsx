import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";
import { Facebook, Github, Instagram, Tiktok } from "../../Assets";
export default function Footer() {
  const footerSections = [
    {
      title: "Links",
      items: ["About Us", "Contact", "News", "Careers"],
    },
    {
      title: "Shop",
      items: ["Categories", "Best Sellers", "Sale"],
    },
    {
      title: "Support",
      items: ["FAQs", "Shipping", "Order Tracking", "Payment Method"],
    },
  ];

  return (
    <footer className={styles.background}>
      <div className={`container ${styles.wrapper}`}>
        <div className="col-2">
          <div className={styles.logo}>
            <p>ELORA STORE</p>
            <span className={styles.des}>
              Your one-stop shop for quality products, great prices, and fast
              delivery.
            </span>
          </div>
        </div>

        <div className="col-8">
          <div className={styles.body}>
            {footerSections.map(({ title, items }) => (
              <div key={title} className={styles.section}>
                <p>{title}</p>
                <ul className={styles.list}>
                  {items.map((item, i) => (
                    <li key={i}>
                      <Link to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}>
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="col-2">
          <div className={styles.social}>
            <p>Social</p>
            <div className={styles.iconSocials}>
              <Link
                to={"https://www.facebook.com/khanh.nguyen.987665?locale=vi_VN"}
                className={styles.icon}
              >
                <Facebook />
              </Link>
              <Link
                to={"https://www.tiktok.com/vi-VN/"}
                className={styles.icon}
              >
                <Tiktok />
              </Link>
              <Link
                to={"https://www.instagram.com/n22t.k/"}
                className={styles.icon}
              >
                <Instagram />
              </Link>
              <Link to={"https://github.com/ZzzNTKzzZ"} className={styles.icon}>
                <Github />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
