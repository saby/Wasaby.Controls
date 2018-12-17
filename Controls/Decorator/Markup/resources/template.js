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

   // We are not ready to remove "decoratedlink" right now.
   // TODO: Should remove this function in 3.19.100, when server and mobile will be ready.
   // Problem link: https://online.sbis.ru/opendoc.html?guid=4f521fbe-a40b-4926-bcc6-27e2312a4170.
   function replaceDecoratedLinks(value) {
      if (!Array.isArray(value)) {
         return value;
      }
      var newValue = [],
         found = false;
      for (var i = 0; i < value.length; ++i) {
         if (value[i] && value[i][0] === 'decoratedlink') {
            found = true;
            newValue.push(['a',
               {
                  'class': 'asLink',
                  rel: 'noreferrer',
                  href: value[i][1].href,
                  target: '_blank'
               },
               value[i][1].href
            ]);
         } else {
            newValue.push(value[i]);
         }
      }
      return found ? newValue : value;
   }

   function recursiveMarkup(value, attrsToDecorate, key, parent) {
      var valueToBuild = resolverMode && resolver ? resolver(value, parent, resolverParams) : value,
         wasResolved,
         i;
      if (isString(valueToBuild)) {
         return markupGenerator.createText(markupGenerator.escape(valueToBuild), key);
      }
      if (!valueToBuild) {
         return [];
      }
      wasResolved = value !== valueToBuild;
      resolverMode ^= wasResolved;
      valueToBuild = replaceDecoratedLinks(valueToBuild);
      var children = [];
      if (Array.isArray(valueToBuild[0])) {
         for (i = 0; i < valueToBuild.length; ++i) {
            children.push(recursiveMarkup(valueToBuild[i], attrsToDecorate, key + i + '_', parent));
         }
         resolverMode ^= wasResolved;
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
         resolverMode ^= wasResolved;
         return [];
      }
      if (valueToBuild[1] && !isString(valueToBuild[1]) && !Array.isArray(valueToBuild[1])) {
         firstChildIndex = 2;
         validAttributesInsertion(attrs.attributes, valueToBuild[1]);
      }
      for (i = firstChildIndex; i < valueToBuild.length; ++i) {
         children.push(recursiveMarkup(valueToBuild[i], {}, key + i + '_', valueToBuild));
      }
      resolverMode ^= wasResolved;
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
         elements = [markupGenerator.createTag('div', { key: key + '0_' }, [], attrsToDecorate,
            defCollection, data, key + '0_')];
      }
      return markupGenerator.joinElements(elements, key, defCollection);
   };

   // Template functions should have true "stable" flag to send error on using, for example, some control instead it.
   template.stable = true;

   return template;
});
