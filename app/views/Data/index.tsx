import { Navbar } from '@mantine/core';
import { useQuery } from 'urql';
import { graphql } from '#gql';

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
    useQuery({
        query: datasetsQueryDocument,
    });

    return (
        <div className={styles.dataPage}>
            <Navbar
                p="xs"
                width={{ sm: 200, lg: 300, base: 200 }}
            >
                {/* Navbar content */}
            </Navbar>
            <Upload />
        </div>
    );
}
