import Slider from "../slider/slider";
import styles from './home.module.css';

function HomeContent(){


    return (
        <div className={styles['home-main']}>
            <div className={styles['home-container']}>
                <Slider />
                <div className={styles['home-content']}>
                    <div className={styles['sale']}>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeContent;
