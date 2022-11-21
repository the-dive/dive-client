import { Outlet } from 'react-router-dom';
import styles from './styles.module.css';

function ProtectedLayout() {
    return (
        <div className={styles.protectedLayout}>
            <Outlet />
        </div>
    );
}

export default ProtectedLayout;
