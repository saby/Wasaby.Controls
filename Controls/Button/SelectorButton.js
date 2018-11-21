define('Controls/Button/SelectorButton', ['Core/Control', 'wml!Controls/Button/SelectorButton/SelectorButton'], function(Control, template) {
   'use strict';

   /**
    * Button link with the specified text, on clicking on which a selection window opens.
    *
    * @class Controls/Button/SelectorButton
    * @extends Core/Control
    * @control
    * @public
    *
    * @css @spacing_SelectorButton-between-buttonMore-buttonReset Spacing between button more and button reset.
    */

   return Control.extend({
      _template: template
   });
});
