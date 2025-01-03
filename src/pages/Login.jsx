import React, { useState } from 'react' 
import styles from "./LoginSignup.module.css"; 
import triangleImage from "../image/loginleft.png"; 
import pinkCircleImage from "../image/loginright.png"; 
import orangeCircleImage from "../image/loginbottom.png"; 
import GoogleIcon from "../image/googleicon.png" 
import { Link, useNavigate } from "react-router-dom"; 
import api from '../data/api'; 
import { useDispatch } from 'react-redux'; 
import { setToken } from '../redux/authSlice'; 
const Login = () => { 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [errors, setErrors] = useState({ email: "", password: "" }); 
     const [loading, setLoading] = useState(false); 
     const dispatch = useDispatch(); 
    const navigate = useNavigate(); 
 
    const validateForm = () => { 
        const newErrors = {}; 
        if (!email) { 
            newErrors.email = "Email is required"; 
        } else if (!/\S+@\S+\.\S+/.test(email)) { 
            newErrors.email = "Invalid email format"; 
        } 
 
        if (!password) { 
            newErrors.password = "Password is required"; 
        } 
 
        setErrors(newErrors); 
        return Object.keys(newErrors).length === 0; 
    }; 
 
 
 
    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        if (validateForm()) { 
            setLoading(true); 
            // console.log("Submitting login data:", data); 
            // setLoading(true); 
            try { 
                console.log("Submitting loginnnnnn data:", { email, password }); 
                const response = await api.post("/user/login", { 
                    email: email, 
                    password: password, 
                }); 
                if (response.status === 200) { 
                    const { token, user } = response.data; 
                    dispatch(setToken(token)); 
                    localStorage.setItem("token", token); 
                    localStorage.setItem("userData", JSON.stringify(user)); 
                    localStorage.setItem('userId', user._id);
                   
                    navigate("/dashboard"); 
                } else { 
                    alert( 
                        response.data.error || 
                        "Login failed. Please check your credentials and try again." 
                    ); 
                } 
            } catch (error) { 
                console.error("Error during login:", error); 
                alert( 
                    error.response?.data?.error || 
                    "Login failed. Please check your credentials and try again." 
                ); 
            } 
            finally { 
                setLoading(false); 
 
            } 
        } 
    }; 
 
    return ( 
        <div className={styles.loginContainer}> 
            {/* <div className={styles.backgroundShapes}> */} 
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
            {/* </div> */} 
            <div className={styles.loginForm}> 
                <form onSubmit={handleSubmit}> 
                    <div className={styles.cont} > 
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
                        {errors.password && <p className={styles.errorText}>{errors.password}</p>} 
                    </div> 
                    <button type="submit" className={styles.loginButton} disabled={loading}> 
                        {loading ? "Loging In..." : "Log In"} 
                    </button> 
                    <div className={styles.separator}> 
                        <span>OR</span> 
                    </div> 
                    <button type="button" className={styles.googleButton}> 
                        <img src={GoogleIcon} alt="Google Icon" className={styles.googleIcon} /> 
                        Sign In with Google 
                    </button> 
                </form> 
                <p> 
                    Don't have an account?<Link to='/signup'>Register now</Link> 
                </p> 
            </div> 
        </div> 
    ); 
} 
 
export default Login