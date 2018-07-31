define('Controls/Button/Back', [
   'Core/Control',
   'tmpl!Controls/Button/BackButton/Back',
   'WS.Data/Type/descriptor',
   'css!Controls/Button/BackButton/Back'
], function(Control, template, types) {

   /**
    * Back button with support two display styles and three size.
    *
    * <a href="/materials/demo-ws4-header-separator">Демо-пример</a>.
    *
    * @class Controls/Button/Back
    * @extends Core/Control
    * @mixes Controls/Button/interface/ICaption
    * @mixes Controls/Button/interface/IClick
    * @control
    * @public
    * @category Button
    *
    * @mixes Controls/Button/BackButton/BackStyles
    *
    * @demo Controls-demo/Buttons/BackButton/backDemo
    */

   /**
    * @name Controls/Button/Back#style
    * @cfg {String} Back button display style.
    * @variant primary Primary display style.
    * @variant default Default display style. It is the default value.
    */

   /**
    * @name Controls/Button/Back#size
    * @cfg {String} Back button size.
    * @variant s Small button size.
    * @variant m Medium button size. It is the default value.
    * @variant l Large button size.
    */

   /**
    * @name Controls/Button#caption
    * @cfg {String} Caption text.
    */

   var BackButton = Control.extend({
      _template: template
   });

   BackButton.getOptionTypes =  function getOptionTypes() {
      return {
         caption: types(String).required(),
         style: types(String).oneOf([
            'primary',
            'default'
         ]),
         size: types(String).oneOf([
            's',
            'm',
            'l'
         ])
      };
   };

   BackButton.getDefaultOptions = function() {
      return {
         style: 'default',
         size: 'm'
      };
   };

   return BackButton;

});
