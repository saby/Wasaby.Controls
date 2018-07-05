
define('Controls/PageLayout', [
   'Core/Control',
   'tmpl!Controls/PageLayout/PageLayout',
   'Controls/Controllers/SourceController',
   'css!Controls/PageLayout/PageLayout'
], function(Control, template, SourceController) {
   'use strict';

   /**
    * PageLayout
    *
    * @class Controls/PageLayout
    * @extends Core/Control
    * @control
    * @public
    * @category PageLayout
    * @demo Controls-demo/PageLayout/PageLayoutDemo
    */

   /**
    * @typedef {Source/Memory} tabsSource
    * @property {Array} data Items with settings for the item.
    * @property {String} idProperty String with name of identifier in item.
    */
   /**
    * @typedef Controls/PageLayout tabsSelectedKey
    * @cfg {String} tabsSelectedKey Number of selected key.
    */
   /**
    * @typedef {Array} data
    * @property {String} idProperty Model of item.
    * @property {String} tittle Tittle of tabs.
    * @property {String} mainArea Model of item.
    * @property {String} tabsArea Model of item.
    */
   var _private = {
      initItems: function(source, self) {
         self._sourceController = new SourceController({
            source: source
         });
         return self._sourceController.load().addCallback(function(items) {
            return items;
         });
      },
      updateOptions: function(self) {
         self._tabsArea = self._items.getRecordById(self._options.tabsSelectedKey).get('tabsArea');
         self._mainArea = self._items.getRecordById(self._options.tabsSelectedKey).get('mainArea');
      }
   };
   var browserTabs = Control.extend({
      _template: template,

      _beforeMount: function(options, context, receivedState) {
         if (receivedState) {
            this._items = receivedState;
            _private.updateOptions(this);
         } else {
            return _private.initItems(options.tabsSource, this).addCallback(function(items) {
               this._items = items;
               _private.updateOptions(this);
               return items;
            }.bind(this));
         }
      },
      _beforeUpdate: function(newOptions) {
         var self = this;
         if (newOptions.tabsSource && newOptions.tabsSource !== this._options.tabsSource) {
            return _private.initItems(newOptions.tabsSource, this).addCallback(function(items) {
               this._items = items;
               _private.updateOptions(this);
               self._forceUpdate();
            }.bind(this));
         } else {
            _private.updateOptions(this);
         }
      }
   });
   return browserTabs;
});
