import styles from "./Account.module.scss";
import Button from "../../Components/Button";
import { useOutletContext } from "react-router-dom";

export default function Address() {
  const { setPopUpAddress, address } = useOutletContext();

  const handleAddAddress = () => {
    setPopUpAddress(true);
  };

  const handleSetDefault = () => {
    
  }
  return (
    <div className={styles.addressWrapper}>
      <div className={styles.header}>
        <h2>My Address</h2>
        <Button className={styles.addAddressBtn} onClick={handleAddAddress}>
          Add more address +
        </Button>
      </div>
      <div className={styles.body}>
        {address?.map((a, index) => (
          <div className={styles.address} key={index}>
            <div>
              <p className={styles.addressDetail}>
                {a.addressDetail}
                <br />
                {Object.values(a).slice(0, -2).join(", ")}
              </p>
              {a.isDefault && (
                <span className={styles.defaultAddress}>Default</span>
              )}
            </div>
            <div className={styles.actions}>
              <button className={styles.option}>Update</button>
              <button className={styles.option}>Delete</button>
              <Button
                type={2}
                className={`${styles.option} ${styles.default}`}
                disabled={a.isDefault}
              >
                Set Default
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
