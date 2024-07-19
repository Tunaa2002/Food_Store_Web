'use client'

import { useState, useEffect } from 'react';
import styles from './profile.module.css';
import { fetchProfile, updateProfile } from '@/app/api/user/profile/profile';

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
        const getUserProfile = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    return;
                }
                const { accessToken } = JSON.parse(storedUser);
                if (!accessToken) {
                    return;
                }

                const profileData = await fetchProfile(accessToken);
                const { fullname, email, phone, username, avatar, birthdate, gender } = profileData;

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

        getUserProfile();
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

    const handleEditClick = async () => {
        if (isEditing) {
            try {
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

                await updateProfile(accessToken, updatedData);
                console.log('Profile updated successfully');
            } catch (error) {
                console.error('Error updating profile:', error);
            }
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
                            Thay đổi Avatar
                        </button>
                    </label>
                </div>
                <div className={`${styles['profile-info']} ${styles['clear-fix']}`}>
                    <label className={styles['label']}>Họ tên</label>
                    <input
                        type="text"
                        name="fullname"
                        value={user.fullname}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                    <label className={styles['label']}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                    <label className={styles['label']}>Số điện thoại</label>
                    <input
                        type="text"
                        name="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                    <label className={styles['label']}>Tên người dùng</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                    <label className={styles['label']}>Ngày sinh</label>
                    <input
                        type="date"
                        name="birthdate"
                        value={birthdate}
                        onChange={handleBirthdateChange}
                        disabled={!isEditing}
                    />
                    <label className={styles['label']}>Giới tính:</label>
                    <select
                        name="gender"
                        value={gender}
                        onChange={handleGenderChange}
                        disabled={!isEditing}
                        className={styles['gender']}
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