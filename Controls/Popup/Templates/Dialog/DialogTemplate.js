define('Controls/Popup/Templates/Dialog/DialogTemplate',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Templates/Dialog/DialogTemplate',
      'css!Controls/Popup/Templates/Dialog/DialogTemplate'
   ],
   function(Control, template) {
      'use strict';

      var DialogTemplate = Control.extend({

         /**
          * Base dialog template
          * @class Controls/Popup/Templates/Dialog/DialogTemplate
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников Андрей
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#caption
          * @cfg {String} Dialog title
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#topArea
          * @cfg {Content} Dialog header template
          */
         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#contentArea
          * @cfg {Content} Dialog content template
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#draggable
          * @cfg {Boolean} Dialog dragged
          */

         _template: template,

         /**
          * Закрыть всплывающее окно
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
