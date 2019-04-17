import Control = require('Core/Control');
import template = require('wml!Controls/_operations/Button/Button');


   /**
    * Control for changing the extensibility of the "Controls/_operations/Panel".
    *
    * @class Controls/_operations/Button
    * @extends Core/Control
    * @mixes Controls/interface/IExpandable
    * @control
    * @author Авраменко А.С.
    * @public
    *
    * @css @width_OperationsButton Width of the button.
    * @css @height_OperationsButton Height of the button.
    * @css @thickness_OperationsButton-separator Thickness of the separator between the button and the rest of the content.
    * @css @height_OperationsButton-separator Height of the separator between the button and the rest of the content.
    * @css @color_OperationsButton-icon Color of the icon.
    * @css @color_OperationsButton-icon_hovered Color of the hovered icon.
    * @css @color_OperationsButton-icon_active Color of the active icon.
    * @css @color_OperationsButton-separator Color of the separator between the button and the rest of the content.
    * @css @font-size_OperationsButton-icon Font size of the icon.
    * @css @font-family_OperationsButton-icon Font family of the icon.
    */


   var Button = Control.extend({
      _template: template,

      _onClick: function() {
         this._notify('expandedChanged', [!this._options.expanded]);
      }
   });
   Button._theme = ['Controls/operations'];
   export = Button;

