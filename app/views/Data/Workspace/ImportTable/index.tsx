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
import { useQuery } from 'urql';
import { useForm } from '@mantine/form';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { graphql } from '#gql';
import styles from './styles.module.css';

const tableProperties = {
    headerLevelOptions: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
    ],
    timeZoneOptions: [
        { value: 'Nepal Time', label: 'Nepal Time' },
        { value: 'UTC Time', label: 'UTC Time' },
    ],
    languageOptions: [
        { value: 'English', label: 'English' },
        { value: 'Nepali', label: 'Nepali' },
        { value: 'Hindi', label: 'Hindi' },
    ],
};

const tableQueryDocument = graphql(/* GraphQL */`
    query tableQuery($id: ID!) {
        table(id: $id) {
            id
            isAddedToWorkspace
            name
            previewData
            status
            statusDisplay
        }
    }
`);

interface Column {
    key: string;
    label: string;
}
type Row = Record<string, string>;

interface FormValues {
    headerLevel: string;
    timeZone: string;
    trimWhiteSpace: boolean;
    naValues: string;
    language: string;
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

    const tablePropertiesForm = useForm<FormValues>({
        initialValues: {
            headerLevel: '1',
            timeZone: 'Nepal Time',
            trimWhiteSpace: true,
            naValues: 'NA',
            language: 'English',
        },
    });

    const handleCollapseClick = useCallback(() => {
        toggleOpened();
    }, [toggleOpened]);

    const handleFormSubmit = useCallback(() => {}, []);

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
                                data={tableProperties.headerLevelOptions}
                                rightSection={<IoChevronDown className={styles.icon} />}
                                styles={{ rightSection: { pointerEvents: 'none' } }}
                                {...tablePropertiesForm.getInputProps('headerLevel')}
                            />
                            <Select
                                label="Time Zone (Optional)"
                                data={tableProperties.timeZoneOptions}
                                rightSection={<IoChevronDown className={styles.icon} />}
                                styles={{ rightSection: { pointerEvents: 'none' } }}
                                {...tablePropertiesForm.getInputProps('timeZone')}
                            />
                            <Switch
                                label="Trim White Space"
                                labelPosition="left"
                                {...tablePropertiesForm.getInputProps('trimWhiteSpace', { type: 'checkbox' })}
                            />
                            <TextInput
                                label="Treat These as NA (Optional)"
                                {...tablePropertiesForm.getInputProps('naValues')}
                            />
                            <Select
                                label="Language"
                                rightSection={<IoChevronDown className={styles.icon} />}
                                rightSectionWidth={30}
                                styles={{ rightSection: { pointerEvents: 'none' } }}
                                data={tableProperties.languageOptions}
                                {...tablePropertiesForm.getInputProps('language')}
                            />
                            <Group position="apart">
                                <Button type="reset" radius="xl" variant="default" uppercase>Reset</Button>
                                <Button type="submit" radius="xl" variant="light" uppercase>Apply</Button>
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
            </Collapse>
        </Paper>
    );
}
