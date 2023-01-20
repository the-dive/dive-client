import {
    ActionIcon,
    Group,
    Paper,
    Divider,
    Table,
    ScrollArea,
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
        <>
            <Paper
                p="md"
                className={styles.tabView}
            >
                <Group
                    spacing={1}
                    className={styles.tableViewProperties}
                >
                    <ActionIcon
                        color="dark"
                        size="md"
                        variant="transparent"
                    >
                        <MdOutlineTableChart />
                    </ActionIcon>
                    <ActionIcon
                        color="dark"
                        size="md"
                        variant="transparent"
                    >
                        <MdList />
                    </ActionIcon>
                    <ActionIcon
                        color="dark"
                        size="md"
                        variant="transparent"
                    >
                        <MdOutlineGridView />
                    </ActionIcon>
                </Group>
                <Divider orientation="vertical" />
                <Group
                    className={styles.tableStatus}
                >
                    <ActionIcon
                        variant="transparent"
                        className={styles.tableStatusButton}
                    >
                        1
                        <MdOutlineTag />
                    </ActionIcon>
                    <ActionIcon
                        variant="transparent"
                        className={styles.tableStatusButton}
                    >
                        1
                        <MdOutlineCalendarToday />
                    </ActionIcon>
                    <ActionIcon
                        variant="transparent"
                        className={styles.tableStatusButton}
                    >
                        1
                        <MdOutlineLanguage />
                    </ActionIcon>
                    <ActionIcon
                        variant="transparent"
                        className={styles.tableStatusButton}
                    >
                        1
                        <MdOutlineLocationOn />
                    </ActionIcon>
                </Group>
            </Paper>
            <Divider />
            <ScrollArea>
                <Table striped withColumnBorders />
            </ScrollArea>
        </>
    );
}
