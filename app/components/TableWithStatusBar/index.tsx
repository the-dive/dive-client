import { useCallback } from 'react';
import {
    ActionIcon,
    Group,
    Paper,
    Table,
    ScrollArea,
    Collapse,
    SegmentedControl,
    Flex,
    Tabs,
    SimpleGrid,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import {
    MdOutlineTableChart,
    MdList,
    MdOutlineGridView,
    MdOutlineTag,
    MdOutlineLanguage,
    MdOutlineCalendarToday,
    MdOutlineLocationOn,
} from 'react-icons/md';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.css';

interface Props {
    className?: string;
    listColumn?: JSX.Element[];
    card?: JSX.Element[];
    listRows?: JSX.Element[];
    columns?: JSX.Element[];
    rows: JSX.Element[];
}

export default function TableWithStatusBar(props: Props) {
    const {
        className,
        listColumn,
        listRows,
        columns,
        rows,
        card,
    } = props;
    const [opened, toggleOpened] = useToggle([true, false]);

    const handleCollapseClick = useCallback(() => {
        toggleOpened();
    }, [toggleOpened]);

    return (
        <Paper
            className={_cs(className)}
        >
            <Paper
                p="md"
                className={styles.tabView}
            >
                <Tabs
                    variant="pills"
                    defaultValue="tableView"
                    className={styles.tab}
                >
                    <Tabs.List>
                        <Tabs.Tab value="tableView" icon={<MdOutlineTableChart size={14} />} />
                        <Tabs.Tab value="listView" icon={<MdList size={14} />} />
                        <Tabs.Tab value="gridView" icon={<MdOutlineGridView size={14} />} />
                        <Group>
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
                            <ActionIcon
                                color="dark"
                                size="md"
                                variant="transparent"
                                onClick={handleCollapseClick}
                            >
                                {opened ? <IoChevronDown /> : <IoChevronUp />}
                            </ActionIcon>
                        </Group>
                    </Tabs.List>
                    <Collapse in={opened}>
                        <Tabs.Panel className={styles.tabPanelWrapper} value="tableView" pt="xs">
                            <Paper className={styles.tabPanel}>
                                <ScrollArea className={styles.scrollArea}>
                                    <Table striped withColumnBorders>
                                        <thead>
                                            <tr>
                                                {columns}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows}
                                        </tbody>
                                    </Table>
                                </ScrollArea>
                            </Paper>
                        </Tabs.Panel>
                        <Tabs.Panel className={styles.tabPanelWrapper} value="listView" pt="xs">
                            <Paper className={styles.tabPanel}>
                                <ScrollArea className={styles.scrollArea}>
                                    <Flex
                                        justify="center"
                                        p="sm"
                                    >
                                        <SegmentedControl
                                            radius="lg"
                                            color="brand"
                                            data={[
                                                { value: 'summary_stats', label: 'Summary stats' },
                                                { value: 'framework_setup', label: 'Framework setup', disabled: true },
                                            ]}
                                        />
                                    </Flex>
                                    <Table striped withColumnBorders>
                                        <thead>
                                            <tr>
                                                {listColumn}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listRows}
                                        </tbody>
                                    </Table>
                                </ScrollArea>
                            </Paper>
                        </Tabs.Panel>
                        <Tabs.Panel className={styles.tabPanelWrapper} value="gridView" pt="xs">
                            <Paper className={styles.tabPanel}>
                                <ScrollArea className={styles.scrollArea}>
                                    <SimpleGrid
                                        breakpoints={[
                                            { minWidth: 'sm', cols: 2 },
                                            { minWidth: 'md', cols: 3 },
                                            { minWidth: 'lg', cols: 4 },
                                        ]}
                                        p="md"
                                        spacing="md"
                                    >
                                        {card}
                                    </SimpleGrid>
                                </ScrollArea>
                            </Paper>
                        </Tabs.Panel>
                    </Collapse>
                </Tabs>
            </Paper>
        </Paper>
    );
}
