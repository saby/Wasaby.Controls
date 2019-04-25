import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/Panel/Link/Link');
import 'css!theme?Controls/filterPopup';
   /**
    * Control filter link
    * @class Controls/_filterPopup/Panel/Link
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @name Controls/_filterPopup/Panel/Link#caption
    * @cfg {Object} Caption
    */



   var FilterLink = Control.extend({
      _template: template,

      _clickHandler: function() {
         this._notify('visibilityChanged', [true]);
      }

   });

   export = FilterLink;

