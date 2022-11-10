import { NavLink, Outlet } from 'react-router-dom';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.module.css';

function ProtectedLayout() {
    return (
        <div className={styles.protectedLayout}>
            <nav className={styles.navBar}>
                <ul>
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => _cs(
                                isActive && styles.isActive, styles.navLink,
                            )}
                        >
                            Home
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}

export default ProtectedLayout;
