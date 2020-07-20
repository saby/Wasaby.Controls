import {Logger} from 'UI/Utils';
import {constants} from 'Env/Env';

export function inlineHeight(size: string, inlineHeight: string): string {
    if (size) {
        if (constants.isBrowserPlatform) {
            // TODO: будет удалено в версию после 5100
            Logger.error('Controls.input: Используется устаревшая опция size. ' +
                `нужно использовать inlineHeight=${size}" ` +
                'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
        }
        return size;
    }
    if (inlineHeight) {
        return inlineHeight;
    }
}

export function fontColorStyle(fontStyle: string, fontColorStyle: string): string {
    if (fontStyle) {
        if (constants.isBrowserPlatform) {
            // TODO: будет удалено в версию после 5100
            Logger.error('Controls.input: Используется устаревшая опция fontStyle. ' +
                `нужно использовать fontColorStyle=${fontStyle}" ` +
                'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
        }
        return fontStyle;
    }
    if (fontColorStyle) {
        return fontColorStyle;
    }
}

export function fontSize(fontStyle: string, fontSize: string): string {
    if (fontStyle) {
        let result;
        if (fontStyle === 'primary' || fontStyle === 'secondary') {
            result = '3xl';
        }
        if (constants.isBrowserPlatform) {
            // TODO: будет удалено в версию после 5100
            Logger.error('Controls.input: Используется устаревшая опция fontStyle. ' +
                `нужно использовать fontSize=${result}" ` +
                'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
        }
        return result || 'm';
    }
    if (fontSize) {
        return fontSize;
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
    if (size) {
        let result;
        switch (size) {
            case 's':
                result = 's';
                break;
            case 'l':
                result = 'l';
                break;
        }
        if (constants.isBrowserPlatform) {
            // TODO: будет удалено в версию после 5100
            Logger.error('Controls.input: Используется устаревшая опция size. ' +
                `нужно использовать fontSize=${result}" ` +
                'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
        }
        return result || 'm';
    }
    if (fontSize) {
        return fontSize;
    }
}
