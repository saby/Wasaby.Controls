define('Controls/interface/IClick', [
], function() {

   /**
    * Click event interface.
    *
    * @interface Controls/interface/IClick
    * @public
    */

   /**
    * @event Controls/interface/IClick#click Occurs when item was clicked.
    * @remark If button with readOnly set to true then event does not bubble.
    * @example
    * Button with style 'primary' viewMode 'button' and icon 'icon-Send'. If user click to button then document send.
    * <pre>
    *    <Controls.buttons:Button on:click="_clickHandler()" icon="icon-Send" style="primary" viewMode="button"/>
    * </pre>
    * <pre>
    *    Control.extend({
    *       ...
    *       _clickHandler(e) {
    *          this.sendDocument();
    *       }
    *       ...
    *    });
    * </pre>
    */

});
