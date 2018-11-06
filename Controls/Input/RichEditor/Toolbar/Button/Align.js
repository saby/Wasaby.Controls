define('Controls/Input/RichEditor/Toolbar/Button/Align', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/Toolbar/Button/Align/Align',
   'WS.Data/Source/Memory'
], function(Control, template, Memory) {
   /**
    * Component Toolbar/Button/Align
    * Button for picking text align for selected text
    * @class Controls/Input/RichEditor/Toolbar/Button/Align
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   var ALIGN = ['alignright', 'alignjustify', 'aligncenter'];

   var ALIGN_COMMAND_DATA = [{
      id: 'JustifyLeft',
      icon: 'icon-AlignmentLeft icon-medium'
   }, {
      id: 'JustifyRight',
      icon: 'icon-AlignmentRight icon-medium'
   }, {
      id: 'JustifyCenter',
      icon: 'icon-AlignmentCenter icon-medium'
   }, {
      id: 'JustifyFull',
      icon: 'icon-AlignmentWidth icon-medium'
   }];

   var _private = {

      /**
       * Function return current align from formats list
       * @param formats
       * @returns {string}
       */
      getAlignFromFormatsList: function(formats) {
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

         // TODO Change after solving the task https://online.sbis.ru/opendoc.html?guid=6fdee982-8623-402e-a9dc-0162c337e824

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
            data: ALIGN_COMMAND_DATA
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

      _formatChangedHandler: function(formats) {
         this._updateSelectedAlign(_private.getAlignFromFormatsList(formats));
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
