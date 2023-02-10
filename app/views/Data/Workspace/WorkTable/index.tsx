import { useCallback } from 'react';
import {
    ActionIcon,
    Group,
    Paper,
    Divider,
    Table,
    ScrollArea,
    Menu,
    Collapse,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
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
import styles from './styles.module.css';

interface Props {
    tableId: string;
}

interface Column {
    key: number;
    label: string;
}

type Row = Record<string, string>;

const workspaceTableQueryDocument = graphql(/* GraphQL */ `
    query workTable($id: ID!) {
        table(id: $id) {
            id
            name
            isAddedToWorkspace
            dataColumnStats
            dataRows
        }
    }
`);

export default function WorkTable(props: Props) {
    const { tableId } = props;

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

    const colsKeys: number[] = workspaceTable?.table?.dataColumnStats.map((col: Column) => col.key);

    const rows = workspaceTable?.table?.dataRows.map((row: Row, rowIndex: number) => {
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
    });

    const columns = workspaceTable?.table?.dataColumnStats.map((col: Column) => (
        <th key={`${tableId}-${col.key}`}>
            <Menu>
                <Menu.Target>
                    <ActionIcon className={styles.columnHeader}>
                        {col.label}
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
    ));

    const handleCollapseClick = useCallback(() => {
        toggleOpened();
    }, [toggleOpened]);

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
                    >
                        <MdOutlineTableChart />
                    </ActionIcon>
                    <ActionIcon
                        color="dark"
                        size="md"
                        variant="transparent"
                    >
                        <MdList />
                    </ActionIcon>
                    <ActionIcon
                        color="dark"
                        size="md"
                        variant="transparent"
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
        </>
    );
}
