define('Controls/Decorator/Highlight',
   [
      'Core/Control',
      'Controls/Utils/RegExp',
      'WS.Data/Type/descriptor',
      'wml!Controls/Decorator/Highlight/Highlight',

      'css!theme?Controls/Decorator/Highlight/Highlight'
   ],
   function(Control, RegExpUtil, descriptor, template) {
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

         calculateHighlightRegExp: function(highlightedWords, searchMode) {
            var regExp;

            regExp = highlightedWords.join('|');

            if (_private.isSearchByWords(searchMode)) {
               regExp = '^|\\s(' + regExp + ')\\s|$';
            }

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
                  obj.found = exec[0];
                  obj.index = exec.index;
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
            var hasUnite;

            return value.reduce(function(set, current) {
               if (hasUnite) {
                  hasUnite = false;
                  set[set.length - 1].value += current.value;
               }

               if (current.type === 'text' && current.value.test(_private.separatorsRegExp)) {
                  hasUnite = true;
                  set[set.length - 1].value += current.value;
               }
            }, []);
         },

         parseText: function(text, highlight, searchMode) {
            var highlightedWords = RegExpUtil.escapeSpecialChars(highlight).split(_private.separatorsRegExp);

            if (_private.isSearchByWords(searchMode)) {
               highlightedWords = highlightedWords.filter(_private.isWord);
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
               _private.uniteToSet(parsedText);
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
            searchMode: 'substring',
            class: 'controls-Highlight_found'
         };
      };

      Highlight._private = _private;

      return Highlight;
   });
