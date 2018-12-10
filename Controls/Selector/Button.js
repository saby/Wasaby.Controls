define('Controls/Selector/Button', ['Core/Control', 'wml!Controls/Selector/Button/SelectorButton'], function(Control, template) {
   'use strict';

   /**
    * Button link with the specified text, on clicking on which a selection window opens.
    * Here you can see <a href="/materials/demo-ws4-engine-selector-button">demo-example</a>.
    *
    * @class Controls/Selector/Button
    * @mixes Controls/interface/ICaption
    * @mixes Controls/interface/ISelectedCollection
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IMultiSelectable
    * @mixes Controls/interface/ISource
    * @extends Core/Control
    * @control
    * @public
    * @demo Controls-demo/Buttons/SelectorButtonPG
    *
    * @css @spacing_SelectorButton-between-buttonMore-buttonReset Spacing between button more and button reset.
    */

   return Control.extend({
      _template: template
   });
});
