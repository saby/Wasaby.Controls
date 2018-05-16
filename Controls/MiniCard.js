define('Controls/MiniCard',
   [
      'Core/Control',
      'tmpl!Controls/MiniCard/MiniCard',

      'Controls/Popup/Opener/MiniCard'
   ],
   function(Control, template) {

      'use strict';

      /**
       * @class Controls/MiniCard
       * @extends Core/Control
       * @public
       *
       * @name Controls/MiniCard#target
       * @cfg {Content} The content to which the logic of opening and closing the mini card is added.
       *
       * @name Controls/MiniCard#miniCard
       * @cfg {Content} Mini card contents.
       */
      var _private = {
         stopPropagation: function(event) {
            event.stopPropagation();
         }
      };

      var MiniCard = Control.extend({
         _template: template,

         _beforeMount: function() {
            this._result = this._result.bind(this);
         },

         _open: function(event, type) {
            this._children.openerMiniCard.open({
               target: event.target
            }, type);
         },

         _close: function(event, type) {
            this._children.openerMiniCard.close(type);
         },

         _targetMousedownHandler: function(event) {
            this._open(event, 'click');
            _private.stopPropagation(event);
         },

         _miniCardMousedownHandler: function(event) {
            _private.stopPropagation(event);
         },

         _cancel: function(event, action) {
            this._children.openerMiniCard.cancel(action);
         },

         _stopPropagation: function(event) {
            _private.stopPropagation(event);
         },

         _result: function(event) {
            switch (event.type) {
               case 'mouseenter':
                  this._cancel(event, 'closing');
                  break;
               case 'mouseleave':
                  this._close(event, 'hover');
                  break;
               case 'mousedown':
                  this._stopPropagation(event);
                  break;
            }
         }
      });

      return MiniCard;
   }
);
