define('Controls/Input/RichEditor/Toolbar/Button/List', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/Toolbar/Button/List/List',
   'Controls/Input/RichEditor/Toolbar/Button/List/data',
   'WS.Data/Source/Memory'
], function(Control, template, listPickData, Memory) {
   /**
    * Component Toolbar/Button/List
    * Button for picking list-style for selected text
    * @class Controls/Input/RichEditor/Toolbar/Button/List
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
            data: listPickData
         });
      },

      _menuItemActivateHandler: function(event, item) {
         this._notify('execCommand', [[{ command: item.get('command') }]], { bubbling: true });
      }
   });
});
