define('Controls/Button/Back', [
   'Core/Control',
   'tmpl!Controls/Button/BackButton/Back',
   'WS.Data/Type/descriptor',
   'css!Controls/Button/BackButton/Back'
], function(Control, template, types) {

   /**
    * Button "Back".
    * @class Controls/Button/Back
    * @extends Core/Control
    * @mixes Controls/Button/interface/ICaption
    * @mixes Controls/Button/interface/IClick
    * @control
    * @public
    * @category Button
    */

   /**
    * @name Controls/Button/Back#style
    * @cfg {String} Button display style.
    * @variant primary Button will be accented.
    * @variant default Button will be default.
    */

   /**
    * @name Controls/Button/Back#size
    * @cfg {String} Button size
    * @variant s Button has small size.
    * @variant m Button has middle size.
    * @variant l Button has large size.
    */

   /**
    * @name Controls/Button#caption
    * @cfg {String} Text of caption.
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
