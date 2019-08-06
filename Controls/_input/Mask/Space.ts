export const Spaces = {
    usual: ' ',
    longSpace: '\u2002'
};

export function spaceToLongSpace(value: string): string {
    return value === Spaces.usual ? Spaces.longSpace : value;
}
