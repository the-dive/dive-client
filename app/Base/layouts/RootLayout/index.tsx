import { Outlet } from 'react-router-dom';
import styles from './styles.module.css';

function RootLayout() {
    return (
        <div className={styles.rootLayout}>
            <Outlet />
        </div>
    );
}

export default RootLayout;
