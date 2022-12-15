import { AppShell, Header, Image } from '@mantine/core';
import { Outlet } from 'react-router-dom';

function ProtectedLayout() {
    return (
        <AppShell
            padding="xs"
            header={<Header height={60} p="xs"><Image height={30} width={100} src="/assets/DiveRegular.svg" /></Header>}
            styles={(theme) => ({
                main: {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    display: 'flex',
                },
            })}
        >
            <Outlet />
        </AppShell>
    );
}

export default ProtectedLayout;
