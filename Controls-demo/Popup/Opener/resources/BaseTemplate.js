define('Controls-demo/Popup/Opener/resources/BaseTemplate',
   ['Core/Control', 'wml!Controls-demo/Popup/Opener/resources/BaseTemplate'],
   function(Control, template) {
      'use strict';
      var BaseTemplate = Control.extend({
         _template: template,
         _branch: '19.700/bugfix/create-dialog',
         _storage: 'controls',
         _heading: 'Регламент: Ошибка в документации.',
         _description: '(reg-chrome) 19.700 VDOM controls'
      });

      return BaseTemplate;
   });
