define('js!WSControls/Containers/TabButtons', [
   'Core/Control',
   'tmpl!WSControls/Containers/TabButtons',
   'css!WSControls/Containers/TabButtons'
], function (Base, template) {
   'use strict';

   var PageDemo =  Base.extend({
      _template: template,
      iWantVDOM: true,

      constructor: function(cfg) {
         PageDemo.superclass.constructor.apply(this, arguments);
         this._publish('onTabChange');
      },

      _onTabClick: function(e, tabId) {
         if (this._options.currentTab !== tabId) {
            this._notify('onTabChange', tabId);
         }
      }
   });

   return PageDemo;
});