define('Controls/Popup/Templates/Stack/StackTemplate',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Templates/Stack/StackTemplate',
      'css!Controls/Popup/Templates/Stack/StackTemplate'
   ],
   function(Control, template) {
      'use strict';

      var DialogTemplate = Control.extend({

         /**
          * Базовый шаблон стековой панели
          * @class Controls/Popup/Templates/Stack/StackTemplate
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников Андрей
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#caption
          * @cfg {String} Заголовок
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#topArea
          * @cfg {Content} Шаблон шапки диалога
          */

         /**
          * @name Controls/Popup/Templates/Stack/StackTemplate#contentArea
          * @cfg {Content} Шаблон контента диалога
          */

         _template: template,

         /**
          * Закрыть всплывающее окно
          * @function Controls/Popup/Templates/Stack/StackTemplate#close
          */
         close: function() {
            this._notify('close', [], {bubbling: true});
         },
         changeMaximizedState: function() {
            this._notify('maximized', [!this._options.maximized], {bubbling: true});
         }
      });

      DialogTemplate.getDefaultOptions = function() {
         return {
            captionStyle: 'default'
         };
      };

      return DialogTemplate;
   }
);
