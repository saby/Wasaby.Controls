/**
 * Модуль для совместимости устаревшего и актуального API контролов декораторов.
 * Удалить по https://online.sbis.ru/opendoc.html?guid=d04dc579-2453-495f-b0a7-282370f6a9c5.
 */

import {Logger} from 'UI/Utils'

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
