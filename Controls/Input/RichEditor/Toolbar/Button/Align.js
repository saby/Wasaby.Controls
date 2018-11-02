define('Controls/Input/RichEditor/Toolbar/Button/Align', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/Toolbar/Button/Align/Align',
   'Controls/Input/RichEditor/Toolbar/Button/Align/data',
   'WS.Data/Source/Memory'
], function(Control, template, alignPickData, Memory) {
   /**
    * Component Toolbar/Button/Align
    * Button for picking text align for selected text
    * @class Controls/Input/RichEditor/Toolbar/Button/Align
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   var ALIGN = ['alignright', 'alignjustify', 'aligncenter'];

   var _private = {

      /**
       * Function return current align in selectedText
       * @param formats
       * @returns {string}
       */
      getCurrentAlign: function(formats) {
         // Alignleft as default
         var currentAlign = 'alignleft';

         for (var i = 0, len = ALIGN.length; i < len; i++) {
            if (formats.getRecordById(ALIGN[i]).get('state')) {
               currentAlign = ALIGN[i];
               break;
            }
         }

         return currentAlign;
      },

      /**
       * Function returns correct icon value
       * @param align
       * @returns {string}
       */
      getSelectedAlignIcon: function(align) {
         var icon;

         switch (align) {
            case 'JustifyLeft':
            case 'alignleft':
               icon = 'icon-AlignmentLeft';
               break;
            case 'JustifyRight':
            case 'alignright':
               icon = 'icon-AlignmentRight';
               break;
            case 'JustifyCenter':
            case 'aligncenter':
               icon = 'icon-AlignmentCenter';
               break;
            case 'JustifyFull':
            case 'alignjustify':
               icon = 'icon-AlignmentWidth';
               break;
            default:
               icon = 'icon-AlignmentLeft';
               break;
         }

         return icon;
      }
   };

   return Control.extend({
      _template: template,
      _source: null,
      _items: null,
      _selectedAlign: null,

      _beforeMount: function() {
         this._source = new Memory({
            idProperty: 'id',
            data: alignPickData
         });

         this._selectedAlign = {
            icon: 'icon-AlignmentLeft',
            type: 'JustifyLeft'
         };
      },

      _afterMount: function() {
         this._notify('register', ['formatChanged', this, this._formatChangedHandler], { bubbling: true });
      },

      _menuItemActivateHandler: function(event, item) {
         this._notify('execCommand', [[{ command: item.get('id') }]], { bubbling: true });
         this._updateSelectedAlign(item.get('id'));
      },

      _formatChangedHandler(formats) {
         this._updateSelectedAlign(_private.getCurrentAlign(formats));
      },

      /**
       * Function updates current selected align
       * @param align
       * @private
       */
      _updateSelectedAlign: function(align) {
         if (this._selectedAlign.type !== align) {
            this._selectedAlign.type = align;
            this._selectedAlign.icon = _private.getSelectedAlignIcon(align);
         }

         this._forceUpdate();
      }
   });
});
