define('js!Controls/Popup/DialogTemplate',
   [
      'Core/Control',
      'tmpl!Controls/Popup/DialogTemplate',
      'css!Controls/Popup/DialogTemplate'
   ],
   function (Control, template) {
      'use strict';
   /**
    * Компонент шаблона диалога
       * @class Controls/Popup/DialogTemplate
    * @control
    * @public
    * @category Popup
    */
      return Control.extend({
         _controlName: 'Controls/Popup/DialogTemplate',
         _template: template,
         iWantVDOM: true,

         closePopup: function (){
            this.sendCommand('close');
         }
      });
   }
);