import { useState } from 'react';
import { Navbar, Card, Button, Modal, Grid, FileButton, Text } from '@mantine/core';
import { MdOutlineFileUpload } from 'react-icons/md';
import styles from './styles.module.css';

export default function Data() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);

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
                    onClick={() => setIsModalOpen(true)}
                >
                    Import
                </Button>
            </Card>
            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Import"
                centered
            >
                <Grid
                    className={styles.gridModal}
                    gutter="xl"
                    align="center"
                    justify="center"
                >
                    <Grid.Col
                        span={4}
                        className={styles.gridColumn}
                    >
                        <img src="./assets/txt.svg" alt="" />
                        Text
                    </Grid.Col>
                    <FileButton onChange={setFile} accept="image/png">
                        {() => (
                            <Grid.Col
                                span={4}
                                className={styles.gridColumn}
                            >
                                <img src="./assets/excel.svg" alt="" />
                                Excel
                            </Grid.Col>
                        )}
                    </FileButton>
                    <Grid.Col
                        span={4}
                        className={styles.gridColumn}
                    >
                        <img src="./assets/json.svg" alt="" />
                        JSON
                    </Grid.Col>
                    <Grid.Col
                        span={4}
                        className={styles.gridColumn}
                    >
                        <img src="./assets/log.svg" alt="" />
                        Log file
                    </Grid.Col>
                    <Grid.Col
                        span={4}
                        className={styles.gridColumn}
                    >
                        <img src="./assets/stats.svg" alt="" />
                        Stats file
                    </Grid.Col>
                    <Grid.Col
                        span={4}
                        className={styles.gridColumn}
                    >
                        <img src="./assets/kobo.svg" alt="" />
                        Kobo
                    </Grid.Col>
                </Grid>
            </Modal>
        </div>
    );
}
