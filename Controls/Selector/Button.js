define('Controls/Selector/Button', ['Core/Control', 'wml!Controls/Selector/Button/SelectorButton'], function(Control, template) {
   'use strict';

   /**
    * Button link with the specified text, on clicking on which a selection window opens.
    *
    * @class Controls/Selector/Button
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
