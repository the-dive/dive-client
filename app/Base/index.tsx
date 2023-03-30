import { useEffect } from 'react';
import {
    RouterProvider,
    createBrowserRouter,
    createRoutesFromChildren,
    matchRoutes,
    useLocation,
    useNavigationType,
} from 'react-router-dom';
import {
    cacheExchange,
    createClient,
    dedupExchange,
    Provider,
} from 'urql';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import Home from '#views/Home';
import Login from '#views/Login';
import Data from '#views/Data';

import RootLayout from './layouts/RootLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import ErrorPage from './components/ErrorPage';
import ThemeProvider from './ThemeProvider';

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    debug: import.meta.env.VITE_SENTRY_DEBUG === 'true',
    release: `${import.meta.env.VITE_APP_NAME}@${import.meta.env.VITE_APP_VERSION}`,
    environment: import.meta.env.MODE,
    integrations: [new BrowserTracing({
        tracePropagationTargets: ['localhost', import.meta.env.VITE_GRAPHQL_API_ENDPOINT],
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
        ),
    })],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE),
});

const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(
    createBrowserRouter,
);

const router = sentryCreateBrowserRouter([
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
    exchanges: [dedupExchange, cacheExchange, multipartFetchExchange],
});

function Base() {
    return (
        <Sentry.ErrorBoundary fallback={ErrorPage} showDialog>
            <ThemeProvider>
                <Provider value={client}>
                    <RouterProvider router={router} />
                </Provider>
            </ThemeProvider>
        </Sentry.ErrorBoundary>
    );
}

export default Base;
