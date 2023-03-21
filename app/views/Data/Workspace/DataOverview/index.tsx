import React, { useCallback, useMemo } from 'react';
import {
    ActionIcon,
    Card,
    Divider,
    Group,
    LoadingOverlay,
    Menu,
    Paper,
    Stack,
    Text,
} from '@mantine/core';
import { isDefined, _cs } from '@togglecorp/fujs';
import { useMutation, useQuery } from 'urql';
import { IoCheckmarkOutline } from 'react-icons/io5';
import {
    MdOutlineCalendarToday,
    MdHdrAuto,
    MdDateRange,
    MdOutlineGrid3X3,
} from 'react-icons/md';
import { graphql } from '#gql';
import { WorkTableQuery } from '#gql/graphql';
import TableWithStatusBar from '#components/TableWithStatusBar';

import styles from './styles.module.css';

interface Props {
    tableId: string;
    className?: string;
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
        label: 'Field names',
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

const columnIcon: Record<string, React.ReactElement> = {
    number: <MdOutlineGrid3X3 />,
    string: <MdHdrAuto />,
    date: <MdOutlineCalendarToday />,
    datetime: <MdDateRange />,
};

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

const tableColumnOptionsQueryDocument = graphql(/* graphql */`
    query TableColumnOptionsQuery {
        propertiesOptions {
            column {
                columnTypes {
                    key
                    label
                }
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
            result{
                id
                isAddedToWorkspace
                name
            }
            ok
            errors
        }
    }
`);

export default function DataOverview(props: Props) {
    const {
        tableId,
        className,
    } = props;

    const [
        ,
        tableAction,
    ] = useMutation(tableActionMutationDocument);

    const [
        workspaceTableResult,
    ] = useQuery({
        query: workspaceTableQueryDocument,
        variables: {
            id: tableId,
        },
    });

    const [
        tableColumnOptions,
    ] = useQuery({
        query: tableColumnOptionsQueryDocument,
    });

    const { data, fetching } = workspaceTableResult;

    const colsKeys = useMemo(() => (
        data?.table?.dataColumnStats
            ?.map((stats) => stats?.key).filter(isDefined)
    ), [
        data,
    ]);

    const rows = useMemo(() => (
        data?.table?.dataRows.map((row: Row, rowIndex: number) => {
            const cells = colsKeys?.map((key) => (
                // eslint-disable-next-line react/no-array-index-key
                <td key={`${tableId}-row-${rowIndex}-cell-${key}`}>
                    {row[key]}
                </td>
            ));

            return (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={`${tableId}-row-${rowIndex}`}>
                    {/* eslint-disable-next-line react/no-array-index-key */}
                    <td key={`${tableId}-row-${rowIndex}-cell-index`}>
                        {rowIndex + 1}
                    </td>
                    {cells}
                </tr>
            );
        })
    ), [
        data,
        tableId,
        colsKeys,
    ]);

    const handleMenuItemClick = useCallback((
        key: string | undefined,
    ) => (e: React.MouseEvent<HTMLButtonElement>) => (
        tableAction({
            id: tableId,
            key,
            type: e.currentTarget.name,
        })
    ), [
        tableAction,
        tableId,
    ]);

    const columnTypeOption = useMemo(() => (
        tableColumnOptions.data?.propertiesOptions?.column?.columnTypes?.filter((type) => (
            type?.key !== 'gender' && type?.key !== 'url' && type?.key !== 'geo_area'
        ))), [tableColumnOptions.data?.propertiesOptions?.column?.columnTypes]);

    const columns = useMemo(() => (
        data?.table?.dataColumnStats?.map((col) => (
            <th key={`${tableId}-${col?.key}`}>
                <Menu shadow="md" withinPortal position="bottom">
                    <Menu.Target>
                        <ActionIcon className={styles.columnHeader}>
                            {col?.label}
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {columnTypeOption?.map((columnType) => (
                            <Menu.Item
                                color={col?.type === columnType?.key ? 'brand' : 'dimmed'}
                                key={columnType?.key}
                                name={columnType?.key}
                                icon={columnType?.key ? (columnIcon[columnType.key]) : null}
                                onClick={handleMenuItemClick(col?.key)}
                                className={_cs(
                                    styles.menuItem,
                                    col?.type === columnType?.key && styles.active,
                                )}
                                rightSection={(
                                    col?.type === columnType?.key
                                ) && <IoCheckmarkOutline />}
                            >
                                {columnType?.label}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>
            </th>
        ))
    ), [
        data,
        tableId,
        handleMenuItemClick,
        columnTypeOption,
    ]);

    const card = useMemo(() => (
        data?.table?.dataColumnStats?.map((stats) => (
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
        ))
    ), [data]);

    const listColKeys = useMemo(() => (
        listColKeyValue.map((col) => (col.key))
    ), []);

    const listRows = useMemo(() => (
        data?.table?.dataColumnStats
            ?.map((row, rowIndex: number) => {
                const cells = listColKeys.map((key) => (

                    <td // eslint-disable-next-line react/no-array-index-key
                        key={`${tableId}-row-${rowIndex}-list-cell-${key}`}
                        className={_cs((key === 'type') && styles.typeCell)}
                    >
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
        data,
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

    if (fetching) {
        return (
            <LoadingOverlay visible={fetching} />
        );
    }

    return (
        <TableWithStatusBar
            className={className}
            listColumn={listColumn}
            listRows={listRows}
            columns={columns}
            rows={rows}
            card={card}
        />
    );
}
