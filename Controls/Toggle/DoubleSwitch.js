define('Controls/Toggle/DoubleSwitch', [
   'Core/Control',
   'tmpl!Controls/Toggle/DoubleSwitch/DoubleSwitch',
   'tmpl!Controls/Toggle/DoubleSwitch/resources/DoubleSwitchToggle',
   'tmpl!Controls/Toggle/DoubleSwitch/resources/DoubleSwitchText',
   'WS.Data/Type/descriptor',
   'css!Controls/Toggle/DoubleSwitch/DoubleSwitch',
   'css!Controls/Toggle/resources/SwitchCircle/SwitchCircle'
], function(Control, template, toggleTemplate, textTemplate, types) {

   /**
    * Double switch (switch between two values).
    *
    * <a href="/materials/demo-ws4-switchers">Демо-пример</a>.
    * <u>Внимание</u>: временно демо-пример размещён на test-wi.sbis.ru.
    * Для авторизации воспользуйтесь связкой логин/пароль как "Демо_тензор"/"Демо123".
    *
    * @class Controls/Toggle/DoubleSwitch
    * @extends Core/Control
    * @mixes Controls/Toggle/interface/ICheckable
    * @mixes Controls/interface/ITooltip
    * @control
    * @public
    * @category Toggle
    */

   /**
    * @name Controls/Toggle/DoubleSwitch#captions
    * @cfg {Array.<String>} Array of captions.
    */

   /**
    * @name Controls/Toggle/DoubleSwitch#orientation
    * @cfg {String} Display type.
    * @variant horizontal Horizontal switch.
    * @variant vertical Vertical switch.
    */
   var _private = {
      checkCaptions: function(captions) {
         if (captions.length !== 2) {
            throw new Error('You must set 2 captions.');
         }
      },

      notifyChanged: function(self) {
         self._notify('valueChanged', [!self._options.value]);
      }
   };


   var Switch = Control.extend({
      _template: template,
      _toggleTemplate: toggleTemplate,
      _textTemplate: textTemplate,
      _toggleHoverState: false,

      constructor: function(options) {
         Switch.superclass.constructor.apply(this, arguments);
         _private.checkCaptions(options.captions);
      },

      _clickTextHandler: function(e, _nextValue) {
         if (this._options.value !== _nextValue && !this._options.readOnly) {
            _private.notifyChanged(this);
            this._toggleSwitchHoverState(false);
         }
      },

      _clickToggleHandler: function(e) {
         if (!this._options.readOnly) {
            _private.notifyChanged(this);
         }
      },

      _beforeUpdate: function(newOptions) {
         _private.checkCaptions(newOptions.captions);
      },

      _toggleSwitchHoverState: function(e, toggledState) {
         if (toggledState) {
            this._toggleHoverState = true;
         } else {
            this._toggleHoverState = false;
         }
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
