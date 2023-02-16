import React, { useCallback, useMemo, useState } from 'react';
import {
    ActionIcon,
    Group,
    Paper,
    Divider,
    Table,
    ScrollArea,
    Menu,
    Collapse,
    SegmentedControl,
    Flex,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { isDefined, _cs } from '@togglecorp/fujs';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import {
    MdOutlineTableChart,
    MdList,
    MdOutlineGridView,
    MdOutlineTag,
    MdOutlineLanguage,
    MdOutlineCalendarToday,
    MdOutlineLocationOn,
    MdGrid3X3,
    MdHdrAuto,
} from 'react-icons/md';
import { useQuery } from 'urql';
import { graphql } from '#gql';
import { WorkTableQuery } from '#gql/graphql';
import styles from './styles.module.css';

interface Props {
    tableId: string;
}

type Row = Record<string, string>;
type TabTypes = 'tableView' | 'listView' | 'gridView';

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
            dataRows
            dataColumnStats {
                key
                label
                type
                totalCount
                uniqueCount
                stdDeviation
                minLength
                naCount
                min
                median
                mean
                maxLength
                max
            }
        }
    }
`);

export default function WorkTable(props: Props) {
    const { tableId } = props;

    const [
        activeTab,
        setActiveTab,
    ] = useState<TabTypes>('tableView');

    const [
        workspaceTableResult,
    ] = useQuery({
        query: workspaceTableQueryDocument,
        variables: {
            id: tableId,
        },
    });

    const {
        data: workspaceTable,
    } = workspaceTableResult;

    const [opened, toggleOpened] = useToggle([true, false]);

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
                        <Menu.Item icon={<MdGrid3X3 />}>Number</Menu.Item>
                        <Menu.Item icon={<MdHdrAuto />}>String</Menu.Item>
                        <Menu.Item icon={<MdOutlineCalendarToday />}>Date</Menu.Item>
                        <Menu.Item>Date and Time</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </th>
        ))
    ), [
        workspaceTable,
        tableId,
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

    const listColumn = useMemo(() => (
        listColKeyValue.map((list) => (
            <th key={`${tableId}-list-${list.key}`}>
                {list.label}
            </th>
        ))
    ), [
        tableId,
    ]);

    const handleCollapseClick = useCallback(() => {
        toggleOpened();
    }, [toggleOpened]);

    const handleTabChange = useCallback((e: React.BaseSyntheticEvent) => {
        setActiveTab(e.currentTarget.name);
    }, [setActiveTab]);

    return (
        <>
            <Paper
                p="md"
                className={styles.tabView}
            >
                <Group
                    spacing={1}
                    className={styles.tableViewProperties}
                >
                    <ActionIcon
                        color="dark"
                        size="md"
                        variant="transparent"
                        name="tableView"
                        onClick={handleTabChange}
                        className={_cs(activeTab === 'tableView'
                            ? styles.actionIconActive
                            : styles.action)}
                    >
                        <MdOutlineTableChart />
                    </ActionIcon>
                    <ActionIcon
                        color="dark"
                        size="md"
                        variant="transparent"
                        name="listView"
                        onClick={handleTabChange}
                        className={_cs(activeTab === 'listView'
                            ? styles.actionIconActive
                            : styles.action)}
                    >
                        <MdList />
                    </ActionIcon>
                    <ActionIcon
                        color="dark"
                        size="md"
                        variant="transparent"
                        name="gridView"
                        onClick={handleTabChange}
                        className={_cs(activeTab === 'gridView'
                            ? styles.actionIconActive
                            : styles.action)}
                    >
                        <MdOutlineGridView />
                    </ActionIcon>
                </Group>
                <Divider orientation="vertical" />
                <Group
                    className={styles.tableStatus}
                >
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
                </Group>
                <ActionIcon
                    color="dark"
                    size="md"
                    variant="transparent"
                    onClick={handleCollapseClick}
                >
                    {opened ? <IoChevronUp /> : <IoChevronDown />}
                </ActionIcon>
            </Paper>
            <Divider />
            {activeTab === 'tableView' && (
                <Collapse in={opened} className={styles.collapse}>
                    <Paper className={styles.tableContainer} withBorder>
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
                </Collapse>
            )}
            {activeTab === 'listView' && (
                <Collapse in={opened} className={styles.collapse}>
                    <Flex
                        justify="center"
                        className={styles.segmentedFlex}
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
                    <Paper className={styles.tableContainer} withBorder>
                        <ScrollArea className={styles.scrollArea}>
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
                </Collapse>
            )}
        </>
    );
}
