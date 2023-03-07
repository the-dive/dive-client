import { KeyLabelType } from '#gql/graphql';

// eslint-disable-next-line import/prefer-default-export
export function mapKeyToValue(option: KeyLabelType | null) {
    return {
        value: option?.key,
        label: option?.label,
    };
}
