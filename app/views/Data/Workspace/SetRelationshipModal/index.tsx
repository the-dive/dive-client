import { useCallback, useMemo } from 'react';
import {
    Button,
    Flex,
    Modal,
    Select,
    SelectItem,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { isDefined, isNotDefined } from '@togglecorp/fujs';
import { IoChevronDown } from 'react-icons/io5';

import { TableType } from '#gql/graphql';

import styles from './styles.module.css';

export interface TableRelationshipFormType {
    fromTable: string;
    toTable: string;
    joinType: 'innerJoin' | 'union';
}

interface Props {
    selectedTableId: string;
    tables: TableType[] | null | undefined;
    onClose: () => void;
    onOpenJoinModal: (values: TableRelationshipFormType) => void;
}

const relationTypes: SelectItem[] = [
    { value: 'innerJoin', label: 'Inner Join' },
];

export default function SetRelationshipModal(props: Props) {
    const {
        selectedTableId,
        tables,
        onClose,
        onOpenJoinModal,
    } = props;

    const tableRelationshipForm = useForm({
        initialValues: {
            fromTable: selectedTableId,
            toTable: null,
            joinType: 'innerJoin',
        },
        validate: {
            fromTable: (value) => (isNotDefined(value) ? 'From table is required' : null),
            toTable: (value) => (isNotDefined(value) ? 'To table is required' : null),
            joinType: (value) => (isNotDefined(value) ? 'Join type is required' : null),
        },
    });

    const selectedTable = useMemo(() => {
        const table = tables?.find((t) => t.id === selectedTableId);
        return table ? [{ value: table.id, label: table.name }] : [];
    }, [selectedTableId, tables]);

    const otherTables = useMemo(() => (
        tables?.filter((table) => table.id !== selectedTableId)
            ?.map((table) => ({ value: table.id, label: table.name })) ?? []
    ), [tables, selectedTableId]);

    const handleFormSubmit = useCallback((values: TableRelationshipFormType) => {
        onOpenJoinModal(values);
    }, [onOpenJoinModal]);

    return (
        <Modal
            opened={isDefined(selectedTableId)}
            onClose={onClose}
            title={(
                <Title order={3}>
                    Set Relationship
                </Title>
            )}
            radius="md"
            size="sm"
            padding="md"
            centered
        >
            <form
                className={styles.form}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onSubmit={tableRelationshipForm.onSubmit(handleFormSubmit)} // TODO: graphql types
                onReset={tableRelationshipForm.onReset}
            >
                <Flex
                    gap="md"
                    direction="column"
                >
                    <Flex
                        gap="md"
                        direction="row"
                    >
                        <Select
                            label="Relation from"
                            readOnly
                            disabled
                            required
                            data={selectedTable}
                            {...tableRelationshipForm.getInputProps('fromTable')}
                        />
                        <Select
                            label="Relation to"
                            placeholder="Select Table"
                            required
                            data={otherTables}
                            rightSection={<IoChevronDown className={styles.icon} />}
                            rightSectionWidth={30}
                            {...tableRelationshipForm.getInputProps('toTable')}
                        />
                    </Flex>
                    <Select
                        label="Relation"
                        data={relationTypes}
                        required
                        rightSection={<IoChevronDown className={styles.icon} />}
                        rightSectionWidth={30}
                        {...tableRelationshipForm.getInputProps('joinType')}
                    />
                </Flex>
                <Flex
                    gap="xl"
                    direction="row"
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
        </Modal>
    );
}
