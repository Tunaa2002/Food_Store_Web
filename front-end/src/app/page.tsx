
import styles from "./page.module.css";
import HomeContent from "@/components/home/home";

function Home() {
  return (
    <div className={styles.main}>
      <div className={styles['container']}>
        <HomeContent />
      </div>
    </div>
  );
}

export default Home;