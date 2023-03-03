import { useCallback, useState, useMemo } from 'react';
import {
    ActionIcon,
    Group,
    Image,
    Loader,
    NavLink,
    Navbar,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useQuery } from 'urql';
import {
    MdOutlineSettings,
    MdAdd,
    MdOutlineSearch,
    MdOutlineTableChart,
} from 'react-icons/md';
import { graphql } from '#gql';

import Workspace from './Workspace';
import Upload from './Upload';
import UploadModal from './Upload/UploadModal';
import styles from './styles.module.css';

const datasetsQueryDocument = graphql(/* GraphQL */`
    query DatasetsQuery {
        datasets(page: 1, pageSize: 10) {
            page
            pageSize
            totalCount
            results {
                createdAt
                error
                hasErrored
                id
                metadata
                modifiedAt
                name
                status
                tables {
                    id
                    name
                    status
                    statusDisplay
                    isAddedToWorkspace
                }
            }
        }
    }
`);

export default function Data() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [tableToImportId, setTableToImportId] = useState<string | undefined>();
    /*
     *  URQL's Document Caching Gotcha
     *  If we request a list of data, and the API returns an empty list, then the
     *  cache won't be able to see the __typename of said list and invalidate it.
     *  We should refetch dataset when new data is added for the first time.
     */
    const context = useMemo(() => ({ additionalTypenames: ['CreateDataset'] }), []);
    const [
        datasetResults,
    ] = useQuery({
        query: datasetsQueryDocument,
        context,
    });

    const {
        data,
        fetching,
    } = datasetResults;

    const handleModalClose = useCallback(() => {
        setModalVisible(false);
    }, []);

    const handleAddClick = useCallback(() => {
        setModalVisible(true);
    }, []);

    const handleTableClick = useCallback((tableId: string) => {
        setTableToImportId(tableId);
    }, []);

    const handleTableImportCancel = useCallback(() => {
        setTableToImportId(undefined);
    }, []);

    const handleTableImportSuccess = useCallback(() => {
        setTableToImportId(undefined);
    }, []);

    const hasData = (data?.datasets?.totalCount ?? 0) > 0;

    return (
        <div className={styles.dataPage}>
            <Navbar
                p="xs"
                width={{ sm: 200, lg: 300, base: 200 }}
            >
                <Navbar.Section>
                    <Stack>
                        <Group position="apart">
                            <Title order={3}>Datasets</Title>
                            <MdOutlineSettings />
                        </Group>
                        <Group position="apart">
                            <ActionIcon
                                variant="filled"
                                size="md"
                                color="brand"
                                onClick={handleAddClick}
                            >
                                <MdAdd />
                            </ActionIcon>
                            <TextInput placeholder="Search" icon={<MdOutlineSearch />} />
                        </Group>
                    </Stack>
                </Navbar.Section>
                <Navbar.Section grow mx="-xs" px="xs" component={ScrollArea}>
                    {data?.datasets?.results?.map((item) => (
                        <NavLink
                            className={styles.navLink}
                            key={item.id}
                            icon={<Image src="/assets/excel.svg" alt="excel" />}
                            label={(
                                <Text fw={600}>
                                    {item.name}
                                </Text>
                            )}
                        >
                            {item.tables?.map((table) => (
                                <NavLink
                                    className={styles.navLink}
                                    key={table.id}
                                    icon={<MdOutlineTableChart />}
                                    label={table.name}
                                    disabled={table.isAddedToWorkspace}
                                    onClick={() => handleTableClick(table.id)}
                                />
                            ))}
                        </NavLink>
                    ))}
                </Navbar.Section>
            </Navbar>
            {fetching && (
                <Loader className={styles.loader} />
            )}
            {!fetching && hasData && (
                <Workspace
                    tableToImportId={tableToImportId}
                    onImportCancel={handleTableImportCancel}
                    onImportSuccess={handleTableImportSuccess}
                />
            )}
            {!fetching && !hasData && (
                <Upload />
            )}
            <UploadModal
                opened={isModalVisible}
                onClose={handleModalClose}
            />
        </div>
    );
}
