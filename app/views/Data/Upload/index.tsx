import { useCallback, useState } from 'react';
import {
    Alert,
    Button,
    Paper,
    FileButton,
    Image,
    LoadingOverlay,
    Modal,
    SimpleGrid,
    Text,
    Title,
} from '@mantine/core';
import { useMutation } from 'urql';
import { MdOutlineFileUpload } from 'react-icons/md';

import { graphql } from '#gql';

import styles from './styles.module.css';

const createFileMutationDocument = graphql(/* GraphQL */`
    mutation createFileMutation($file: Upload!, $fileType: FileTypeEnum!) {
      createFile(data: {fileType: $fileType, file: $file}) {
        errors
        ok
        result {
          file
          fileType
          id
        }
      }
    }
`);

export default function Upload() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isAlertVisible, setAlertVisible] = useState(false);

    const handleModalOpen = useCallback(() => {
        setAlertVisible(false);
        setModalVisible(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setAlertVisible(false);
        setModalVisible(false);
    }, []);
    const [
        uploadFileResult,
        uploadFile,
    ] = useMutation(createFileMutationDocument);

    const handleExcelFileUpload = useCallback((file: File) => {
        uploadFile({
            file,
            fileType: 'EXCEL',
        }).then((res) => {
            if (res.data?.createFile?.ok) {
                handleModalClose();
            }
            if (res.error) {
                setAlertVisible(true);
            }
        });
    }, [uploadFile, handleModalClose]);

    const { fetching } = uploadFileResult;

    return (
        <Paper className={styles.dropZone} withBorder>
            <Text fz="md" ta="center">
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
            <Modal
                opened={isModalVisible}
                onClose={handleModalClose}
                title={(
                    <Title order={4}>
                        Import
                    </Title>
                )}
                radius="md"
                size="sm"
                padding="md"
                centered
            >
                <SimpleGrid
                    cols={3}
                    spacing="md"
                    verticalSpacing="md"
                >
                    <LoadingOverlay visible={fetching} />
                    <FileButton
                        disabled
                        onChange={handleExcelFileUpload} // FIXME: use file specific upload
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
                        disabled={fetching}
                        onChange={handleExcelFileUpload}
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
                        onChange={handleExcelFileUpload} // FIXME: use file specific upload
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
                        onChange={handleExcelFileUpload} // FIXME: use file specific upload
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
                        onChange={handleExcelFileUpload} // FIXME: use file specific upload
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
                        onChange={handleExcelFileUpload} // FIXME: use file specific upload
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
                {isAlertVisible && (
                    <Alert
                        title="Error"
                        color="red"
                    >
                        Cannot upload the file. Please try again.
                    </Alert>
                )}
            </Modal>
        </Paper>

    );
}
