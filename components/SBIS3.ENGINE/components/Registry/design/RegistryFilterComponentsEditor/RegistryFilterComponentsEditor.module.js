define('js!genie.RegistryFilterComponentsEditor',
   [
      'js!genie.PropertyEditorStandardPopupObject',
      'html!genie.RegistryFilterComponentsEditor',
      'css!genie.RegistryFilterComponentsEditor'
   ], function (parent, dotTplFn) {
      // редактор добавления/удаления стардартных компонентов фильтрации в области для фильтров
      var RegistryFilterComponentsEditor = parent.extend({
         _dotTplFn: dotTplFn,
         init: function () {
            RegistryFilterComponentsEditor.superclass.init.apply(this, arguments);
            var self = this,
               add = self.getContainer().find('.genie-PropertyGrid__addBtn'),
               edit = self.getContainer().find('.genie-PropertyEditor__chooser'),
               remove = self.getContainer().find('.genie-PropertyGrid__Remove');
            self.getContainer().find('.genie-PropertyGrid__title').click(function (e) {
               e.stopPropagation();
               return false;
            });
            if (this.getConfig().getValue().hasControl) {
               edit.removeClass('ws-hidden');
               add.addClass('ws-hidden');
               self.getContainer().addClass('can-remove');
            }
            add.click(function () {
               self.getConfig().getChildByName('hasControl').setValue(true);
               edit.removeClass('ws-hidden');
               add.addClass('ws-hidden');
               self.getContainer().addClass('can-remove');
               edit.trigger('click');
            });
            remove.click(function () {
               self.getConfig().getChildByName('hasControl').setValue(false);
               edit.addClass('ws-hidden');
               add.removeClass('ws-hidden');
               self.getContainer().removeClass('can-remove');
               return false;
            });
         }
      });
      return RegistryFilterComponentsEditor;
   });