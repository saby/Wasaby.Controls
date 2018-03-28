define('Controls/Button/Back', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Button/BackButton/Back',
   'WS.Data/Type/descriptor',
   'css!Controls/Button/BackButton/Back'
], function(Control, IoC, template, types) {

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

   /**
    * @name Controls/Button#style
    * @cfg {String} Внешний вид кнопки
    * @variant primary красная стрелка, синий заголовок в теме онлайна
    * @variant default синяя стрелка, красный заголовок в теме онлайна
    */

   /**
    * @name Controls/Button#size
    * @cfg {String} Размер кнопки
    * @variant s размер шрифта 20px
    * @variant default размер шрифта 18px
    * @variant l размер шрифта 15px
    */

   /**
    * @name Controls/Button#caption
    * @cfg {String} Заголовок
    */

   /**
    * @name Controls/Button#inHeader
    * @cfg {Boolean} Специальный стиль для заголовка в шапке
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
         counterLocation: types(String).oneOf([
            's',
            'default',
            'l'
         ])
      }
   };

   BackButton.getDefaultOptions = function() {
      return {
         style: 'default',
         size: 'default'
      };
   };

   return BackButton;

});