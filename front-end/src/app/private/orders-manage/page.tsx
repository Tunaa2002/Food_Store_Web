'use client'

import styles from './ordersManage.module.css';
import { useState, useEffect } from 'react';
import getOrdersAPI from '@/app/api/admin/orders/getOrders';
import updateOrderStatus from '@/app/api/admin/orders/updateOrder';
import OrderData from '@/common/interfaces/orderData';
import { filterOrderByName } from '@/common/utils/filterByName';
import { formatPrice } from '@/common/utils/formatPrice';

function OrdersManage() {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [searchText, setSearchText] = useState('');
    const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [editingOrderStatus, setEditingOrderStatus] = useState<string>('');
    const ordersPerPage = 10;

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const result = filterOrderByName(orders, searchText);
        setFilteredOrders(result);
        setCurrentPage(1);
    }, [searchText, orders]);

    const fetchOrders = async () => {
        try {
            const data = await getOrdersAPI();
            if (data) {
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleEditStatus = (orderId: number, status: string) => {
        setEditingOrderId(orderId);
        setEditingOrderStatus(status);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEditingOrderStatus(event.target.value);
    };

    const handleSaveStatus = async (orderId: number) => {
        try {
            const status = editingOrderStatus;
            await updateOrderStatus(orderId, status);
            setOrders(orders.map(order => (order.order_id === orderId ? { ...order, status } : order)));
            setEditingOrderId(null);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const indexOfLastCategory = currentPage * ordersPerPage;
    const indexOfFirstCategory = indexOfLastCategory - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstCategory, indexOfLastCategory);

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const translateStatus = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Đang xử lý';
            case 'completed':
                return 'Đã hoàn thành';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    return (
        <div className={styles['orders-manage']}>
            <div className={styles['container']}>
                <div className={styles['header']}>
                    <h4 className={styles['title']}>Quản lý đơn đặt hàng</h4>
                    <div className={styles['actions']}>
                        <div className={styles['search-form']}>
                            <input 
                                className={styles['search-text']} 
                                type='text' 
                                name='search' 
                                placeholder='Nhập tên người dùng'
                                value={searchText}
                                onChange={handleSearchChange}
                            />
                            <i className={`${styles['bi']} ${styles['bi-search']} ${styles['search-btn']} ${'bi-search'}`}></i>
                        </div>
                    </div>
                </div>
                <div className={styles['orders-list']}>
                    <table className={styles['orders-table']}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên người dùng</th>
                                <th>Địa chỉ nhận hàng</th>
                                <th>Số điện thoại</th>
                                <th>Phương thức thanh toán</th>
                                <th>Tổng giá đơn hàng</th>
                                <th>Trạng thái đơn hàng</th>
                                <th>Ngày đặt hàng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map((order, index) => (
                                <tr key={index}>
                                    <td>{order.order_id}</td>
                                    <td>{order.username}</td>
                                    <td>{order.address}</td>
                                    <td>{order.phone_number}</td>
                                    <td>{order.payment_description}</td>
                                    <td>{formatPrice(order.total_price)}</td>
                                    <td>
                                        {editingOrderId === order.order_id ? (
                                            <select value={editingOrderStatus} onChange={handleStatusChange}>
                                                <option value="pending">Đang xử lý</option>
                                                <option value="completed">Đã hoàn thành</option>
                                                <option value="cancelled">Đã hủy</option>
                                            </select>
                                        ) : (
                                            translateStatus(order.status)
                                        )}
                                    </td>
                                    <td>{order.created_at}</td>
                                    <td>
                                        {editingOrderId === order.order_id ? (
                                            <button className={styles['btn-save-order']} onClick={() => handleSaveStatus(order.order_id)}>Lưu</button>
                                        ) : (
                                            <button className={styles['btn-update-order']} onClick={() => handleEditStatus(order.order_id, order.status)}>Cập nhật</button>
                                        )}
                                        <button className={styles['btn-order-detail']}>Xem chi tiết</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles['pagination']}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &laquo; Trang trước
                    </button>
                    <span className={styles['current-page']}>{currentPage}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Trang sau &raquo;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrdersManage;
