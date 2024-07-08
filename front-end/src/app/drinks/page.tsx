import styles from './drinks.module.css';
import container from '@/common/styles/style.module.css';
import Product1 from '@/components/product1/product1';
import FilterOption from '@/components/filter-option/filterOption';

function Drinks() {
    const productData = [
        {
            image: 'https://down-bs-vn.img.susercontent.com/vn-11134513-7r98o-lsu96vdwxva168@resize_ss280x175!@crop_w280_h175_cT',
            productId: 1,
            title: 'Trà sữa thái',
            discount: 20000,
            cost: 25000,
            rateAvg: 4.5,
            orderNum: 150,
        },
        {
            image: 'https://down-cvs-vn.img.susercontent.com/vn-11134513-7r98o-lvia2nmph7xg7b@resize_ss280x175!@crop_w280_h175_cT',
            productId: 2,
            title: 'Cheese Coffee',
            discount: 40000,
            cost: 45000,
            rateAvg: 4,
            orderNum: 120,
        },
    ];

    const categoriesList = [
        'Nước ngọt',
        'Nước trái cây',
        'Sữa',
        'Trà sữa',
        'Đồ uống có cồn',
        'Nước khoáng',
        'Cà phê'
    ];

    return (
        <div className={styles['drink-main']}>
            <div className={`${container['container']} ${styles['container']}`}>
                <div className={styles['filter']}>
                    <FilterOption 
                        categories={categoriesList}
                    />
                </div>
                <div className={styles['food-content']}>
                    {productData.map((data, index) => (
                        <Product1
                            key={index}
                            image={data.image}
                            productId={data.productId}
                            title={data.title}
                            discount={data.discount}
                            cost={data.cost}
                            rateAvg={data.rateAvg}
                            orderNum={data.orderNum}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Drinks;
