import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/Panel/Text/Text');
import 'css!theme?Controls/filterPopup';

   /**
    * Control text with cross
    * @class Controls/_filterPopup/Panel/FilterText
    * @extends Controls/Control
    * @control
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/_filterPopup/Panel/FilterText#caption
    * @cfg {Object} Caption
    */



   var FilterText = Control.extend({
      _template: template,

      _afterMount: function() {
         this._notify('valueChanged', [true]);
      },

      _resetHandler: function() {
         this._notify('visibilityChanged', [false]);
      }

   });

   FilterText.getDefaultOptions = function() {
      return {
         value: true
      };
   };

   export = FilterText;


