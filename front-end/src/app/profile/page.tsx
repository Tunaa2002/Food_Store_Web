'use client'

import { useState, useEffect } from 'react';
import styles from './profile.module.css';
import axios from 'axios';

function Profile() {
    const [user, setUser] = useState({
        fullname: '',
        email: '',
        phone: '',
        username: '',
        avatar: '/avatar/avatar-default.png'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [birthdate, setBirthdate] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    return;
                }
                const { accessToken } = JSON.parse(storedUser);
                if (!accessToken) {
                    return;
                }
                const response = await axios.get('http://localhost:5000/profile', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                const { fullname, email, phone, username, avatar, birthdate, gender } = response.data;

                setUser({
                    fullname,
                    email,
                    phone,
                    username,
                    avatar: avatar || '/avatar/avatar-default.png'
                });

                const formattedBirthdate = birthdate ? new Date(birthdate).toISOString().split('T')[0] : '';

                setBirthdate(formattedBirthdate);
                setGender(gender || '');
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleButtonClick = () => {
        document.getElementById('avatarInput')?.click();
    };

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
            const updatedData = {
                ...user,
                birthdate: new Date(birthdate).toISOString().split('T')[0],
                gender
            };
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                return;
            }
            const { accessToken } = JSON.parse(storedUser);
            if (!accessToken) {
                return;
            }
            axios.put('http://localhost:5000/update-profile', updatedData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            .then(response => {
                console.log('Profile updated success');
            })
            .catch(error => {
                console.error('Error updating profile:', error);
            });
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
                        <button
                            type="button"
                            onClick={handleButtonClick}
                            className={styles['change-avatar-btn']}
                            disabled={!isEditing}
                        >
                            Change Avatar
                        </button>
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