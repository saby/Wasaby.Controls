/**
 * Created by ia.kapustin on 27.09.2018.
 */
import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/Lookup/Link/LookUp_Link');
import 'css!theme?Controls/lookup';


   /**
    * Link for use in Selector/Lookup
    *
    * @class Controls/_lookup/Lookup/Link
    * @mixes Controls/_interface/ICaption
    * @mixes Controls/_lookup/Lookup/Link/LookupLinkStyles
    * @control
    * @public
    * @author Капустин И.А.
    */

   export = Control.extend({
      _template: template,

      _keyUpHandler: function(e) {
         if (e.nativeEvent.keyCode === 13 && !this._options.readOnly) {
            this._notify('click');
         }
      },

      _clickHandler: function(e) {
         if (this._options.readOnly) {
            e.stopPropagation();
         }
      }
   });

