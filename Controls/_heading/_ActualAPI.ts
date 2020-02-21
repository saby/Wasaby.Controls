export function counterSize(size: 's' | 'm' | 'l', fontSize: string): string {
    if (fontSize) {
        return fontSize;
    } else {
        const fontSizesTable = {
            s: 'm',
            m: 'l',
            l: '3xl'
        };
        const result: string = fontSizesTable[size];
        return result || 'l';
    }
}

export function counterStyle(style: 'primary' | 'secondary' | 'disabled', fontColorStyle: string): string {
    if (fontColorStyle) {
        return fontColorStyle;
    } else {
        const fontStylesTable = {
            primary: 'primary',
            secondary: 'secondary',
            disabled: 'unaccented'
        };
        const result: string = fontStylesTable[style];
        return result || 'primary';
    }
}

export function backSize(size?: 's' | 'm' | 'l', fontSize?: string, iconSize?: string): {fontSize: string, iconSize: string} {
    if (fontSize && iconSize) {
        return { fontSize: fontSize, iconSize: iconSize };
    } else {
        return { fontSize: size, iconSize: size };
    }
}
export function backStyleOptions(style: 'primary' | 'secondary' ): {fontColorStyle: string, iconStyle: string} {
    if (style === 'primary') {
        return { fontColorStyle: 'primary', iconStyle: 'secondary' };
    } else {
        return {fontColorStyle: 'secondary', iconStyle: 'primary' };
    }
}

export function backStyle(style?: 'primary' | 'secondary', fontColorStyle?: string, iconStyle?: string ): {fontColorStyle: string, iconStyle: string} {
    if (fontColorStyle && iconStyle) {
        return {fontColorStyle: fontColorStyle, iconStyle: iconStyle};
    } else {
        return backStyleOptions(style);
    }
}
