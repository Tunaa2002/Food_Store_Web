import styles from './footer.module.css';
import Link from 'next/link';

function Footer() {
    const foodCategories = [
        'Đồ ăn nhanh',
        'Đồ ăn vặt',
        'Đồ ăn nhẹ',
        'Đồ ăn chính',
        'Đồ ăn chay'
    ];

    const drinkCategories = [
        'Nước ngọt',
        'Nước trái cây',
        'Nước khoáng',
        'Sữa',
        'Đồ uống có cồn',
        'Trà sữa'
    ];

    return (
        <div className={styles['footer-main']}>
            <div className={styles['footer-container']}>
                <div className={styles['intro']}>
                    <h4 className={styles['title']}>Giới thiệu</h4>
                    <p>Chúng tôi cung cấp các món ăn và đồ uống đa dạng và hấp dẫn.</p>
                    <i className='bi bi-facebook'></i>
                    <i className='bi bi-instagram'></i>
                    <i className='bi bi-twitter'></i>
                    <i className='bi bi-youtube'></i>
                </div>
                <div className={styles['menu_vertical']}>
                    <h4 className={styles['title']}>
                        <Link href="/" className={styles['nav-link']}>Foods</Link>
                    </h4>
                    <div className={styles['category']}>
                        <ul>
                            {foodCategories.map((category, index) => (
                                <li key={index}><Link href='/foods' className={styles['nav-link']}>{category}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles['menu_vertical']}>
                    <h4 className={styles['title']}>
                        <Link href="/" className={styles['nav-link']}>Drinks</Link>
                    </h4>
                    <div className={styles['category']}>
                        <ul>
                            {drinkCategories.map((category, index) => (
                                <li key={index}><Link href='/drinks' className={styles['nav-link']}>{category}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='info'>
                    <h4 className={styles['title']}>Thông tin</h4>
                    <p>Food Store</p>
                    <p>Địa chỉ: Trần Phú, Hà Đông, Hà Nội</p>
                    <p>Liên hệ: 0988888888</p>
                    <p>Mở cửa từ 8-18h</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
