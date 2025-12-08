import { useState } from "react";
import InputBar from "../../Components/InputBar";
import styles from "./Login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../Components/Button";
import { useUser } from "../../Hook/useUserContext";

function SignUpBox() {
  const { setUser } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const res = fetch("http://localhost:5000/user/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Sign In error:", data.error);
        return;
      }
      
      setUser(data);
      console.log("Sign up success:", data);

    } catch (error) {
      console.log("Sign In: ", error);
    }
  };

  return (
    <div>
      <div className={styles.loginBox}>
        <h2>Sign Up</h2>
        <div className={styles.fromLogin}>
          <InputBar placeholder="Name" icon={false} onChange={setName} />
          <InputBar placeholder="Email" icon={false} onChange={setEmail} />
          <InputBar
            placeholder="Password"
            icon={false}
            type="password"
            onChange={setPassword}
          />
          <Button onClick={handleSignUp}>Sign Up</Button>
        </div>
      </div>
    </div>
  );
}

function LogInBox() {
  const { setUser } = useUser();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // server sent an error status (404, 401, etc.)
        console.error("Login error:", data.error);
        return;
      }
      setUser(data);
      navigate("/");
      console.log("Login success:", data);
    } catch (err) {
      console.error("Network error:", err.message);
    }
  };

  return (
    <div className={styles.loginBox}>
      <h2>Login</h2>
      <div className={styles.fromLogin}>
        <InputBar placeholder="Email" icon={false} onChange={setEmail} />
        <InputBar
          placeholder="Password"
          icon={false}
          type="password"
          onChange={setPassword}
        />
        <Button onClick={handleLogin}>Login</Button>
      </div>
    </div>
  );
}

export default function Login() {
  const [mode, setMode] = useState("login");

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <Link to={"/"}>ELORA STORE</Link>
        <span>
          Your one-stop shop for quality products, great prices, and fast
          delivery.
        </span>
      </div>
      <div className={styles.right}>
        {mode === "login" && <LogInBox />}
        {mode === "signUp" && <SignUpBox />}
      </div>
      <div className={styles.mode}>
        {mode === "login" && (
          <Button
            onClick={() => {
              setMode("signUp");
            }}
          >
            Sign Up
          </Button>
        )}
        {mode === "signUp" && (
          <Button
            onClick={() => {
              setMode("login");
            }}
          >
            Log In
          </Button>
        )}
      </div>
    </div>
  );
}
