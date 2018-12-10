define('Controls/Input/RichEditor/Toolbar/Button/Color', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/Toolbar/Button/Color/Color',
   'Controls/Input/RichEditor/Toolbar/Button/Color/data',
   'WS.Data/Source/Memory',
   'css!theme?Controls/Input/RichEditor/Toolbar/Button/Color/Color',
], function(Control, template, colorsPickData, Memory) {
   /**
    * Component Toolbar/Button/Color
    * Button for picking color for selected text
    * @class Controls/Input/RichEditor/Toolbar/Button/Color
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   return Control.extend({
      _template: template,
      _source: null,

      _beforeMount: function() {
         this._source = new Memory({
            idProperty: 'id',
            data: colorsPickData
         });
      },


      _menuItemActivateHandler: function(event, item) {
         this._notify('applyFormat', [[{ formatName: 'forecolor', state: item.get('color') }]], { bubbling: true });
      }
   });
});
