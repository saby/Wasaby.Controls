define('js!genie.OperationPanelCustomEditor',
   [
      'js!genie.PropertyEditorSimple',
      'js!genie._PropertyGridPopupMixin',
      'js!genie.PropertyList',
      'html!genie.OperationPanelCustomEditor',
      'css!genie.OperationPanelCustomEditor'
   ],
   function (parent, popupMixin, customEditor, dotTplFn) {
      var OperationPanelCustomEditor = parent.extend([popupMixin], {
         _dotTplFn: dotTplFn,
         init: function () {
            var self = this;
            OperationPanelCustomEditor.superclass.init.apply(this, arguments);
            $('.genie-PropertyEditor__chooser', this.getContainer().get(0)).click(function (e) {
               self.showPopup(self.getPopupConstructor(), $ws.core.merge({
                     config: self.getConfig(),
                     parent: self,
                     filter: !self.getConfig().filtered ? self._options.filter : ''
                  }, self.getPopupConfig() || {}),
                  self.getContainer().find('.genie-PropertyEditor__chooser'),
                  self.getConfig().getName()
               );
               return false;
            })
         },
         getPopupConstructor: function () {
            return customEditor;// default is PropertyList
         },
         getPopupConfig: function () {
            return {};
         }
      });
      return OperationPanelCustomEditor;
   });