define('Controls/Decorator/Highlight',
   [
      'Core/IoC',
      'Core/Control',
      'Controls/Utils/RegExp',
      'WS.Data/Type/descriptor',
      'wml!Controls/Decorator/Highlight/Highlight',

      'css!theme?Controls/Decorator/Highlight/Highlight'
   ],
   function(IoC, Control, RegExpUtil, descriptor, template) {
      'use strict';

      /**
       * Highlighting the searched phrase.
       *
       * @class Controls/Decorator/Highlight
       * @extends Core/Control
       * @control
       * @public
       *
       * @author Журавлев М.С.
       */

      /**
       * @name Controls/Decorator/Highlight#text
       * @cfg {String} The text in which to search.
       */

      /**
       * @name Controls/Decorator/Highlight#highlight
       * @cfg {String} Text to search.
       */

      /**
       * @name Controls/Decorator/Highlight#class
       * @cfg {String} Class for highlight.
       */

      /**
       * @name Controls/Decorator/Highlight#searchMode
       * @cfg {String}
       * @variant word
       * @variant substring
       * @variant setWords
       * @variant setSubstrings
       */

      var _private = {
         MINIMUM_WORD_LENGTH: 3,

         separatorsRegExp: /\s+/g,

         isSearchByWords: function(searchMode) {
            return searchMode === 'word' || searchMode === 'setWords';
         },

         isSearchBySet: function(searchMode) {
            return searchMode === 'setWords' || searchMode === 'setSubstrings';
         },

         isWord: function(value) {
            return value.length >= _private.MINIMUM_WORD_LENGTH;
         },

         isNotEmpty: function(value) {
            return value !== '';
         },

         calculateHighlightRegExp: function(highlightedWords, searchMode) {
            var startSeparator = '';
            var endSeparator = '';
            var regExp;

            regExp = highlightedWords.join('|');

            if (_private.isSearchByWords(searchMode)) {
               startSeparator = '^|\\s';
               endSeparator = '\\s|$';
            }

            regExp = '(' + startSeparator + ')(' + regExp + ')(' + endSeparator + ')';

            return new RegExp(regExp, 'ig');
         },

         iterator: function(regExp, value) {
            var obj = {
               value: value,
               hasFinished: false
            };

            obj.next = function() {
               obj.lastIndex = regExp.lastIndex;

               var exec = regExp.exec(value);

               obj.hasFinished = !exec;

               if (obj.hasFinished) {
                  obj.found = '';
                  obj.index = value.length;
               } else {
                  obj.found = exec[2];
                  regExp.lastIndex -= exec[3].length;
                  obj.index = exec.index + exec[1].length;
               }

               return obj;
            };

            return obj;
         },

         addText: function(target, iterator) {
            if (iterator.lastIndex !== iterator.index) {
               target.push({
                  type: 'text',
                  value: iterator.value.substring(iterator.lastIndex, iterator.index)
               });
            }
         },

         addHighlight: function(target, iterator) {
            target.push({
               type: 'highlight',
               value: iterator.found
            });
         },

         uniteToSet: function(value) {
            return value.reduce(function(set, current) {
               var lastItem = set[set.length - 1];

               switch (lastItem.type) {
                  case 'highlight':
                     if (current.type === 'highlight' || /^\s+$/.test(current.value)) {
                        lastItem.value += current.value;
                     } else {
                        set.push(current);
                     }
                     break;
                  case 'text':
                     set.push(current);
                     break;
                  default:
                     break;
               }

               return set;
            }, [value.shift()]);
         },

         parseText: function(text, highlight, searchMode) {
            var highlightedWords =
               RegExpUtil.escapeSpecialChars(highlight)
                  .split(_private.separatorsRegExp)
                  .filter(_private.isNotEmpty);

            if (_private.isSearchByWords(searchMode)) {
               highlightedWords = highlightedWords.filter(_private.isWord);
            }

            if (highlightedWords.length === 0) {
               IoC.resolve('ILogger').warn('Controls/Decorator/Highlight', 'When searching there was a problem, there are no words in the highlight option. Perhaps the control is not used for its intended purpose or is not required now.');

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

            if (_private.isSearchBySet(searchMode)) {
               parsedText = _private.uniteToSet(parsedText);
            }

            return parsedText;
         }
      };

      var Highlight = Control.extend({
         _template: template,

         _parsedText: null,

         _beforeMount: function(options) {
            this._parsedText = _private.parseText(options.text, options.highlight, options.searchMode);
         },

         _beforeUpdate: function(newOptions) {
            if (
               newOptions.text !== this._options.text ||
               newOptions.highlight !== this._options.highlight ||
               newOptions.searchMode !== this._options.searchMode
            ) {
               this._parsedText = _private.parseText(newOptions.text, newOptions.highlight, newOptions.searchMode);
            }
         }
      });

      Highlight.getOptionTypes = function() {
         return {
            class: descriptor(String),
            searchMode: descriptor(String).oneOf([
               'word',
               'substring',
               'setWords',
               'setSubstrings'
            ]),
            text: descriptor(String).required(),
            highlight: descriptor(String).required()
         };
      };

      Highlight.getDefaultOptions = function() {
         return {
            searchMode: 'setWords',
            class: 'controls-Highlight_highlight'
         };
      };

      return Highlight;
   });
