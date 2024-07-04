import styles from './foods.module.css';
import container from '@/common/styles/style.module.css';
import Product1 from '@/components/product1/product1';
import FilterOption from '@/components/filter-option/filterOption';

function Foods() {
    const productData = [
        {
            image: 'https://down-tx-vn.img.susercontent.com/vn-11134513-7r98o-lstqa2yq1qys29@resize_ss280x175!@crop_w280_h175_cT',
            productId: 1,
            title: 'Cơm gà xối mỡ',
            discount: 20000,
            cost: 25000,
            rateAvg: 4.5,
            orderNum: 150,
        },
        {
            image: '"https://down-bs-vn.img.susercontent.com/vn-11134513-7r98o-lsv7jl8ilrix5f@resize_ss280x175!@crop_w280_h175_cT"',
            productId: 2,
            title: 'Bánh mì thập cẩm',
            discount: 30000,
            cost: 35000,
            rateAvg: 3.9,
            orderNum: 130,
        },
    ];

    return (
        <div className={styles['food-main']}>
            <div className={`${container['container']} ${styles['container']} ${container['clear-fix']}`}>
                <div className={styles['filter']}>
                    <FilterOption 

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

export default Foods;