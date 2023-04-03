import { useCallback, useState } from 'react';
import {
    ActionIcon,
    Paper,
    Table,
    ScrollArea,
    Collapse,
    Tabs,
    Text,
    SimpleGrid,
    Group,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import {
    MdOutlineTableChart,
    MdList,
    MdOutlineGridView,
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
    const [activeTab, setActiveTab] = useState<string | null>('tableView');

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
                    value={activeTab}
                    onTabChange={setActiveTab}
                    className={styles.tab}
                >
                    <Tabs.List
                        className={styles.tabList}
                    >
                        <Group>
                            <Tabs.Tab value="tableView" icon={<MdOutlineTableChart size={14} />} />
                            <Tabs.Tab value="listView" icon={<MdList size={14} />} />
                            <Tabs.Tab value="gridView" icon={<MdOutlineGridView size={14} />} />
                        </Group>
                        {/* NOTE: Add these component after implementation of columns type count
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
                        </Group> */}
                        {activeTab === 'listView' && (
                            <Tabs>
                                <Tabs.List defaultValue="first">
                                    <Tabs.Tab value="first">Summary Stats</Tabs.Tab>
                                    <Tabs.Tab disabled value="second">Framework Setup</Tabs.Tab>
                                </Tabs.List>
                            </Tabs>
                        )}
                        <Group>
                            <Text className={styles.stats}>
                                {`${columns?.length} columns, ${rows?.length} rows`}
                            </Text>
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
                                        <thead className={styles.tableHeading}>
                                            <tr>
                                                <th />
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
