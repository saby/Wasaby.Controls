define('Controls/Input/RichEditor/Toolbar/Button/CustomFormat', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/Toolbar/Button/CustomFormat/CustomFormat',
   'Controls/Input/RichEditor/Toolbar/Button/CustomFormat/data',
   'WS.Data/Source/Memory',
   'Core/core-clone',
   'Controls/Input/RichArea/helpers/constants',
   'css!Controls/Input/RichEditor/Toolbar/Button/CustomFormat/CustomFormat',
   'wml!Controls/Input/RichEditor/Toolbar/Button/CustomFormat/item'
], function(Control, template, formatPickData, Memory, cClone, constantsHelper) {
   /**
    * Component Toolbar/Button/CustomFormat
    * Button for picking custom format for selected text
    * @class Controls/Input/RichEditor/Toolbar/Button/Format
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   var CUSTOM_FORMATS = ['header', 'subheader', 'additional'];

   var _private = {

      /**
       * Function return current custom format from formats list
       * @param formats
       * @returns {string}
       */
      getCustomFormatFromFormatsList: function(formats) {
         // Default custom format is default
         var currentFormat = 'default';

         for (var i = 0, len = CUSTOM_FORMATS.length; i < len; i++) {
            if (formats.getRecordById(CUSTOM_FORMATS[i]).get('state')) {
               currentFormat = CUSTOM_FORMATS[i];
               break;
            }
         }

         return currentFormat;
      }
   };

   return Control.extend({
      _template: template,
      _source: null,
      _items: null,
      _selectedFormat: null,

      _beforeMount: function() {
         this._items = cClone(formatPickData);

         this._source = new Memory({
            idProperty: 'id',
            data: this._items
         });

         this._selectedFormat = 'default';
      },

      _afterMount: function() {
         this._notify('register', ['formatChanged', this, this._formatChangedHandler], { bubbling: true });
      },

      _selectedKeyChangedHandler: function(event, format) {
         this._notify('removeFormat', [constantsHelper.defaultFormats], { bubbling: true });

         if (format !== 'default') {
            this._notify('applyFormat', [[{ formatName: format, state: true }]], { bubbling: true });
         }

         this._selectedFormat = format;
      },

      _formatChangedHandler: function(formats) {
         var currentFormat = _private.getCustomFormatFromFormatsList(formats);

         if (currentFormat !== this._selectedFormat) {
            this._selectedFormat = currentFormat;
            this._forceUpdate();
         }
      }
   });
});
