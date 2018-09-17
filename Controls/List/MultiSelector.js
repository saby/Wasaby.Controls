define('Controls/List/MultiSelector', [
   'Core/Control',
   'wml!Controls/List/MultiSelector/MultiSelector',
   'Controls/Container/MultiSelector/SelectionContextField'
], function(
   Control,
   template,
   SelectionContextField
) {
   'use strict';

   /**
    * Container for list components.
    * Passes selectedKeys to list inside.
    *
    * @class Controls/List/MultiSelector
    * @extends Core/Control
    * @control
    * @author Авраменко А.С.
    * @public
    */

   /**
    * @event Controls/List/MultiSelector#listSelectionChange Occurs when selection was changed.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Array} selectedKeys Array of selected items' keys.
    * @param {Array} added Array of added keys in selection.
    * @param {Array} deleted Array of deleted keys in selection.
    */

   var MultiSelector = Control.extend({
      _template: template,

      _onSelectionChange: function(event, keys, added, removed) {
         this._notify('listSelectionChange', [keys, added, removed], {
            bubbling: true
         });
      }
   });

   MultiSelector.contextTypes = function contextTypes() {
      return {
         selection: SelectionContextField
      };
   };

   return MultiSelector;
});
