import {
    Button,
    Divider,
    Flex,
    Image,
    Paper,
    Select,
    SelectItem,
    Text,
} from '@mantine/core';
import { _cs } from '@togglecorp/fujs';
import { IoChevronDown } from 'react-icons/io5';

import styles from './styles.module.css';

const tableOption: SelectItem[] = [
    { value: 'job', label: 'Job' },
    { value: 'salary', label: 'Salary' },
];

interface Props {
    className: string;
}

export default function JoinModalForm(props: Props) {
    const {
        className,
    } = props;
    return (
        <Paper
            className={_cs(className, styles.joinModalForm)}
            radius="md"
        >
            <Flex
                gap="md"
                direction="column"
            >
                <Text
                    fz="xs"
                    color="dimmed"
                    weight="600"
                >
                    JOIN TYPE
                </Text>
                <Divider />
                <Paper
                    radius="md"
                    p="md"
                >
                    <Flex
                        direction="row"
                        align="center"
                        gap="md"
                    >
                        <Select
                            placeholder={`${tableOption[0].label}`}
                            variant="unstyled"
                            data={tableOption}
                            rightSection={<IoChevronDown className={styles.icon} />}
                        />
                        <Image
                            src="assets/JoinType.svg"
                            caption="Inner Join"
                        />
                        <Select
                            placeholder={`${tableOption[0].label}`}
                            variant="unstyled"
                            data={tableOption}
                            rightSection={<IoChevronDown className={styles.icon} />}
                        />
                    </Flex>
                </Paper>
                <Text
                    fz="xs"
                    color="dimmed"
                    weight="600"
                >
                    JOIN CLAUSES
                </Text>
                <Divider />
                <Flex
                    gap="md"
                    direction="row"
                >
                    <Select
                        label="Sheet 1"
                        placeholder="Select column"
                        data={tableOption}
                        rightSection={<IoChevronDown className={styles.icon} />}
                    />
                    <Text
                        fz="xs"
                        color="dimmed"
                        weight="600"
                        className={styles.joinText}
                    >
                        =
                    </Text>
                    <Select
                        label="Sheet 2"
                        placeholder="Select column"
                        data={tableOption}
                        rightSection={<IoChevronDown className={styles.icon} />}
                    />
                </Flex>
                <Flex
                    gap="xl"
                    direction="row"
                >
                    <Button
                        disabled={false}
                        type="reset"
                        radius="xl"
                        variant="default"
                        uppercase
                    >
                        Reset
                    </Button>
                    <Button
                        disabled={false}
                        type="submit"
                        radius="xl"
                        variant="light"
                        uppercase
                    >
                        Apply
                    </Button>
                </Flex>
            </Flex>
        </Paper>
    );
}
