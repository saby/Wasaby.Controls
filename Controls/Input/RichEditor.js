define('Controls/Input/RichEditor', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/RichEditor',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet',
   'Controls/Input/RichEditor/Toolbar/defaultToolbarButtonsList',
   'Core/core-clone',
   'Core/moduleStubs',
   'css!Controls/Input/RichEditor/RichEditor'
], function(Control, template, Memory, RecordSet, defaultButtons, cClone, moduleStubs) {
   /**
    * Component RichEditor
    * Default rich editor with toolbar.
    * @class Controls/Input/RichEditor
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   var _private = {

      /**
       * Function returns prepared toolbar buttons array
       * @param self
       * @param toolbarButtonsConfig
       * @returns {*}
       */
      prepareToolbarItems: function(self, toolbarButtonsConfig) {
         var
            resultItems = new RecordSet({
               idProperty: 'id',
               rawData: cClone(defaultButtons)
            }),
            hiddenItems = toolbarButtonsConfig.hidden || [],
            additionalItems = toolbarButtonsConfig.additional || [];

         hiddenItems.forEach(function(item) {
            resultItems.remove(resultItems.getRecordById(item));
         });

         resultItems = resultItems.getRawData();
         resultItems.concat(additionalItems);

         return resultItems;
      },

      /**
       * Function returns array of templates which must be required
       * @param items
       * @returns {Array}
       */
      getItemsTemplates: function(items) {
         var dependencies = [];

         items.forEach(function(item) {
            if (item.template) {
               dependencies.push(item.template);
            }
         });

         return dependencies;
      }
   };

   var RichEditor = Control.extend({
      _toolbarOpened: false,
      _template: template,

      _beforeMount: function(options) {
         this._items = _private.prepareToolbarItems(this, options.toolbarButtons || {});
         this._toolbarOpened = options.toolbarVisible;

         this._toolbarSource = new Memory({
            idProperty: 'id',
            data: this._items
         });

         return moduleStubs.require(_private.getItemsTemplates(this._items));
      },

      _clickHandler: function() {
         this._toolbarOpened = !this._toolbarOpened;
      },

      getDefaultOptions: function() {
         return {
            toolbarVisible: true
         };
      }
   });

   return RichEditor;
});
