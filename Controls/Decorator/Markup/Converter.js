/**
 * Created by rn.kondakov on 18.10.2018.
 */
define('Controls/Decorator/Markup/Converter', [
   'Controls/Decorator/Markup/resources/template',
   'Controls/Decorator/Markup/resources/linkDecorateUtils',
   'Core/core-merge'
], function(template,
   linkDecorateUtils,
   objectMerge) {
   'use strict';

   // Convert node to jsonML array.
   function nodeToJson(node) {
      // Text node, in jsonML it is just a string.
      if (node.nodeType === Node.TEXT_NODE) {
         return node.nodeValue;
      }

      // Element node, in jsonML it is an array.
      if (node.nodeType === Node.ELEMENT_NODE) {
         var json = [];

         // json[0] is a tag name.
         json[0] = node.nodeName.toLowerCase();

         // If node has attributes, they are located in json[1].
         if (node.attributes.length > 0) {
            var jsonAttributes = {},
               nodeAttributes = node.attributes;
            for (var i = 0; i < nodeAttributes.length; ++i) {
               jsonAttributes[nodeAttributes[i].name] = nodeAttributes[i].value;
            }
            json[1] = jsonAttributes;
         }

         // After that convert child nodes and push them to array.
         if (node.hasChildNodes()) {
            var childNodes = node.childNodes;
            for (var i = 0; i < childNodes.length; ++i) {
               // Recursive converting of children.
               json.push(nodeToJson(childNodes[i]));
            }
         }

         // By agreement, json shouldn't contain decorated link. Undecorate it if found.
         return linkDecorateUtils.undecorateLinkIfNeed(json);
      }

      // Return empty array if node is neither text nor element.
      return [];
   }

   var linkParseRegExp = /(?:(((?:https?|ftp|file|smb):\/\/|www\.)[^\s<>]+?)|([^\s<>]+@[^\s<>]+(?:\.[^\s<>]{2,6}?))|([^\s<>]*?))([.,:]?(?:\s|$|&nbsp;|(<[^>]*>)))/g,
      hasOpenATagRegExp = /<a(( )|(>))/i;

   // Wrap all links and email addresses placed not in tag a.
   function wrapUrl(html) {
      var inLink = false;
      return html.replace(linkParseRegExp, function(match, link, linkPrefix, email, text, end) {
         if (link && !inLink) {
            return '<a class="asLink" rel="noreferrer" href="' + (linkPrefix === 'www.' ? 'http://' : '') + link + '" target="_blank">' + link + '</a>' + end;
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
      div.innerHTML = wrapUrl(html).trim();
      return nodeToJson(div).slice(1);
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
      return objectMerge([], json, { clone: true });
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
