import { Tuple } from '@mantine/core';

export const DEFAULT_COLORS = {
    grey: [
        '#f7f7f7',
        '#e3e3e3',
        '#c8c8c8',
        '#a4a4a4',
        '#818181',
        '#666666',
        '#515151',
        '#434343',
        '#383838',
        '#171717',
    ],
    brand: [
        '#E0E9FA',
        '#C6D7F6',
        '#8DAEED',
        '#4F83E3',
        '#215ECF',
        '#184395',
        '#133677',
        '#0E2858',
        '#0A1C3E',
        '#050E1F',
    ],
    green: [
        '#f0fdf5',
        '#dcfce9',
        '#bbf7d3',
        '#86efb0',
        '#4ade85',
        '#22c563',
        '#16a34e',
        '#15803f',
        '#166535',
        '#14532d',
    ],
    red: [
        '#fef2f2',
        '#fee2e2',
        '#fecaca',
        '#fca5a5',
        '#f87171',
        '#ef4444',
        '#dc2626',
        '#b91c1c',
        '#991b1b',
        '#7f1d1d',
    ],
} as Record<string, Tuple<string, 10>>;

export default DEFAULT_COLORS;
