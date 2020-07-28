import {Logger} from 'UI/Utils';
import {constants} from 'Env/Env';

export function inlineHeight(size: string, inlineHeight: string, msg: boolean = true): string {
    if (size) {
        if (constants.isBrowserPlatform && msg) {
            Logger.error('Используется устаревшая опция size. ' +
                `нужно использовать inlineHeight="${size}" ` +
                'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
        }
        return size;
    }
    if (inlineHeight) {
        return inlineHeight;
    }
}

export function fontColorStyle(fontStyle: string, fontColorStyle: string, msg: boolean = true): string {
    if (fontStyle) {
        if (constants.isBrowserPlatform && msg) {
            Logger.error('Используется устаревшая опция fontStyle. ' +
                `нужно использовать fontColorStyle="${fontStyle}" ` +
                'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
        }
        return fontStyle;
    }
    if (fontColorStyle) {
        return fontColorStyle;
    }
}

export function fontSize(fontStyle: string, fontSize: string, msg: boolean = true): string {
    if (fontStyle) {
        let result;
        if (fontStyle === 'primary' || fontStyle === 'secondary') {
            result = '3xl';
        }
        if (constants.isBrowserPlatform && msg) {
            Logger.error('Используется устаревшая опция fontStyle. ' +
                `нужно использовать fontSize="${result}" ` +
                'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
        }
        return result || 'm';
    }
    if (fontSize) {
        return fontSize;
    }
}

export function generateStates(self: object, options: object): void {
    self._inlineHeight = inlineHeight(options.size, options.inlineHeight, false);
    self._fontColorStyle = inlineHeight(options.fontStyle, options.fontColorStyle, false);
    self._fontSize = inlineHeight(options.fontStyle, options.fontSize, false);
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
