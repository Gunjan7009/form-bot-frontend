import React from "react";
import LeftShape from "../image/homeleft.png";
import RightShape from "../image/homeright.png";
import CenterImage from "../image/homecenter.png";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <div className={styles.navbar}>
                <div className={styles.logo}>
                    <div className={styles.icon}>
                        <svg
                            width="35"
                            height="36"
                            viewBox="0 0 35 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M31.5 0.5H3.5C1.567 0.5 0 2.067 0 4V32C0 33.933 1.567 35.5 3.5 35.5H31.5C33.433 35.5 35 33.933 35 32V4C35 2.067 33.433 0.5 31.5 0.5Z"
                                fill="#0042DA"
                            />
                            <path
                                d="M28.4375 16.1827V14.1934C28.4375 13.7101 28.0457 13.3184 27.5625 13.3184H12.4855C12.0023 13.3184 11.6105 13.7101 11.6105 14.1934V16.1827C11.6105 16.6659 12.0023 17.0577 12.4855 17.0577H27.5625C28.0457 17.0577 28.4375 16.6659 28.4375 16.1827Z"
                                fill="#FF8E20"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M8.43216 17.0577C9.46474 17.0577 10.3018 16.2206 10.3018 15.188C10.3018 14.1554 9.46474 13.3184 8.43216 13.3184C7.39957 13.3184 6.5625 14.1554 6.5625 15.188C6.5625 16.2206 7.39957 17.0577 8.43216 17.0577Z"
                                fill="#FF8E20"
                            />
                            <path
                                d="M6.5625 19.8027V21.792C6.5625 22.2752 6.95425 22.667 7.4375 22.667H22.5145C22.9977 22.667 23.3895 22.2752 23.3895 21.792V19.8027C23.3895 19.3194 22.9977 18.9277 22.5145 18.9277H7.4375C6.95425 18.9277 6.5625 19.3194 6.5625 19.8027Z"
                                fill="white"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M26.5679 18.9277C25.5353 18.9277 24.6982 19.7648 24.6982 20.7974C24.6982 21.83 25.5353 22.6671 26.5679 22.6671C27.6005 22.6671 28.4376 21.83 28.4376 20.7974C28.4376 19.7648 27.6005 18.9277 26.5679 18.9277Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                    <span className={styles.logoname}>FormBot</span>
                </div>
                <div className={styles.buttons}>
                    <button className={styles.signInBtn}><Link to='/signup'>Sign in</Link></button>
                    <button className={styles.createBtn}>Create a FormBot</button>
                </div>
            </div>
            <section className={styles.hero}>
                <img
                    src={LeftShape}
                    alt="Left Decorative Shape"
                    className={styles.leftShape}
                />
                <div className={styles.content}>
                    <h1 className={styles.title}>Build advanced chatbots visually</h1>
                    <p className={styles.subtitle}>
                        Typebot gives you powerful blocks to create unique chat experiences.
                        Embed them anywhere on your web/mobile apps and start collecting
                        results like magic.
                    </p>
                    <button className={styles.ctaButton}>
                        Create a FormBot for free
                    </button>
                </div>
                <img
                    src={RightShape}
                    alt="Right Decorative Shape"
                    className={styles.rightShape}
                />
            </section>
            <div>
                <img
                    src={CenterImage}
                    alt="center image"
                    className={styles.middleimg}
                />
            </div>
            <footer className={styles.footer}>
                <div className={styles.section}>
                    <div className={styles.footerlogo}>
                        <svg
                            width="35"
                            height="36"
                            viewBox="0 0 35 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M31.5 0.5H3.5C1.567 0.5 0 2.067 0 4V32C0 33.933 1.567 35.5 3.5 35.5H31.5C33.433 35.5 35 33.933 35 32V4C35 2.067 33.433 0.5 31.5 0.5Z"
                                fill="#0042DA"
                            />
                            <path
                                d="M28.4375 16.1827V14.1934C28.4375 13.7101 28.0457 13.3184 27.5625 13.3184H12.4855C12.0023 13.3184 11.6105 13.7101 11.6105 14.1934V16.1827C11.6105 16.6659 12.0023 17.0577 12.4855 17.0577H27.5625C28.0457 17.0577 28.4375 16.6659 28.4375 16.1827Z"
                                fill="#FF8E20"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M8.43216 17.0577C9.46474 17.0577 10.3018 16.2206 10.3018 15.188C10.3018 14.1554 9.46474 13.3184 8.43216 13.3184C7.39957 13.3184 6.5625 14.1554 6.5625 15.188C6.5625 16.2206 7.39957 17.0577 8.43216 17.0577Z"
                                fill="#FF8E20"
                            />
                            <path
                                d="M6.5625 19.8027V21.792C6.5625 22.2752 6.95425 22.667 7.4375 22.667H22.5145C22.9977 22.667 23.3895 22.2752 23.3895 21.792V19.8027C23.3895 19.3194 22.9977 18.9277 22.5145 18.9277H7.4375C6.95425 18.9277 6.5625 19.3194 6.5625 19.8027Z"
                                fill="white"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M26.5679 18.9277C25.5353 18.9277 24.6982 19.7648 24.6982 20.7974C24.6982 21.83 25.5353 22.6671 26.5679 22.6671C27.6005 22.6671 28.4376 21.83 28.4376 20.7974C28.4376 19.7648 27.6005 18.9277 26.5679 18.9277Z"
                                fill="white"
                            />
                        </svg>
                        <span className={styles.footerlogoname}>FormBot</span>
                    </div>
                    <p>
                        Made with ❤️ by{" "}<br />
                        <a
                            href="https://twitter.com/baptisteArno"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            @cuvette
                        </a>
                    </p>
                </div>
                <div className={styles.section}>
                    <h4 className={styles.heading}>Product</h4>
                    <ul>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                Status
                            </a>
                        </li>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                Documentation
                            </a>
                        </li>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                Roadmap
                            </a>
                        </li>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                Pricing
                            </a>
                        </li>
                    </ul>
                </div>
                <div className={styles.section}>
                    <h4 className={styles.heading}>Community</h4>
                    <ul>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                Discord
                            </a>
                        </li>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                GitHub repository
                            </a>
                        </li>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                Twitter
                            </a>
                        </li>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                        </li>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                OSS Friends
                            </a>
                        </li>
                    </ul>
                </div>
                <div className={styles.section}>
                    <h4 className={styles.heading}>Company</h4>
                    <ul>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                Contact
                            </a>
                        </li>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                Terms of Service
                            </a>
                        </li>
                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                Privacy Policy
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default Home;
