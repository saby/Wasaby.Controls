define('Controls/Button/Back', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Button/BackButton/Back',
   'WS.Data/Type/descriptor',
   'css!Controls/Button/BackButton/Back'
], function(Control, IoC, template, types) {

   /**
    * Button "Back"
    * @class Controls/Button/Back
    * @extends Controls/Control
    * @mixes Controls/Button/interface/ICaption
    * @mixes Controls/interface/ITooltip
    * @mixes Controls/Button/interface/IClick
    * @control
    * @public
    * @category Button
    */

   /**
    * @name Controls/Button#style
    * @cfg {String} button display style
    * @variant primary button will be accented
    * @variant default button will be default
    */

   /**
    * @name Controls/Button#size
    * @cfg {String} button size
    * @variant s button has small size
    * @variant m button has middle size
    * @variant l button has large size
    */

   /**
    * @name Controls/Button#caption
    * @cfg {String} text of caption
    */

   /**
    * @name Controls/Button#inHeader
    * @cfg {Boolean} a special style for the component when it is in the header
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
         ]),
         inHeader: types(Boolean)
      }
   };

   BackButton.getDefaultOptions = function() {
      return {
         style: 'default',
         size: 'm'
      };
   };

   return BackButton;

});