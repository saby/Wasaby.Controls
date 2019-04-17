import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/Stack/Stack');
import Env = require('Env/Env');
import 'css!theme?Controls/_popupTemplate/Stack/Stack';


      var DialogTemplate = Control.extend({

         /**
          * Base template of stack panel. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/#template-standart See more}.
          * @class Controls/Popup/Templates/Stack/StackTemplate
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников А.С.
          * @mixes Controls/Popup/Templates/Stack/StackTemplateStyles
          * @demo Controls-demo/Popup/Templates/StackTemplatePG
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#headingCaption
          * @cfg {String} Header title.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#headingStyle
          * @cfg {String} Caption display style.
          * @variant secondary
          * @variant primary
          * @variant info
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#headerContentTemplate
          * @cfg {function|String} The content between the header and the cross closure.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#bodyContentTemplate
          * @cfg {function|String} Main content.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#footerContentTemplate
          * @cfg {function|String} Content at the bottom of the stack panel.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#closeButtonVisibility
          * @cfg {Boolean} Determines whether display of the close button.
          */


         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#maximizeButtonVisibility
          * @cfg {Boolean} Determines the display maximize button.
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#closeButtonViewMode
          * @cfg {String} Close button display style.
          * @variant default
          * @variant light
          * @variant primary
          */

         _template: template,
         _beforeMount: function(options) {
            if (options.contentArea) {
               Env.IoC.resolve('ILogger').warn('StackTemplate', 'Используется устаревшая опция contentArea, используйте bodyContentTemplate');
            }
            if (options.caption) {
               Env.IoC.resolve('ILogger').warn('StackTemplate', 'Используется устаревшая опция caption, используйте headingCaption');
            }
            if (options.captionStyle) {
               Env.IoC.resolve('ILogger').warn('StackTemplate', 'Используется устаревшая опция captionStyle, используйте headingStyle');
            }
            if (options.showMaximizeButton) {
               Env.IoC.resolve('ILogger').warn('StackTemplate', 'Используется устаревшая опция showMaximizeButton, используйте maximizeButtonVisibility');
            }
            if (options.topArea) {
               Env.IoC.resolve('ILogger').warn('StackTemplate', 'Используется устаревшая опция topArea, используйте headerContentTemplate');
            }

            if (options.bottomArea) {
               Env.IoC.resolve('ILogger').warn('StackTemplate', 'Используется устаревшая опция bottomArea, используйте footerContentTemplate');
            }
            if (options.closeButtonStyle) {
               Env.IoC.resolve('ILogger').warn('StackTemplate', 'Используется устаревшая опция closeButtonStyle, используйте closeButtonViewMode');
            }
            this._updateMaximizeButtonTitle(options.maximized);
         },

         _beforeUpdate: function(newOptions) {
            if (this._options.maximized !== newOptions.maximized) {
               this._updateMaximizeButtonTitle(newOptions.maximized);
            }
         },

         _afterUpdate: function(oldOptions) {
            if (this._options.maximized !== oldOptions.maximized) {
               this._notify('controlResize', [], { bubbling: true });
            }
         },

         _updateMaximizeButtonTitle: function(maximized) {
            this._maximizeButtonTitle = maximized ? rk('Свернуть') : rk('Развернуть');
         },

         /**
          * Закрыть всплывающее окно
          * @function Controls/Popup/Templates/Stack/StackTemplate#close
          */
         close: function() {
            this._notify('close', [], { bubbling: true });
         },
         changeMaximizedState: function() {
            /**
             * @event maximized
             * Occurs when you click the expand / collapse button of the panels.
             */
            this._notify('maximized', [!this._options.maximized], { bubbling: true });
         }
      });

      DialogTemplate.getDefaultOptions = function() {
         return {
            headingStyle: 'secondary',
            closeButtonVisibility: true
         };
      };

      export = DialogTemplate;


/**
 * @name Controls/Popup/Templates/Stack/StackTemplate#close
 * Close popup.
 */
