define('Controls/Decorators/Highlight',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'tmpl!Controls/Decorators/Highlight/Highlight',

      'css!Controls/Decorators/Highlight/Highlight'
   ],
   function(Control, descriptor, template) {

      'use strict';

      /**
       * Highlighting the searched phrase.
       *
       * @class Controls/Decorators/Highlight
       * @extends Core/Control
       * @control
       * @public
       * @category Decorators
       *
       * @name Controls/Decorators/Highlight#text
       * @cfg {String} The text in which to search.
       *
       * @name Controls/Decorators/Highlight#highlight
       * @cfg {String} Text to search.
       *
       * @name Controls/Decorators/Highlight#class
       * @cfg {String} Class for highlight.
       */

      var _private = {
         separatorsRegExp: /\s/g,

         getHighlightRegExp: function(highlight) {
            var highlightRegExpString = highlight.replace(this.separatorsRegExp, ')?(\\s?');

            return new RegExp('(' + highlightRegExpString + ')?', 'gi');
         },

         getParseText: function(text, highlight) {
            var
               parseText = [],
               highlightRegExp = this.getHighlightRegExp(highlight),
               exec, foundText, startingPosition;

            while (exec = highlightRegExp.exec(text)) {
               foundText = exec[0];

               if (foundText) {
                  if (startingPosition !== undefined) {
                     parseText.push({
                        type: 'text',
                        value: text.substring(startingPosition, exec.index)
                     });

                     startingPosition = undefined;
                  }

                  parseText.push({
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
               parseText.push({
                  type: 'text',
                  value: text.substring(startingPosition)
               });
            }

            return parseText;
         }
      };

      var Highlight = Control.extend({
         _template: template,

         _parseText: null,

         _beforeMount: function(options) {
            this._parseText = _private.getParseText(options.text, options.highlight);
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.text !== this._options.text || newOptions.highlight !== this._options.highlight) {
               this._parseText = _private.getParseText(newOptions.text, newOptions.highlight);
            }
         }
      });

      Highlight.getOptionTypes = function() {
         return {
            text: descriptor(String).required(),
            highlight: descriptor(String).required()
         };
      };

      Highlight._private = _private;

      return Highlight;
   }
);
