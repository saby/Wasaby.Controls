define('Controls/Selector/Button', ['Core/Control', 'wml!Controls/Selector/Button/SelectorButton'], function(Control, template) {
   'use strict';

   /**
    * Button link with the specified text, on clicking on which a selection window opens.
    * Here you can see <a href="/materials/demo-ws4-engine-selector-button">demo-example</a>.
    *
    * @class Controls/Selector/Button
    * @mixes Controls/interface/ICaption
    * @mixes Controls/interface/ISelectedCollection
    * @mixes Controls/interface/ISelectorDialog
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IMultiSelectable
    * @mixes Controls/interface/ISource
    * @extends Core/Control
    * @control
    * @public
    * @author Капустин И.А.
    * @demo Controls-demo/Buttons/SelectorButtonPG
    *
    * @css @spacing_SelectorButton-between-buttonMore-buttonReset Spacing between button more and button reset.
    * @css @min-height_SelectorButton Minimum selector button height
    * @css @color_Selectorbutton-single-item The color of the selected item in single mode.
    * @css @color_Selectorbutton-single-item_hovered The color when the hover of the selected item in single mode.
    * @css @color_Selectorbutton-single-item_active The color when the active of the selected item in single mode.
    */

   /**
    * @name Controls/Selector/Button#style
    * @cfg {Enum} Button display style.
    * @variant primary
    * @variant success
    * @variant warning
    * @variant danger
    * @variant info
    * @variant secondary
    * @variant default
    * @default secondary
   */

   return Control.extend({
      _template: template
   });
});
