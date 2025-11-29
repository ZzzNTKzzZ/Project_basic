// PopUpAddress.jsx
import { useState } from "react";
import InputSelect from "../../Components/InputSelect";
import Button from "../../Components/Button";
import styles from "./Account.module.scss";

export default function PopUpAddress({ closePopup, user, setUser }) {
  const [city, setCity] = useState({});
  const [ward, setWard] = useState({});
  const [addressDetail, setAddressDetail] = useState("");

  const handleSubmit = () => {
    closePopup();
    try {
      if (city.name.trim() === "" && ward.ward_name.trim() === "") return;
      const fetchApi = async () => {
        const res = await fetch(
          `http://localhost:5000/user/edit/address/${user._id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              city: city.name,
              ward: ward.ward_name,
              addressDetail,
            }),
          }
        );

        const data = await res.json();

        if (!data.ok) {
          console.log(data.mess);
        }
        setUser((prev) => ({ ...prev, address: data }));
      };
      fetchApi();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.popUpOverLay}>
      <div className={styles.popUpAddress}>
        <div className={styles.header}>
          <h2>New Address</h2>
        </div>
        <div className={styles.body}>
          {/* City select */}
          <InputSelect
            placeholder="City"
            apiUrl="https://34tinhthanh.com/api/provinces"
            query={city}
            setQuery={setCity}
          />

          {/* Ward select */}
          <InputSelect
            placeholder="Ward"
            apiUrl={
              city?.province_code
                ? `https://34tinhthanh.com/api/wards?province_code=${city.province_code}`
                : ""
            }
            query={ward}
            setQuery={setWard}
            disabled={!city?.province_code} 
          />

          {/* Address detail */}
          <textarea
            placeholder="Address detail user"
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
            className={styles.addressDetail}
          />

          {/* Buttons */}
          <div className={styles.groupBtn}>
            <Button className={styles.returnBtn} onClick={closePopup}>
              Return
            </Button>
            <Button
              type={1}
              className={styles.completeBtn}
              onClick={handleSubmit}
            >
              Complete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
