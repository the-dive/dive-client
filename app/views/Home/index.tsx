import {
    Paper,
    Text,
} from '@mantine/core';
import styles from './styles.module.css';

function Home() {
    return (
        <div className={styles.home}>
            <Paper
                shadow="xs"
                p="md"
                className={styles.homeContent}
            >
                <Text
                    align="center"
                    fw={700}
                >
                    Welcome to DIVE!
                </Text>
                <Text
                    align="center"
                    fw={500}
                >
                    It is still under active develpment.
                    You can however, visit the data page and play
                    around with importing and joining datasets.
                </Text>
            </Paper>

        </div>
    );
}

export default Home;
