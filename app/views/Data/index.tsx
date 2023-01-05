import { useCallback, useState } from 'react';
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
import { isDefined } from '@togglecorp/fujs';
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
                extraData
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
    const [selectedTable, setSelectedTable] = useState<string | undefined>();
    const [
        datasetResults,
    ] = useQuery({
        query: datasetsQueryDocument,
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
        setSelectedTable(tableId);
    }, []);

    const handleTableImportCancel = useCallback(() => {
        setSelectedTable(undefined);
    }, []);

    const handleTableImportSuccess = useCallback(() => {
        setSelectedTable(undefined);
    }, []);

    const hasData = isDefined(data?.datasets?.results);

    const importedTables = data?.datasets?.results?.map((dataset) => (
        dataset?.tables?.filter((table) => table.isAddedToWorkspace)
    )).flat();

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
                    tables={importedTables}
                    selectedTable={selectedTable}
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
