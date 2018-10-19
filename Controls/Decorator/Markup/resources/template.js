/**
 * Created by rn.kondakov on 18.10.2018.
 */
define('Controls/Decorator/Markup/resources/template', [
   'View/Runner/tclosure'
], function(thelpers) {
   'use strict';

   var markupGenerator,
      defCollection,
      control,
      resolver;

   function recursiveMarkup(value, attrsToDecorate, key) {
      var valueToBuild = resolver ? resolver(value) : value;
      if (value !== valueToBuild) {
         resolver = false;
      }
   }

   var template = function(data, attr, context, isVdom, sets) {
      markupGenerator = thelpers.getMarkupGenerator(isVdom);
      defCollection = {
         id: [],
         def: undefined
      };
      control = data;
      resolver = data._options.resolver;

      var out,
         key = ((attr && attr.key) || '_') + '0_',
         attrsToDecorate = {
            attributes: attr.attributes,
            context: attr.context
         };
      try {
         out = markupGenerator.joinElements(recursiveMarkup(data._options.value, attrsToDecorate, key));
      } catch (e) {
         thelpers.templateError('Controls/Decorator/Markup', e, data);
      }
      if (!out || !out.length) {
         out = markupGenerator.joinElements([markupGenerator.createTag('span',
            { key: key }, [], attrsToDecorate, defCollection, data, key)]);
      }
      return out;
   };

   return template;
});
