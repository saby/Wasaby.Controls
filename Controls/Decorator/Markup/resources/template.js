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
      resolver,
      resolverParams,
      resolverMode;

   function isString(value) {
      return typeof value === 'string' || value instanceof String;
   }

   function validAttributesInsertion(to, from) {
      var validAttributes = validHtml.validAttributes,
         dataAttributeRegExp = /^data-([\w-])*/;
      for (var key in from) {
         if (from.hasOwnProperty(key) && (validAttributes[key] || dataAttributeRegExp.test(key))) {
            to[key] = markupGenerator.escape(from[key]);
         }
      }
   }

   function recursiveMarkup(value, attrsToDecorate, key, parent) {
      var valueToBuild = resolverMode && resolver ? resolver(value, parent, resolverParams) : value,
         i;
      if (isString(valueToBuild)) {
         return markupGenerator.createText(markupGenerator.escape(valueToBuild), key);
      }
      resolverMode ^= (value !== valueToBuild);
      var children = [];
      if (Array.isArray(valueToBuild[0])) {
         for (i = 0; i < valueToBuild.length; ++i) {
            children.push(recursiveMarkup(valueToBuild[i], attrsToDecorate, key + i + '_', parent));
         }
         resolverMode ^= (value !== valueToBuild);
         return children;
      }
      var firstChildIndex = 1,
         tagName = valueToBuild[0],
         attrs = {
            attributes: {},
            events: {},
            key: key
         };
      if (!validHtml.validNodes[tagName]) {
         resolverMode ^= (value !== valueToBuild);
         return [];
      }
      if (valueToBuild[1] && !isString(valueToBuild[1]) && !Array.isArray(valueToBuild[1])) {
         firstChildIndex = 2;
         validAttributesInsertion(attrs.attributes, valueToBuild[1]);
      }
      for (i = firstChildIndex; i < valueToBuild.length; ++i) {
         children.push(recursiveMarkup(valueToBuild[i], {}, key + i + '_', valueToBuild));
      }
      resolverMode ^= (value !== valueToBuild);
      return [markupGenerator.createTag(tagName, attrs, children, attrsToDecorate, defCollection, control, key)];
   }

   var template = function(data, attr, context, isVdom, sets) {
      markupGenerator = thelpers.getMarkupGenerator(isVdom);
      defCollection = {
         id: [],
         def: undefined
      };
      control = data;
      resolver = data._options.tagResolver;
      resolverParams = data._options.resolverParams || {};
      resolverMode = 1;

      var elements = [],
         key = (attr && attr.key) || '_',
         attrsToDecorate = {
            attributes: attr.attributes,
            context: attr.context
         },
         oldEscape,
         value = data._options.value;
      if (value && value.length) {
         // Need just one root node.
         value = ['div', value];
      }
      if (isVdom) {
         // Protect view of text from needless unescape in inferno.
         oldEscape = markupGenerator.escape;
         markupGenerator.escape = function(str) {
            return str.replace(/&([^&]*;)/g, function(match, entity) {
               return '&amp;' + entity;
            });
         };
      }
      try {
         elements = recursiveMarkup(value, attrsToDecorate, key + '0_');
      } catch (e) {
         thelpers.templateError('Controls/Decorator/Markup', e, data);
      } finally {
         if (isVdom) {
            markupGenerator.escape = oldEscape;
         }
      }

      if (!elements.length) {
         // TODO: Replace the empty span with an invisible node after talking with Nikita Izygin.
         elements = [markupGenerator.createTag('span', { key: key + '0_' }, [], attrsToDecorate,
            defCollection, data, key + '0_')];
      }
      return markupGenerator.joinElements(elements, key, defCollection);
   };

   return template;
});
