import {
    Avatar,
    Box,
    Image,
    Navbar,
    NavLink,
    Text,
    TextInput,
    UnstyledButton,
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
    const [
        datasetResults,
    ] = useQuery({
        query: datasetsQueryDocument,
    });

    const { data } = datasetResults;
    const hasData = datasetResults.data?.datasets?.results;

    return (
        <div className={styles.dataPage}>
            <Navbar
                p="xs"
                width={{ sm: 200, lg: 300, base: 200 }}
                className={styles.sidePane}
            >
                <div className={styles.sidePaneHead}>
                    <div className={styles.navBarTitle}>
                        <Text fz="md" fw={600}>Mira Colombia</Text>
                        <MdOutlineSettings />
                    </div>
                    <div className={styles.addSearch}>
                        <UnstyledButton>
                            <Avatar size={36} color="#3151D5">
                                <MdAdd />
                            </Avatar>
                        </UnstyledButton>
                        <TextInput placeholder="Search" icon={<MdOutlineSearch />} />
                    </div>
                </div>
                <Box>
                    {data?.datasets?.results?.map((item) => (
                        <NavLink
                            key={item.id}
                            icon={<Image src="/assets/excel.svg" />}
                            label={(
                                <Text fw={600}>
                                    {`${item.name}`}
                                </Text>
                            )}
                        >
                            {item.tables?.map((table) => (
                                <NavLink
                                    className={styles.dataSetsTable}
                                    icon={<MdOutlineTableChart />}
                                    key={table.id}
                                    label={`${table.name}`}
                                />
                            ))}
                        </NavLink>
                    ))}
                </Box>
            </Navbar>
            {hasData ? (
                <Workspace />
            ) : (
                <Upload />
            )}
        </div>
    );
}
