import {descriptor} from 'Types/entity';
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as RegExpUtil from 'Controls/Utils/RegExp';
import * as template from 'wml!Controls/_decorator/Highlight/Highlight';
import {Logger} from 'UI/Utils';

/*
 * Highlighting the searched phrase.
 *
 * @class Controls/_decorator/Highlight
 * @extends UI/_base/Control
 *
 * @public
 * @demo Controls-demo/Decorator/Highlight
 *
 * @author Красильников А.С.
 */
/**
 * Контрол выполняет поиск сопоставления между {@link text текстом} и {@link highlight искомой фразой}.
 *
 * @class Controls/_decorator/Highlight
 * @extends UI/_base/Control
 *
 * @public
 * @demo Controls-demo/Decorator/Highlight
 *
 * @author Красильников А.С.
 */

export type SearchMode = 'word' | 'substring';

export interface IHighlightOptions extends IControlOptions {
    /*
     * @name Controls/_decorator/Highlight#text
     * @cfg {String} The text in which to search.
     */
    /**
     * @name Controls/_decorator/Highlight#text
     * @cfg {String} Текст в котором выполняется поиск.
     */
    text: string;
    /*
     * @name Controls/_decorator/Highlight#highlight
     * @cfg {String} Text to search.
     */
    /**
     * @name Controls/_decorator/Highlight#highlight
     * @cfg {String} Текст для поиска.
     */
    highlight: string;
    /*
     * @name Controls/_decorator/Highlight#class
     * @cfg {String} Class for highlight.
     */
    /**
     * @name Controls/_decorator/Highlight#class
     * @cfg {String} Класс подсвечивающий результат поиска.
     */
    class: string;
    /*
     * @name Controls/_decorator/Highlight#searchMode
     * @cfg {Enum}
     * @variant word The search is carried out by words. A word is a set of characters,
     * length not less than 2. Words are separated by whitespace and punctuation.
     * @variant substring The search is carried out by substrings.
     */
    /**
     * @name Controls/_decorator/Highlight#searchMode
     * @cfg {Enum}
     * @variant word Поиск осуществляется по словам.
     * Слово - это набор символов,  длина не менее 2. Слова разделяются пробелом и пунктуацией.
     * @variant substring Поиск осуществляется по подстрокам.
     */
    searchMode: SearchMode;
}

interface IHighlight {
    type: 'highlight';
    value: string;
}

interface IPlain {
    type: 'plain';
    value: string;
}

interface ISearchResult {
    index: number;
    value: string;
}

type SearchBy = 'and' | 'or';
type Element = IHighlight | IPlain;

export class Highlight extends Control<IHighlightOptions> {
    protected _parsedText: Element[];
    protected _template: TemplateFunction = template;
    protected _theme: string[] = ['Controls/decorator'];

    private _parseText(text: string, highlight: string, searchMode: SearchMode): Element[] {
        /**
         * Подсвечиваемый текст нужно ограничить, потому что в дальнейшем он будет преобразован в регулярное выражение, которое
         * имеет ограничение длины. При превышении длины регулярное выражение будет считаться невалидным, и с ним невозможно будет работать.
         * Возьмем максимум 10000 символов. Этого точно должно хватить для покрытия всех адекватных сценариев.
         */
        const maxLength: number = 10000;
        const limitHighlight: string = highlight.length > maxLength ? highlight.substring(0, maxLength) : highlight;
        const escapedHighlight: string = RegExpUtil.escapeSpecialChars(limitHighlight);
        const searchResultByAnd: Element[] = this._searchBy(text, escapedHighlight, searchMode, 'and');

        if (searchResultByAnd.length) {
            return searchResultByAnd;
        }

        return this._searchBy(text, escapedHighlight, searchMode, 'or');
    }

    private _prepareParsedText(options: IHighlightOptions): Element[] {
        if (options.highlight) {
            return this._parseText(options.text, options.highlight, options.searchMode);
        } else {
            return [{
                type: 'plain',
                value: options.text
            }];
        }
    }

    private _searchBy(text: string, highlight: string, searchMode: SearchMode, by: SearchBy): Element[] {
        let words: string[];
        switch (by) {
            case 'and':
                words = [highlight];
                break;
            case 'or':
                words = highlight.split(Highlight.WORD_SEPARATOR);

                if (searchMode === 'word') {
                    words = words.filter(Highlight._isWord);
                }
                break;
            default:
                Logger.error(this._moduleName + ': ' + `"${by}" search is not supported.`, this);
                words = [highlight];
                break;
        }

        words = words.filter(Highlight._isNotEmpty);

        if (words.length === 0) {
            Logger.warn(this._moduleName + ': When searching there is a problem, there are no ' +
                'words in the highlight option. Perhaps the control is not used for its intended purpose or ' +
                'is not required now.', this);
        }

        const regexp: RegExp = this._calculateRegExp(words, searchMode);
        const highlightSearchResult: ISearchResult[] = Highlight._search(text, regexp);

        if (highlightSearchResult.length === 0) {
            if (by === 'or') {
                return [{
                    type: 'plain',
                    value: text
                }];
            }

            return [];
        }

        return Highlight._split(text, highlightSearchResult);
    }

    private _calculateRegExp(valueArr: string[], searchMode: SearchMode): RegExp {
        const flags: string = 'gi';
        const value: string = valueArr.join('|');

        switch (searchMode) {
            case 'word':
                return new RegExp(`\\b${value}\\b`, flags);
            case 'substring':
                return new RegExp(`${value}`, flags);
            default:
                Logger.error(this._moduleName + `: Unsupported search mode: ${searchMode}.`, this);
                return new RegExp(`${value}`, flags);
        }
    }

    protected _beforeMount(options: IHighlightOptions): void {
        this._parsedText = this._prepareParsedText(options);
    }

    protected _beforeUpdate(newOptions: IHighlightOptions): void {
        if (
            newOptions.text !== this._options.text ||
            newOptions.highlight !== this._options.highlight ||
            newOptions.searchMode !== this._options.searchMode
        ) {
            this._parsedText = this._prepareParsedText(newOptions);
        }
    }

    private static WORD_SEPARATOR: RegExp = /\s+/g;
    private static MINIMUM_WORD_LENGTH: number = 2;

    private static _isNotEmpty(value: string): boolean {
        return value !== '';
    }

    private static _isWord(value: string): boolean {
        return value.length >= Highlight.MINIMUM_WORD_LENGTH;
    }

    private static _search(text: string, regexp: RegExp): ISearchResult[] {
        let iterations: number = 1e4;
        const searchResult: ISearchResult[] = [];
        let found: RegExpExecArray | null = regexp.exec(text);

        while (found && iterations >= 1) {
            searchResult.push({
                value: found[0],
                index: found.index
            });

            found = regexp.exec(text);
            iterations--;
        }

        return searchResult;
    }

    private static _split(text: string, found: ISearchResult[]): Element[] {
        const result: Element[] = [];
        const foundLength: number = found.length;

        if (foundLength === 0) {
            result.push({
                type: 'plain',
                value: text
            });

            return result;
        }

        let index: number = 0;
        for (let i = 0; i < foundLength; i++) {
            const highlight = found[i];
            const plainValue: string = text.substring(index, highlight.index);

            if (plainValue) {
                result.push({
                    type: 'plain',
                    value: plainValue
                });
            }

            result.push({
                type: 'highlight',
                value: highlight.value
            });

            index = highlight.index + highlight.value.length;
        }

        if (index !== text.length) {
            result.push({
                type: 'plain',
                value: text.substring(index)
            });
        }

        return result;
    }

    static getDefaultOptions() {
        return {
            searchMode: 'substring',
            class: 'controls-Highlight_highlight'
        };
    }

    static getOptionTypes() {
        return {
            class: descriptor(String),
            searchMode: descriptor(String).oneOf([
                'word',
                'substring'
            ]),
            text: descriptor(String).required(),
            highlight: descriptor(String).required()
        };
    }
}
