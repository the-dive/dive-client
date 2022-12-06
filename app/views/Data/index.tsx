import { Navbar, Card, Button, Text } from '@mantine/core';
import { MdOutlineFileUpload } from 'react-icons/md';
import styles from './styles.module.css';

export default function Data() {
    return (
        <div className={styles.dataPage}>
            <Navbar p="xs" width={{ sm: 200, lg: 300, base: 200 }}>{/* Navbar content */}</Navbar>
            <Card className={styles.dropZone} withBorder>
                <Text fz="sm" ta="center">
                    Drag and drop a file or import from your computer
                </Text>
                <Button
                    variant="filled"
                    uppercase
                    leftIcon={<MdOutlineFileUpload />}
                    size="xs"
                    radius="xl"
                >
                    Import
                </Button>
            </Card>
        </div>
    );
}
