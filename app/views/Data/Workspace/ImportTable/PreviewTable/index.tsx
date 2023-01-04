import {
    Paper,
    ScrollArea,
    Table,
} from '@mantine/core';

import styles from './styles.module.css';

interface Column {
    key: string;
    label: string;
}

type Row = Record<string, string>;

interface Props {
    tableId: string;
    previewData: any; // TODO get typed preview data from server
}

export default function ImportTable(props: Props) {
    const {
        tableId,
        previewData,
    } = props;

    const colsKeys: string[] = previewData?.columns?.map((col: Column) => col.key);

    const rows = previewData?.rows?.map((row: Row, rowIndex: number) => {
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

    const columns = previewData?.columns?.map((col: Column) => (
        <th key={`${tableId}-${col.key}`}>
            {col.label}
        </th>
    ));

    return (
        <Paper className={styles.tableContainer} radius="md" withBorder>
            <ScrollArea>
                <Table striped withColumnBorders>
                    <thead>
                        <tr>
                            {columns}
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </ScrollArea>
        </Paper>
    );
}
