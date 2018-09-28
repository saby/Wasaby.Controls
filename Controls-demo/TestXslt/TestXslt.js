define('Controls-demo/TestXslt/TestXslt', [
   'Core/Control',
   'wml!Controls-demo/TestXslt/TestXslt',
   'Core/xslt-async',
   'css!Controls-demo/TestXslt/TestXslt'
], function(Control, template, Xslt) {
   'use strict';

   function unescape(s) {
      if (!s || !s.replace) {
         return s;
      }
      var translateRe = /&(nbsp|amp|quot|apos|lt|gt);/g,
         translateDict = {
            nbsp: String.fromCharCode(160),
            amp: '&',
            quot: '\'',
            apos: '\'',
            lt: '<',
            gt: '>'
         };
      return s.replace(translateRe, function(match, entity) {
         return translateDict[entity];
      });
   }

   return Control.extend({
      _template: template,
      xml: '',
      xsl: '',
      result: '',
      status: 'Не проверено',
      change: function(e, target) {
         if (this.status !== 'Не проверено') {
            this.status = 'Не проверено';
         }
         this[target] = e.target.value;
      },
      check: function() {
         var self = this;
         var a = new Xslt({xml: self.xml, xsl: self.xsl, errback: self.refused});
         a.execute().addCallback(function() {
            if (a.checkDocument(a._xmlDoc)) {
               self.refused();
               return;
            }
            a.transformToText().addCallback(function(result) {
               self.checkResult(result, self.result) ? self.passed() : self.refused();
            });
         });
      },
      passed: function() {
         this.status = 'Верно';
      },
      refused: function() {
         this.status = 'Неверно';
      },

      checkResult: function(checkStr, goodStr) {
         if (~checkStr.indexOf('<transformiix:result xmlns:transformiix="http://www.mozilla.org/TransforMiix">')) {
            checkStr = unescape(checkStr.replace(/<(\/|)transformiix:result[^>]*>/g, ''));
         }
         var toRemoveRegExp = /(\r)|(\n)|(<html[^>]*>)|(<\/html>)|(<head[^>]*>)|(<\/head>)|(<body[^>]*>)|(<\/body>)|(<tbody[^>]*>)|(<\/tbody>)|( )|(\t)|(xmlns="http:\/\/www\.w3\.org\/1999\/xhtml")/g;
         checkStr = checkStr.replace(toRemoveRegExp, '');
         goodStr = goodStr.replace(toRemoveRegExp, '');
         return  goodStr.indexOf(checkStr) === 0;
      }
   });
});
