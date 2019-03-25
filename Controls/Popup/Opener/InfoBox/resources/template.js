define('Controls/Popup/Opener/InfoBox/resources/template',
   [
      'Core/Control',
      'wml!Controls/Popup/Opener/InfoBox/resources/template'
   ],
   function(Control, template) {
      'use strict';

      return Control.extend({
         _template: template,

         _close: function() {
            // todo For Compatible. Remove after https://online.sbis.ru/opendoc.html?guid=dedf534a-3498-4b93-b09c-0f36f7c91ab5
            this._notify('sendResult', [{ type: 'close' }], { bubbling: true });
            this._notify('close');
         },
         _sendResult: function(event) {
            this._notify('sendResult', [event], { bubbling: true });
         },

         _mousedownHandler: function(event) {
            // Stop the click event on the container. It is necessary in order not to call
            // the emitters on mousedown on the page, whose handlers will lead to the closure of the InfoBox.
            event.stopPropagation();
         }
      });
   });
