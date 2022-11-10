import { _cs } from '@togglecorp/fujs';
import styles from './styles.module.css';

interface Props {
    className?: string;
}

function Login(props: Props) {
    const { className } = props;
    return (
        <div className={_cs(styles.login, className)}>Login</div>
    );
}

export default Login;
