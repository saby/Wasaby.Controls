define('js!Controls/Popup/DialogHelper',
   [
      'Core/Control',
      'Core/core-merge',
      'tmpl!Controls/Popup/DialogHelper/DialogHelper',
      'js!Controls/Windows/Submit'
   ],
   function (Control, merge, template) {
      'use strict';

      return Control.extend({
         _controlName: 'Controls/Popup/DialogHelper',
         _template: template,

         _afterMount: function () {
            var self = this;
            //TODO Пока через subscribe, уточнить у Лощинина
            self._children.opener.subscribe('onResult', function (e, res) {
               self._notify('onResult', res);
            });
         },

         _openDialog: function(cfg, status){
            this._children.opener.open({
               componentOptions: merge(merge({
                  status: status
               }, this._options.dialogOptions), cfg)
            });
         },

         confirm: function(cfg){
            this._openDialog(cfg, 'confirm');
         },

         info: function(cfg){
            this._openDialog(cfg, 'default');
         },

         error: function(cfg){
            this._openDialog(cfg, 'error');
         },

         success: function(cfg){
            this._openDialog(cfg, 'success');
         }

      });
   }
);