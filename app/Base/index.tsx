import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
    cacheExchange,
    createClient,
    dedupExchange,
    Provider,
} from 'urql';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { devtoolsExchange } from '@urql/devtools';

import Home from '#views/Home';
import Login from '#views/Login';
import Data from '#views/Data';

import RootLayout from './layouts/RootLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import ErrorPage from './components/ErrorPage';
import ThemeProvider from './ThemeProvider';

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

const client = createClient({
    url: import.meta.env.VITE_GRAPHQL_API_ENDPOINT,
    exchanges: [devtoolsExchange, dedupExchange, cacheExchange, multipartFetchExchange],
});

function Base() {
    return (
        <ThemeProvider>
            <Provider value={client}>
                <RouterProvider router={router} />
            </Provider>
        </ThemeProvider>
    );
}

export default Base;
