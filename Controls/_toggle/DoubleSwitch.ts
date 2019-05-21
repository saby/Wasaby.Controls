import Control = require('Core/Control');
import template = require('wml!Controls/_toggle/DoubleSwitch/DoubleSwitch');
import toggleTemplate = require('wml!Controls/_toggle/DoubleSwitch/resources/DoubleSwitchToggle');
import textTemplate = require('wml!Controls/_toggle/DoubleSwitch/resources/DoubleSwitchText');
import entity = require('Types/entity');

   /**
    * Switch with two captions and with support two orientation.
    *
    * <a href="/materials/demo-ws4-switchers">Demo-example</a>.
    *
    * @class Controls/_toggle/DoubleSwitch
    * @extends Core/Control
    * @mixes Controls/_toggle/interface/ICheckable
    * @mixes Controls/_interface/ITooltip
    * @control
    * @public
    * @author Михайловский Д.С.
    * @category Toggle
    *
    * @demo Controls-demo/Switch/DoubleSwitchDemo
    *
    * @mixes Controls/_toggle/resources/Switch/SwitchStyles
    * @mixes Controls/_toggle/resources/DoubleSwitch/DoubleSwitchStyles
    * @mixes Controls/_toggle/resources/SwitchCircle/SwitchCircleStyles
    *
    * @css @line-height_DoubleSwitch_vertical Line-height of vertical double switcher. It's align vertical switch toggle.
    */

   /**
    * @name Controls/_toggle/DoubleSwitch#captions
    * @cfg {Array.<String>} Array of two captions. If caption number is not equal to two, then an error occurs.
    */

   /**
    * @name Controls/_toggle/DoubleSwitch#orientation
    * @cfg {String} Double switch orientation in space.
    * @variant horizontal Horizontal orientation. It is default value.
    * @variant vertical Vertical orientation.
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

      _beforeMount: function(options) {
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

   Switch._theme = [ 'Controls/toggle' ];

   Switch.getOptionTypes = function getOptionTypes() {
      return {
         value: entity.descriptor(Boolean),
         orientation: entity.descriptor(String).oneOf([
            'vertical',
            'horizontal'
         ]),

         //TODO: сделать проверку на массив когда будет сделана задача https://online.sbis.ru/opendoc.html?guid=2016ea16-ed0d-4413-82e5-47c3aeaeac59
         captions: entity.descriptor(Object)
      };
   };

   Switch._private = _private;

   export = Switch;

