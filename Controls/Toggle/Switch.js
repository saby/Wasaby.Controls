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
   var _private = {
      isDouble: function(captions) {
         if (captions.length > 2) {
            throw new Error ('You cannot set more than 2 captions.')
         }
         else {
            return captions.length === 2;
         }
      }
   };

   var Switch = Control.extend({
      _template: template,

      constructor: function (options) {
         Switch.superclass.constructor.apply(this, arguments);
         this._isDoubleSwitcher = _private.isDouble(options.captions);
      },

      _clickHandler: function (e, checked) {
         //если дабл свитчер и кликнутый заголовок, то не надо переключаться
         if (!this._isDoubleSwitcher || this._options.checked !== checked) {
            this._notify('checkedChanged', !this._options.checked);
         }
      },

      _beforeUpdate: function (newOptions) {
         this._isDoubleSwitcher = _private.isDouble(newOptions.captions);
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

   Switch._private = _private;

   return Switch;
});