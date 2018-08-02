define('Controls/Button/Close', [
   'Core/Control',
   'tmpl!Controls/Button/Close',
   'css!Controls/Button/Close'
], function(Control, template) {

   /**
    * Close button with support three display styles.
    *
    * <a href="/materials/demo-ws4-buttons">Демо-пример</a>.
    *
    *
    * @class Controls/Button/Close
    * @extends Core/Control
    * @control
    * @public
    * @demo Controls-demo/Buttons/Close/CloseDemo
    * @mixes Controls/Button/interface/IClick
    *
    */

   /**
    * @name Controls/Button/Close#style
    * @cfg {String} Close button display style.
    * @variant primary Primary display style.
    * @variant default Default display style.
    * @variant light Light display style.
    */

   var CloseButton = Control.extend({
      _template: template
   });

   CloseButton.getDefaultOptions = function() {
      return {
         style: 'default'
      };
   };

   return CloseButton;
});
