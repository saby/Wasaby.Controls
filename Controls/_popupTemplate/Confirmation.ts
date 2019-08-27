import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/Confirmation/Confirmation');
import Env = require('Env/Env');
import 'css!theme?Controls/popupTemplate';

      var DialogTemplate = Control.extend({

         /**
          * Базовый шаблон <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/confirmation/'>диалога подтверждения</a>.
          * @class Controls/_popupTemplate/Confirmation
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников А.С.
          * @mixes Controls/_popupTemplate/Confirmation/ConfirmationStyles
          * @demo Controls-demo/Popup/Templates/ConfirmationTemplatePG
          */

         /*
          * Base template of confirm dialog.
          * @class Controls/_popupTemplate/Confirmation
          * @extends Core/Control
          * @control
          * @public
          * @category Popup
          * @author Красильников А.С.
          * @mixes Controls/_popupTemplate/Confirmation/ConfirmationStyles
          * @demo Controls-demo/Popup/Templates/ConfirmationTemplatePG
          */

         /**
          * @name Controls/_popupTemplate/Confirmation#size
          * @cfg {String} Размер окна диалога.
          * @variant m
          * @variant l
          * @default m
          */

         /*
          * @name Controls/_popupTemplate/Confirmation#size
          * @cfg {String} Confirmation size
          * @variant m
          * @variant l
          * @default m
          */

         /**
          * @name Controls/_popupTemplate/Confirmation#style
          * @cfg {String} Стиль отображения окна диалога.
          * @variant default
          * @variant success
          * @variant danger
          */

         /*
          * @name Controls/_popupTemplate/Confirmation#style
          * @cfg {String} Confirmation display style
          * @variant default
          * @variant success
          * @variant danger
          */

         /**
          * @name Controls/_popupTemplate/Confirmation#bodyContentTemplate
          * @cfg {function|String} Основной контент окна диалога.
          */

         /*
          * @name Controls/_popupTemplate/Confirmation#bodyContentTemplate
          * @cfg {function|String} Main content.
          */

         /**
          * @name Controls/_popupTemplate/Confirmation#footerContentTemplate
          * @cfg {function|String} Контент футера окна диалога.
          */

         /**
          * @name Controls/_popupTemplate/Confirmation#footerContentTemplate
          * @cfg {function|String} Content at the bottom of the confirm panel.
          */

         _template: template,
         _size: null,

         /**
          * Закрытие всплывающего окна диалога подтверждения.
          * @function Controls/_popupTemplate/Confirmation#close
          */
         /*
          * Close the dialog
          * @function Controls/_popupTemplate/Confirmation#close
          */
         close: function() {
            this._notify('close', [], { bubbling: true });
         }
      });
      export = DialogTemplate;

