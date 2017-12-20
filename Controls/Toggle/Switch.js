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
   var _private = {
      doubleSwitcherClickHandler: function (self, clickedElement) {
         //если дабл свитчер и кликнутый заголовок, то не надо переключаться.
         if (self._options.value !== (clickedElement === "textOn" ? true : false)) {
            this.notifyChangeValue(self);
         }
      },

      singleSwitcherClickHandler: function (self) {
         this.notifyChangeValue(self);
      },

      notifyChangeValue: function (self) {
         self._notify('changeValue', !self._options.value);
      }
   };


   var Switch = Control.extend({
      _template: template,

      constructor: function (options) {
         Switch.superclass.constructor.apply(this, arguments);
         if (options.captions.length > 2) {
            throw new Error ('You cannot set more than 2 captions.')
         }
      },

      _clickTextHandler: function (e, clickedElement) {
         if (this._isDouble()) {
            _private.doubleSwitcherClickHandler(this,clickedElement);
         }
         else{
            _private.singleSwitcherClickHandler(this);
         }
      },

      _clickToggleHandler: function (e) {
         _private.notifyChangeValue(this);
      },

      _isDouble: function() {
         return this._options.captions.length === 2;
      }
   });

   Switch.getDefaultOptions = function getDefaultOptions() {
      return {
         value: false
      };
   };

   Switch.getOptionTypes = function getOptionTypes() {
      return {
         value: types(Boolean),
         orientation: types(String).oneOf([
            'vertical',
            'horizontal'
         ]),
         //TODO: сделать проверку на массив когда будет сделана задача https://online.sbis.ru/opendoc.html?guid=2016ea16-ed0d-4413-82e5-47c3aeaeac59
         captions: types(Object)
      };
   };

   Switch._private = _private;

   return Switch;
});