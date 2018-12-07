define('Controls/Popup/Templates/Stack/StackTemplate',
   [
      'Core/Control',
      'wml!Controls/Popup/Templates/Stack/StackTemplate',
      'css!theme?Controls/Popup/Templates/Stack/StackTemplate'
   ],
   function(Control, template) {
      'use strict';

      var DialogTemplate = Control.extend({

         /**
          * Base template of stack panel. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/wasaby/components/openers/#template-standart See more}.
          * @class Controls/Popup/Templates/Stack/StackTemplate
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников А.С.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#caption
          * @cfg {String} Header title.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#captionStyle
          * @cfg {String} Caption display style.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#headerContentTemplate
          * @cfg {Content} The content between the header and the cross closure.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#bodyContentTemplate
          * @cfg {Content} Main content.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#footerContentTemplate
          * @cfg {Content} Content at the bottom of the stack panel.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#closeButtonVisibility
          * @cfg {Boolean} Determines whether display of the close button.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#maximized
          * @cfg {Boolean} Determines the initial state in which there is a panel at the opening: folded/deployed.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#showMaximizeButton
          * @cfg {Boolean} Determines the display maximize button.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#closeButtonStyle
          * @cfg {String} Close button display style.
          */

         _template: template,

         /**
          * Закрыть всплывающее окно
          * @function Controls/Popup/Templates/Stack/StackTemplate#close
          */
         close: function() {
            this._notify('close', [], {bubbling: true});
         },
         changeMaximizedState: function() {

            /**
             * @event maximized
             * Occurs when you click the expand / collapse button of the panels.
             */
            this._notify('maximized', [!this._options.maximized], {bubbling: true});
         }
      });

      DialogTemplate.getDefaultOptions = function() {
         return {
            captionStyle: 'default'
         };
      };

      return DialogTemplate;
   }
);

/**
 * @name Controls/Popup/Templates/Stack/StackTemplate#close
 * Close popup.
 */

