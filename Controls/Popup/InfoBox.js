define('Controls/Popup/InfoBox',
   [
      'Core/Control',
      'tmpl!Controls/Popup/InfoBox/InfoBox',
      'Controls/Popup/Previewer/OpenerTemplate',

      'Controls/Popup/Opener/InfoBox'
   ],
   function(Control, template, OpenerTemplate) {

      'use strict';

      /**
       * A delayed template display component.
       * Uses Controls/Popup/Opener/InfoBox.
       *
       * @class Controls/Popup/InfoBox
       * @extends Core/Control
       * @public
       * @demo Controls-demo/InfoBox/InfoBox
       *
       * @interface Controls/interface/IStickyOpener
       *
       * @name Controls/Popup/InfoBox#hideDelay
       * @cfg {Number} Delay before closing after mouse leaves.
       *
       * @name Controls/Popup/InfoBox#showDelay
       * @cfg {Number} Delay before opening after mouse enters.
       *
       * @name Controls/Popup/InfoBox#content
       * @cfg {Content} The content to which the logic of opening and closing the template is added.
       *
       * @name Controls/Popup/InfoBox#template
       * Popup template
       */

      var _private = {
         getCfg: function(self, event) {
            return {
               target: event.currentTarget || event.target,
               template: OpenerTemplate,
               position: self._options.position,
               templateOptions: {
                  content: self._options.template
               }
            };
         }
      };

      var InfoBox = Control.extend({
         _template: template,

         _openId: null,

         _closeId: null,

         _beforeMount: function() {
            this._resultHandler = this._resultHandler.bind(this);
         },

         _open: function(event) {
            this._children.openerInfoBox.open(_private.getCfg(this, event));

            clearTimeout(this._openId);
            clearTimeout(this._closeId);

            this._openId = null;
            this._closeId = null;
            this._opened = true;
         },

         _close: function() {
            this._children.openerInfoBox.close();

            clearTimeout(this._openId);
            clearTimeout(this._closeId);

            this._openId = null;
            this._closeId = null;
            this._opened = false;
         },

         _contentMousedownHandler: function(event) {
            this._open(event);
            event.stopPropagation();
         },

         _contentMouseenterHandler: function(event) {
            var self = this;

            clearTimeout(this._closeId);

            this._openId = setTimeout(function() {
               self._open(event);
            }, self._options.showDelay);
         },

         _contentMouseleaveHandler: function() {
            var self = this;

            clearTimeout(this._openId);

            this._closeId = setTimeout(function() {
               self._close();
            }, self._options.hideDelay);
         },

         _mousedownHandler: function() {
            this._close();
         },

         _resultHandler: function(event) {
            switch (event.type) {
               case 'mouseenter':
                  clearTimeout(this._closeId);
                  this._closeId = null;
                  break;
               case 'mouseleave':
                  this._contentMouseleaveHandler();
                  break;
               case 'mousedown':
                  event.stopPropagation();
                  break;
            }
         }
      });

      InfoBox.getDefaultOptions = function() {
         return {
            position: 'tl',
            showDelay: 300,
            hideDelay: 300
         };
      };

      return InfoBox;
   }
);
