import {
    Divider,
    Paper,
} from '@mantine/core';

import ImportTable from './ImportTable';
import styles from './styles.module.css';

interface Props {
    selectedTable?: string;
    onImportCancel: () => void;
}
export default function Workspace(props: Props) {
    const {
        selectedTable,
        onImportCancel,
    } = props;

    return (
        <Paper className={styles.workspaceContainer}>
            <Paper className={styles.workspace}>
                Workspace
            </Paper>
            <Divider />
            {selectedTable && (
                <ImportTable
                    key={selectedTable}
                    tableId={selectedTable}
                    onCancel={onImportCancel}
                />
            )}
        </Paper>
    );
}
