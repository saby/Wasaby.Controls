/**
 * Created by ia.kapustin on 27.09.2018.
 */
define('Controls/Selector/Lookup/Link', [
   'Core/Control',
   'wml!Controls/Selector/Lookup/Link/LookUp_Link',
   'css!theme?Controls/Selector/Lookup/Link/LookUp_Link'
], function(Control, template) {
   'use strict';

   /**
    * Link for use in Selector/Lookup
    *
    * @mixes Controls/interface/ICaption
    * @mixes Controls/Selector/Lookup/Link/LookupLinkStyles
    * @control
    * @public
    * @author Капустин И.А.
    */

   return Control.extend({
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
});
