define('Controls/Popup/Templates/Dialog/DialogTemplate',
   [
      'Core/Control',
      'wml!Controls/Popup/Templates/Dialog/DialogTemplate',
      'css!Controls/Popup/Templates/Dialog/DialogTemplate'
   ],
   function(Control, template) {
      'use strict';

      var DialogTemplate = Control.extend({

         /**
          * Layout of the dialog template. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/wasaby/components/openers/#template-standart Read more}.
          * @class Controls/Popup/Templates/Dialog/DialogTemplate
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников А.С.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#caption
          * @cfg {String} Header title.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#captionStyle
          * @cfg {String} Caption display style.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#headerContentTemplate
          * @cfg {Content} The content between the header and the cross closure.
          */
         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#bodyContentTemplate
          * @cfg {Content} Main content.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#footerContentTemplate
          * @cfg {Content} Content at the bottom of the stack panel.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#closeButtonVisibility
          * @cfg {Boolean} Determines whether display of the close button.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#closeButtonStyle
          * @cfg {String} Close button display style.
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#draggable
          * @cfg {Boolean} Determines whether the control can be moved by d'n'd.
          */

         _template: template,

         /**
          * Close popup.
          * @function Controls/Popup/Templates/Dialog/DialogTemplate#close
          */
         close: function() {
            this._notify('close', [], {bubbling: true});
         },

         _onMouseDown: function(event) {
            if (this._options.draggable) {
               this._children.dragNDrop.startDragNDrop(null, event);
            }
         },

         _onDragEnd: function() {
            this._notify('popupDragEnd', [], {bubbling: true});
         },

         _onDragMove: function(event, dragObject) {
            this._notify('popupDragStart', [dragObject.offset], {bubbling: true});
         }

      });
      return DialogTemplate;
   }
);
