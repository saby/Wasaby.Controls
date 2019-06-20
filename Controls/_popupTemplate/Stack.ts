import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/Stack/Stack');
import Env = require('Env/Env');

      var MINIMIZED_STEP_FOR_MAXIMIZED_BUTTON = 100;
      var prepareCloseButton = {'light': 'link', 'popup': 'popup', 'default' : 'toolButton', 'primary': 'toolButton', 'toolButton':'toolButton','link':'link' };

      var DialogTemplate = Control.extend({

         /**
          * Base template of stack panel. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/#template-standart See more}.
          * @class Controls/_popupTemplate/Stack
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников А.С.
          * @mixes Controls/_popupTemplate/Stack/StackTemplateStyles
          * @demo Controls-demo/Popup/Templates/StackTemplatePG
          */

         /**
          * @name Controls/_popupTemplate/Stack#headingCaption
          * @cfg {String} Header title.
          */

         /**
          * @name Controls/_popupTemplate/Stack#headingStyle
          * @cfg {String} Caption display style.
          * @variant secondary
          * @variant primary
          * @variant info
          */

         /**
          * @name Controls/_popupTemplate/Stack#headingCaption
          * @cfg {String} Heading size.
          * @variant s Small text size.
          * @variant m Medium text size.
          * @variant l Large text size.
          * @variant xl Extralarge text size.
          * @default l
          */

         /**
          * @name Controls/_popupTemplate/Stack#headerContentTemplate
          * @cfg {function|String} The content between the header and the cross closure.
          */

         /**
          * @name Controls/_popupTemplate/Stack#bodyContentTemplate
          * @cfg {function|String} Main content.
          */

         /**
          * @name Controls/_popupTemplate/Stack#footerContentTemplate
          * @cfg {function|String} Content at the bottom of the stack panel.
          */

         /**
          * @name Controls/_popupTemplate/Stack#closeButtonVisibility
          * @cfg {Boolean} Determines whether display of the close button.
          */


         /**
          * @name Controls/_popupTemplate/Stack#maximizeButtonVisibility
          * @cfg {Boolean} Determines the display maximize button.
          */

         /**
          * @name Controls/_popupTemplate/Stack#closeButtonViewMode
          * @cfg {String} Close button display style.
          * @variant toolButton
          * @variant link
          * @variant popup
          * @default popup
          */

         /**
          * @name Controls/_popupTemplate/Stack#closeButtonTransparent
          * @cfg {String} Close button transparent.
          * @variant true
          * @variant false
          * @default true
          */

         _template: template,
         _maximizeButtonVisibility: false,
         _closeButtonViewMode: 'popup',
         _beforeMount: function(options) {
            this._maximizeButtonTitle = `${rk('Свернуть')}/${rk('Развернуть')}`;

            if (options.contentArea) {
               Env.IoC.resolve('ILogger').error('StackTemplate', 'Используется устаревшая опция contentArea, используйте bodyContentTemplate');
            }
            if (options.caption) {
               Env.IoC.resolve('ILogger').error('StackTemplate', 'Используется устаревшая опция caption, используйте headingCaption');
            }
            if (options.captionStyle) {
               Env.IoC.resolve('ILogger').error('StackTemplate', 'Используется устаревшая опция captionStyle, используйте headingStyle');
            }
            if (options.showMaximizeButton) {
               Env.IoC.resolve('ILogger').error('StackTemplate', 'Используется устаревшая опция showMaximizeButton, используйте maximizeButtonVisibility');
            }
            if (options.topArea) {
               Env.IoC.resolve('ILogger').error('StackTemplate', 'Используется устаревшая опция topArea, используйте headerContentTemplate');
            }

            if (options.bottomArea) {
               Env.IoC.resolve('ILogger').error('StackTemplate', 'Используется устаревшая опция bottomArea, используйте footerContentTemplate');
            }
            if (options.closeButtonStyle) {
               Env.IoC.resolve('ILogger').error('StackTemplate', 'Используется устаревшая опция closeButtonStyle, используйте closeButtonViewMode');
            }
            if (options.closeButtonViewMode === 'light' || options.closeButtonViewMode === 'default'|| options.closeButtonViewMode === 'primary') {
               Env.IoC.resolve('ILogger').error('DialogTemplate', 'Используется устаревшее значение closeButtonViewMode, используйте toolButton, link или popup');
            }
            this._updateMaximizeButton(options);
            this._prepareCloseButton(options);
         },

         _beforeUpdate: function(newOptions) {
            this._updateMaximizeButton(newOptions);
            this._prepareCloseButton(newOptions);
         },

         _afterUpdate: function(oldOptions) {
            if (this._options.maximized !== oldOptions.maximized) {
               this._notify('controlResize', [], { bubbling: true });
            }
         },
         _prepareCloseButton: function(options){
            //TODO: will be fixed by https://online.sbis.ru/opendoc.html?guid=9f2f09ab-6605-484e-9840-1e5e2c000ae3
            let viewMode = options.closeButtonViewMode;
            let style = options.closeButtonStyle;
            this._closeButtonViewMode = style ? prepareCloseButton[style] : prepareCloseButton[viewMode];
         },
         _updateMaximizeButton: function(options) {
            if (options.stackMaxWidth - options.stackMinWidth < MINIMIZED_STEP_FOR_MAXIMIZED_BUTTON) {
               this._maximizeButtonVisibility = false;
            } else {
               this._maximizeButtonVisibility = options.maximizeButtonVisibility;
            }
         },

         /**
          * Закрыть всплывающее окно
          * @function Controls/_popupTemplate/Stack#close
          */
         close: function() {
            this._notify('close', [], { bubbling: true });
         },
         changeMaximizedState: function() {
            /**
             * @event maximized
             * Occurs when you click the expand / collapse button of the panels.
             */
            var maximized = this._calculateMaximized(this._options);
            this._notify('maximized', [!maximized], { bubbling: true });
         },
         _calculateMaximized: function(options) {
            // TODO: https://online.sbis.ru/opendoc.html?guid=256679aa-fac2-4d95-8915-d25f5d59b1ca
            if (!options.stackMinimizedWidth && options.stackMinWidth && options.stackMaxWidth) {
               var middle = (options.stackMinWidth + options.stackMaxWidth) / 2;
               return options.stackWidth - middle > 0;
            }
            return options.maximized;
         }
      });

      DialogTemplate.getDefaultOptions = function() {
         return {
            headingStyle: 'secondary',
            closeButtonVisibility: true,
            headingSize: 'l',
            closeButtonViewMode: 'popup',
            closeButtonTransparent: true
         };
      };
      DialogTemplate._theme = ['Controls/popupTemplate'];
      export = DialogTemplate;


/**
 * @name Controls/_popupTemplate/Stack#close
 * Close popup.
 */
