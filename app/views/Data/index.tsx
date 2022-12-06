import { useState, useCallback } from 'react';
import {
    Button,
    Paper,
    FileButton,
    Image,
    Modal,
    SimpleGrid,
    Text,
    Title,
    Navbar,
} from '@mantine/core';
import { MdOutlineFileUpload } from 'react-icons/md';

import styles from './styles.module.css';

export default function Data() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleModalOpen = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <div className={styles.dataPage}>
            <Navbar
                p="xs"
                width={{ sm: 200, lg: 300, base: 200 }}
            >
                {/* Navbar content */}
            </Navbar>
            <Paper className={styles.dropZone} withBorder>
                <Text fz="sm" ta="center">
                    Drag and drop a file or import from your computer
                </Text>
                <Button
                    variant="filled"
                    uppercase
                    leftIcon={<MdOutlineFileUpload />}
                    size="xs"
                    radius="xl"
                    onClick={handleModalOpen}
                >
                    Import
                </Button>
            </Paper>
            <Modal
                opened={isModalOpen}
                onClose={handleModalClose}
                title={(
                    <Title order={4}>
                        Import
                    </Title>
                )}
                radius="md"
                size="sm"
                centered
            >
                <SimpleGrid
                    cols={3}
                    spacing="sm"
                    verticalSpacing="sm"
                >
                    <FileButton
                        disabled
                        onChange={setFile}
                        accept="text/plain"
                    >
                        {({ onClick }) => (
                            <Paper
                                className={styles.paper}
                                withBorder
                                onClick={onClick}
                            >
                                <Image src="./assets/txt.svg" alt="Text file" />
                                <Text fz="sm" ta="center">
                                    Text file
                                </Text>
                            </Paper>
                        )}
                    </FileButton>
                    <FileButton
                        onChange={setFile}
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    >
                        {({ onClick }) => (
                            <Paper
                                className={styles.paper}
                                withBorder
                                onClick={onClick}
                            >
                                <Image src="./assets/excel.svg" alt="Excel" />
                                <Text fz="sm" ta="center">
                                    Excel
                                </Text>
                            </Paper>
                        )}
                    </FileButton>
                    <FileButton
                        disabled
                        onChange={setFile}
                        accept="application/json"
                    >
                        {({ onClick }) => (
                            <Paper
                                className={styles.paper}
                                withBorder
                                onClick={onClick}
                            >
                                <Image src="./assets/json.svg" alt="Json" />
                                <Text fz="sm" ta="center">
                                    JSON
                                </Text>
                            </Paper>
                        )}
                    </FileButton>
                    <FileButton
                        disabled
                        onChange={setFile}
                        accept="*.log"
                    >
                        {({ onClick }) => (
                            <Paper
                                className={styles.paper}
                                withBorder
                                onClick={onClick}
                            >
                                <Image src="./assets/log.svg" alt="Log" />
                                <Text fz="sm" ta="center">
                                    Log file
                                </Text>
                            </Paper>
                        )}
                    </FileButton>
                    <FileButton
                        disabled
                        onChange={setFile}
                        accept="text/plain"
                    >
                        {({ onClick }) => (
                            <Paper
                                className={styles.paper}
                                withBorder
                                onClick={onClick}
                            >
                                <Image src="./assets/stats.svg" alt="Stats" />
                                <Text fz="sm" ta="center">
                                    Stats file
                                </Text>
                            </Paper>
                        )}
                    </FileButton>
                    <FileButton
                        disabled
                        onChange={setFile}
                        accept="text/plain"
                    >
                        {({ onClick }) => (
                            <Paper
                                className={styles.paper}
                                withBorder
                                onClick={onClick}
                            >
                                <Image src="./assets/kobo.svg" alt="Kobo" />
                                <Text fz="sm" ta="center">
                                    KoBo
                                </Text>
                            </Paper>
                        )}
                    </FileButton>
                </SimpleGrid>
            </Modal>
            {file && (
                <div>
                    {file.name}
                    {file.type}
                </div>
            )}
        </div>
    );
}
