import React from 'react';
import styles from './orderDetailModal.module.css';
import { formatPrice } from '@/common/utils/formatPrice';
import OrderDetailData from '@/common/interfaces/orderDetail';

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderDetails: OrderDetailData[];
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, orderDetails }) => {
    if (!isOpen) return null;
    return (
        <div className={styles['modal']}>
            <div className={styles['modal-content']}>
                <span className={`close ${styles['close']}`} onClick={onClose}>&times;</span>
                <h2>Chi tiết đơn hàng</h2>
                {orderDetails.length === 0 ? (
                    <p>Không có thông tin chi tiết.</p>
                ) : (
                    orderDetails.map((detail) => (
                        <div key={detail.product_id} className={styles['order-detail-item']}>
                            <img src={detail.image_url} alt={detail.name} className={styles['img']}/>
                            <div className={styles['product-content']}>
                                <h4>{detail.name}</h4>
                                <p>Giá: {formatPrice(detail.discount)} VNĐ</p>
                                <p>Số lượng: {detail.quantity}</p>
                                <p>Tổng giá: {formatPrice(detail.price)} VNĐ</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderDetailModal;
