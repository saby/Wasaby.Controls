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
          * Базовый шаблон диалога
          * @class Controls/Popup/Templates/Dialog/DialogTemplate
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников Андрей
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#caption
          * @cfg {String} Заголовок
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#topArea
          * @cfg {Content} Шаблон шапки диалога
          */

         /**
          * @name Controls/Popup/Templates/Dialog/DialogTemplate#contentArea
          * @cfg {Content} Шаблон контента диалога
          */

         _template: template,

         /**
          * Закрыть всплывающее окно
          * @function Controls/Popup/Templates/Dialog/DialogTemplate#close
          */
         close: function() {
            this._notify('close', [], {bubbling: true});
         }
      });
      return DialogTemplate;
   }
);
