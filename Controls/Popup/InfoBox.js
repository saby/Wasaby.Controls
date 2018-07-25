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
       * @mixin Controls/interface/IStickyOpener
       * @public
       * @demo Controls-demo/InfoBox/InfoBox
       */

      /**
       * @typedef {Object} Triggers
       * @property {Boolean} [click=true] Opening by click on the content. Closing by click not on the content or template.
       * @property {Boolean} [hover=true] Opening by hover on the content. Closing by hover or click not on the content or template.
       */

      /**
       * @name Controls/Popup/InfoBox#hideDelay
       * @cfg {Number} Delay before closing after mouse leaves.
       */

      /**
       * @name Controls/Popup/InfoBox#showDelay
       * @cfg {Number} Delay before opening after mouse enters.
       */

      /**
       * @name Controls/Popup/InfoBox#content
       * @cfg {Function} The content to which the logic of opening and closing the template is added.
       */

      /**
       * @name Controls/Popup/InfoBox#template
       * @cfg {Function} Popup template
       */

      /**
       * @name Controls/Popup/InfoBox#triggers
       * @cfg {Object.<Triggers>} Event names. They trigger the opening or closing of the template.
       */

      var _private = {
         getCfg: function(self, event) {
            return {
               target: event.currentTarget || event.target,
               template: OpenerTemplate,
               position: self._options.position,
               templateOptions: {
                  content: self._options.template,
                  contentTemplateName: self._options.templateName,
                  contentTemplateOptions: self._options.templateOptions
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
                  if (this._options.triggers.hover) {
                     this._contentMouseleaveHandler();
                  }
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
            hideDelay: 300,
            triggers: {
               click: true,
               hover: true
            }
         };
      };

      return InfoBox;
   }
);
