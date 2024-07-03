'use client'

import { useState, useEffect } from 'react';
import styles from './profile.module.css';
import axios from 'axios';

function Profile() {
    const [user, setUser] = useState({
        fullname: 'Tuấn Anh',
        email: 'anh@gmail.com',
        phone: '0987654321',
        username: 'Tunaa002',
        avatar: '/avatar/avatar-default.png'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [birthdate, setBirthdate] = useState('');
    const [gender, setGender] = useState('');
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    return;
                }
                const response = await axios.get('http://localhost:5000/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const { fullname, email, phone, username, avatar, birthdate, gender } = response.data;

                setUser({
                    fullname,
                    email,
                    phone,
                    username,
                    avatar: avatar || '/avatar/avatar-default.png'
                });
                setBirthdate(birthdate || '');
                setGender(gender || '');
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfile();
    }, []);


    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser({ ...user, avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBirthdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBirthdate(event.target.value);
    };
    
    const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setGender(event.target.value);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleEditClick = () => {
        if (isEditing) {
            // Save changes
            // Call API to save changes here
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className={styles['profile-main']}>
            <div className={styles['profile-container']}>
                <div className={styles['avatar']}>
                    <label htmlFor="avatarInput" className={styles['avatar-label']}>
                        <img src={user.avatar} alt="Avatar" />
                        <input 
                            type="file" 
                            id="avatarInput" 
                            onChange={handleAvatarChange} 
                            disabled={!isEditing}
                            className={styles['avatar-input']}
                        />
                    </label>
                </div>
                <div className={styles['profile-info']}>
                    <input
                        type="text"
                        name="fullname"
                        value={user.fullname}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                    <input
                        type="text"
                        name="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                    <input
                        type="date"
                        name="birthdate"
                        value={birthdate}
                        onChange={handleBirthdateChange}
                        disabled={!isEditing}
                    />
                    <select
                        name="gender"
                        value={gender}
                        onChange={handleGenderChange}
                        disabled={!isEditing}
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </select>
                </div>
                <button className={styles['edit-profile-btn']} onClick={handleEditClick}>
                    {isEditing ? 'Lưu' : 'Chỉnh sửa hồ sơ'}
                </button>
            </div>
        </div>
    );
}

export default Profile;
