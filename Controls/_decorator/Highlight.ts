import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_decorator/Highlight/Highlight';
import {descriptor} from 'Types/entity';

/**
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

export type SearchMode = 'word' | 'substring';

export interface IHighlightOptions extends IControlOptions {
    /**
     * @name Controls/_decorator/Highlight#text
     * @cfg {String} The text in which to search.
     */
    text: string;
    /**
     * @name Controls/_decorator/Highlight#highlight
     * @cfg {String} Text to search.
     */
    highlight: string;
    /**
     * @name Controls/_decorator/Highlight#class
     * @cfg {String} Class for highlight.
     */
    class: string;
    /**
     * @name Controls/_decorator/Highlight#searchMode
     * @cfg {Enum}
     * @variant word The search is carried out by words. A word is a set of characters,
     * length not less than 2. Words are separated by whitespace and punctuation.
     * @variant substring The search is carried out by substrings.
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

type Element = IHighlight | IPlain;

export class Highlight extends Control<IHighlightOptions> {
    protected _parsedText: Element[];
    protected _template: TemplateFunction = template;
    protected _theme: string[] = ['Controls/decorator'];

    protected _beforeMount(options: IHighlightOptions): void {
        this._parsedText = _private.parseText(options.text, options.highlight, options.searchMode);
    }

    protected _beforeUpdate(newOptions: IHighlightOptions): void {
        if (
            newOptions.text !== this._options.text ||
            newOptions.highlight !== this._options.highlight ||
            newOptions.searchMode !== this._options.searchMode
        ) {
            this._parsedText = _private.parseText(newOptions.text, newOptions.highlight, newOptions.searchMode);
        }
    }

    private static WORD_SEPARATOR: RegExp = /\s+/g;
    private static MINIMUM_WORD_LENGTH: number = 2;

    private static isEmpty(value: string): boolean {
        return value === '';
    }

    private static isWord(value: string): boolean {
        return value.length >= Highlight.MINIMUM_WORD_LENGTH;
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

var _private = {
    MINIMUM_WORD_LENGTH: 2,

    separatorsRegExp: /\s+/g,

    isSearchByWords: function (searchMode) {
        return searchMode === 'word';
    },

    isWord: function (value) {
        return value.length >= _private.MINIMUM_WORD_LENGTH;
    },

    isNotEmpty: function (value) {
        return value !== '';
    },

    calculateHighlightRegExp: function (highlightedWords, searchMode) {
        var startSeparator = '';
        var endSeparator = '';

        /**
         * The regular expression describes any word from the array.
         */
        var wordsRegExp = highlightedWords.join('|');

        if (_private.isSearchByWords(searchMode)) {
            /**
             * Words must be separated from each other.
             * The beginning of the word is separated by a whitespace character or the start of the line.
             * The end of the word is separated by punctuation marks together with a whitespace character
             * or the end of the line.
             */
            startSeparator = '(?:^|\\s)["(\']*';
            endSeparator = '[,.;!?:")\']*(?:\\s|$)';
        }

        /**
         * Add the beginning and end separated.
         * Define substrings:
         * $1 - start separator.
         * $2 - search value for highlight.
         * $3 - end separator.
         */
        var regExp = '(' + startSeparator + ')(' + wordsRegExp + ')(' + endSeparator + ')';

        /**
         * Set global search case-insensitive.
         */
        regExp = new RegExp(regExp, 'ig');

        return regExp;
    },

    iterator: function (regExp, value) {
        var obj = {
            value: value,
            hasFinished: false
        };

        obj.next = function () {
            obj.lastIndex = regExp.lastIndex;

            var resultSearch = regExp.exec(value);

            obj.hasFinished = !resultSearch;

            if (obj.hasFinished) {
                obj.highlight = '';
                obj.index = value.length;
            } else {
                var highlight = resultSearch[2];
                var startSeparator = resultSearch[1];
                var endSeparator = resultSearch[3];

                obj.highlight = highlight;
                regExp.lastIndex -= endSeparator.length;
                obj.index = resultSearch.index + startSeparator.length;
            }

            return obj;
        };

        return obj;
    },

    addText: function (target, iterator) {
        if (iterator.lastIndex !== iterator.index) {
            target.push({
                type: 'text',
                value: iterator.value.substring(iterator.lastIndex, iterator.index)
            });
        }
    },

    addHighlight: function (target, iterator) {
        target.push({
            type: 'highlight',
            value: iterator.highlight
        });
    },

    uniteToSet: function (value) {
        return value.reduce(function (result, current) {
            var lastItem = result[result.length - 1];

            switch (lastItem.type) {
                case 'highlight':
                    if (current.type === 'highlight' || /^\s+$/.test(current.value)) {
                        lastItem.value += current.value;
                    } else {
                        result.push(current);
                    }
                    break;
                case 'text':
                    result.push(current);
                    break;
                default:
                    break;
            }

            return result;
        }, [value.shift()]);
    },

    parseText: function (text, highlight, searchMode) {
        var highlightedWords =
            RegExpUtil.escapeSpecialChars(highlight)
                .split(_private.separatorsRegExp)
                .filter(_private.isNotEmpty);

        if (_private.isSearchByWords(searchMode)) {
            highlightedWords = highlightedWords.filter(_private.isWord);
        }

        if (highlightedWords.length === 0) {
            Env.IoC.resolve('ILogger').warn('Controls/_decorator/Highlight', 'When searching there is a problem, there are no words in the highlight option. Perhaps the control is not used for its intended purpose or is not required now.');

            return [{
                type: 'text',
                value: text
            }];
        }

        var highlightRegExp = _private.calculateHighlightRegExp(highlightedWords, searchMode);

        var parsedText = [];
        var iterator = _private.iterator(highlightRegExp, text).next();

        while (!iterator.hasFinished) {
            _private.addText(parsedText, iterator);
            _private.addHighlight(parsedText, iterator);
            iterator.next();
        }

        _private.addText(parsedText, iterator);

        parsedText = _private.uniteToSet(parsedText);

        return parsedText;
    }
};
