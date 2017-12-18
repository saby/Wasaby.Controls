define('js!Controls/Toggle/Switch', [
   'Core/Control',
   'tmpl!Controls/Toggle/Switch/Switch',
   'WS.Data/Type/descriptor',
   'css!Controls/Toggle/Switch/Switch'
], function (Control, template, types) {

   /**
    * Контрол, отображающий переключатель
    * @class Controls/Toggle/Switch
    * @extends Controls/Control
    * @mixes Controls/Toggle/interface/ICheckable
    * @mixes Controls/interface/ITooltip
    * @control
    * @public
    * @category Toggle
    */

   /**
    * @name Controls/Toggle/Switch#captions
    * @cfg {Array.<String>} Массив заголовков
    */

   /**
    * @name Controls/Toggle/Switch#orientation
    * @cfg {String} Способ отображения
    * @variant horizontal Горизонтальная ориентация
    * @variant vertical Вертикальная ориентация
    */

   var Switch = Control.extend({
      _template: template,

      constructor: function (options) {
         Switch.superclass.constructor.apply(this, arguments);
         if (options.captions.length > 2) {
            throw new Error ('You cannot set more than 2 captions.')
         }
      },

      _clickHandler: function (e, clickedElement) {
         //если дабл свитчер и кликнутый заголовок, то не надо переключаться.
         //если простой свитчер, то всегда переключаться, вне зависимости кликнутый заголовок или нет.
         if (!this._isDouble(this._options.captions) || this._options.checked !== (clickedElement === "textOn" ? true : false) || clickedElement==="Toggle") {
            this._notify('checkedChanged', !this._options.checked);
         }
      },

      _isDouble: function(captions) {
         return captions.length === 2;
      }
   });

   Switch.getDefaultOptions = function getDefaultOptions() {
      return {
         checked: false
      };
   };

   Switch.getOptionTypes = function getOptionTypes() {
      return {
         checked: types(Boolean),
         orientation: types(String).oneOf([
            'vertical',
            'horizontal'
         ]),
         captions: types(Object)
      };
   };

   return Switch;
});