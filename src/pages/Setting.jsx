import React, { useState } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import styles from '../pages/Setting.module.css';
import api from '../data/api';
import { useNavigate } from 'react-router-dom';

const Setting = () => {
    const [visibility, setVisibility] = useState({
        email: false,
        oldPassword: false,
        newPassword: false,
    });
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newpassword, setNewpassword] = useState('');
    const [message, setMessage] = useState('');

    const toggleVisibility = (field) => {
        setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create an object with the fields and their values
        const updatedFields = {
            ...(name && { name }),
            ...(email && { email }),
            ...(oldPassword && { oldPassword }),
            ...(newpassword && { newpassword }),
        };

        // If no fields are updated, show a message and return
        if (Object.keys(updatedFields).length === 0) {
            setMessage('Please update at least one field.');
            return;
        }

        try {
            const response = await api.post('/user/update', updatedFields);

            if (response.status === 200) {
                setMessage('User updated successfully!');
                setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message || 'An error occurred while updating settings.'
            );
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        }
    };

    const handlerouteto = async () => {
        try {
        navigate('/login');
        } catch (error) {
            console.log(error);
        }
    
    };
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Settings</h2>
            <div className={styles.messageContainer}>
                <p>{message}</p>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                />

                <div className={styles.inputWrapper}>
                    <input
                        type={visibility.email ? 'text' : 'email'}
                        placeholder="Update Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                    />
                    <button
                        type="button"
                        className={styles.eyeButton}
                        aria-label={visibility.email ? 'Hide email' : 'Show email'}
                        onClick={() => toggleVisibility('email')}
                    >
                        {visibility.email ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </button>
                </div>

                <div className={styles.inputWrapper}>
                    <input
                        type={visibility.oldPassword ? 'text' : 'password'}
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className={styles.input}
                    />
                    <button
                        type="button"
                        className={styles.eyeButton}
                        aria-label={visibility.oldPassword ? 'Hide old password' : 'Show old password'}
                        onClick={() => toggleVisibility('oldPassword')}
                    >
                        {visibility.oldPassword ? (
                            <VisibilityOffOutlinedIcon />
                        ) : (
                            <VisibilityOutlinedIcon />
                        )}
                    </button>
                </div>

                <div className={styles.inputWrapper}>
                    <input
                        type={visibility.newPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        value={newpassword}
                        onChange={(e) => setNewpassword(e.target.value)}
                        className={styles.input}
                    />
                    <button
                        type="button"
                        className={styles.eyeButton}
                        aria-label={visibility.newPassword ? 'Hide new password' : 'Show new password'}
                        onClick={() => toggleVisibility('newPassword')}
                    >
                        {visibility.newPassword ? (
                            <VisibilityOffOutlinedIcon />
                        ) : (
                            <VisibilityOutlinedIcon />
                        )}
                    </button>
                </div>

                <button type="submit" className={styles.updateButton}>
                    Update
                </button>
            </form>
            <div className={styles.logoutContainer}>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M15.016 7.38948V6.45648C15.016 4.42148 13.366 2.77148 11.331 2.77148H6.45597C4.42197 2.77148 2.77197 4.42148 2.77197 6.45648V17.5865C2.77197 19.6215 4.42197 21.2715 6.45597 21.2715H11.341C13.37 21.2715 15.016 19.6265 15.016 17.5975V16.6545"
                        stroke="#CF3636"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M21.8096 12.0215H9.76855"
                        stroke="#CF3636"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M18.8813 9.10547L21.8093 12.0205L18.8813 14.9365"
                        stroke="#CF3636"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <button className={styles.logoutButton} onClick={handlerouteto}>Log out</button>
            </div>
        </div>
    );
};

export default Setting;
