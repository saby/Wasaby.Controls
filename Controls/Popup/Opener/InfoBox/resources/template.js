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
            // todo Для совместимости
            // Удалить, как будет сделана задача https://online.sbis.ru/opendoc.html?guid=dedf534a-3498-4b93-b09c-0f36f7c91ab5
            this._notify('sendResult', [{ type: 'close' }], { bubbling: true });

            this._notify('close');
         }
      });
   });
