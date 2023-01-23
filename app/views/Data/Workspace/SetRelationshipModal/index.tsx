import { useCallback, useEffect, useMemo } from 'react';
import {
    Button,
    Flex,
    Modal,
    Select,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { isDefined } from '@togglecorp/fujs';
import { IoChevronDown } from 'react-icons/io5';
import { TableType } from '#gql/graphql';

import styles from './styles.module.css';

interface TableRelationshipFormType {
    fromTable: string | undefined;
    toTable: string | undefined;
}

interface Props {
    selectedTableId: string | undefined;
    tables?: TableType[] | undefined | null;
    onClose: () => void;
}

export default function SetRelationshipModal(props: Props) {
    const {
        selectedTableId,
        tables,
        onClose,
    } = props;

    const tableRelationshipForm = useForm<TableRelationshipFormType>({
        initialValues: {
            fromTable: undefined,
            toTable: undefined,
        },
    });

    const { setFieldValue } = tableRelationshipForm;

    useEffect(() => {
        if (selectedTableId) {
            setFieldValue('fromTable', selectedTableId);
        }
    }, [selectedTableId, setFieldValue]);

    const selectedTable = useMemo(() => {
        const table = tables?.find((t) => t.id === selectedTableId);
        return table ? [{ value: table.id, label: table.name }] : [];
    }, [selectedTableId, tables]);

    const otherTables = useMemo(() => (
        tables?.filter((table) => table.id !== selectedTableId)
            ?.map((table) => ({ value: table.id, label: table.name })) ?? []
    ), [tables, selectedTableId]);

    const handleFormSubmit = useCallback((values: any) => { // TODO use proper types
        console.warn('values', values);
    }, []);

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
            >
                <Flex
                    gap="md"
                >
                    <Select
                        readOnly
                        disabled
                        data={selectedTable}
                        {...tableRelationshipForm.getInputProps('fromTable')}
                    />
                    <Select
                        data={otherTables}
                        rightSection={<IoChevronDown className={styles.icon} />}
                        rightSectionWidth={30}
                        {...tableRelationshipForm.getInputProps('toTable')}
                    />
                </Flex>
                <Button
                    disabled={false}
                    type="submit"
                    radius="xl"
                    variant="light"
                    uppercase
                >
                    Apply
                </Button>
            </form>
        </Modal>
    );
}
