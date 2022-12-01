import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Center, Title, Text } from '@mantine/core';

import styles from './styles.module.css';

export default function ErrorPage() {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (
            <Center className={styles.errorPage}>
                <Title order={1}>Oops!</Title>
                <Title order={2}>{error.status}</Title>
                <Text fz="md">{error.statusText}</Text>
                {error.data?.message && <Text fz="md">{error.data.message}</Text>}
            </Center>
        );
    }

    return (
        <Center className={styles.errorPage}>
            <Title order={1}>Oops!</Title>
        </Center>
    );
}
