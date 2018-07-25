define('Controls/Operations/Button', [
   'Core/Control',
   'tmpl!Controls/Operations/Button/Button',
   'css!Controls/Operations/Button/Button'
], function(Control, template) {
   'use strict';

   /**
    * Control for changing the extensibility of the "Controls/Operations/Panel".
    *
    * @class Controls/Operations/Button
    * @extends Core/Control
    * @mixes Controls/List/interface/IExpandable
    * @control
    * @public
    */

   return Control.extend({
      _template: template,

      _onClick: function() {
         this._notify('expandedChanged', [!this._options.expanded]);
      }
   });
});
