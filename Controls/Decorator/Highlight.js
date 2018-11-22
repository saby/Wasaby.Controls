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
       * @category Decorator
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

      var _private = {
         separatorsRegExp: /\s/g,

         wordsRegExp: /.*?(?=\s|$)/gi,

         wordsFilter: function(item, index) {
            return index % 2 === 0;
         },

         /**
          * Converts words to the text value of a regular expression. It describes a set of these words and their combinations.
          * @param {Array} words word list.
          * @returns {String}
          */
         transform: function(words) {
            var result = '';
            var length = words.length;
            var iterator, word, followingWords;

            for (iterator = 0; iterator < length; iterator++) {
               word = words[iterator];

               result += '(' + word;

               followingWords = words.slice(iterator + 1).join('|');

               if (followingWords) {
                  result += '(\\s(?=' + followingWords + '))?';
               }

               result += ')?';
            }

            return result;
         },

         /**
          * Get the string to search converted to a regular expression.
          * @example
          * <pre>
          *    getHighlightRegExp('Hello world') // /(Hello(\s(?=world))?)?(world)?/gi
          * </pre>
          * @param highlight Text to search.
          * @returns {RegExp}
          */
         getHighlightRegExp: function(highlight) {
            highlight = RegExpUtil.escapeSpecialChars(highlight);
            var words = highlight.match(_private.wordsRegExp).filter(_private.wordsFilter);
            var highlightRegExpString = _private.transform(words);


            return new RegExp(highlightRegExpString, 'gi');
         },

         parseText: function(text, highlight) {
            var
               parsedText = [],
               highlightRegExp = this.getHighlightRegExp(highlight),
               exec, foundText, startingPosition;

            // eslint-disable-next-line
            while (exec = highlightRegExp.exec(text)) {
               foundText = exec[0];

               if (foundText) {
                  if (startingPosition !== undefined) {
                     parsedText.push({
                        type: 'text',
                        value: text.substring(startingPosition, exec.index)
                     });

                     startingPosition = undefined;
                  }

                  parsedText.push({
                     type: 'found',
                     value: foundText
                  });
               } else {
                  highlightRegExp.lastIndex++;

                  if (startingPosition === undefined) {
                     startingPosition = exec.index;
                  }
               }
            }

            if (!(startingPosition === undefined || startingPosition === text.length)) {
               parsedText.push({
                  type: 'text',
                  value: text.substring(startingPosition)
               });
            }

            return parsedText;
         }
      };

      var Highlight = Control.extend({
         _template: template,

         _parsedText: null,

         _beforeMount: function(options) {
            this._parsedText = _private.parseText(options.text, options.highlight);
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.text !== this._options.text || newOptions.highlight !== this._options.highlight) {
               this._parsedText = _private.parseText(newOptions.text, newOptions.highlight);
            }
         }
      });

      Highlight.getOptionTypes = function() {
         return {
            text: descriptor(String).required(),
            highlight: descriptor(String).required()
         };
      };

      Highlight.getDefaultOptions = function() {
         return {
            class: 'controls-Highlight_found'
         };
      };

      Highlight._private = _private;

      return Highlight;
   }
);
