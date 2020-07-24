import {IBackOptions} from './Back';
import {Logger} from 'UI/Utils';
import {constants} from 'Env/Env';

export function titleSize(size: 's' | 'm' | 'l' | 'xl', fontSize: string): string {
    if (size) {
        const fontSizesTable = {
            s: 'm',
            m: 'l',
            l: '3xl',
            xl: '4xl'
        };
        if (constants.isBrowserPlatform) {
            Logger.error('Controls.heading.Title: Используется устаревшая опция size, ' +
                `нужно использовать fontSize="${fontSizesTable[size]}". ` +
                'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
        }
        return fontSizesTable[size];
    } else {
        return fontSize;
    }
}

export function titleStyle(style: 'primary' | 'secondary' | 'info', fontColorStyle: string): string {
    if (style) {
        const fontStylesTable = {
            info: 'label',
            primary: 'primary',
            secondary: 'secondary'
        };
        if (constants.isBrowserPlatform) {
            Logger.error('Controls.heading.Title: Используется устаревшая опция style, ' +
                `нужно использовать fontColorStyle="${fontStylesTable[style]}" ` +
                'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
        }
        return fontStylesTable[style];
    } else {
        return fontColorStyle;
    }
}

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
        if (constants.isBrowserPlatform) {
            Logger.error('Controls.heading.Back: Используется устаревшая опция size, ' +
                `нужно использовать fontSize="${result}" ` +
                'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
        }
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
        if (constants.isBrowserPlatform) {
            Logger.error('Controls.heading.Counter: Используется устаревшая опция style, ' +
                `нужно использовать fontColorStyle="${result}" ` +
                'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
        }
        return result || 'primary';
    }
}

export function backSizeOptions(size: string): string {
    const fontSizesTable = {
        s: 'l',
        m: '3xl',
        l: '4xl'
    };
    const result: string = fontSizesTable[size];
    return result || '3xl';
}

export function backSize(options: IBackOptions): { fontSize: string, iconSize: string } {
    const result = backSizeOptions(options.size);
    if (options.size !== undefined && constants.isBrowserPlatform) {
        Logger.error('Controls.heading.Back: Используется устаревшая опция size. ' +
            `нужно использовать fontSize="${result} и iconSize=${options.size}" ` +
            'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
    }
    return {
        fontSize: options.fontSize || result,
        iconSize: options.iconSize || options.size
    };
}

export function backStyleOptions(style: 'primary' | 'secondary'): { fontColorStyle: string, iconStyle: string } {
    if (style === 'secondary') {
        return {
            fontColorStyle: 'secondary', iconStyle: 'primary'
        };
    } else {
        return {
            fontColorStyle: 'primary', iconStyle: 'secondary'
        };
    }
}

export function backStyle(options: IBackOptions): { fontColorStyle: string, iconStyle: string } {
    const result = backStyleOptions(options.style);
    if (options.style !== undefined && constants.isBrowserPlatform) {
        Logger.error('Controls.heading.Back: Используется устаревшая опция style. ' +
            `нужно использовать fontColorStyle="${result.fontColorStyle} и iconStyle=${result.iconStyle}" ` +
            'https://online.sbis.ru/news/1e959ad8-7553-4e56-8627-b08d80305422.');
    }
    return {
        fontColorStyle: options.fontColorStyle || result.fontColorStyle || 'primary',
        iconStyle: options.iconStyle || result.iconStyle || 'secondary'
    };
}
