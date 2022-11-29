import { Navbar } from '@mantine/core';
import styles from './styles.module.css';

export default function Data() {
    return (
        <div className={styles.dataPage}>
            <Navbar p="xs" width={{ sm: 200, lg: 300, base: 200 }}>{/* Navbar content */}</Navbar>
        </div>
    );
}
