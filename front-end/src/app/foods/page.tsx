import styles from './foods.module.css';
import container from '@/common/styles/style.module.css';
import Product1 from '@/components/product1/product1';

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
            image: 'https://down-tx-vn.img.susercontent.com/vn-11134513-7r98o-lstqa2yq1qys29@resize_ss280x175!@crop_w280_h175_cT',
            productId: 2,
            title: 'Cơm gà xối mỡ',
            discount: 20000,
            cost: 25000,
            rateAvg: 4.5,
            orderNum: 150,
        },
    ];

    return (
        <div className={styles['food-main']}>
            <div className={container['container']}>
                <div className={styles['filter']}>

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