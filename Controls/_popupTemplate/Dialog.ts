import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/Dialog/Dialog');
import Env = require('Env/Env');
import 'css!theme?Controls/_popupTemplate/Dialog/Dialog';


      var DialogTemplate = Control.extend({

         /**
          * Layout of the dialog template. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/#template-standart Read more}.
          * @class Controls/Popup/Templates/Dialog/DialogTemplate
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников А.С.
          * @mixes Controls/Popup/Templates/Dialog/DialogTmplStyles
          * @demo Controls-demo/Popup/Templates/DialogTemplatePG
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#headingCaption
          * @cfg {String} Header title.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#headingStyle
          * @cfg {String} Caption display style.
          * @variant secondary
          * @variant primary
          * @variant info
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#headerContentTemplate
          * @cfg {function|String} The content between the header and the cross closure.
          */
         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#bodyContentTemplate
          * @cfg {function|String} Main content.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#footerContentTemplate
          * @cfg {function|String} Content at the bottom of the stack panel.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#closeButtonVisibility
          * @cfg {Boolean} Determines whether display of the close button.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#closeButtonViewMode
          * @cfg {String} Close button display style.
          * @variant default
          * @variant lite
          * @variant primary
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#draggable
          * @cfg {Boolean} Determines whether the control can be moved by d'n'd.
          * @default false
          */

         _template: template,
         _closeButtonVisibility: true,
         _beforeMount: function(options) {
            this._closeButtonVisibility = options.hideCross === undefined ? options.closeButtonVisibility : !options.hideCross;

            if (options.contentArea) {
               Env.IoC.resolve('ILogger').warn('ConfirmationTemplate', 'Используется устаревшая опция contentArea, используйте bodyContentTemplate');
            }
            if (options.caption) {
               Env.IoC.resolve('ILogger').warn('ConfirmationTemplate', 'Используется устаревшая опция caption, используйте headingCaption');
            }
            if (options.captionStyle) {
               Env.IoC.resolve('ILogger').warn('ConfirmationTemplate', 'Используется устаревшая опция captionStyle, используйте headingStyle');
            }
            if (options.topArea) {
               Env.IoC.resolve('ILogger').warn('ConfirmationTemplate', 'Используется устаревшая опция topArea, используйте headerContentTemplate');
            }
            if (options.hideCross) {
               Env.IoC.resolve('ILogger').warn('ConfirmationTemplate', 'Используется устаревшая опция hideCross, используйте closeButtonVisibility');
            }
         },
         _beforeUpdate: function(options) {
            this._closeButtonVisibility = options.hideCross === undefined ? options.closeButtonVisibility : !options.hideCross;
         },

         /**
          * Close popup.
          * @function Controls/Popup/Templates/Dialog/DialogTemplate#close
          */
         close: function() {
            this._notify('close', [], { bubbling: true });
         },

         _onMouseDown: function(event) {
            if (this._options.draggable) {
               this._children.dragNDrop.startDragNDrop(null, event);
            }
         },

         _onDragEnd: function() {
            this._notify('popupDragEnd', [], { bubbling: true });
         },

         _onDragMove: function(event, dragObject) {
            this._notify('popupDragStart', [dragObject.offset], { bubbling: true });
         }
      });
      DialogTemplate.getDefaultOptions = function() {
         return {
            headingStyle: 'secondary',
            closeButtonVisibility: true,
            closeButtonViewMode: 'toolButton'
         };
      };

      export = DialogTemplate;

