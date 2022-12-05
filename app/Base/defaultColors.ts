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
        '#eef7ff',
        '#d9edff',
        '#bbe1ff',
        '#8ccfff',
        '#56b2ff',
        '#2f91ff',
        '#1971f7',
        '#115ae4',
        '#1549b8',
        '#184395',
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
