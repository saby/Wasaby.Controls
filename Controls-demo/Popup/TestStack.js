define('Controls-demo/Popup/TestStack',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/TestStack',
      'Types/entity',
      'require',
      'wml!Controls-demo/Popup/resources/InfoboxTemplate'
   ],
   function(Control, template, entity, require) {
      'use strict';

      var TestDialog = Control.extend({
         _template: template,

         _close: function() {
            this._notify('close', [], { bubbling: true });
         },

         _onClick: function() {
            if (this._options.type === 'sticky') {
               this._notify('sendResult', [123], { bubbling: true });
            } else {
               this._children.stack.open({
                  maxWidth: 600
               });
            }
         },

         _openInfobox: function() {
            var cfg = {
               template: 'wml!Controls-demo/Popup/resources/InfoboxTemplate',
               target: this._children.infoboxButton._container
            };
            this._notify('openInfobox', [cfg], { bubbling: true });
         },
         _openFC: function() {
            this._children.formControllerOpener.open();
         },
         _openModalDialog: function() {
            this._children.modalDialog.open();
         },
         _openOldPanel: function(event, tplName, mode, isStack) {
            require(['SBIS3.CONTROLS/Action/List/OpenEditDialog', tplName], function(OpenEditDialog) {
               new OpenEditDialog().execute({
                  template: tplName,
                  mode: mode,
                  item: new entity.Record(),
                  dialogOptions: {
                     isStack: isStack
                  }
               });
            });
         }
      });

      return TestDialog;
   });
