
define('Controls/Popup/Templates/BaseTemplate',
   [
      'Core/Control',
      'wml!Controls/Popup/Templates/BaseTemplate'
   ],
   function(Control, template) {
      'use strict';

      /**
       * Layout of the popup template.
       *
       * @class Controls/Popup/Templates/BaseTemplate
       * @extends Core/Control
       *
       * @public
       * @author Красильников А.С.
       * @demo Controls-demo/InfoBox/InfoBox
       */

      var DialogTemplate = Control.extend({
         _template: template
      });
      return DialogTemplate;

   });

/**
 * @name Controls/Popup/Templates/BaseTemplate#contentTemplate
 * @cfg {String} contentTemplate Main content.
 */

/**
 * @name Controls/Popup/Templates/BaseTemplate#closeButtonVisibility
 * @cfg {Boolean} closeButtonVisibility Determines whether display of the close button.
 */

/**
 * @name Controls/Popup/Templates/BaseTemplate#closeButtonStyle
 * @cfg {String} closeButtonStyle Close button display style.
 */
