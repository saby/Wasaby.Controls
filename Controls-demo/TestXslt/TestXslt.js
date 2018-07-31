define('Controls-demo/TestXslt/TestXslt', [
   'Core/Control',
   'tmpl!Controls-demo/TestXslt/TestXslt',
   'Core/xslt-async'
], function(Control, template, Xslt) {
   'use strict';

   return Control.extend({
      _template: template,
      xml: '',
      xsl: '',
      result: '',
      change: function(e, target) {
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
         this._children.infoBoxXslt.open({
            target: this._children.check._container,
            message: 'Correct'
         });
      },
      refused: function() {
         this._children.infoBoxXslt.open({
            target: this._children.check._container,
            message: 'Wrong'
         });
      }
   });
});
