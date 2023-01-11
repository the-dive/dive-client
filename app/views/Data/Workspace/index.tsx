import { useCallback, useMemo, useState } from 'react';
import {
    Button,
    Divider,
    LoadingOverlay,
    Menu,
    Paper,
    Text,
} from '@mantine/core';
import {
    MdOutlineTableChart,
} from 'react-icons/md';
import { IoChevronDown } from 'react-icons/io5';
import { useQuery, useMutation } from 'urql';
import { TableType } from '#gql/graphql';
import { graphql } from '#gql';

import ImportTable from './ImportTable';
import styles from './styles.module.css';
import WorkTable from './WorkTable';

interface Props {
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
          isAddedToWorkspace
        }
      }
    }
`);

const tablesAddedToWorkspaceQueryDocument = graphql(/* GraphQL */`
    query TablesAddedToWorkspace {
      tables(isAddedToWorkspace: true) {
        results {
          id
          isAddedToWorkspace
          name
          previewData
          status
          statusDisplay
        }
        totalCount
      }
    }
`);

interface WorkspaceItemProps {
    table: TableType;
    onClickTable: () => void;
}

function WorkspaceItem(props: WorkspaceItemProps) {
    const {
        table,
        onClickTable,
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
                onClick={onClickTable}
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
        selectedTable,
        onImportCancel,
        onImportSuccess,
    } = props;
    /*
    *  URQL's Document Caching Gotcha
    *  If we request a list of data, and the API returns an empty list, then the
    *  cache won't be able to see the __typename of said list and invalidate it.
    *  Supplying additionalTypenames to the context of your query, will invalidate
    *  the query even when the list is empty.
    */
    const context = useMemo(() => ({ additionalTypenames: ['TableType'] }), []);
    const [tablePreview, setTablePreview] = useState(false);

    const [
        tablesAddedToWorkspaceResult,
    ] = useQuery({
        query: tablesAddedToWorkspaceQueryDocument,
        context,
    });

    const {
        data,
        fetching,
    } = tablesAddedToWorkspaceResult;

    const onTableClick = useCallback(() => {
        setTablePreview(true);
    }, []);

    return (
        <Paper className={styles.workspaceContainer}>
            <Paper className={styles.workspace}>
                <LoadingOverlay visible={fetching} />
                {data?.tables?.results?.map((table) => (
                    <WorkspaceItem
                        key={table.id}
                        table={table}
                        onClickTable={onTableClick}
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
            {tablePreview && (
                <WorkTable />
            )}
        </Paper>

    );
}
