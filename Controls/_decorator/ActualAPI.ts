/**
 * Модуль для совместимости устаревшего и актуального API контролов декораторов.
 * Удалить по https://online.sbis.ru/opendoc.html?guid=d04dc579-2453-495f-b0a7-282370f6a9c5.
 */

import {Logger} from 'UI/Utils';

export function wrapURLsValue(text?: string, value?: string, useLogging: boolean = false): string {
    if (typeof text === 'string') {
        if (useLogging) {
            Logger.warn('Controls.decorator:WrapURLs - опция text устарела, используйте опцию value.');
        }
        return text;
    }

    return value;
}

export function phoneValue(number?: string, value?: string, useLogging: boolean = false): string {
    if (typeof number === 'string') {
        if (useLogging) {
            Logger.warn('Controls.decorator:Phone - опция number устарела, используйте опцию value.');
        }
        return number;
    }

    return value;
}

export function numberValue(number: number, value?: string | number | null, useLogging: boolean = false): string | number | null {
    if (typeof number === 'number') {
        if (useLogging) {
            Logger.warn('Controls.decorator:Number - опция number устарела, используйте опцию value.');
        }
        return number;
    }

    return value;
}

export function moneyUseGrouping(delimiters?: boolean, useGrouping?: boolean, useLogging: boolean = false): boolean {
    if (typeof delimiters === 'boolean') {
        if (useLogging) {
            Logger.warn('Controls.decorator:Money - опция delimiters устарела, используйте опцию useGrouping.');
        }
        return delimiters;
    }

    return useGrouping;
}

export function moneyValue(number: number, value?: string | number | null, useLogging: boolean = false): string | number | null {
    if (typeof number === 'number') {
        if (useLogging) {
            Logger.warn('Controls.decorator:Money - опция number устарела, используйте опцию value.');
        }
        return number;
    }

    return value;
}

export function moneyOptions(options: {title?: string, tooltip?: string}, useLogging: boolean = false): {tooltip?: string} {
    if ('title' in options) {
        Logger.warn('Controls.decorator:Money - опция title устарела, используйте опцию tooltip.');
        return {
            tooltip: options.title
        }
    }
    if ('tooltip' in options) {
        return {
            tooltip: options.tooltip
        }
    }

    return {}
}
