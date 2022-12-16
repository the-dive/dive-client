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
    Table,
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

const data = [
    { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
];

interface FormValues {
    headerLevel: string;
    timeZone: string;
    trimWhiteSpace: boolean;
    naValues: string;
    language: string;
}

export default function Workspace() {
    const [opened, toggleOpened] = useToggle([true, false]);

    const tablePropertiesForm = useForm<FormValues>({
        initialValues: {
            headerLevel: '1',
            timeZone: 'Nepal Time',
            trimWhiteSpace: true,
            naValues: 'NA',
            language: 'English',
        },
    });

    const handleCollapseClick = useCallback(() => {
        toggleOpened();
    }, [toggleOpened]);

    const handleFormSubmit = useCallback((values: FormValues) => {
        console.warn('values', values);
    }, []);

    const rows = data.map((element) => (
        <tr key={element.name}>
            <td>{element.position}</td>
            <td>{element.name}</td>
            <td>{element.symbol}</td>
            <td>{element.mass}</td>
        </tr>
    ));

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
                        onClick={handleCollapseClick}
                    >
                        {opened ? <IoChevronUp /> : <IoChevronDown />}
                    </ActionIcon>
                </div>
                <Collapse in={opened} className={styles.collapse}>
                    <div className={styles.content}>
                        <Paper className={styles.tablePropertiesContainer} radius="md">
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
                                    <Button type="reset" radius="xl" variant="default" uppercase>Reset</Button>
                                    <Button type="submit" radius="xl" variant="light" uppercase>Apply</Button>
                                </Group>
                            </form>
                        </Paper>
                        <Paper className={styles.tableContainer} radius="md" withBorder>
                            <Table striped withColumnBorders>
                                <thead>
                                    <tr>
                                        <th>Element position</th>
                                        <th>Element name</th>
                                        <th>Symbol</th>
                                        <th>Atomic mass</th>
                                    </tr>
                                </thead>
                                <tbody>{rows}</tbody>
                            </Table>
                        </Paper>
                    </div>
                    <Group position="right" className={styles.importActions}>
                        <Button type="reset" radius="xl" variant="default" uppercase>Cancel</Button>
                        <Button type="submit" radius="xl" variant="light" uppercase>Import</Button>
                    </Group>
                </Collapse>
            </Paper>
        </Paper>
    );
}
