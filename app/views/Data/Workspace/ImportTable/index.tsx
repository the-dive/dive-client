import { useCallback } from 'react';
import {
    ActionIcon,
    Alert,
    Button,
    Center,
    Collapse,
    Group,
    LoadingOverlay,
    Paper,
    Table,
    Title,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useQuery } from 'urql';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { graphql } from '#gql';

import TablePropertiesForm from './TablePropertiesForm';
import styles from './styles.module.css';

interface Column {
    key: string;
    label: string;
}

type Row = Record<string, string>;

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

interface Props {
    tableId: string;
    onCancel: () => void;
}

export default function ImportTable(props: Props) {
    const {
        tableId,
        onCancel,
    } = props;

    const [opened, toggleOpened] = useToggle([true, false]);

    const [
        tableResult,
    ] = useQuery({
        query: tableQueryDocument,
        variables: {
            id: tableId,
        },
    });

    const { data, fetching, error } = tableResult;

    const handleCollapseClick = useCallback(() => {
        toggleOpened();
    }, [toggleOpened]);

    const colsKeys: string[] = data?.table?.previewData?.columns?.map((col: Column) => col.key);

    const rows = data?.table?.previewData?.rows?.map((row: Row, rowIndex: number) => {
        const cells = colsKeys?.map((key) => (
            // eslint-disable-next-line react/no-array-index-key
            <td key={`${data?.table?.id}-row-${rowIndex}-cell-${key}`}>
                {row[key]}
            </td>
        ));

        return (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={`${data?.table?.id}-row-${rowIndex}`}>
                {cells}
            </tr>
        );
    });

    const columns = data?.table?.previewData?.columns?.map((col: Column) => (
        <th key={`${data?.table?.id}-${col.key}`}>
            {col.label}
        </th>
    ));

    if (fetching) {
        return (
            <LoadingOverlay visible={fetching} />
        );
    }

    return (
        <Paper className={styles.import}>
            <div className={styles.heading}>
                <Title order={3}>{data?.table?.name}</Title>
                <ActionIcon
                    color="dark"
                    size="md"
                    variant="transparent"
                    onClick={handleCollapseClick}
                >
                    {opened ? <IoChevronUp /> : <IoChevronDown />}
                </ActionIcon>
            </div>
            <Collapse in={opened} className={styles.collapse}>
                <div className={styles.content}>
                    <TablePropertiesForm
                        tableId={tableId}
                        tablePropertyOptions={data?.propertiesOptions?.table}
                        tableProperties={data?.table?.properties}
                    />
                    <Paper className={styles.tableContainer} radius="md" withBorder>
                        <LoadingOverlay visible={fetching} />
                        {error ? (
                            <Center>
                                <Alert
                                    className={styles.alert}
                                    title="Unable to get table information"
                                    color="red"
                                >
                                    We couldn&apos;t get the table details.
                                    Please try refreshing the page.
                                </Alert>
                            </Center>
                        ) : (
                            <Table striped withColumnBorders>
                                <thead>
                                    <tr>
                                        {columns}
                                    </tr>
                                </thead>
                                <tbody>{rows}</tbody>
                            </Table>
                        )}
                    </Paper>
                </div>
                <Group className={styles.importActions} position="right">
                    <Button
                        radius="xl"
                        variant="default"
                        uppercase
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        radius="xl"
                        variant="light"
                        uppercase
                        disabled={fetching}
                    >
                        Import
                    </Button>
                </Group>
            </Collapse>
        </Paper>
    );
}
