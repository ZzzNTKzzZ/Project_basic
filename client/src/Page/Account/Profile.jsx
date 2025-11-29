import { useState } from "react";
import { useUser } from "../../Hook/useUserContext";
import styles from "./Account.module.scss";
import Button from "../../Components/Button";
import { AltImage } from "../../Assets";
export default function Profile() {
  const { user, setUser } = useUser();

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [dob, setDob] = useState(user.dob || "");
  const [file, setFile] = useState(user.file || AltImage);
  const [preview, setPreview] = useState(AltImage);
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name",name);
      formData.append("email",email);
      formData.append("phone",phone);
      formData.append("dob",dob);
      formData.append("image", file)
      const res = await fetch(`http://localhost:5000/user/edit/${user._id}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(res.error);
        return;
      }

      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setDob(user.dob || "");
    setFile(user.file || AltImage)
  };

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.header}>
        <h2>My Profile</h2>
        <p>Manage your personal information to secure your account</p>
      </div>

      <div className={styles.body}>
        <div className={styles.left}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email Login</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />

          <Button className={styles.saveBtn} onClick={handleSave}>
            Save Changes
          </Button>
          <Button type={2} className={styles.resetBtn} onClick={handleReset}>
            Reset
          </Button>
        </div>
        <div className={styles.right}>
          <img src={preview} alt="" />
    <input
      type="file"
      id="fileUpload"
      className={styles.hiddenInput}
      onChange={(e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
          setPreview(URL.createObjectURL(selectedFile));
        }
      }}
    />

          <label htmlFor="fileUpload" className={styles.uploadBtn}>
                Choose Image
          </label>

          <span className={styles.imageNote}>
            Maximum file size 1 MB
            <br />
            Format: .JPEG, .PNG
          </span>
        </div>
      </div>
    </div>
  );
}
