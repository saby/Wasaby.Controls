define('ControlsUnit/resources/TemplateUtil',
   [
      'Core/helpers/String/unEscapeASCII',

      'wml!ControlsUnit/resources/SimpleContent'
   ],
   function(unEscapeASCII, SimpleContent) {
      'use strict';

      var _private = {
         ignoreSpaces: [unEscapeASCII('&#65279;')],

         regExpSpacesString: /\s+/g,

         regExpAdditionalAttributes: / ?(data-component|ws-delegates-tabfocus|ws-creates-context|__config|tabindex|name|config|hasMarkup)=".+?"/g,

         regScripts: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
      };

      return {
         content: SimpleContent,

         clearTemplatePromise: function(markup) {
            const self = this;
            return markup
               .then(function(resolved) {
                  return self.clearMarkup(resolved);
               })
               .catch(function() {
                  return Promise.resolve('');
               });
         },

         clearTemplate: function(template) {
            const self = this;
            return function(inst, async) {
               return async ? self.clearTemplatePromise(template(inst)) : self.clearMarkup(template(inst));
            };
         },

         clearMarkup: function(_markup) {
            let markup = _markup.replace(_private.regExpSpacesString, function(substr) {
               if (_private.ignoreSpaces.includes(substr)) {
                  return '';
               }

               return ' ';
            });
            markup = markup.replace(_private.regExpAdditionalAttributes, '');

            return this.clearScripts(markup);
         },

         clearScripts: function(markup) {
            var innerMarkup = markup;
            while (_private.regScripts.test(innerMarkup)) {
               innerMarkup = markup.replace(_private.regScripts, '');
            }
            return innerMarkup;
         }
      };
   });
