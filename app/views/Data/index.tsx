import { useState } from 'react';
import { Navbar, Card, Button, Modal, Grid, FileButton, Text, Image } from '@mantine/core';
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
                    justify="center"
                    align="center"
                >
                    <FileButton disabled onChange={setFile} accept="image/png,image/jpeg">
                        {(props) => (
                            <Grid.Col
                                {...props}
                                span={4}
                                className={styles.gridColumn}
                            >
                                <Image src="./assets/txt.svg" alt="" />
                                <Text fz="sm" ta="center">
                                    Text
                                </Text>
                            </Grid.Col>
                        )}
                    </FileButton>
                    <FileButton onChange={setFile} accept="image/png,image/jpeg">
                        {(props) => (
                            <Grid.Col
                                span={4}
                                {...props}
                                className={styles.gridColumn}
                            >
                                <Image src="./assets/excel.svg" alt="" />
                                <Text fz="sm" ta="center">
                                    Excel
                                </Text>
                            </Grid.Col>
                        )}
                    </FileButton>
                    <FileButton disabled onChange={setFile} accept="image/png,image/jpeg">
                        {(props) => (
                            <Grid.Col
                                span={4}
                                {...props}
                                className={styles.gridColumn}
                            >
                                <Image src="./assets/json.svg" alt="" />
                                <Text fz="sm" ta="center">
                                    JSON
                                </Text>
                            </Grid.Col>
                        )}
                    </FileButton>
                    <FileButton disabled onChange={setFile} accept="image/png,image/jpeg">
                        {(props) => (
                            <Grid.Col
                                span={4}
                                {...props}
                                className={styles.gridColumn}
                            >
                                <Image src="./assets/log.svg" alt="" />
                                <Text fz="sm" ta="center">
                                    Log file
                                </Text>
                            </Grid.Col>
                        )}
                    </FileButton>
                    <FileButton disabled onChange={setFile} accept="image/png,image/jpeg">
                        {(props) => (
                            <Grid.Col
                                span={4}
                                {...props}
                                className={styles.gridColumn}
                            >
                                <Image src="./assets/stats.svg" alt="" />
                                <Text fz="sm" ta="center">
                                    Stats file
                                </Text>
                            </Grid.Col>
                        )}
                    </FileButton>
                    <FileButton disabled onChange={setFile} accept="image/png,image/jpeg">
                        {(props) => (
                            <Grid.Col
                                span={4}
                                {...props}
                                className={styles.gridColumn}
                            >
                                <Image src="./assets/kobo.svg" alt="" />
                                <Text fz="sm" ta="center">
                                    KoBo
                                </Text>
                            </Grid.Col>
                        )}
                    </FileButton>
                </Grid>
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
