define('Controls/List/MultiSelector', ['Controls/_operations/Container'], function(Control) {
/**
 * Container for list components.
 *
 * @class Controls/operations:Container
 * @extends Core/Control
 * @control
 * @author Авраменко А.С.
 * @public
 */
   /**
 * @event Controls/operations:Container#listSelectedKeysChanged Occurs when selected keys were changed.
 * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
 * @param {Array} selectedKeys Array of selected items' keys.
 * @param {Array} added Array of added keys in selection.
 * @param {Array} deleted Array of deleted keys in selection.
 */
   /**
 * @event Controls/operations:Container#listExcludedKeysChanged Occurs when excluded keys were changed.
 * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
 * @param {Array} selectedKeys Array of selected items' keys.
 * @param {Array} added Array of added keys in selection.
 * @param {Array} deleted Array of deleted keys in selection.
 */
   return Control;
});
