import { useCallback } from 'react';
import {
    Button,
    Divider,
    Menu,
    Paper,
    Text,
} from '@mantine/core';
import { MdOutlineTableChart } from 'react-icons/md';
import { IoChevronDown } from 'react-icons/io5';
import { useMutation } from 'urql';
import { TableType } from '#gql/graphql';
import { graphql } from '#gql';

import ImportTable from './ImportTable';
import styles from './styles.module.css';

interface Props {
    tables?: TableType[];
    selectedTable?: string;
    onImportCancel: () => void;
    onImportSuccess: () => void;
}

const removeTableFromWorkspaceMutationDocument = graphql(/* GraphQL */`
    mutation DeleteTableFromWorkspace($id: ID!) {
      deleteTableFromWorkspace(id: $id) {
        errors
        ok
        result {
          id
          name
          previewData
          isAddedToWorkspace
        }
      }
    }
`);

interface WorkspaceItemProps {
    table: TableType;
}

function WorkspaceItem(props: WorkspaceItemProps) {
    const {
        table,
    } = props;

    const [
        removeTableFromWorkspaceResult,
        removeTableFromWorkspace,
    ] = useMutation(removeTableFromWorkspaceMutationDocument);

    const handleRemoveButtonClick = useCallback(() => {
        removeTableFromWorkspace({ id: table.id });
    }, [removeTableFromWorkspace, table.id]);

    return (
        <Button.Group key={table.id}>
            <Button
                variant="light"
                color="gray"
                loading={removeTableFromWorkspaceResult.fetching}
                leftIcon={<MdOutlineTableChart />}
                disabled={removeTableFromWorkspaceResult.fetching}
            >
                <Text color="dark">
                    {table.name}
                </Text>
            </Button>
            <Menu
                width={130}
                shadow="md"
                withinPortal
                disabled={removeTableFromWorkspaceResult.fetching}
            >
                <Menu.Target>
                    <Button
                        variant="light"
                        color="gray"
                    >
                        <IoChevronDown />
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item>Refresh</Menu.Item>
                    <Menu.Item>Duplicate</Menu.Item>
                    <Menu.Item>Rename</Menu.Item>
                    <Menu.Item>Color</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        color="red"
                        disabled={removeTableFromWorkspaceResult.fetching}
                        onClick={handleRemoveButtonClick}
                    >
                        Remove
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Button.Group>
    );
}

export default function Workspace(props: Props) {
    const {
        tables,
        selectedTable,
        onImportCancel,
        onImportSuccess,
    } = props;

    return (
        <Paper className={styles.workspaceContainer}>
            <Paper className={styles.workspace}>
                {tables?.map((table) => (
                    <WorkspaceItem
                        key={table.id}
                        table={table}
                    />
                ))}
            </Paper>
            {selectedTable && (
                <>
                    <Divider />
                    <ImportTable
                        key={selectedTable}
                        tableId={selectedTable}
                        onCancel={onImportCancel}
                        onSuccess={onImportSuccess}
                    />
                </>
            )}
        </Paper>
    );
}
