define('Controls/List/VirtualScroll', ['Controls/_list/VirtualScroll'], function(Control) {
/** **********************************************
     *
     *    Event handlers
     *
     ********************************************** */
   /**
     * Updates window bounds when reaching top or bottom of the list.
     *
     * @param position (string) 'top' or 'bottom'
     * @returns {{window: (*|{start: number, end: number}), topChange: number, bottomChange: number}}
     */
   /**
     * Add more items to the end of virtual window.
     *
     * @returns {{topChange: number, bottomChange: number}}
     * @private
     */
   /**
     * Add more items to the beginning of virtual window.
     *
     * @returns {{topChange: number, bottomChange: number}}
     * @private
     */
   /**
     * Recalculates virtual page after item was removed from the dataset.
     * TODO: resize window if becomes too small
     *
     * @param idx - index of removed item
     */
   /**
     * Recalculates virtual page after item was added to the dataset.
     * TODO: resize window if becomes too large
     *
     * @param idx - index of added item
     */
   /**
     * Return virtual window bounds.
     *
     * @returns {{start: number, end: number}}
     */
   return Control;
});
