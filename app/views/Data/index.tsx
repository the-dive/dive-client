import { Navbar, Container, Button } from '@mantine/core';
import { MdOutlineFileUpload } from 'react-icons/md';
import styles from './styles.module.css';

export default function Data() {
    return (
        <div className={styles.dataPage}>
            <Navbar p="xs" width={{ sm: 200, lg: 300, base: 200 }}>{/* Navbar content */}</Navbar>
            <Container className={styles.dropZone}>
                <div className={styles.dropText}>
                    Drag and drop a file or import from your computer
                </div>
                <Button
                    variant="filled"
                    uppercase
                    leftIcon={<MdOutlineFileUpload />}
                    size="xs"
                    radius="xl"
                >
                    Import
                </Button>
            </Container>
        </div>
    );
}
