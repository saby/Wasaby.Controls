define('Controls/Popup/Previewer',
   [
      'Core/Control',
      'wml!Controls/Popup/Previewer/Previewer',
      'Core/helpers/Function/debounce',
      'Controls/Popup/Opener/Previewer'
   ],
   function(Control, template, debounce, PreviewerOpener) {

      'use strict';

      /**
       * @class Controls/Popup/Previewer
       * @extends Core/Control
       * @public
       * @author Красильников А.С.
       *
       * @name Controls/Popup/Previewer#content
       * @cfg {Content} The content to which the logic of opening and closing the mini card is added.
       *
       * @name Controls/Popup/Previewer#template
       * @cfg {Content} Mini card contents.
       */

      /**
       * @name Controls/Popup/Previewer#trigger
       * @cfg {String} Event name trigger the opening or closing of the template.
       * @variant click Opening by click on the content. Closing by click not on the content or template.
       * @variant hover Opening by hover on the content. Closing by hover not on the content or template.
       * @variant hoverAndClick Opening by click or hover on the content. Closing by click or hover not on the content or template.
       * @default hoverAndClick
       */
      var _private = {
         getType: function(eventType) {
            if (eventType === 'mouseenter' || eventType === 'mouseleave') {
               return 'hover';
            } else {
               return 'click';
            }
         },
         getCfg: function(self, event) {
            return {
               opener: self,
               target: event.currentTarget || event.target,
               template: 'Controls/Popup/Previewer/OpenerTemplate',
               corner: {
                  vertical: 'bottom',
                  horizontal: 'right'
               },
               isCompoundTemplate: self._options.isCompoundTemplate,
               eventHandlers: {
                  onResult: self._resultHandler
               },
               templateOptions: {
                  content: self._options.template,
                  contentTemplateName: self._options.templateName,
                  contentTemplateOptions: self._options.templateOptions
               },
               closeChildWindows: self._options.closeChildWindows
            };
         }
      };

      var Previewer = Control.extend({
         _template: template,
         _isPopupOpened: false,

         _isNewEnvironment: PreviewerOpener.isNewEnvironment,

         _beforeMount: function() {
            this._resultHandler = this._resultHandler.bind(this);
            this._debouncedAction = debounce(this._debouncedAction, 10);
            this._enableClose = true;
         },

         _open: function(event) {
            var type = _private.getType(event.type);

            if (!this._isPopupOpened) {
               if (this._isNewEnvironment()) {
                  this._close(event); // close opened popup to avoid jerking the content for repositioning
                  this._isPopupOpened = true;
                  this._notify('openPreviewer', [_private.getCfg(this, event), type], {bubbling: true});
               } else {
                  this._children.openerPreviewer.open(_private.getCfg(this, event), type);
               }
            }
         },

         _close: function(event) {
            var type = _private.getType(event.type);

            this._isPopupOpened = false;
            if (this._isNewEnvironment()) {
               this._notify('closePreviewer', [type], {bubbling: true});
            } else {
               this._children.openerPreviewer.close(type);
            }
         },

         // Pointer action on hover with content and popup are executed sequentially.
         // Collect in package and process the latest challenge
         _debouncedAction: function(method, args) {
            this[method].apply(this, args);
         },

         _cancel: function(event, action) {
            if (this._isNewEnvironment()) {
               this._notify('cancelPreviewer', [action], {bubbling: true});
            } else {
               this._children.openerPreviewer.cancel(action);
            }
         },

         _contentMousedownHandler: function(event) {
            /**
             * When trigger is set to 'hover', preview shouldn't be shown when user clicks on content.
             */
            if (this._options.trigger === 'hover') {
               this._cancel(event, 'opening');
            } else {
               // Stop mousedown event for prevent closing popup by external click
               if (this._isPopupOpened) {
                  event.preventDefault();
               } else {
                  this._debouncedAction('_open', [event]);
               }
            }

            event.stopPropagation();
         },

         _contentMouseenterHandler: function(event) {
            this._debouncedAction('_open', [event]);
            this._cancel(event, 'closing');
         },

         _contentMouseleaveHandler: function(event) {
            this._debouncedAction('_close', [event]);
         },

         _previewerClickHandler: function(event) {
            /**
             * Cancel the ascent of the click. Thus cancel the parent reaction.
             */
            event.stopPropagation();
         },

         _resultHandler: function(event) {
            switch (event.type) {
               case 'menuclosed':
                  this._enableClose = true;
                  event.stopPropagation();
                  break;
               case 'menuopened':
                  this._enableClose = false;
                  event.stopPropagation();
                  break;
               case 'mouseenter':
                  this._debouncedAction('_cancel', [event, 'closing']);
                  break;
               case 'mouseleave':
                  if (this._enableClose && (this._options.trigger === 'hover' || this._options.trigger === 'hoverAndClick')) {
                     this._debouncedAction('_close', [event]);
                  }
                  break;
               case 'mousedown':
                  event.stopPropagation();
                  break;
            }
         }
      });

      Previewer.getDefaultOptions = function() {
         return {
            trigger: 'hoverAndClick'
         };
      };

      return Previewer;
   }
);
