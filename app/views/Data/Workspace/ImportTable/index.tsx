import { useCallback } from 'react';
import {
    ActionIcon,
    Alert,
    Button,
    Center,
    Collapse,
    Divider,
    Group,
    LoadingOverlay,
    Paper,
    Select,
    Switch,
    Table,
    TextInput,
    Title,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useMutation, useQuery } from 'urql';
import { useForm } from '@mantine/form';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { graphql } from '#gql';
import styles from './styles.module.css';

const tableQueryDocument = graphql(/* GraphQL */`
    query tableQuery($id: ID!) {
        table(id: $id) {
            id
            isAddedToWorkspace
            name
            previewData
            status
            statusDisplay
            properties {
                headerLevel
                language
                timezone
                treatTheseAsNa
                trimWhitespaces
            }
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

const createUpdateTableMutationDocument = graphql(/* GraphQL */ `
    mutation createUpdateTableMutation(
            $id: ID,
            $isAddedToWorkspace: Boolean,
            $headerLevel: String!,
            $timezone: String!,
            $language: String!,
            $trimWhitespaces: Boolean!,
            $treatTheseAsNa: String,
        ){
        updateTable(
                id: $id
                data: {
                    isAddedToWorkspace: $isAddedToWorkspace,
                    properties: {
                        headerLevel: $headerLevel
                        timezone: $timezone
                        language: $language
                        trimWhitespaces: $trimWhitespaces
                        treatTheseAsNa: $treatTheseAsNa
                    }
                },
            ) {
            errors
            ok
            result {
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
        }
    }
`);

interface Column {
    key: string;
    label: string;
}
type Row = Record<string, string>;

interface FormValues {
    headerLevel?: string | null | undefined;
    timezone?: string | null | undefined;
    language?: string | null | undefined;
    trimWhitespaces?: boolean ;
    treatTheseAsNa?: string;
}
interface UpdateTable {
    id?: string;
    isAddedToWorkspace?: boolean;
    headerLevel: string;
    timezone: string;
    language: string;
    trimWhitespaces: boolean;
    treatTheseAsNa?: string;
}

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

    console.log(data?.table);

    const [
        updateTableResult,
        updateTable,
    ] = useMutation(createUpdateTableMutationDocument);

    const tablePropertiesForm = useForm<FormValues>({
        initialValues: data?.table?.properties ?? {},
    });

    const handleCollapseClick = useCallback(() => {
        toggleOpened();
    }, [toggleOpened]);

    console.log('Update', updateTableResult);

    const handleUpdateTable = useCallback((values: UpdateTable) => {
        updateTable({
            values,
        }).then((res) => {
            if (res.data?.updateTable?.ok) {
                console.log('ok');
            }
            if (res.error) {
                console.log('error', res.error);
            }
        });
    }, [
        updateTable,
    ]);

    const handleFormSubmit = useCallback((values) => {
        console.warn('values', values);
        const formValues = tablePropertiesForm.values;
        handleUpdateTable(values);
    }, [
        tablePropertiesForm.values,
        handleUpdateTable,
        data,
    ]);

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

    return (
        <Paper className={styles.import}>
            {fetching
                ? <LoadingOverlay visible={fetching} />
                : (
                    <>
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
                                <Paper className={styles.tablePropertiesContainer} radius="md">
                                    <Title order={5} color="dimmed" weight="600">Properties</Title>
                                    <Divider />
                                    <form
                                        className={styles.form}
                                        onSubmit={tablePropertiesForm.onSubmit(handleFormSubmit)}
                                        onReset={tablePropertiesForm.onReset}
                                    >
                                        <Select
                                            label="Header Levels"
                                            data={data?.propertiesOptions?.table?.headerLevels}
                                            rightSection={<IoChevronDown className={styles.icon} />}
                                            styles={{ rightSection: { pointerEvents: 'none' } }}
                                            {...tablePropertiesForm.getInputProps('headerLevel')}
                                        />
                                        <Select
                                            label="Time Zone (Optional)"
                                            data={data?.propertiesOptions?.table?.timezones}
                                            rightSection={<IoChevronDown className={styles.icon} />}
                                            styles={{ rightSection: { pointerEvents: 'none' } }}
                                            {...tablePropertiesForm.getInputProps('timezone')}
                                        />
                                        <Switch
                                            label="Trim White Space"
                                            labelPosition="left"
                                            {...tablePropertiesForm.getInputProps('trimWhitespaces', { type: 'checkbox' })}
                                        />
                                        <TextInput
                                            label="Treat These as NA (Optional)"
                                            {...tablePropertiesForm.getInputProps('treatTheseAsNa')}
                                        />
                                        <Select
                                            label="Language"
                                            rightSection={<IoChevronDown className={styles.icon} />}
                                            rightSectionWidth={30}
                                            styles={{ rightSection: { pointerEvents: 'none' } }}
                                            data={data?.propertiesOptions?.table?.languages}
                                            {...tablePropertiesForm.getInputProps('language')}
                                        />
                                        <Group position="apart">
                                            <Button
                                                type="reset"
                                                radius="xl"
                                                variant="default"
                                                uppercase
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                type="submit"
                                                radius="xl"
                                                variant="light"
                                                uppercase
                                            >
                                                Apply
                                            </Button>
                                        </Group>
                                    </form>
                                </Paper>
                                <Paper className={styles.tableContainer} radius="md" withBorder>
                                    <LoadingOverlay visible={fetching} />
                                    {error ? (
                                        <Center>
                                            <Alert title="Unable to get table information" color="red" className={styles.alert}>
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
                            <Group position="right" className={styles.importActions}>
                                <Button radius="xl" variant="default" uppercase onClick={onCancel}>Cancel</Button>
                                <Button radius="xl" variant="light" uppercase disabled={fetching}>Import</Button>
                            </Group>
                            <Alert
                                title="Update Table"
                                color="green"
                            >
                                Table Updated
                            </Alert>
                        </Collapse>
                    </>
                )}
        </Paper>
    );
}
