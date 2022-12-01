import { AppShell, Header } from '@mantine/core';
import { Outlet } from 'react-router-dom';

function ProtectedLayout() {
    return (
        <AppShell
            padding="md"
            header={<Header height={60} p="xs">{/* Header content */}</Header>}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <Outlet />
        </AppShell>
    );
}

export default ProtectedLayout;
