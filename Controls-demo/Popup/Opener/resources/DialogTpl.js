define('Controls-demo/Popup/Opener/resources/DialogTpl',
   [
      'Env/Env',
      'Core/Control',
      'wml!Controls-demo/Popup/Opener/resources/DialogTpl',
      'css!Controls-demo/Popup/Opener/resources/StackHeader'
   ],
   function(Env, Control, template) {
      'use strict';

      var PopupPage = Control.extend({
         _template: template,
         _actionClicked: '',
         _groupingKeyCallback: null,
         _itemActions: null,
         _viewSource: null,
         _branch: '19.700/bugfix/create-dialog',
         _storage: 'controls',
         _heading: 'Регламент: Ошибка в документации.',
         _description: '(reg-chrome) 19.700 VDOM controls',
         _close: function() {
            this._notify('close', [], { bubbling: true });
         }
      });
      return PopupPage;
   });
