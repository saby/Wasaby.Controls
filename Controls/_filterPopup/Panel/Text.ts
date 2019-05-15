import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/Panel/Text/Text');
import 'css!theme?Controls/filterPopup';

   /**
    * Control text with cross
    * @class Controls/_filterPopup/Panel/Text
    * @extends Core/Control
    * @control
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/_filterPopup/Panel/Text#caption
    * @cfg {Object} Caption
    */



   var Text = Control.extend({
      _template: template,

      _afterMount: function() {
         this._notify('valueChanged', [true]);
      },

      _resetHandler: function() {
         this._notify('visibilityChanged', [false]);
      }

   });

   Text.getDefaultOptions = function() {
      return {
         value: true
      };
   };

   export = Text;


