'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from './sign-up.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        repassword: ''
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        const { name, email, phone, username, password, repassword } = formData;

        // Validation checks
        if (phone.length !== 10 || isNaN(Number(phone))) {
            alert('Số điện thoại phải gồm 10 ký tự số!');
            return;
        }
        
        if (username.length < 6 || username.length > 20) {
            alert('Tên đăng nhập phải từ 6 đến 20 ký tự!');
            return;
        }

        if (password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        if (password !== repassword) {
            alert('Mật khẩu nhập lại không trùng khớp!');
            return;
        }

        try {
            await axios.post('http://localhost:5000/sign-up', {
                name,
                email,
                phone,
                username,
                password
            });

            // console.log('User registered successfully:', response.data);
            window.location.href = '/sign-in';
        } catch (error: any) {
            console.error('Error registering user:', error.message);
        }
    };

    const { name, email, phone, username, password, repassword } = formData;

    // Kiểm tra nếu tất cả các trường có giá trị
    const isFormFilled = name && email && phone && username && password && repassword;

    return (
        <div className={styles['sign-up-form']}>
            <div className={styles['sign-up-container']}>
                <form className={styles['sign-up']}>
                    <h2 className={styles['title']}>Đăng ký</h2>
                    <div className={styles['form-group']}>
                        <label htmlFor="name">Họ tên:</label>
                        <input type="text" id="name" name="name" placeholder='Họ tên' value={name} onChange={handleChange} required />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder='Email' value={email} onChange={handleChange} required />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="phone">Số điện thoại:</label>
                        <input type="tel" id="phone" name="phone" placeholder='Số điện thoại' value={phone} onChange={handleChange} required />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input type="text" id="username" name="username" placeholder='Nhập 6-20 ký tự' value={username} onChange={handleChange} required />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="password">Mật khẩu</label>
                        <input type="password" id="password" name="password" placeholder='Mật khẩu' value={password} onChange={handleChange} required />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="repassword">Nhập lại mật khẩu</label>
                        <input type="password" id="repassword" name="repassword" placeholder='Nhập lại mật khẩu' value={repassword} onChange={handleChange} required />
                    </div>
                    <Link href="/sign-in" className={styles['nav-link']}>Đến đăng nhập</Link>
                    <button className={styles['submit-button']} type="button" onClick={handleSubmit} disabled={!isFormFilled}>Đăng ký</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
