import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import styles from './styles.module.css';

export default function ErrorPage() {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (
            <div className={styles.errorPage}>
                <h1 className={styles.heading}>Oops!</h1>
                <h2>{error.status}</h2>
                <p>{error.statusText}</p>
                {error.data?.message && <p>{error.data.message}</p>}
            </div>
        );
    }

    return (
        <div className={styles.errorPage}>
            <h1 className={styles.heading}>Oops!</h1>
        </div>
    );
}
