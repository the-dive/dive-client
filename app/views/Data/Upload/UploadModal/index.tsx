import { useCallback, useState } from 'react';
import {
    Alert,
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

import { graphql } from '#gql';

import styles from './styles.module.css';

const createDatasetMutationDocument = graphql(/* GraphQL */`
    mutation createDatasetMutation($file: Upload!) {
        createDataset(data: {file: $file}) {
            errors
            ok
            result {
                file
                id
                name
                status
                statusDisplay
                tables {
                    id
                    isAddedToWorkspace
                    name
                    status
                    statusDisplay
                }
            }
        }
    }
`);

interface Props {
    opened: boolean;
    onClose: () => void;
}

export default function UploadModal(props: Props) {
    const {
        opened,
        onClose,
    } = props;

    const [isAlertVisible, setAlertVisible] = useState(false);

    const [
        uploadFileResult,
        uploadFile,
    ] = useMutation(createDatasetMutationDocument);

    const handleExcelFileUpload = useCallback((file: File) => {
        uploadFile({
            file,
        }).then((res) => {
            if (res.data?.createDataset?.ok) {
                onClose();
            }
            if (res.error) {
                setAlertVisible(true);
            }
        });
    }, [uploadFile, onClose]);

    const handleModalClose = useCallback(() => {
        setAlertVisible(false);
        onClose();
    }, [onClose]);

    const { fetching } = uploadFileResult;

    return (
        <Modal
            opened={opened}
            onClose={handleModalClose}
            title={(
                <Title order={3}>
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
                            <Image src="/assets/txt.svg" alt="Text file" />
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
                            <Image src="/assets/excel.svg" alt="Excel" />
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
                            <Image src="/assets/json.svg" alt="Json" />
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
                            <Image src="/assets/log.svg" alt="Log" />
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
                            <Image src="/assets/stats.svg" alt="Stats" />
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
                            <Image src="/assets/kobo.svg" alt="Kobo" />
                            <Text fz="sm" ta="center">
                                KoBo
                            </Text>
                        </Paper>
                    )}
                </FileButton>
            </SimpleGrid>
            {isAlertVisible && (
                <Alert
                    title="Unable to upload file"
                    color="red"
                >
                    We couldn&apos;t upload the file. Please try uploading the file again.
                </Alert>
            )}

        </Modal>
    );
}
