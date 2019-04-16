import Control = require('Core/Control');
import template = require('wml!Controls/Filter/Button/Panel/Link/Link');
import 'css!theme?Controls/Filter/Button/Panel/Link/Link';
   /**
    * Control filter link
    * @class Controls/Filter/Button/Panel/Link
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @name Controls/Filter/Button/Panel/Link#caption
    * @cfg {Object} Caption
    */

   

   var FilterLink = Control.extend({
      _template: template,

      _clickHandler: function() {
         this._notify('visibilityChanged', [true]);
      }

   });

   export = FilterLink;

