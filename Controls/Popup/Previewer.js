define('Controls/Popup/Previewer',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Previewer/Previewer',

      'Controls/Popup/Opener/Previewer'
   ],
   function(Control, template) {

      'use strict';

      /**
       * @class Controls/Popup/Previewer
       * @extends Core/Control
       * @public
       *
       * @name Controls/Popup/Previewer#content
       * @cfg {Content} The content to which the logic of opening and closing the mini card is added.
       *
       * @name Controls/Popup/Previewer#template
       * @cfg {Content} Mini card contents.
       */
      var _private = {
         getType: function(eventType) {
            if (eventType === 'mouseenter' || eventType === 'mouseleave') {
               return 'hover';
            } else {
               return 'click';
            }
         }
      };

      var Previewer = Control.extend({
         _template: template,

         _beforeMount: function() {
            this._resultHandler = this._resultHandler.bind(this);
            this._enableClose = true;
         },

         _open: function(event) {
            var type = _private.getType(event.type);

            this._children.openerPreviewer.open({
               target: event.target
            }, type);
         },

         _close: function(event) {
            var type = _private.getType(event.type);

            this._children.openerPreviewer.close(type);
         },


         _cancel: function(event, action) {
            this._children.openerPreviewer.cancel(action);
         },

         _contentMousedownHandler: function(event) {
            this._open(event);
            event.stopPropagation();
         },

         _contentMouseenterHandler: function(event) {
            this._open(event);
         },

         _contentMouseleaveHandler: function(event) {
            this._close(event);
         },

         _previewerMousedownHandler: function(event) {
            event.stopPropagation();
         },

         _resultHandler: function(event) {
            switch (event.type) {
               case 'menuclosed':
                  this._enableClose = true;
                  break;
               case 'menuopened':
                  this._enableClose = false;
                  break;
               case 'mouseenter':
                  this._cancel(event, 'closing');
                  break;
               case 'mouseleave':
                  if (this._enableClose) {
                     this._close(event, 'hover');
                  }
                  break;
               case 'mousedown':
                  event.stopPropagation();
                  break;
            }
         }
      });

      return Previewer;
   }
);
