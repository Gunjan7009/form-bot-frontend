import React, { useState } from "react";
import styles from "./LoginSignup.module.css";
import triangleImage from "../image/loginleft.png";
import pinkCircleImage from "../image/loginright.png";
import orangeCircleImage from "../image/loginbottom.png";
import GoogleIcon from "../image/googleicon.png";
import { Link, useNavigate } from "react-router-dom"; 
import api from "../data/api";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: "", email: "", password: "", confirmpassword: "" });
  const navigate = useNavigate(); 


  const validateForm = () => {
    const newErrors = {};
    if (!name) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }
    if (password !== confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        const response = await api.post("/user/signup", {
          name,
          email,
          password,
          confirmpassword,
        });
        console.log(response);
        if (response.status === 201) {
          console.log("Register successful", response.data);
          setTimeout(() => {
            navigate("/login");
          }, 5000);}
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div className={styles.loginContainer}>
      <button
        className={styles.backButton}
        onClick={() => navigate(-1)} 
      >
        ←
      </button>
      <img src={triangleImage} alt="Triangle" className={styles.triangle} />
      <img
        src={pinkCircleImage}
        alt="Pink Circle"
        className={styles.pinkCircle}
      />
      <img
        src={orangeCircleImage}
        alt="Orange Circle"
        className={styles.orangeCircle}
      />
      <div className={styles.loginForm}>
        <form onSubmit={handleSubmit}>
          <div className={styles.cont}>
            <label>Username</label>
            <input
              type="name"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input} ${errors.name ? styles.errorInput : ""
                }`}
            />
            {errors.name && <p className={styles.errorText}>{errors.name}</p>}
          </div>
          <div className={styles.cont}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input} ${errors.email ? styles.errorInput : ""
                }`}
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>
          <div className={styles.cont}>
            <label>Password</label>
            <input
              type="password"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.input} ${errors.password ? styles.errorInput : ""
                }`}
            />
            {errors.password && (
              <p className={styles.errorText}>{errors.password}</p>
            )}
          </div>
          <div className={styles.cont}>
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="*********"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${styles.input} ${errors.confirmpassword ? styles.errorInput : ""
                }`}
            />
            {errors.confirmpassword && (
              <p className={styles.errorText}>{errors.confirmpassword}</p>
            )}
          </div>
          <button type="submit" className={styles.loginButton} disabled={loading} onClick={handleSubmit}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <div className={styles.separator}>
            <span>OR</span>
          </div>
          <button type="button" className={styles.googleButton}>
            <img
              src={GoogleIcon}
              alt="Google Icon"
              className={styles.googleIcon}
            />
            Sign Up with Google
          </button>
        </form>
        <p>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
