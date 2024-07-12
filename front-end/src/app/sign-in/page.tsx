'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from './sign-in.module.css';

function SignIn() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignIn = async () => {
        const { username, password } = formData;

        // check username
        if (username.length < 6 || username.length > 20) {
            alert('Tên đăng nhập phải từ 6 đến 20 ký tự!');
            return;
        }

        // check password
        if (password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/sign-in', {
              username,
              password
            });
    
            const { accessToken } = response.data;
    
            const expiry = new Date().getTime() + 60 * 1000; 
            localStorage.setItem('user', JSON.stringify({ accessToken, expiry }));
            window.location.href = '/';
          } catch (error: any) {
            if (error.response && error.response.status === 401) {
              alert('Sai thông tin đăng nhập');
            } else {
              console.error('Error during sign-in:', error.message);
              console.log('Đã xảy ra lỗi, vui lòng thử lại sau');
            }
          }
    };
    const { username, password } = formData;
    const isFormFilled = username && password;
    return (
        <div className={styles['sign-in-form']}>
            <div className={styles['sign-in-container']}>
                <form className={styles['sign-in']} onSubmit={(e) => e.preventDefault()}>
                    <h2 className={styles['title']}>Đăng nhập</h2>
                    <div className={styles['form-group']}>
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input type="text" id="username" name="username" placeholder='Nhập từ 6-20 ký tự' value={username} onChange={handleChange} required />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="password">Mật khẩu</label>
                        <input type="password" id="password" name="password" placeholder='Mật khẩu' value={password} onChange={handleChange} required />
                    </div>
                    <Link href ="/sign-up" className={styles['nav-link']}>Đến đăng ký</Link>
                    <Link href ="/forgot-password" className={styles['nav-link']}>Quên mật khẩu?</Link>
                    <button className={styles['submit-button']} type="submit" onClick={handleSignIn} disabled={!isFormFilled}>Đăng nhập</button>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
