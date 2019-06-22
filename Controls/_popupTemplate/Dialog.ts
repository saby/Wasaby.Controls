import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/Dialog/Dialog');
import Env = require('Env/Env');
import Vdom = require('Vdom/Vdom');

      var prepareCloseButton = {'light': 'link', 'popup': 'popup', 'default' : 'toolButton', 'primary': 'toolButton', 'toolButton':'toolButton','link':'link' };
      var DialogTemplate = Control.extend({

         /**
          * Layout of the dialog template. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/#template Read more}.
          * @class Controls/_popupTemplate/Dialog
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников А.С.
          * @mixes Controls/_popupTemplate/Dialog/DialogStyles
          * @demo Controls-demo/Popup/Templates/DialogTemplatePG
          */

         /**
          * @name Controls/_popupTemplate/Dialog#headingCaption
          * @cfg {String} Header title.
          */

         /**
          * @name Controls/_popupTemplate/Dialog#headingStyle
          * @cfg {String} Caption display style.
          * @variant secondary
          * @variant primary
          * @variant info
          */

         /**
          * @name Controls/_popupTemplate/Dialog#headerContentTemplate
          * @cfg {function|String} The content between the header and the cross closure.
          */
         /**
          * @name Controls/_popupTemplate/Dialog#bodyContentTemplate
          * @cfg {function|String} Main content.
          */

         /**
          * @name Controls/_popupTemplate/Dialog#footerContentTemplate
          * @cfg {function|String} Content at the bottom of the stack panel.
          */

         /**
          * @name Controls/_popupTemplate/Dialog#closeButtonVisibility
          * @cfg {Boolean} Determines whether display of the close button.
          */

         /**
          * @name Controls/_popupTemplate/Dialog#closeButtonViewMode
          * @cfg {String} Close button display style.
          * @variant toolButton
          * @variant link
          * @variant popup
          * @default popup
          */

         /**
          * @name Controls/_popupTemplate/Dialog#closeButtonTransparent
          * @cfg {String} Close button transparent.
          * @variant true
          * @variant false
          * @default true
          */

         /**
          * @name Controls/_popupTemplate/Dialog#draggable
          * @cfg {Boolean} Determines whether the control can be moved by d'n'd.
          * @default false
          */

         _template: template,
         _closeButtonVisibility: true,
         _closeButtonViewMode: 'popup',
         /**
          * Close popup.
          * @function Controls/_popupTemplate/Dialog#close
          */
         close: function() {
            this._notify('close', [], { bubbling: true });
         },

         _onMouseDown: function(event) {
            if (this._needStartDrag(event.target)) {
               this._startDragNDrop(event)
            }
         },

         _startDragNDrop: function(event) {
            this._children.dragNDrop.startDragNDrop(null, event);
         },

         _needStartDrag: function(target) {
            var controlsArray = Vdom.goUpByControlTree(target);

            // if click to control then control must handle click
            return this._options.draggable && controlsArray[0]._container === this._container;
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
            closeButtonViewMode: 'popup',
            closeButtonTransparent: true
         };
      };
      DialogTemplate._theme = ['Controls/popupTemplate'];

      export = DialogTemplate;

