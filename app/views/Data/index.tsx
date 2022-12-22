import { useCallback, useState } from 'react';
import {
    ActionIcon,
    Group,
    Image,
    Loader,
    NavLink,
    Navbar,
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
                }
            }
        }
    }
`);

export default function Data() {
    const [isModalVisible, setModalVisible] = useState(false);
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

    const hasData = isDefined(data?.datasets?.results);

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
                <Navbar.Section grow>
                    {data?.datasets?.results?.map((item) => (
                        <NavLink
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
                                    key={table.id}
                                    icon={<MdOutlineTableChart />}
                                    label={table.name}
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
                <Workspace />
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
