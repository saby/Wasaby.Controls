/**
 * Created by rn.kondakov on 18.10.2018.
 */
import thelpers = require('View/Executor/TClosure');
import validHtml = require('Core/validHtml');
import {IoC} from 'Env/Env';

   var markupGenerator,
      defCollection,
      control,
      resolver,
      resolverParams,
      resolverMode,
      currentValidHtml,
      linkAttributesMap = {
         'action': true,
         'background': true,
         'cite': true,
         'codebase': true,
         'formaction': true,
         'href': true,
         'icon': true,
         'longdesc': true,
         'manifest': true,
         'poster': true,
         'profile': true,
         'src': true,
         'usemap': true
      },
      goodLinkAttributeRegExp = /^((https?|ftp|file|smb):(\/\/|\\\\)|mailto:|www\.|\.?\/)/,
      dataAttributeRegExp = /^data-(?!component$)([\w-]*[\w])+$/,
      escapeVdomRegExp = /&([a-zA-Z0-9#]+;)/g,
      additionalNotVdomEscapeRegExp = /(\u00a0)|(&#)/g;

   function isString(value) {
      return typeof value === 'string' || value instanceof String;
   }

   function generateEventSubscribeObject(handlerName) {
      return {
         name: 'event',
         args: [],
         value: handlerName,
         fn: (function(self) {
            const f = (function() {
               const event = arguments[0];
               event.result = thelpers.getter(this, [handlerName]).apply(this, arguments);
            }).bind(self);
            f.control = self;
            f.isControlEvent = false;
            return f;
         })(control)
      };
   }

   function addEventListener(events, eventName, handlerName) {
      if (!events[eventName]) {
         events[eventName] = [];
      }
      events[eventName].push(generateEventSubscribeObject(handlerName));
   }

   // A link from an attribute (for example, href in an a tag or src in an iframe tag) can't begin with "javascript:".
   // This is a way to call any javascript code after such a start.
   function isLinkAttributeWithJavascript(attributeName, attributeValue) {
      return linkAttributesMap[attributeName] && !goodLinkAttributeRegExp.test(attributeValue);
   }

   function validAttributesInsertion(targetAttributes: Object, sourceAttributes: Object) {
      const validAttributes: Object = currentValidHtml.validAttributes;
      for (let attributeName in sourceAttributes) {
         if (!sourceAttributes.hasOwnProperty(attributeName)) {
            continue;
         }
         const sourceAttributeValue = sourceAttributes[attributeName];
         if (!isString(sourceAttributeValue)) {
            IoC.resolve('ILogger')
               .error(control._moduleName, `Невалидное значение атрибута ${attributeName}, ожидается строковый тип.`);
            continue;
         }
         if (!validAttributes[attributeName] && !dataAttributeRegExp.test(attributeName)) {
            continue;
         }
         if (isLinkAttributeWithJavascript(attributeName, sourceAttributeValue)) {
            continue;
         }
         targetAttributes[attributeName] = markupGenerator.escape(sourceAttributeValue);
      }
   }

   function recursiveMarkup(value, attrsToDecorate, key, parent?) {
      var valueToBuild = resolverMode && resolver ? resolver(value, parent, resolverParams) : value,
         wasResolved,
         i;
      if (isString(valueToBuild)) {
         if (!resolver || !resolver.__noNeedEscapeString) {
            valueToBuild = markupGenerator.escape(valueToBuild);
         }
         return markupGenerator.createText(valueToBuild, key);
      }
      if (!valueToBuild) {
         return [];
      }
      if (!Array.isArray(valueToBuild)) {
         IoC.resolve('ILogger')
            .error(control._moduleName, `Узел в JsonML должен быть строкой или массивом.`);
         return [];
      }
      wasResolved = value !== valueToBuild;
      resolverMode ^= wasResolved;
      var children = [];
      if (Array.isArray(valueToBuild[0])) {
         for (i = 0; i < valueToBuild.length; ++i) {
            children.push(recursiveMarkup(valueToBuild[i], attrsToDecorate, key + i + '_', valueToBuild));
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
      if (!currentValidHtml.validNodes[tagName]) {
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

   var template = function(data, attr, context, isVdom, sets?) {
      markupGenerator = thelpers.getMarkupGenerator(isVdom);
      defCollection = {
         id: [],
         def: undefined
      };
      control = data;
      resolver = control._options.tagResolver;
      resolverParams = control._options.resolverParams || {};
      resolverMode = 1;
      currentValidHtml = control._options.validHtml || validHtml;

      const events = attr.events || {};
      if (typeof window !== 'undefined') {
         addEventListener(events, 'on:contextmenu', '_contextMenuHandler');
      }
      var elements = [],
         key = (attr && attr.key) || '_',
         attrsToDecorate = {
            attributes: attr.attributes,
            events: events,
            context: attr.context
         },
         oldEscape,
         value = control._options.value;
      if (value && value.length) {
         // Need just one root node.

         // Mobile can't work with tags yet, so can be value like ["text"].
         // TODO: cancel this merge in https://online.sbis.ru/opendoc.html?guid=a8a904f8-6c0d-4754-9e02-d53da7d32c99
         if (value.length === 1 && isString(value[0])) {
            value = ['div', value[0].split('\n').map(function(str, index) {
               // Newline symbol does not shown in the middle of tag.
               return index ? ['p', '\n' + str] : ['p', str];
            })];
         } else {
            value = ['div', value];
         }
      }
      if (isVdom) {
         // Protect view of text from needless unescape in inferno.
         oldEscape = markupGenerator.escape;
         markupGenerator.escape = function(str) {
            return str.replace(escapeVdomRegExp, function(match, entity) {
               return '&amp;' + entity;
            });
         };
      } else {
         // Markup Converter should escape long space characters too.
         oldEscape = markupGenerator.escape;
         markupGenerator.escape = function(str) {
            return oldEscape(str).replace(additionalNotVdomEscapeRegExp,
               (match) => match[0] === '&' ? '&amp;#' : '&nbsp;');
         };
      }
      try {
         elements = recursiveMarkup(value, attrsToDecorate, key + '0_');
      } catch (e) {
         thelpers.templateError(control._moduleName, e, control);
      } finally {
         markupGenerator.escape = oldEscape;
      }

      if (!elements.length) {
         elements = [markupGenerator.createTag('invisible-node', { key: key + '0_' }, [], attrsToDecorate,
            defCollection, control, key + '0_')];
      }
      return markupGenerator.joinElements(elements, key, defCollection);
   };

   // Template functions should have true "stable" flag to send error on using, for example, some control instead it.
   template.stable = true;


   export = template;

