import { TableType } from '#gql/graphql';
import {
    ActionIcon,
    Group,
    Paper,
    Divider,
    Table,
    ScrollArea,
    Menu,
} from '@mantine/core';
import {
    MdOutlineTableChart,
    MdList,
    MdOutlineGridView,
    MdOutlineTag,
    MdOutlineLanguage,
    MdOutlineCalendarToday,
    MdOutlineLocationOn,
} from 'react-icons/md';
import styles from './styles.module.css';

interface Props {
    table: TableType
}

interface Column {
    key: string;
    label: string;
}

type Row = Record<string, string>;

export default function WorkTable(props: Props) {
    const { table } = props;

    const colsKeys: string[] = table?.previewData?.columns?.map((col: Column) => col.key);

    const rows = table?.previewData?.rows.map((row: Row, rowIndex: number) => {
        const cells = colsKeys?.map((key) => (
            // eslint-disable-next-line react/no-array-index-key
            <td key={`${table.id}-row-${rowIndex}-cell-${key}`}>
                {row[key]}
            </td>
        ));

        return (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={`${table.id}-row-${rowIndex}`}>
                {cells}
            </tr>
        );
    });

    const columns = table?.previewData?.columns?.map((col: Column) => (
        <th key={`${table.id}-${col.key}`}>
            <Menu>
                <Menu.Target>
                    <ActionIcon className={styles.columnHeader}>
                        {col.label}
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item>Number</Menu.Item>
                    <Menu.Item>String</Menu.Item>
                    <Menu.Item>Date</Menu.Item>
                    <Menu.Item>Date and Time</Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </th>
    ));
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
            </Paper>
            <Divider />
            <ScrollArea>
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
        </>
    );
}
