define('Controls-demo/TestXslt/TestXslt', [
   'Core/Control',
   'tmpl!Controls-demo/TestXslt/TestXslt',
   'Core/xslt-async',
   'css!Controls-demo/TestXslt/TestXslt'
], function(Control, template, Xslt) {
   'use strict';

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
               result.replace(/(\r)|(\n)/g, '') === self.result.replace(/(\r)|(\n)/g, '') ? self.passed() : self.refused();
            });
         });
      },
      passed: function() {
         this.status = 'Верно';
      },
      refused: function() {
         this.status = 'Неверно';
      }
   });
});
