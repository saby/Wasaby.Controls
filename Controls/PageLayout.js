
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
    * @name Controls/PageLayout#source
    * @cfg  Object that implements ISource interface for data access.
    */

   /**
    * @name Controls/PageLayout#mainAreaProperty
    * @cfg {String} Name of field with template, which display in main area. Default value 'mainArea'.
    */
   /**
    * @name Controls/PageLayout#tabsAreaProperty
    * @cfg {String} Name of field with template, which display in tabs area. Default value 'tabsArea'.
    */
   /**
    * @name Controls/PageLayout#tabsSelectedKey
    * @cfg {String} Key of selected item.
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
         self._tabsArea = self._items.getRecordById(self._options.tabsSelectedKey).get(self._options.tabsAreaProperty || 'tabsArea');
         self._mainArea = self._items.getRecordById(self._options.tabsSelectedKey).get(self._options.mainAreaProperty || 'mainArea');
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
