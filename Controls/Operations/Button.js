define('Controls/Operations/Button', [
   'Core/Control',
   'wml!Controls/Operations/Button/Button',
   'css!theme?Controls/Operations/Button/Button'
], function(Control, template) {
   'use strict';

   /**
    * Control for changing the extensibility of the "Controls/Operations/Panel".
    *
    * @class Controls/Operations/Button
    * @extends Core/Control
    * @mixes Controls/interface/IExpandable
    * @control
    * @author Зайцев А.С.
    * @public
    *
    * @css @width_OperationsButton
    * @css @height_OperationsButton
    * @css @color_OperationsButton__icon
    * @css @color_OperationsButton__icon_hovered
    * @css @color_OperationsButton__icon_readonly
    * @css @font-size_OperationsButton__icon
    */

   return Control.extend({
      _template: template,

      _onClick: function() {
         this._notify('expandedChanged', [!this._options.expanded]);
      }
   });
});
