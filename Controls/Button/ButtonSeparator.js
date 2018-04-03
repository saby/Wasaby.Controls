define('Controls/Button/ButtonSeparator', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Button/ButtonSeparator/ButtonSeparator',
   'WS.Data/Type/descriptor',
   'css!Controls/Button/ButtonSeparator/ButtonSeparator'
], function(Control, IoC, template, types) {
   'use strict';

   /**
    * Control showing the separator button.
    * @class Controls/Button/ButtonSeparator
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @name Controls/Button/ButtonSeparator#singleClick
    * @cfg {Boolean} The ability to send a single event when icon was clicked. Event name is iconClick.
    */

   /**
    * @name Controls/Button/ButtonSeparator#style
    * @cfg {String} Icon display style.
    * @variant Accent Icon will be default.
    * @variant Additional Icon will be non accented.
    * @variant Main Icon will be accented.
    */

   /**
    * @name Controls/Button/ButtonSeparator#value
    * @cfg {Boolean} If value is true, that opening icon will be displaying, else closing icon will be displaying.
    */

   /**
    * @name Controls/Button/ButtonSeparator#bold
    * @cfg {Boolean} If value is true, that icon is bold, else icon isn't bold.
    */

   var _private = {
      iconChangedValue: function (self, options) {
         if (options.value) {
            self._icon = 'icon-' + (options.bold ? 'MarkCollapseBold ':'CollapseLight ') + 'icon-16';
         }else {
            self._icon = 'icon-' + (options.bold ? 'MarkExpandBold ':'ExpandLight ') + 'icon-16';
         }
      }
   };

   var ButtonSeparator = Control.extend({
      _template: template,

      _beforeMount: function (options) {
         _private.iconChangedValue(this, options);
      },

      _beforeUpdate: function (newOptions) {
         _private.iconChangedValue(this, newOptions);
      },

      iconClickHandler: function (e) {
         if(this._options.singleClick){
            e.stopPropagation();
            this._notify('iconClick');
         }
      }
   });

   ButtonSeparator.getOptionTypes =  function getOptionTypes() {
      return {
         singleClick: types(Boolean),
         bold: types(Boolean),
         style: types(String).oneOf([
            'Accent',
            'Additional',
            'Main'
         ]),
         value: types(Boolean)
      }
   };

   ButtonSeparator.getDefaultOptions = function() {
      return {
         style: 'Accent',
         value: false,
         singleClick: false,
         bold: false
      };
   };

   ButtonSeparator._private = _private;

   return ButtonSeparator;
});
