import { NavLink, Outlet } from 'react-router-dom';
import { _cs } from '@togglecorp/fujs';
import {
    Text,
    Center,
    Container,
    AppShell,
    Header,
    Image,
} from '@mantine/core';
import {
    MdOutlineDns,
    MdOutlineHome,
} from 'react-icons/md';
import styles from './styles.module.css';

function ProtectedLayout() {
    const getNavLinkClassName = ({ isActive }: { isActive: boolean }) => {
        if (isActive) {
            return _cs(styles.navLink, styles.active);
        }
        return styles.navLink;
    };

    return (
        <AppShell
            padding="xs"
            header={(
                <Header height={60} className={styles.header}>
                    <Container fluid className={styles.container} px="0">
                        <div
                            className={styles.logoContainer}
                        >
                            <Image height={30} width={100} src="/assets/DiveRegular.svg" alt="Dive" fit="contain" />
                        </div>
                        <div className={styles.links}>
                            <NavLink
                                to="/"
                                className={getNavLinkClassName}
                            >
                                <Center inline>
                                    <MdOutlineHome size="1.2rem" />
                                    <Text fz="md" transform="uppercase" weight={600}>
                                        Home
                                    </Text>
                                </Center>
                            </NavLink>
                            <NavLink
                                to="/data"
                                className={getNavLinkClassName}
                            >
                                <Center inline>
                                    <MdOutlineDns size="1.2rem" />
                                    <Text fz="md" transform="uppercase" weight={600}>
                                        Data
                                    </Text>
                                </Center>
                            </NavLink>
                        </div>
                    </Container>
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
