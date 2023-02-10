import {
    ActionIcon,
    AppShell,
    Divider,
    Flex,
    Header,
    Image,
} from '@mantine/core';
import {
    MdOutlineDns,
    MdOutlineHome,
} from 'react-icons/md';
import { Outlet } from 'react-router-dom';
import ActionNavLink from '#base/components/ActionNavLink';
import styles from './styles.module.css';

function ProtectedLayout() {
    return (
        <AppShell
            padding="xs"
            header={(
                <Header height={60} p="xs">
                    <Flex
                        gap="lg"
                    >
                        <Image height={30} width={100} src="/assets/DiveRegular.svg" alt="Dive" />
                        <Flex justify="center" align="center" gap="xl" className={styles.navButton}>
                            <ActionNavLink
                                route="/"
                            >
                                <ActionIcon className={styles.actionIcon}>
                                    <Flex align="center" gap="xs">
                                        <MdOutlineHome size={20} />
                                        HOME
                                    </Flex>
                                </ActionIcon>
                            </ActionNavLink>
                            <Divider orientation="vertical" />
                            <ActionNavLink
                                route="/data"
                            >
                                <ActionIcon className={styles.actionIcon}>
                                    <Flex align="center" gap="xs">
                                        <MdOutlineDns size={20} />
                                        DATA
                                    </Flex>
                                </ActionIcon>
                            </ActionNavLink>
                        </Flex>
                    </Flex>
                </Header>
            )}
            styles={(theme) => ({
                main: {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    display: 'flex',
                    overflow: 'auto',
                },
            })}
        >
            <Outlet />
        </AppShell>
    );
}

export default ProtectedLayout;
