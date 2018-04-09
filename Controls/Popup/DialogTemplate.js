define('Controls/Popup/DialogTemplate',
   [
      'Core/Control',
      'tmpl!Controls/Popup/DialogTemplate',
      'css!Controls/Popup/DialogTemplate',
      'css!SBIS3.CONTROLS/Mixins/PopupMixin/PopupMixin'
   ],
   function(Control, template) {
      'use strict';

      var DialogTemplate = Control.extend({

         /**
          * Базовый шаблон диалога
          * @class Controls/Popup/DialogTemplate
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Лощинин Дмитрий
          */

         /**
          * @name Controls/Popup/DialogTemplate#caption
          * @cfg {String} Заголовок
          */

         /**
          * @name Controls/Popup/DialogTemplate#topArea
          * @cfg {Content} Шаблон шапки диалога
          */

         /**
          * @name Controls/Popup/DialogTemplate#contentArea
          * @cfg {Content} Шаблон контента диалога
          */

         _template: template,

         /**
          * Закрыть всплывающее окно
          * @function Controls/Popup/DialogTemplate#close
          */
         close: function() {
            this._notify('close', [], {bubbling: true});
         }
      });
      return DialogTemplate;
   }
);
