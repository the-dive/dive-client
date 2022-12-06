import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { DEFAULT_COLORS } from './defaultColors';

export const theme: MantineThemeOverride = {
    colorScheme: 'light',
    colors: DEFAULT_COLORS,
    primaryColor: 'brand',
    primaryShade: {
        light: 6,
        dark: 8,
    },
    loader: 'dots',
    cursorType: 'pointer',
    fontFamily: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
    defaultGradient: {
        from: 'brand',
        to: 'cyan',
        deg: 45,
    },
    headings: {
        fontFamily: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
    },
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    return (
        <MantineProvider
            withCSSVariables
            withGlobalStyles
            withNormalizeCSS
            theme={theme}
        >
            {children}
        </MantineProvider>
    );
}
