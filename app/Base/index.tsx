import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '#views/Home';
import Login from '#views/Login';
import Data from '#views/Data';

import RootLayout from './layouts/RootLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import ErrorPage from './components/ErrorPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <ProtectedLayout />,
                children: [
                    { index: true, element: <Home /> },
                    {
                        path: '/data',
                        element: <Data />,
                    },
                ],
            },
            {
                path: '/login',
                element: <Login />,
                errorElement: <ErrorPage />,
            },
        ],
    },
]);

function Base() {
    return (
        <RouterProvider router={router} />
    );
}

export default Base;
