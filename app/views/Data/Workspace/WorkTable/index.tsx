import {
    ActionIcon,
    Group,
    Paper,
} from '@mantine/core';
import {
    MdOutlineTableChart,
    MdList,
    MdOutlineGridView,
    MdOutlineTag,
    MdOutlineLanguage,
    MdOutlineCalendarToday,
    MdOutlineLocationOn,
} from 'react-icons/md';
import styles from './styles.module.css';

export default function WorkTable() {
    return (
        <Paper>
            <Group
                spacing={1}
                className={styles.tableViewProperties}
            >
                <ActionIcon>
                    <MdOutlineTableChart />
                </ActionIcon>
                <ActionIcon>
                    <MdList />
                </ActionIcon>
                <ActionIcon>
                    <MdOutlineGridView />
                </ActionIcon>
            </Group>
            <Group>
                <ActionIcon>
                    <MdOutlineTag />
                </ActionIcon>
                <ActionIcon>
                    <MdOutlineCalendarToday />
                </ActionIcon>
                <ActionIcon>
                    <MdOutlineLanguage />
                </ActionIcon>
                <ActionIcon>
                    <MdOutlineLocationOn />
                </ActionIcon>
            </Group>
        </Paper>
    );
}
