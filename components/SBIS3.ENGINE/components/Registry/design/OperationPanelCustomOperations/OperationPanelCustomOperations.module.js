define('js!genie.OperationPanelCustomOperations',
   [
      'js!genie.PropertyEditorAbstract',
      'js!genie._PropertyGridPopupMixin',
      'js!genie.PropertyList',
      'js!genie.PropertyEditorFilteredHashMap',
      'html!genie.OperationPanelCustomOperations',
      'css!genie.OperationPanelCustomOperations'
   ],
   function (parent, popupMixin, PropertyList, HashMap, dotTplFn) {
      var OperationPanelCustomOperations = parent.extend([popupMixin], {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               filteredOpts: {}
            }
         },
         $constructor: function () {
         },
         initTitle: function () {
         },
         initEditor: function () {
         },
         emitValue: function () {
         },
         setValue: function() {

         },
         init: function () {
            OperationPanelCustomOperations.superclass.init.apply(this, arguments);
            var self = this,
               cnt = this.getContainer(),
               customCnt = cnt.find('#customOptions');
            cnt.find('[data-name]').each(function (idx, elem) {
               var $elem = $(elem),
                  add = $elem.find('.genie-PropertyGrid__addBtn'),
                  edit = $elem.find('.genie-PropertyEditor__chooser'),
                  remove = $elem.find('.genie-PropertyGrid__Remove'),
                  optName = $elem.attr('data-name');

               $elem.find('.genie-PropertyGrid__title').click(function (e) {
                  e.stopPropagation();
                  return false;
               });

               if (self.getConfig().getValue()[optName]) {
                  edit.removeClass('ws-hidden');
                  add.addClass('ws-hidden');
                  $elem.addClass('can-remove');
               }

               add.click(function () {
                  self.getConfig().add(optName, {}, 0, 0);
                  edit.removeClass('ws-hidden');
                  add.addClass('ws-hidden');
                  $elem.addClass('can-remove');
                  edit.trigger('click');
               });

               remove.click(function () {
                  self.getConfig().remove(optName);
                  edit.addClass('ws-hidden');
                  add.removeClass('ws-hidden');
                  $elem.removeClass('can-remove');
                  return false;
               });

               edit.click(function () {
                  self.showPopup(PropertyList, {
                     configRoot: self.getConfig().getChildByName(optName),
                     parent: self,
                     filter: !self.getConfig().filtered ? self._options.filter : ''// TODO возможно, здесь неверно устанавливается фильтр
                  }, this, optName + '\'s options');
               });
            });

            new HashMap({
               element: customCnt,
               config: this.getConfig(),
               filter: !this.getConfig().filtered ? this._options.filter : '',
               parent: self,
               filteredOpts: this._options.filteredOpts
            });
         }
      });
      return OperationPanelCustomOperations;
   });