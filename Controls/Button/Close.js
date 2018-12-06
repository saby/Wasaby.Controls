define('Controls/Button/Close', [
   'Core/Control',
   'wml!Controls/Button/Close',
   'css!theme?Controls/Button/Close'
], function(Control, template) {

   /**
    * Specialized type of button for closing windows.
    *
    * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
    *
    *
    * @class Controls/Button/Close
    * @extends Core/Control
    * @control
    * @public
    * @author Михайловский Д.С.
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
         style: 'default',
         size: 'l'
      };
   };

   return CloseButton;
});
