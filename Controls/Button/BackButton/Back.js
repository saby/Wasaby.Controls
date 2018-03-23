define('Controls/Button/BackButton/Back', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Button/BackButton/Back',
   'css!Controls/Button/BackButton/Back'
], function(Control, IoC, template) {

   /**
    * Кнопка "Назад"
    * @class Controls/Button/Back
    * @extends Controls/Control
    * @mixes Controls/Button/interface/ICaption
    * @mixes Controls/interface/ITooltip
    * @mixes Controls/Button/interface/IClick
    * @control
    * @public
    * @category Button
    */

   var BackButton = Control.extend({
      _template: template
   });

   return BackButton;

});