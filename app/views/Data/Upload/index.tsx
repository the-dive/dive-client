import { useCallback, useState } from 'react';
import {
    Button,
    Center,
    Paper,
    Text,
} from '@mantine/core';
import { MdOutlineFileUpload } from 'react-icons/md';

import UploadModal from './UploadModal';
import styles from './styles.module.css';

export default function Upload() {
    const [isModalVisible, setModalVisible] = useState(false);

    const handleModalClose = useCallback(() => {
        setModalVisible(false);
    }, []);

    const handleImportClick = useCallback(() => {
        setModalVisible(true);
    }, []);

    return (
        <Center>
            <Paper className={styles.import} withBorder>
                <Text fz="md" ta="center">
                    Drag and drop a file or import from your computer
                </Text>
                <Button
                    variant="filled"
                    uppercase
                    leftIcon={<MdOutlineFileUpload />}
                    size="xs"
                    radius="xl"
                    onClick={handleImportClick}
                >
                    Import
                </Button>
                <UploadModal
                    opened={isModalVisible}
                    onClose={handleModalClose}
                />
            </Paper>
        </Center>
    );
}
