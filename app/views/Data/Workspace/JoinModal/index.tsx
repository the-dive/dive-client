import { useMemo, useCallback } from 'react';
import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    Group,
    Image,
    Modal,
    Paper,
    Select,
    SelectItem,
    Text,
    Title,
} from '@mantine/core';
import { isNotDefined, isDefined } from '@togglecorp/fujs';
import { useForm } from '@mantine/form';
import { useMutation, useQuery } from 'urql';
import { IoChevronDown } from 'react-icons/io5';

import { mapKeyToValue } from '#base/utils/transform';
import { graphql } from '#gql';
import { TableJoinInputType } from '#gql/graphql';
import PreviewTable from '#views/Data/Workspace/ImportTable/PreviewTable';

import { TableRelationshipFormType } from '../SetRelationshipModal';
import styles from './styles.module.css';

const tableJoinPreviewMutationDocument = graphql(/* GraphQL */`
    mutation TableJoinPreview($data: TableJoinInputType!, $id: ID!) {
      joinPreview(
        data: $data
        id: $id
      ) {
        errors
        ok
        result {
          columns {
            key
            label
          }
          rows
        }
      }
    }
`);

const tableJoinMutationDocument = graphql(/* GraphQL */`
    mutation TableJoinMutation($data: TableJoinInputType!, $id: ID!) {
      tableJoin(
        data: $data
        id: $id
      ) {
        errors
        ok
        result {
            id
            name
        }
      }
    }
`);

const tableColumnsQueryDocument = graphql(/* GraphQL */`
    query TableColumns($id: ID!) {
        table(id: $id) {
            id
            name
            dataColumnStats {
                key
                label
            }
        }
    }
`);

interface Props {
    onClose: () => void;
    formValues: TableRelationshipFormType;
}

export default function JoinModal(props: Props) {
    const {
        formValues,
        onClose,
    } = props;

    const [
        tableJoinPreviewResult,
        tableJoinPreview,
    ] = useMutation(tableJoinPreviewMutationDocument);

    const [
        ,
        tableJoin,
    ] = useMutation(tableJoinMutationDocument);

    const [
        sourceTableColumnsResult,
    ] = useQuery({
        query: tableColumnsQueryDocument,
        variables: {
            id: formValues.fromTable,
        },
    });

    const [
        targetTableColumnsResult,
    ] = useQuery({
        query: tableColumnsQueryDocument,
        variables: {
            id: formValues.toTable,
        },
    });

    const tableJoinForm = useForm({
        initialValues: {
            id: formValues.fromTable,
            data: {
                clauses: [
                    {
                        source_column: null,
                        target_column: null,
                        operation: 'equal',
                    },
                ],
                targetTable: formValues.toTable,
                joinType: 'INNER_JOIN',
            },
        },
        validate: {
            data: {
                clauses: {
                    source_column: (val) => (isNotDefined(val) ? 'Source table column is required' : null),
                    target_column: (val) => (isNotDefined(val) ? 'Target table column is required' : null),
                },
            },
        },
    });

    const sourceTableColumOptions = useMemo(() => (
        sourceTableColumnsResult.data?.table?.dataColumnStats?.map(mapKeyToValue) ?? []
    ), [sourceTableColumnsResult.data?.table?.dataColumnStats]);

    const targetTableColumOptions = useMemo(() => (
        targetTableColumnsResult.data?.table?.dataColumnStats?.map(mapKeyToValue) ?? []
    ), [targetTableColumnsResult.data?.table?.dataColumnStats]);

    const handleFormSubmit = useCallback((values: any) => { // TODO: use type
        const { data } = values;
        tableJoinPreview({
            ...values,
            data: {
                ...data,
                clauses: JSON.stringify(data.clauses),
            },
        });
    }, [tableJoinPreview]);

    const handleSave = useCallback(() => {
        const { data } = tableJoinForm.values;
        tableJoin({
            ...tableJoinForm.values,
            data: {
                ...data as TableJoinInputType, // TODO: fix type
                clauses: JSON.stringify(data.clauses),
            },
        }).then((res) => {
            if (res.data?.tableJoin?.ok) {
                onClose();
            }
        });
    }, [tableJoinForm.values, tableJoin, onClose]);

    return (
        <Modal
            opened={isDefined(formValues)}
            onClose={onClose}
            title={(
                <Title order={3}>
                    Join
                </Title>
            )}
            radius="md"
            size="80vw"
            padding="md"
            centered
            className={styles.joinModal}
        >
            <Flex
                className={styles.formContainer}
                direction="row"
                gap="xs"
            >
                <Paper
                    className={styles.joinModalForm}
                    radius="md"
                >
                    <Flex
                        gap="xs"
                        direction="column"
                    >
                        <Text
                            fz="xs"
                            color="dimmed"
                            weight="600"
                        >
                            JOIN TYPE
                        </Text>
                        <Divider />
                        <Paper
                            radius="md"
                            p="xs"
                        >
                            <Flex
                                direction="row"
                                align="center"
                                justify="center"
                                gap="xs"
                            >
                                <Box miw="4rem">
                                    <Text
                                        color="dimmed"
                                        weight="600"
                                        style={{ wordBreak: 'unset' }}
                                    >
                                        {sourceTableColumnsResult.data?.table?.name}
                                    </Text>
                                </Box>
                                <Image
                                    width={200}
                                    src="assets/JoinType.svg"
                                    caption={(
                                        <Text
                                            color="dimmed"
                                            weight="600"
                                        >
                                            Inner Join
                                        </Text>
                                    )}
                                />
                                <Box miw="4rem">
                                    <Text
                                        color="dimmed"
                                        weight="600"
                                        style={{ wordBreak: 'unset' }}
                                    >
                                        {targetTableColumnsResult.data?.table?.name}
                                    </Text>
                                </Box>
                            </Flex>
                        </Paper>
                        <Text
                            fz="xs"
                            color="dimmed"
                            weight="600"
                        >
                            JOIN CLAUSES
                        </Text>
                        <Divider />
                        <form
                            onSubmit={
                                tableJoinForm.onSubmit(handleFormSubmit)
                            } // TODO: graphql types
                            onReset={tableJoinForm.onReset}
                        >
                            <Flex
                                gap="xs"
                                direction="row"
                                pb="xs"
                            >
                                <Select
                                    label="Source Table Column"
                                    required
                                    data={sourceTableColumOptions as SelectItem[]}
                                    rightSectionWidth={30}
                                    {...tableJoinForm.getInputProps('data.clauses.0.source_column')}
                                    rightSection={<IoChevronDown className={styles.icon} />}
                                />
                                <Text
                                    color="dimmed"
                                    weight="600"
                                >
                                    =
                                </Text>
                                <Select
                                    label="Target Table Column"
                                    required
                                    data={targetTableColumOptions as SelectItem[]}
                                    rightSectionWidth={30}
                                    {...tableJoinForm.getInputProps('data.clauses.0.target_column')}
                                    rightSection={<IoChevronDown className={styles.icon} />}
                                />
                            </Flex>
                            <Flex
                                gap="xs"
                                direction="row"
                                pt="xm"
                            >
                                <Button
                                    disabled={false}
                                    type="reset"
                                    radius="xl"
                                    variant="default"
                                    uppercase
                                >
                                    Reset
                                </Button>
                                <Button
                                    disabled={false}
                                    type="submit"
                                    radius="xl"
                                    variant="light"
                                    uppercase
                                >
                                    Apply
                                </Button>
                            </Flex>
                        </form>
                    </Flex>
                </Paper>
                <div className={styles.joinModalTable}>
                    {isDefined(tableJoinPreviewResult.data?.joinPreview?.result) ? (
                        <PreviewTable
                            tableId={formValues.fromTable}
                            previewData={tableJoinPreviewResult.data?.joinPreview?.result}
                        />
                    ) : (
                        <Center className={styles.text}>
                            <Text fz="md" weight={600}>
                                Apply table join clauses to preview
                            </Text>
                        </Center>
                    )}
                </div>
            </Flex>
            <Group
                position="right"
                pt="xs"
            >
                <Button
                    radius="xl"
                    variant="default"
                    onClick={onClose}
                    uppercase
                >
                    Cancel
                </Button>
                <Button
                    radius="xl"
                    variant="light"
                    uppercase
                    onClick={handleSave}
                >
                    Save
                </Button>
            </Group>
        </Modal>
    );
}
