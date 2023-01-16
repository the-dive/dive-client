import { useCallback, useMemo, useState } from 'react';
import {
    Button,
    Divider,
    LoadingOverlay,
    Menu,
    Paper,
    Text,
    TextInput,
} from '@mantine/core';
import {
    MdOutlineTableChart,
    MdDone,
    MdRefresh,
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

const dublicateTableFromWorkspaceMutationDocument = graphql(/* GraphQL */`
    mutation DublicateTableFromWorkspace($id: ID!) {
        cloneTable(id: $id) {
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

const renameTableFromWorkspaceMutationDocument = graphql(/* GraphQL */`
    mutation RenameTableFromWorkspace($id: ID! $name: String!) {
        renameTable(id: $id, name: $name) {
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

    const [isRename, setIsRename] = useState(false);
    const [renameTable, setRenameTable] = useState(table.name);

    const [
        removeTableFromWorkspaceResult,
        removeTableFromWorkspace,
    ] = useMutation(removeTableFromWorkspaceMutationDocument);

    const [
        dublicateTableFromWorkspaceResult,
        dublicateTableFromWorkspace,
    ] = useMutation(dublicateTableFromWorkspaceMutationDocument);

    const [
        renameTableFromWorkspaceResult,
        renameTableFromWorkspace,
    ] = useMutation(renameTableFromWorkspaceMutationDocument);

    const handleRemoveButtonClick = useCallback(() => {
        removeTableFromWorkspace({ id: table.id });
    }, [removeTableFromWorkspace, table.id]);

    const handleDublicateButtonClick = useCallback(() => {
        dublicateTableFromWorkspace({ id: table.id });
    }, [dublicateTableFromWorkspace, table.id]);

    const handleRenameButtonClick = useCallback(() => {
        setIsRename(true);
    }, []);

    const handleRenameOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setRenameTable(e.target?.value);
    }, []);

    const handleRefreshButtonClick = useCallback(() => {
        setRenameTable(table.name);
    }, [table.name]);

    const handleRenameSubmit = useCallback(() => {
        renameTableFromWorkspace({ id: table.id, name: renameTable });
        setIsRename(false);
    }, [
        table,
        renameTableFromWorkspace,
        renameTable,
    ]);

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
                {!isRename
                    ? (
                        <Text color="dark">
                            {table.name}
                        </Text>
                    ) : (
                        <TextInput
                            autoFocus
                            className={styles.renameInput}
                            value={renameTable}
                            onChange={handleRenameOnChange}
                            variant="unstyled"
                            rightSection={(
                                <div className={styles.renameSubmitRefresh}>
                                    <MdDone
                                        className={styles.renameSubmit}
                                        onClick={handleRenameSubmit}
                                    />
                                    <MdRefresh onClick={handleRefreshButtonClick} />
                                </div>
                            )}
                        />
                    )}
            </Button>
            {!isRename && (
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
                        <Menu.Item
                            disabled={dublicateTableFromWorkspaceResult.fetching}
                            onClick={handleDublicateButtonClick}
                        >
                            Duplicate
                        </Menu.Item>
                        <Menu.Item
                            disabled={renameTableFromWorkspaceResult.fetching}
                            onClick={handleRenameButtonClick}
                        >
                            Rename
                        </Menu.Item>
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
            )}
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
                <>
                    <Divider />
                    <WorkTable />
                </>
            )}
        </Paper>
    );
}
