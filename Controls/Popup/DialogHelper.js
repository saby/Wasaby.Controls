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

         confirm: function(cfg){
            this._children.opener.open({
               componentOptions: merge(merge({
                  status: 'confirm'
               }, this._options.dialogOptions), cfg)
            });
         },

         message: function(cfg){
            this._children.opener.open({
               componentOptions: merge(merge({}, this._options.dialogOptions), cfg)
            });
         }

      });
   }
);