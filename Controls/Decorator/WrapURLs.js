define('Controls/Decorator/WrapURLs',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'wml!Controls/Decorator/WrapURLs/WrapURLs'
   ],
   function(Control, descriptor, template) {

      'use strict';

      /**
       * Wrap references in text.
       *
       * @class Controls/Decorator/WrapURLs
       * @extends Core/Control
       * @control
       * @public
       * @author Журавлев М.С.
       * @category Decorator
       *
       * @author Журавлев Максим Сергеевич
       */

      /**
       * @name Controls/Decorator/WrapURLs#text
       * @cfg {String} Text to convert.
       */

      /**
       * @name Controls/Decorator/WrapURLs#newTab
       * @cfg {Boolean} Open link in new tab.
       */

      var _private = {
         parseRegExp: /(?:(((?:https?|ftp|file):\/\/|www\.)\S+?)|(\S+@\S+(?:\.\S{2,6}?))|(\S*?))([.,:]?(?:\s|$))/g,

         parseText: function(text) {
            var
               node = {},
               parsedText = [],
               exec;
   
            // eslint-disable-next-line
            while (exec = this.parseRegExp.exec(text)) {
               if (text.length === this.parseRegExp.lastIndex && !exec[0]) {
                  this.parseRegExp.lastIndex = 0;
                  break;
               } else if (exec[1]) {
                  node = {
                     type: 'link',
                     href: exec[1],
                     www: exec[2] === 'www.'
                  };
               } else if (exec[3]) {
                  node = {
                     type: 'email',
                     address: exec[3]
                  };
               } else if (node.type === 'text') {
                  node.value += node.end + exec[4];
                  node.end = exec[5];
                  continue;
               } else {
                  node = {
                     type: 'text',
                     value: exec[4]
                  };
               }

               node.end = exec[5];
               parsedText.push(node);
            }

            return parsedText;
         }
      };

      var WrapURLs = Control.extend({
         _template: template,

         _parsedText: null,

         _beforeMount: function(options) {
            this._parsedText = _private.parseText(options.text);
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.text !== this._options.text) {
               this._parsedText = _private.parseText(newOptions.text);
            }
         }
      });

      WrapURLs.getOptionTypes = function() {
         return {
            text: descriptor(String).required()
         };
      };

      WrapURLs.getDefaultOptions = function() {
         return {
            newTab: true
         };
      };

      WrapURLs._private = _private;

      return WrapURLs;
   }
);
