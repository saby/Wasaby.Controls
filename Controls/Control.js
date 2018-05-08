define('Controls/Control', [
], function() {

   /**
    * Basic control class.
    * @class Controls/Control
    * @control
    * @public
    */



   /**
    * @name Controls/Control#readOnly
    * @cfg {Boolean} Indicates whether control will react to user actions.
    */

   /**
    * Sets focus on a component.
    * @function Controls/Control#focus
    */

   /**
    * Moves focus from control to body.
    * @function Controls/Control#blur
    */


   /**
    * This method is called right before control is mounted to DOM.
    * Runs on both server and client side. The last method that runs on server.
    * Runs only once in a component's lifecycle.
    *
    * At this stage, you can set component's state based on received options.
    *
    * @function Controls/Control#_beforeMount
    * @param {Object} options
    * @param {Object} context
    * @param {Object} receivedState
    * @private
    */

   /**
    * This method is called right after control was mounted to DOM.
    * Runs only on client side.
    * Runs only once in a component's lifecycle.
    *
    * At this stage, you can access DOM elements and this._children,
    * run asynchronous operations, and rerender component if necessary.
    *
    * @function Controls/Control#_afterMount
    * @private
    */

   /**
    * This method is called right before new options are applied to control.
    * Runs only on client side.
    * Runs many times during component's lifecycle.
    *
    * At this stage, you can set component's state based on new options (similar to _beforeMount).
    *
    * @function Controls/Control#_beforeUpdate
    * @param {Object} newOptions - предыдущие опции компонента
    * @private
    */

   /**
    * This method is called right after control was updated.
    * Always happens after _beforeUpdate.
    * Runs only on client side.
    * Runs many times during component's lifecycle.
    *
    * At this stage, you can access DOM elements and this._children (similar to _afterMount).
    *
    * @function Controls/Control#_afterUpdate
    * @param {Object} oldOptions
    * @private
    */

   /**
    * This method is called right before a component is removed from DOM.
    * Runs on both server and client side.
    *
    * @function Controls/Control#_beforeUnmount
    * @private
    */


   /**
    * Force update component's template.
    *
    * @function Controls/Control#_forceUpdate
    * @private
    */

   /**
    * @event Controls/Control#focus Occurs when component becomes focused.
    */

   /**
    * @event Controls/Control#blur Occurs when component loses focus.
    */

   /**
    * @event Controls/Control#focusIn Occurs when child becomes focused.
    */

   /**
    * @event Controls/Control#focusOut Occurs when child control loses focus.
    */

});
