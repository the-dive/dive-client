import {
    Button,
    Flex,
    Group,
    Modal,
    Title,
} from '@mantine/core';
import { isDefined } from '@togglecorp/fujs';

import WorkTable from '../WorkTable';
import JoinModalForm from './JoinModalForm';
import styles from './styles.module.css';

interface Props {
    onClose: () => void;
    joinOpen: boolean;
    tableId: string;
}

export default function JoinModal(props: Props) {
    const {
        joinOpen,
        onClose,
        tableId,
    } = props;

    return (
        <Modal
            opened={isDefined(joinOpen)}
            onClose={onClose}
            title={(
                <Title order={3}>
                    Join
                </Title>
            )}
            radius="md"
            size="80vw"
            padding="md"
            centered
        >
            <Flex
                className={styles.joinModalFlex}
                direction="row"
                gap="md"
            >
                <JoinModalForm
                    className={styles.joinModalForm}
                />
                <WorkTable
                    className={styles.joinModalTable}
                    tableId={tableId}
                />
            </Flex>
            <Group
                position="right"
                p="md"
            >
                <Button
                    radius="xl"
                    variant="default"
                    uppercase
                >
                    Cancel
                </Button>
                <Button
                    radius="xl"
                    variant="light"
                    uppercase
                >
                    Save
                </Button>
            </Group>
        </Modal>
    );
}
