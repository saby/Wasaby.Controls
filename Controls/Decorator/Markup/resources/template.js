/**
 * Created by rn.kondakov on 18.10.2018.
 */
define('Controls/Decorator/Markup/resources/template', [
   'View/Runner/tclosure',
   'Core/validHtml'
], function(thelpers,
   validHtml) {
   'use strict';

   var markupGenerator,
      defCollection,
      control,
      resolver;

   function isString(value) {
      return typeof value === 'string' || value instanceof String;
   }

   function recursiveMarkup(value, attrsToDecorate, key, parent) {
      var valueToBuild = resolver ? resolver(value, parent) : value;
      if (value !== valueToBuild) {
         resolver = false;
      }
      if (isString(value)) {
         return markupGenerator.createText(markupGenerator.escape(value), key);
      }
      var out = [];
      if (Array.isArray(value[0])) {
         for (var i = 0; i < value.length; ++i) {
            out.push(recursiveMarkup(value[i]), attrsToDecorate, key + i + '_');
         }
         return out;
      }
      if (!validHtml.validNodes[value[0]]) {
         return [];
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
         out = markupGenerator.joinElements(recursiveMarkup(data._options.value, attrsToDecorate, key, null));
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
