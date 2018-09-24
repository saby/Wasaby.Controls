define('tests/unit/resources/TemplateUtil',
   [
      'wml!tests/unit/resources/SimpleContent'
   ],
   function(SimpleContent) {


      'use strict';

      var _private = {
         regExpSpacesString: /\s+/g,

         regExpAdditionalAttributes: / ?(ws-delegates-tabfocus|ws-creates-context|__config|tabindex|name|config|hasMarkup)=".+?"/g
      };

      return {
         content: SimpleContent,

         clearTemplate: function(template) {
            return function(inst) {
               var markup = template(inst);

               markup = markup.replace(_private.regExpSpacesString, ' ');
               markup = markup.replace(_private.regExpAdditionalAttributes, '');

               return markup;
            };
         }
      };
   }
);
