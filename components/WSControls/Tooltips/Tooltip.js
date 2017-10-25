define('js!WSControls/Tooltips/Tooltip',
   [
      'Core/Control',
      'tmpl!WSControls/Tooltips/Tooltip',
      'Core/detection',
      'js!SBIS3.CONTROLS.Utils.GetTextWidth'
   ],
   function(Control, template, detection, getTextWidth) {

      'use strict';

      var Tooltip = Control.extend({
         _controlName: 'WSControls/Tooltips/Tooltip',

         _template: template,

         _mouseenterHandler: function(event) {
            var target = event.target.children[0];
            this._tooltip = this._calcTooltip(target.scrollWidth, target.clientWidth, this._options);
         },

         _calcTooltip: function(scrollWidth, clientWidth, options) {
            var
               tooltip = options.tooltip,
               text = options.text;

            if (detection.isIE) {
               scrollWidth = getTextWidth(text);
            }

            return scrollWidth > clientWidth ? text : tooltip;
         }
      });

      return Tooltip;
   }
);