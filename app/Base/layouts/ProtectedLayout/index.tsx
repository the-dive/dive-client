import { AppShell, Header } from '@mantine/core';
import { Outlet } from 'react-router-dom';

function ProtectedLayout() {
    return (
        <AppShell
            padding={0}
            header={<Header height={60} p="xs">{/* Header content */}</Header>}
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
