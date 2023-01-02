import { useCallback, useMemo } from 'react';
import {
    Button,
    Divider,
    Group,
    Paper,
    Select,
    Switch,
    TextInput,
    Title,
    LoadingOverlay,
} from '@mantine/core';
import { useMutation } from 'urql';
import { IoChevronDown } from 'react-icons/io5';
import { FormErrors, useForm } from '@mantine/form';
import { isNotDefined, isDefined } from '@togglecorp/fujs';

import { transformToFormError, ObjectError } from '#base/utils/errorTransform';
import { graphql } from '#gql';
import {
    TablePropertiesInputType,
    TablePropertiesOptionsType,
    TablePropertiesType,
    KeyLabelType,
} from '#gql/graphql';

import styles from './styles.module.css';

const updateTablePropertiesMutationDocument = graphql(/* GraphQL */`
    mutation UpdateTableProperties($id: ID!, $data: TablePropertiesInputType!) {
      updateTableProperties(id: $id, data: $data) {
        errors
        ok
        result {
          id
          isAddedToWorkspace
          name
          previewData
          status
          statusDisplay
          properties {
            headerLevel
            language
            timezone
            treatTheseAsNa
            trimWhitespaces
          }
        }
      }
    }
`);

function mapKeyToValue(option?: KeyLabelType | null) {
    return {
        value: option?.key,
        label: option?.label,
    };
}

interface Props {
    tablePropertyOptions: TablePropertiesOptionsType | null | undefined;
    tableId: string;
    tableProperties: TablePropertiesType | null | undefined;
}

export default function TablePropertiesForm(props: Props) {
    const {
        tableId,
        tablePropertyOptions,
        tableProperties,
    } = props;

    const tablePropertiesForm = useForm({
        initialValues: {
            headerLevel: tableProperties?.headerLevel,
            language: tableProperties?.language,
            timezone: tableProperties?.timezone,
            treatTheseAsNa: tableProperties?.treatTheseAsNa,
            trimWhitespaces: tableProperties?.trimWhitespaces,
        },
    });

    const options = useMemo(() => {
        if (tablePropertyOptions) {
            const {
                headerLevels,
                languages,
                timezones,
            } = tablePropertyOptions;

            return {
                headerLevels: headerLevels?.map(mapKeyToValue),
                languages: languages?.map(mapKeyToValue),
                timezones: timezones?.map(mapKeyToValue),
            };
        }
        return undefined;
    }, [tablePropertyOptions]);

    const [
        updateTablePropertiesResult,
        updateTableProperties,
    ] = useMutation(updateTablePropertiesMutationDocument);

    const { data, fetching } = updateTablePropertiesResult;

    const handleFormSubmit = useCallback((values: TablePropertiesInputType) => {
        updateTableProperties({
            id: tableId,
            data: values,
        }).then((res) => {
            if (isNotDefined(res.data) || isNotDefined(res.data?.updateTableProperties)) {
                return;
            }
            const { errors, ok, result } = res.data.updateTableProperties;
            if (errors) {
                const formError = transformToFormError(errors as ObjectError[]);
                if (formError) {
                    tablePropertiesForm.setErrors(formError as FormErrors);
                }
            }
            if (ok && isDefined(result) && isDefined(result.properties)) {
                const {
                    headerLevel,
                    language,
                    timezone,
                    treatTheseAsNa,
                    trimWhitespaces,
                } = result.properties;

                tablePropertiesForm.setValues({
                    headerLevel,
                    language,
                    timezone,
                    treatTheseAsNa,
                    trimWhitespaces,
                });

                tablePropertiesForm.resetTouched();
                tablePropertiesForm.resetDirty();
            }
        });
    }, [updateTableProperties, tableId, tablePropertiesForm]);

    const formIsClean = !tablePropertiesForm.isDirty();

    const handleFormReset = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        if (data?.updateTableProperties?.result?.properties) {
            const {
                headerLevel,
                language,
                timezone,
                treatTheseAsNa,
                trimWhitespaces,
            } = data.updateTableProperties.result.properties;

            tablePropertiesForm.setValues({
                headerLevel,
                language,
                timezone,
                treatTheseAsNa,
                trimWhitespaces,
            });
            tablePropertiesForm.resetTouched();
            tablePropertiesForm.resetDirty();
        } else {
            tablePropertiesForm.onReset(event);
        }
    }, [tablePropertiesForm, data?.updateTableProperties?.result?.properties]);

    return (
        <Paper className={styles.tablePropertiesContainer} radius="md">
            <Title order={5} color="dimmed" weight="600">Properties</Title>
            <Divider />
            <LoadingOverlay visible={fetching} />
            <form
                className={styles.form}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onSubmit={tablePropertiesForm.onSubmit(handleFormSubmit)} // TODO: graphql types
                onReset={handleFormReset}
            >
                <Select
                    label="Header Levels"
                    data={options?.headerLevels}
                    rightSection={<IoChevronDown className={styles.icon} />}
                    styles={{ rightSection: { pointerEvents: 'none' } }}
                    {...tablePropertiesForm.getInputProps('headerLevel')}
                />
                <Select
                    label="Time Zone (Optional)"
                    data={options?.timezones}
                    rightSection={<IoChevronDown className={styles.icon} />}
                    styles={{ rightSection: { pointerEvents: 'none' } }}
                    {...tablePropertiesForm.getInputProps('timezone')}
                />
                <Switch
                    label="Trim White Space"
                    labelPosition="left"
                    {...tablePropertiesForm.getInputProps('trimWhitespaces', { type: 'checkbox' })}
                />
                <TextInput
                    label="Treat These as NA (Optional)"
                    {...tablePropertiesForm.getInputProps('treatTheseAsNa')}
                />
                <Select
                    label="Language"
                    rightSection={<IoChevronDown className={styles.icon} />}
                    rightSectionWidth={30}
                    styles={{ rightSection: { pointerEvents: 'none' } }}
                    data={options?.languages}
                    {...tablePropertiesForm.getInputProps('language')}
                />
                <Group position="apart">
                    <Button
                        disabled={fetching || formIsClean}
                        type="reset"
                        radius="xl"
                        variant="default"
                        uppercase
                    >
                        Reset
                    </Button>
                    <Button
                        disabled={fetching || formIsClean}
                        type="submit"
                        radius="xl"
                        variant="light"
                        uppercase
                    >
                        Apply
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}
