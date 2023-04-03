import { useCallback } from 'react';
import {
    ActionIcon,
    Center,
    Alert,
    Button,
    Collapse,
    Group,
    LoadingOverlay,
    Paper,
    Title,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useQuery, useMutation } from 'urql';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { graphql } from '#gql';

import TablePropertiesForm from './TablePropertiesForm';
import PreviewTable from './PreviewTable';
import styles from './styles.module.css';

const tableQueryDocument = graphql(/* GraphQL */`
    query TableQuery($id: ID!) {
      table(id: $id) {
        id
        isAddedToWorkspace
        name
        previewData
        properties {
          headerLevel
          language
          timezone
          treatTheseAsNa
          trimWhitespaces
        }
        status
        statusDisplay
      }
      propertiesOptions {
        table {
          headerLevels {
            key
            label
          }
          languages {
            key
            label
          }
          timezones {
            key
            label
          }
        }
      }
    }
`);

const addTableToWorkspaceMutationDocument = graphql(/* GraphQL */`
    mutation AddTableToWorkspaceMutation($id: ID!) {
      addTableToWorkspace(id: $id, isAddedToWorkspace: true) {
        errors
        ok
        result {
          id
          isAddedToWorkspace
          name
        }
      }
    }
`);

interface Props {
    tableId: string;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function ImportTable(props: Props) {
    const {
        tableId,
        onCancel,
        onSuccess,
    } = props;

    const [opened, toggleOpened] = useToggle([true, false]);
    const [
        addTableToWorkspaceResult,
        addTableToWorkspace,
    ] = useMutation(addTableToWorkspaceMutationDocument);

    const [
        tableResult,
    ] = useQuery({
        query: tableQueryDocument,
        variables: {
            id: tableId,
        },
        pause: addTableToWorkspaceResult.fetching,
    });

    const { data, fetching, error } = tableResult;

    const handleCollapseClick = useCallback(() => {
        toggleOpened();
    }, [toggleOpened]);

    const handleImportClick = useCallback(() => {
        addTableToWorkspace({ id: tableId }).then((result) => {
            if (result.data?.addTableToWorkspace?.ok) {
                onSuccess();
            }
        });
    }, [addTableToWorkspace, tableId, onSuccess]);

    if (fetching) {
        return (
            <LoadingOverlay visible={fetching} />
        );
    }

    return (
        <Paper className={styles.import}>
            <div className={styles.heading}>
                <Title order={3}>{data?.table?.name}</Title>
                <Group className={styles.importActions} position="right">
                    <Button
                        radius="xl"
                        variant="default"
                        uppercase
                        disabled={addTableToWorkspaceResult.fetching}
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        radius="xl"
                        variant="light"
                        uppercase
                        disabled={addTableToWorkspaceResult.fetching}
                        onClick={handleImportClick}
                    >
                        Import
                    </Button>
                    <ActionIcon
                        color="dark"
                        size="md"
                        variant="transparent"
                        onClick={handleCollapseClick}
                    >
                        {opened ? <IoChevronUp /> : <IoChevronDown />}
                    </ActionIcon>
                </Group>
            </div>
            <Collapse in={opened} className={styles.collapse}>
                <div className={styles.content}>
                    {error ? (
                        <Center>
                            <Alert
                                title="Unable to get table information"
                                color="red"
                            >
                                We couldn&apos;t get the table details.
                                Please try refreshing the page.
                            </Alert>
                        </Center>
                    ) : (
                        <div className={styles.tableContainer}>
                            <TablePropertiesForm
                                tableId={tableId}
                                tablePropertyOptions={data?.propertiesOptions?.table}
                                tableProperties={data?.table?.properties}
                            />
                            <PreviewTable
                                tableId={tableId}
                                previewData={data?.table?.previewData}
                            />
                        </div>
                    )}
                </div>
            </Collapse>
        </Paper>
    );
}
