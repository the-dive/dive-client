import React, { useCallback, useMemo } from 'react';
import {
    ActionIcon,
    Card,
    Collapse,
    Divider,
    Flex,
    Group,
    Menu,
    Paper,
    ScrollArea,
    SegmentedControl,
    SimpleGrid,
    Stack,
    Table,
    Tabs,
    Text,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { isDefined } from '@togglecorp/fujs';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import {
    MdGrid3X3,
    MdHdrAuto,
    MdList,
    MdOutlineCalendarToday,
    MdOutlineGridView,
    MdOutlineLanguage,
    MdOutlineLocationOn,
    MdOutlineTableChart,
    MdOutlineTag,
} from 'react-icons/md';
import { useMutation, useQuery } from 'urql';
import { graphql } from '#gql';
import { WorkTableQuery } from '#gql/graphql';
import styles from './styles.module.css';

interface Props {
    tableId: string;
}

type Row = Record<string, string>;
type Column = NonNullable<NonNullable<NonNullable<WorkTableQuery['table']>['dataColumnStats']>[0]>;

interface ListColKeyValue {
    key: keyof Column;
    label: string;
}
const listColKeyValue: ListColKeyValue[] = [
    {
        key: 'key',
        label: '',
    },
    {
        key: 'label',
        label: 'Label',
    },
    {
        key: 'type',
        label: 'Type',
    },
    {
        key: 'totalCount',
        label: 'Total count',
    },
    {
        key: 'naCount',
        label: 'Nulls',
    },
    {
        key: 'maxLength',
        label: 'Max length',
    },
    {
        key: 'minLength',
        label: 'Min length',
    },
    {
        key: 'uniqueCount',
        label: 'Unique count',
    },
    {
        key: 'min',
        label: 'Min',
    },
    {
        key: 'max',
        label: 'Max',
    },
    {
        key: 'mean',
        label: 'Mean',
    },
    {
        key: 'median',
        label: 'Median',
    },
    {
        key: 'stdDeviation',
        label: 'Standard deviation',
    },
];

const workspaceTableQueryDocument = graphql(/* GraphQL */ `
    query workTable($id: ID!) {
        table(id: $id) {
            id
            name
            isAddedToWorkspace
            columnsCount
            rowsCount
            dataRows
            dataColumnStats {
                key
                label
                max
                mean
                maxLength
                median
                min
                minLength
                naCount
                stdDeviation
                totalCount
                type
                uniqueCount
            }
        }
    }
`);

const tableActionMutationDocument = graphql(/* graphql */`
    mutation changeTableAction(
        $id: ID!
        $key: String
        $type: String
    ) {
        tableAction(
            id: $id,
            action: {
                actionName: cast_column,
                params: [$key, $type]
            }
        ) {
            result
            ok
            errors
        }
    }
`);

export default function WorkTable(props: Props) {
    const { tableId } = props;

    const [opened, toggleOpened] = useToggle([true, false]);

    const [
        ,
        tableAction,
    ] = useMutation(tableActionMutationDocument);

    const [
        workspaceTableResult,
        reexecuteQuery,
    ] = useQuery({
        query: workspaceTableQueryDocument,
        variables: {
            id: tableId,
        },
    });

    const {
        data: workspaceTable,
    } = useMemo(() => (
        workspaceTableResult
    ), [workspaceTableResult]);

    const colsKeys = useMemo(() => (
        workspaceTable?.table?.dataColumnStats
            ?.map((stats) => stats?.key).filter(isDefined)
    ), [
        workspaceTable,
    ]);

    const rows = useMemo(() => (
        workspaceTable?.table?.dataRows.map((row: Row, rowIndex: number) => {
            const cells = colsKeys?.map((key) => (
                // eslint-disable-next-line react/no-array-index-key
                <td key={`${tableId}-row-${rowIndex}-cell-${key}`}>
                    {row[key]}
                </td>
            ));

            return (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={`${tableId}-row-${rowIndex}`}>
                    {cells}
                </tr>
            );
        })
    ), [
        workspaceTable,
        tableId,
        colsKeys,
    ]);

    const getClickHandler = useCallback((
        key: string | undefined,
    ) => (e: React.BaseSyntheticEvent) => (
        tableAction({
            id: tableId,
            key,
            type: e.currentTarget.name,
        }).then((result) => {
            if (result.data?.tableAction?.ok) {
                reexecuteQuery({ requestPolicy: 'network-only' });
            }
        })
    ), [
        tableAction,
        tableId,
        reexecuteQuery,
    ]);

    const columns = useMemo(() => (
        workspaceTable?.table?.dataColumnStats?.map((col) => (
            <th key={`${tableId}-${col?.key}`}>
                <Menu>
                    <Menu.Target>
                        <ActionIcon className={styles.columnHeader}>
                            {col?.label}
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            name="number"
                            icon={<MdGrid3X3 />}
                            onClick={getClickHandler(col?.key)}
                        >
                            Number
                        </Menu.Item>
                        <Menu.Item
                            name="string"
                            icon={<MdHdrAuto />}
                            onClick={getClickHandler(col?.key)}
                        >
                            String
                        </Menu.Item>
                        <Menu.Item icon={<MdOutlineCalendarToday />}>Date</Menu.Item>
                        <Menu.Item>Date and Time</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </th>
        ))
    ), [
        workspaceTable,
        tableId,
        getClickHandler,
    ]);

    const listColKeys = useMemo(() => (
        listColKeyValue.map((col) => (col.key))
    ), []);

    const listRows = useMemo(() => (
        workspaceTable?.table?.dataColumnStats
            ?.map((row, rowIndex: number) => {
                const cells = listColKeys.map((key) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <td key={`${tableId}-row-${rowIndex}-list-cell-${key}`}>
                        {row && row[key]}
                    </td>
                ));
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <tr key={`${tableId}-list-row-${rowIndex}`}>
                        {cells}
                    </tr>
                );
            })
    ), [
        workspaceTable,
        listColKeys,
        tableId,
    ]);

    const handleCollapseClick = useCallback(() => {
        toggleOpened();
    }, [toggleOpened]);

    const listColumn = useMemo(() => (
        listColKeyValue.map((list) => (
            <th key={`${tableId}-list-${list.key}`}>
                {list.label}
            </th>
        ))
    ), [
        tableId,
    ]);

    return (
        <Paper
            p="md"
            className={styles.tabView}
        >
            <Tabs
                variant="pills"
                defaultValue="tableView"
                className={styles.tab}
            >
                <Tabs.List>
                    <Tabs.Tab value="tableView" icon={<MdOutlineTableChart size={14} />} />
                    <Tabs.Tab value="listView" icon={<MdList size={14} />} />
                    <Tabs.Tab value="gridView" icon={<MdOutlineGridView size={14} />} />
                    <Group>
                        <ActionIcon
                            variant="transparent"
                            className={styles.tableStatusButton}
                        >
                            1
                            <MdOutlineTag />
                        </ActionIcon>
                        <ActionIcon
                            variant="transparent"
                            className={styles.tableStatusButton}
                        >
                            1
                            <MdOutlineCalendarToday />
                        </ActionIcon>
                        <ActionIcon
                            variant="transparent"
                            className={styles.tableStatusButton}
                        >
                            1
                            <MdOutlineLanguage />
                        </ActionIcon>
                        <ActionIcon
                            variant="transparent"
                            className={styles.tableStatusButton}
                        >
                            1
                            <MdOutlineLocationOn />
                        </ActionIcon>
                        <ActionIcon
                            color="dark"
                            size="md"
                            variant="transparent"
                            onClick={handleCollapseClick}
                        >
                            {opened ? <IoChevronUp /> : <IoChevronDown />}
                        </ActionIcon>
                    </Group>
                </Tabs.List>
                <Collapse in={opened}>
                    <Tabs.Panel value="tableView" pt="xs">
                        <Paper className={styles.tabPanel}>
                            <ScrollArea className={styles.scrollArea}>
                                <Table striped withColumnBorders>
                                    <thead>
                                        <tr>
                                            {columns}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows}
                                    </tbody>
                                </Table>
                            </ScrollArea>
                        </Paper>
                    </Tabs.Panel>
                    <Tabs.Panel value="listView" pt="xs">
                        <Paper className={styles.tabPanel}>
                            <ScrollArea className={styles.scrollArea}>
                                <Flex
                                    justify="center"
                                    p="sm"
                                >
                                    <SegmentedControl
                                        radius="lg"
                                        color="brand"
                                        data={[
                                            { value: 'summary_stats', label: 'Summary stats' },
                                            { value: 'framework_setup', label: 'Framework setup', disabled: true },
                                        ]}
                                    />
                                </Flex>
                                <Table striped withColumnBorders>
                                    <thead>
                                        <tr>
                                            {listColumn}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listRows}
                                    </tbody>
                                </Table>
                            </ScrollArea>
                        </Paper>
                    </Tabs.Panel>
                    <Tabs.Panel value="gridView" pt="xs">
                        <Paper className={styles.tabPanel}>
                            <ScrollArea className={styles.scrollArea}>
                                <SimpleGrid
                                    breakpoints={[
                                        { minWidth: 'sm', cols: 2 },
                                        { minWidth: 'md', cols: 3 },
                                        { minWidth: 'lg', cols: 4 },
                                    ]}
                                    p="md"
                                    spacing="md"
                                >
                                    {workspaceTable?.table?.dataColumnStats?.map((stats) => (
                                        <Card shadow="sm" p="sm" radius="sm" withBorder key={stats?.key}>
                                            <Stack>
                                                <Text size="lg" weight={600}>{stats?.label}</Text>
                                                {isDefined(stats?.min) && (
                                                    <Paper>
                                                        <Group position="apart">
                                                            <Text>Min</Text>
                                                            <Text>{stats?.min}</Text>
                                                        </Group>
                                                        <Divider />
                                                    </Paper>
                                                )}
                                                {isDefined(stats?.max) && (
                                                    <Paper>
                                                        <Group position="apart">
                                                            <Text weight={500}>
                                                                Max
                                                            </Text>
                                                            <Text weight={500}>
                                                                {stats?.max}
                                                            </Text>
                                                        </Group>
                                                        <Divider />
                                                    </Paper>
                                                )}
                                                {isDefined(stats?.minLength) && (
                                                    <Paper>
                                                        <Group position="apart">
                                                            <Text weight={500}>
                                                                Min Length
                                                            </Text>
                                                            <Text weight={500}>
                                                                {stats?.minLength}
                                                            </Text>
                                                        </Group>
                                                        <Divider />
                                                    </Paper>
                                                )}
                                                {isDefined(stats?.maxLength) && (
                                                    <Paper>
                                                        <Group position="apart">
                                                            <Text weight={500}>
                                                                Max Length
                                                            </Text>
                                                            <Text weight={500}>
                                                                {stats?.maxLength}
                                                            </Text>
                                                        </Group>
                                                        <Divider />
                                                    </Paper>
                                                )}
                                                {isDefined(stats?.mean) && (
                                                    <Paper>
                                                        <Group position="apart">
                                                            <Text weight={500}>
                                                                Mean
                                                            </Text>
                                                            <Text weight={500}>
                                                                {stats?.mean}
                                                            </Text>
                                                        </Group>
                                                        <Divider />
                                                    </Paper>
                                                )}
                                                {isDefined(stats?.median) && (
                                                    <Paper>
                                                        <Group position="apart">
                                                            <Text weight={500}>
                                                                Median
                                                            </Text>
                                                            <Text weight={500}>
                                                                {stats?.median}
                                                            </Text>
                                                        </Group>
                                                        <Divider />
                                                    </Paper>
                                                )}
                                                {isDefined(stats?.stdDeviation) && (
                                                    <Paper>
                                                        <Group position="apart">
                                                            <Text weight={500}>
                                                                Standard Deviation
                                                            </Text>
                                                            <Text weight={500}>
                                                                {stats?.stdDeviation}
                                                            </Text>
                                                        </Group>
                                                        <Divider />
                                                    </Paper>
                                                )}
                                                {isDefined(stats?.totalCount) && (
                                                    <Paper>
                                                        <Group position="apart">
                                                            <Text weight={500}>
                                                                Total Count
                                                            </Text>
                                                            <Text weight={500}>
                                                                {stats?.totalCount}
                                                            </Text>
                                                        </Group>
                                                        <Divider />
                                                    </Paper>
                                                )}
                                                {isDefined(stats?.uniqueCount) && (
                                                    <Paper>
                                                        <Group position="apart">
                                                            <Text weight={500}>
                                                                Unique Count
                                                            </Text>
                                                            <Text weight={500}>
                                                                {stats?.uniqueCount}
                                                            </Text>
                                                        </Group>
                                                        <Divider />
                                                    </Paper>
                                                )}
                                            </Stack>
                                        </Card>
                                    ))}
                                </SimpleGrid>
                            </ScrollArea>
                        </Paper>
                    </Tabs.Panel>
                </Collapse>
            </Tabs>
        </Paper>
    );
}
