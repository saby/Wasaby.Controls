/**
 * Created by rn.kondakov on 18.10.2018.
 */
define('Controls/Decorator/Markup/Converter', [
   'Controls/Decorator/Markup/resources/template',
   'Core/Util/Object'
], function(template,
   ObjectUtils) {
   'use strict';

   function domToJson(dom) {
      if (dom.nodeType === 3) {
         // Text node.
         return dom.nodeValue;
      }

      // Tag name.
      var json = [dom.nodeName.toLowerCase()];

      if (dom.nodeType === 1 && dom.attributes.length > 0) {
         // Element node with attributes.
         json.push({});
         for (var j = 0; j < dom.attributes.length; ++j) {
            var attribute = dom.attributes.item(j);
            json[1][attribute.nodeName] = attribute.nodeValue;
         }
      }

      if (dom.hasChildNodes()) {
         for (var i = 0; i < dom.childNodes.length; ++i) {
            // Recursive converting of children.
            var item = domToJson(dom.childNodes.item(i));
            json.push(item);
         }
      }

      return json;
   }

   var linkParseRegExp = /(?:(((?:https?|ftp|file):\/\/|www\.)[^\s<>]+?)|([^\s<>]+@[^\s<>]+(?:\.[^\s<>]{2,6}?))|([^\s<>]*?))([.,:]?(?:\s|$|(<[^>]*>)))/g,
      hasOpenATagRegExp = /<a(( )|(>))/i;

   // Wrap all links and email addresses placed not in tag a.
   function wrapUrl(html) {
      var inLink = false;
      return html.replace(linkParseRegExp, function(match, link, linkPrefix, email, text, end) {
         if (link && !inLink) {
            return '<a rel="noreferrer" href="' + (linkPrefix === 'www.' ? 'http://' : '') + link + '" target="_blank">' + link + '</a>' + end;
         }
         if (email && !inLink) {
            return '<a href="mailto:' + email + '">' + email + '</a>' + end;
         }
         if (end.match(hasOpenATagRegExp)) {
            inLink = true;
         } else if (~end.indexOf('</a>')) {
            inLink = false;
         }
         return match;
      });
   }

   /**
    * Convert html string to valid JsonML.
    * @function Controls/Decorator/Markup/Converter#htmlToJson
    * @param html {String}
    * @returns {Array}
    */
   var htmlToJson = function(html) {
      var div = document.createElement('div');
      div.innerHTML = wrapUrl(html);
      return domToJson(div).slice(1);
   };

   /**
    * Convert Json to html string.
    * @function Controls/Decorator/Markup/Converter#jsonToHtml
    * @param json {Array} Json based on JsonML.
    * @param tagResolver {Function} exactly like in {@link Controls/Decorator/Markup#tagResolver}.
    * @param resolverParams {Object} exactly like in {@link Controls/Decorator/Markup#resolverParams}.
    * @returns {String}
    */
   var jsonToHtml = function(json, tagResolver, resolverParams) {
      return template({
         _options: {
            value: json,
            tagResolver: tagResolver,
            resolverParams: resolverParams
         }
      }, {});
   };

   /**
    * Convert Json array to its copy  by value in all nodes.
    * @function Controls/Decorator/Markup/Converter#deepCopyJson
    * @param json
    * @return {Array}
    */
   var deepCopyJson = function(json) {
      return ObjectUtils.merge([], json);
   };

   /**
    * @class Controls/Decorator/Markup/Converter
    * @author Кондаков Р.Н.
    * @public
    */
   var MarkupConverter = {
      htmlToJson: htmlToJson,
      jsonToHtml: jsonToHtml,
      deepCopyJson: deepCopyJson
   };

   return MarkupConverter;
});
