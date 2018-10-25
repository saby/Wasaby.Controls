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

   function validAttributesInsertion(to, from) {
      var validAttributes = validHtml.validAttributes;
      for (var key in from) {
         if (from.hasOwnProperty(key) && validAttributes[key]) {
            to[key] = from[key];
         }
      }
   }

   function recursiveMarkup(value, attrsToDecorate, key, parent) {
      var valueToBuild = resolver ? resolver(value, parent) : value,
         i;
      if (value !== valueToBuild) {
         resolver = false;
      }
      if (isString(valueToBuild)) {
         return markupGenerator.createText(markupGenerator.escape(valueToBuild), key);
      }
      var children = [];
      if (Array.isArray(valueToBuild[0])) {
         for (i = 0; i < valueToBuild.length; ++i) {
            children.push(recursiveMarkup(valueToBuild[i], attrsToDecorate, key + i + '_', parent));
         }
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
         // TODO Если нужно, реализовать для тегов из validHtml.fullEscapeNodes возврат чего-то вроде
         // markupGenerator.createText(markupGenerator.escape(Converter.jsonToHtml(valueToBuild)), key)
         return [];
      }
      if (valueToBuild[1] && !isString(valueToBuild[1]) && !Array.isArray(valueToBuild[1])) {
         firstChildIndex = 2;
         validAttributesInsertion(attrs.attributes, valueToBuild[1]);
      }
      for (i = firstChildIndex; i < valueToBuild.length; ++i) {
         children.push(recursiveMarkup(valueToBuild[i], {}, key + i + '_', valueToBuild));
      }
      return [markupGenerator.createTag(tagName, attrs, children, attrsToDecorate, defCollection, control, key)];
   }

   var template = function(data, attr, context, isVdom, sets) {
      markupGenerator = thelpers.getMarkupGenerator(isVdom);
      defCollection = {
         id: [],
         def: undefined
      };
      control = data;
      resolver = data._options.resolver;

      var elements = [],
         key = (attr && attr.key) || '_',
         attrsToDecorate = {
            attributes: attr.attributes,
            context: attr.context
         };
      try {
         elements = recursiveMarkup(data._options.value, attrsToDecorate, key + '0_');
      } catch (e) {
         thelpers.templateError('Controls/Decorator/Markup', e, data);
      }
      if (isVdom) {
         // Нет смысла при использовании в конвертере (jsonToHtml) запрещать пустую и мультиноду.
         // Если это сломает серверную вёрстку, можно придумать что-то ещё.
         if (!elements.length) {
            // TODO: Здесь должно быть создание invisible-node, но когда я пытался переписать старый HtmlJson таким образом,
            // не прокатило. Если после пустого json передать непустой, всё падало.
            // После создания невидимого узла this._container становился равным контейнеру родителя,
            // и если потом передать новый json, контейнер уже не переприсваивался при перерисовке, что неправильно.
            // Пока оставил спан.
            elements = [markupGenerator.createTag('span', { key: key + '0_' }, [], attrsToDecorate,
               defCollection, data, key + '0_')];
         } else if (elements.length > 1) {
            elements = [markupGenerator.createTag('span', { key: key + 'wrap_' }, elements, attrsToDecorate,
               defCollection, data, key + 'wrap_')];
         }
      }
      return markupGenerator.joinElements(elements, key, defCollection);
   };

   return template;
});
