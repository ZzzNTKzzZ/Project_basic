import { useOutletContext } from "react-router-dom";
import styles from "./Admin.module.scss";
import { useEffect, useState } from "react";
import { Eyes, Pen, Trash } from "../../Assets";
import InputBar from "../../Components/InputBar";
import Button from "../../Components/Button";
import Breadcrumb from "../../Components/BreadCrumb";
import Pagination from "../../Components/Pagination";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const resUsers = await fetch("http://localhost:5000/user");
      const dataUsers = await resUsers.json();

      setUsers(dataUsers);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.userWrapper}>
      <div className={styles.header}>
      <h2>All User</h2>
      <Breadcrumb />
      </div>
      <div className={`${styles.tableStatistics} ${styles.user}`}>
        <span className={styles.groupAction}>
      <InputBar className={styles.search}/>
      <Button className={styles.add}>
        + Add new
      </Button>
        </span>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Action</div>
          </div>

          <div className={styles.tableBody}>
            {users.map((user) => (
              <div className={styles.tableRow} key={user._id}>
                <div>{user.name}</div>
                <div>{user.email}</div>
                <div>{user.phone}</div>
                <div className={styles.action}>
                  <Eyes />
                  <Pen />
                  <Trash />
                </div>
              </div>
            ))}
          </div>
          <Pagination totalIndex={5} currentIndex={1} />
        </div>
      </div>
    </div>
  );
}
