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

import SetRelationshipModal from './SetRelationshipModal';
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

const duplicateTableFromWorkspaceMutationDocument = graphql(/* GraphQL */`
    mutation DuplicateTableFromWorkspace($id: ID!) {
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
          originalName
        }
        totalCount
      }
    }
`);

interface WorkspaceItemProps {
    table: TableType;
    onSetRelation: (id: string) => void;
    onTableClick: (id: string) => void;
}

function WorkspaceItem(props: WorkspaceItemProps) {
    const {
        table,
        onSetRelation,
        onTableClick,
    } = props;

    const [isRenameClicked, setIsRenameClicked] = useState(false);
    const [tableName, setTableName] = useState(table.name);

    const [
        removeTableFromWorkspaceResult,
        removeTableFromWorkspace,
    ] = useMutation(removeTableFromWorkspaceMutationDocument);

    const [
        duplicateTableFromWorkspaceResult,
        duplicateTableFromWorkspace,
    ] = useMutation(duplicateTableFromWorkspaceMutationDocument);

    const [
        renameTableFromWorkspaceResult,
        renameTableFromWorkspace,
    ] = useMutation(renameTableFromWorkspaceMutationDocument);

    const handleRemoveButtonClick = useCallback(() => {
        removeTableFromWorkspace({ id: table.id });
    }, [removeTableFromWorkspace, table.id]);

    const handleDuplicateButtonClick = useCallback(() => {
        duplicateTableFromWorkspace({ id: table.id });
    }, [duplicateTableFromWorkspace, table.id]);

    const handleRenameButtonClick = useCallback(() => {
        setIsRenameClicked(true);
    }, []);

    const handleRenameOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTableName(e.target?.value);
    }, []);

    const handleRefreshButtonClick = useCallback(() => {
        setTableName(table.name);
    }, [table.name]);

    const handleRenameSubmit = useCallback(() => {
        renameTableFromWorkspace({ id: table.id, name: tableName }).then((response) => {
            if (response.data?.renameTable?.ok) {
                setIsRenameClicked(false);
            }
        });
    }, [
        table,
        renameTableFromWorkspace,
        tableName,
    ]);

    const handleSetRelation = useCallback(() => {
        onSetRelation(table.id);
    }, [table.id, onSetRelation]);

    const handleTableClick = useCallback(() => {
        onTableClick(table.id);
    }, [table.id, onTableClick]);

    return (
        <Button.Group key={table.id}>
            <Button
                variant="light"
                color="gray"
                loading={removeTableFromWorkspaceResult.fetching}
                leftIcon={<MdOutlineTableChart />}
                disabled={removeTableFromWorkspaceResult.fetching}
                onClick={handleTableClick}
            >
                {isRenameClicked ? (
                    <TextInput
                        autoFocus
                        classNames={{
                            wrapper: styles.renameInput,
                            rightSection: styles.rightSection,
                        }}
                        value={tableName}
                        onChange={handleRenameOnChange}
                        disabled={renameTableFromWorkspaceResult.fetching}
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
                ) : (
                    <Text color="dark">
                        {table.name}
                    </Text>
                )}
            </Button>
            {!isRenameClicked && (
                <Menu
                    width={130}
                    shadow="md"
                    withinPortal
                    disabled={removeTableFromWorkspaceResult.fetching || isRenameClicked}
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
                        <Menu.Item
                            disabled={duplicateTableFromWorkspaceResult.fetching}
                            onClick={handleDuplicateButtonClick}
                        >
                            Duplicate
                        </Menu.Item>
                        <Menu.Item
                            disabled={renameTableFromWorkspaceResult.fetching}
                            onClick={handleRenameButtonClick}
                        >
                            Rename
                        </Menu.Item>
                        <Menu.Item
                            disabled={renameTableFromWorkspaceResult.fetching}
                            onClick={handleSetRelation}
                        >
                            Set relation
                        </Menu.Item>
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
    const [relationTableId, setRelationTableId] = useState<string>();
    const [tableId, setTableId] = useState<string>();
    const [
        tablesAddedToWorkspaceResult,
    ] = useQuery({
        query: tablesAddedToWorkspaceQueryDocument,
        context,
    });

    const {
        data: workspaceData,
        fetching: fetchingWorkspace,
    } = tablesAddedToWorkspaceResult;

    const handleSetRelation = useCallback((id: string) => {
        setRelationTableId(id);
    }, []);

    const handleTableClick = useCallback((id: string) => {
        setTableId(id);
    }, []);

    const handleModalClose = useCallback(() => {
        setRelationTableId(undefined);
    }, []);

    return (
        <Paper className={styles.workspaceContainer}>
            <Paper className={styles.workspace}>
                <LoadingOverlay visible={fetchingWorkspace} />
                {workspaceData?.tables?.results?.map((table) => (
                    <WorkspaceItem
                        key={table.id}
                        table={table}
                        onSetRelation={handleSetRelation}
                        onTableClick={handleTableClick}
                    />
                ))}
                {relationTableId && (
                    <SetRelationshipModal
                        selectedTableId={relationTableId}
                        onClose={handleModalClose}
                        tables={workspaceData?.tables?.results}
                    />
                )}
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
            {(!selectedTable && tableId) && (
                <>
                    <Divider />
                    <WorkTable
                        tableId={tableId}
                    />
                </>
            )}
        </Paper>

    );
}
