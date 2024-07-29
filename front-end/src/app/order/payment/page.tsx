import styles from './payment.module.css';
import Link from 'next/link';

function Payment() {
    return(
        <div className={styles['payment-main']}>
            <h4>Thanh toán thành công</h4>
            <Link href="/">Chuyển đến trang chủ</Link>

            <h4>Thanh toán thất bại</h4>
            <Link href="/order">Chuyển đến trang chủ</Link>
        </div>
    );
}

export default Payment;

