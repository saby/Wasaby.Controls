define('unit/resources/TemplateUtil',
   [
      'Core/helpers/String/unEscapeASCII',

      'wml!unit/resources/SimpleContent'
   ],
   function(unEscapeASCII, SimpleContent) {
      'use strict';

      var _private = {
         ignoreSpaces: [unEscapeASCII('&#65279;')],

         regExpSpacesString: /\s+/g,

         regExpAdditionalAttributes: / ?(data-component|ws-delegates-tabfocus|ws-creates-context|__config|tabindex|name|config|hasMarkup)=".+?"/g
      };

      return {
         content: SimpleContent,

         clearTemplate: function(template) {
            return function(inst) {
               var markup = template(inst);

               markup = markup.replace(_private.regExpSpacesString, function(substr) {
                  if (_private.ignoreSpaces.includes(substr)) {
                     return '';
                  }

                  return ' ';
               });
               markup = markup.replace(_private.regExpAdditionalAttributes, '');

               return markup;
            };
         }
      };
   });
