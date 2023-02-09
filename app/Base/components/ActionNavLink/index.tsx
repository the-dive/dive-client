import { NavLink, NavLinkProps } from 'react-router-dom';
import { _cs } from '@togglecorp/fujs';
import styles from './styles.module.css';

export type Props = Omit<NavLinkProps, 'to'> & {
    route: string;
    children: React.ReactNode;
};

function ActionNavLink(props: Props) {
    const {
        route,
        children,
        state,
        className,
        ...otherProps
    } = props;

    return (
        <NavLink
            {...otherProps}
            to={{
                pathname: route,
            }}
            className={({ isActive }) => _cs(isActive
                ? styles.actionNavLinkActive
                : styles.actionNavLink)}
        >
            {children}
        </NavLink>
    );
}

export default ActionNavLink;
