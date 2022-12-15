import { useCallback } from 'react';
import {
    ActionIcon,
    Button,
    Collapse,
    Divider,
    Group,
    Paper,
    Select,
    Switch,
    TextInput,
    Title,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import styles from './styles.module.css';

const tableProperties = {
    headerLevelOptions: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
    ],
    timeZoneOptions: [
        { value: 'Nepal Time', label: 'Nepal Time' },
        { value: 'UTC Time', label: 'UTC Time' },
    ],
    languageOptions: [
        { value: 'English', label: 'English' },
        { value: 'Nepali', label: 'Nepali' },
        { value: 'Hindi', label: 'Hindi' },
    ],
};

interface FormValues {
    headerLevel: string;
    timeZone: string;
    trimWhiteSpace: boolean;
    naValues: string;
    language: string;
}

export default function Workspace() {
    const [opened, setOpened] = useToggle([true, false]);

    const tablePropertiesForm = useForm<FormValues>({
        initialValues: {
            headerLevel: '1',
            timeZone: 'Nepal Time',
            trimWhiteSpace: true,
            naValues: 'NA',
            language: 'English',
        },
    });

    const handleButtonClick = useCallback(() => {
        setOpened();
    }, [setOpened]);

    const handleFormSubmit = useCallback((values: FormValues) => {
        console.warn('values', values);
    }, []);

    return (
        <Paper className={styles.workspaceContainer}>
            <Paper className={styles.workspace}>
                Workspace
            </Paper>
            <Divider />
            <Paper className={styles.import}>
                <div className={styles.heading}>
                    <Title order={3}>This is title</Title>
                    <ActionIcon
                        color="dark"
                        size="md"
                        variant="transparent"
                        onClick={handleButtonClick}
                    >
                        {opened ? <IoChevronUp /> : <IoChevronDown />}
                    </ActionIcon>
                </div>
                <Collapse in={opened}>
                    <div className={styles.content}>
                        <Paper className={styles.tablePropertiesContainer}>
                            <Title order={5} color="dimmed" weight="600">Properties</Title>
                            <Divider />
                            <form
                                className={styles.form}
                                onSubmit={tablePropertiesForm.onSubmit(handleFormSubmit)}
                                onReset={tablePropertiesForm.onReset}
                            >
                                <Select
                                    label="Header Levels"
                                    data={tableProperties.headerLevelOptions}
                                    rightSection={<IoChevronDown className={styles.icon} />}
                                    styles={{ rightSection: { pointerEvents: 'none' } }}
                                    {...tablePropertiesForm.getInputProps('headerLevel')}
                                />
                                <Select
                                    label="Time Zone (Optional)"
                                    data={tableProperties.timeZoneOptions}
                                    rightSection={<IoChevronDown className={styles.icon} />}
                                    styles={{ rightSection: { pointerEvents: 'none' } }}
                                    {...tablePropertiesForm.getInputProps('timeZone')}
                                />
                                <Switch
                                    label="Trim White Space"
                                    labelPosition="left"
                                    {...tablePropertiesForm.getInputProps('trimWhiteSpace', { type: 'checkbox' })}
                                />
                                <TextInput
                                    label="Treat These as NA (Optional)"
                                    {...tablePropertiesForm.getInputProps('naValues')}
                                />
                                <Select
                                    label="Language"
                                    rightSection={<IoChevronDown className={styles.icon} />}
                                    rightSectionWidth={30}
                                    styles={{ rightSection: { pointerEvents: 'none' } }}
                                    data={tableProperties.languageOptions}
                                    {...tablePropertiesForm.getInputProps('language')}
                                />
                                <Group position="apart">
                                    <Button type="reset" radius="xl" variant="default">Reset</Button>
                                    <Button type="submit" radius="xl" variant="light">Apply</Button>
                                </Group>
                            </form>
                        </Paper>
                        <Paper className={styles.tableContainer}>
                            Hari
                        </Paper>
                    </div>
                </Collapse>
            </Paper>
        </Paper>
    );
}
