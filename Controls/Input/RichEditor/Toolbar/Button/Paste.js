define('Controls/Input/RichEditor/Toolbar/Button/Paste', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/Toolbar/Button/Paste/Paste',
   'Controls/Input/RichEditor/Toolbar/Button/Paste/data',
   'WS.Data/Di',
   'Core/Deferred',
   'WS.Data/Source/Memory'
], function(Control, template, pastePickData, Di, Deferred, Memory) {
   /**
    * Component Toolbar/Button/Paste
    * Button for inserting clipboard data with/without styles
    * @class Controls/Input/RichEditor/Toolbar/Button/Paste
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   var _private = {

      /**
       * Function returns promise which return content from dialog
       * @param self
       * @param withStyles
       * @returns {Deferred}
       */
      getContentFromPasteDialog: function(self, withStyles) {
         var def = new Deferred(),
            onPaste = function(event) {
               var content = event.clipboardData.getData ? event.clipboardData.getData('text/html') : '';
               if (!content || !withStyles) {
                  content = event.clipboardData.getData ? event.clipboardData.getData('text/plain') : window.clipboardData.getData('Text');
               }

               self._children.confirmationOpener.close();

               event.stopPropagation();
               event.preventDefault();

               document.removeEventListener('paste', onPaste);
               def.callback(content);
            };

         self._children.loadingIndicator.hide();

         document.addEventListener('paste', onPaste);

         self._children.confirmationOpener.open({
            message: withStyles ? rk('Не закрывая это окно нажмите CTRL + V для вставки текста из буфера обмена с сохранением стилей')
               : rk('Не закрывая это окно нажмите CTRL + V для вставки текста из буфера обмена без сохранения стилей'),
            type: 'ok',
            isModal: true,
            okCaption: rk('Отменить'),
            eventHandlers: {
               onClose: function() {
                  document.removeEventListener('paste', onPaste);
                  def.callback('');
               }
            }
         }).addCallback(function() {
            def.callback('');
            document.removeEventListener('paste', onPaste);
         });

         return def;
      },

      /**
       * Function returns clipboard content
       * @param self
       * @param withStyles
       * @returns {Deferred}
       */
      getPasteContent: function(self, withStyles) {
         var
            def = new Deferred(),
            service;

         self._children.loadingIndicator.show();


         if (Di.isRegistered('SBIS3.Plugin/Source/LocalService')) {
            service = Di.resolve('SBIS3.Plugin/Source/LocalService', {
               endpoint: {
                  address: 'Clipboard-1.0.1.0',
                  contract: 'Clipboard'
               },
               options: { mode: 'silent' }
            });

            service.isReady().addCallback(function() {
               service.call('getContentType').addCallback(function(contentType) {
                  service.call((contentType === 'Text/Html' ||
                     contentType === 'Text/Rtf' ||
                     contentType === 'Html' ||
                     contentType === 'Rtf') &&
                  withStyles ? 'getHtml' : 'getText', {}).addCallback(function(content) {
                     self._children.loadingIndicator.hide();
                     def.callback(content);
                  }).addErrback(errBack.bind(null, self));
               }).addErrback(errBack.bind(null, self));
            }).addErrback(errBack.bind(null, self));
         } else {
            errBack(self);
         }

         return def;

         function errBack(self) {
            _private.getContentFromPasteDialog(self, withStyles).addCallback(function(content) {
               def.callback(content);
            });
         }
      }
   };

   return Control.extend({
      _template: template,
      _source: null,
      _selected: null,

      _beforeMount: function() {
         this._selected = ['pasteWithStyles'];

         this._source = new Memory({
            idProperty: 'id',
            data: pastePickData
         });
      },

      _menuItemActivateHandler: function(event, item) {
         _private.getPasteContent(this, item.get('withStyles')).addCallback(function(content) {
            this._notify('_paste', [content], { bubbling: true });
         }.bind(this));
      }
   });
});
