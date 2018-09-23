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
            a.transformToText().addCallback(function(result) {
               var checkStr = result.replace(/(\r)|(\n)/g, '').replace(/( )* /g, ' ');
               if (~checkStr.indexOf('<transformiix:result xmlns:transformiix="http://www.mozilla.org/TransforMiix">')) {
                  checkStr = unescape(checkStr.replace('</transformiix:result>', '')
                     .replace('<transformiix:result xmlns:transformiix="http://www.mozilla.org/TransforMiix"> ', '')
                     .replace(' xmlns="http://www.w3.org/1999/xhtml"', ''));
               }
               self.checkResult(checkStr, self.result) ? self.passed() : self.refused();
            });
         });
      },
      passed: function() {
         this.status = 'Верно';
      },
      refused: function() {
         this.status = 'Неверно';
      },

      /**
       * Такая проверка введена из-за проблем с firefox.
       * Например, firefox выкидывает теги html, head, body, tbody. Возможно, ещё какие-то.
       * Будем считать, что преобразование верно, если проверяемый результат полностью содержится в верном результате
       * в правильном порядке с любыми разделителями.
       * */
      checkResult: function(checkStr, goodStr) {
         var goodIndex = 0;
         for (var checkIndex = 0; checkIndex < checkStr.length; ++checkIndex) {
            while (goodIndex < goodStr.length && checkStr[checkIndex] !== goodStr[goodIndex]) {
               goodIndex++;
            }
            if (goodIndex >= goodStr.length) {
               return false;
            }
            goodIndex++;
         }
         return true;
      }
   });
});
