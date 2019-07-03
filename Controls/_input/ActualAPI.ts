export function inlineHeight(size: string, inlineHeight: string): string {
    if (inlineHeight) {
        return inlineHeight;
    }

    return size;
}

export function fontColorStyle(fontStyle: string, fontColorStyle: string): string {
    if (fontColorStyle) {
        return fontColorStyle;
    }

    return fontStyle;
}

export function fontSize(fontStyle: string, fontSize: string): string {
    if (fontSize) {
        return fontSize;
    }

    switch (fontStyle) {
        case 'primary':
        case 'secondary': return '3xl';
        case 'default':
        default: return 'm';
    }
}

export function validationStatus(style: string, validationStatus: string): string {
    if (validationStatus) {
        return validationStatus;
    }

    switch (style) {
        case 'invalid': return 'invalid';
        case 'info':
        default: return 'valid';
    }
}

export function heightLine(size: string, fontSize: string): string {
    if (fontSize) {
        return fontSize;
    }

    switch (size) {
        case 's': return 's';
        case 'l': return 'l';
        case 'm':
        case 'default':
        default: return 'm';
    }
}
