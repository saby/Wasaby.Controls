define('Controls/List/EditInPlace', [
   'Core/Control',
   'tmpl!Controls/List/EditInPlace/EditInPlace',
   'Core/Deferred',
   'WS.Data/Entity/Record'
], function (Control, template, Deferred, Record) {

   var _private = {
      beginEdit: function(self, record) {
         var result = self._notify('beginEdit', [record], {bubbling: true});

         self._oldItem = record;

         return _private.processBeginEditResult(self, record, result);
      },


      afterBeginEdit: function(self, record) {
         self._editingItem = record.clone();
         self._notify('afterBeginEdit', [record], {bubbling: true});
         self._options.listModel.setEditingItem(self._editingItem);

         return self._editingItem;
      },

      beginAdd: function(self, options) {
         var result = self._notify('beginAdd', [options], {bubbling: true});

         return _private.processBeginEditResult(self, options, result, true);
      },

      processBeginEditResult: function(self, originalResult, result, isAdd) {
         if (result) {
            if (result === BeginEditResult.CANCEL) {
               return Deferred.fail(originalResult);
            }

            if (result instanceof Deferred) {
               return result.addCallback(function(newOptions) {
                  return newOptions;
               });
            }

            if (result instanceof Record || result.item instanceof Record) {
               return Deferred.success(result);
            }

            if (isAdd) {
               return _private.createModel(self, result);
            }
         }

         return Deferred.success(originalResult);
      },

      afterBeginAdd: function(self, options) {
         self._isAdd = true;
         self._editingItem = options.item.clone();
         self._notify('afterBeginEdit', [options.item, true], {bubbling: true});
         self._options.listModel.setEditingItem(self._editingItem);

         return self._editingItem;
      },

      endEdit: function(self, commit) {
         //Чтобы при первом старте редактирования не летели лишние события
         if (!self._editingItem) {
            return Deferred.success();
         }

         var result = self._notify('endEdit', [self._editingItem, commit, self._isAdd], {bubbling: true});

         if (result === EndEditResult.CANCEL) {
            return Deferred.fail();
         }

         if (result instanceof Deferred) {
            //Если мы попали сюда, то прикладники сами сохраняют запись
            return result.addCallback(function() {
               _private.afterEndEdit(self);
            });
         }

         return _private.updateModel(self, commit).addCallback(function() {
            _private.afterEndEdit(self);
         });
      },

      afterEndEdit: function(self) {
         //Это событие всплывает, т.к. прикладники после завершения сохранения могут захотеть показать кнопку "+Запись" (по стандарту при старте добавления она скрывается)
         self._notify('afterEndEdit', [self._oldItem, self._isAdd], {bubbling: true});
         _private.resetVariables(self);
         self._options.listModel.setEditingItem(null);
      },

      createModel: function(self, options) {
         return self._options.source.create().addCallback(function(newRecord) {
            options.item = newRecord;
            return options;
         });
      },

      updateModel: function(self, commit) {
         if (commit) {
            if (self._options.source) {
               return self._options.source.update(self._editingItem).addCallback(function() {
                  _private.acceptChanges(self);
               });
            } else {
               _private.acceptChanges(self);
            }
         }

         return Deferred.success();
      },

      acceptChanges: function(self) {
         if (self._isAdd) {
            self._options.listModel.getItems().add(self._editingItem);
         } else {
            self._oldItem.merge(self._editingItem);
         }
      },

      resetVariables: function(self) {
         self._oldItem = null;
         self._editingItem = null;
         self._isAdd = null;
      },

      validate: function(self) {
         return self._children.formController.submit();
      },

      editNextRow: function(self, editNextRow) {
         var
            items = self._options.listModel.getItems(),
            index = self._options.listModel.getEditingItemIndex();

         if (editNextRow) {
            if (index < items.getCount() - 1) {
               self.beginEdit(items.at(index + 1));
            } else if (self._options.editingConfig && self._options.editingConfig.autoAdd) {
               self.beginAdd();
            } else {
               self.commitEdit();
            }
         } else {
            if (index > 0) {
               self.beginEdit(items.at(index - 1));
            } else {
               self.commitEdit();
            }
         }
      }
   },
   BeginEditResult = { // Возможные результаты события "BeginEditResult"
      CANCEL: 'Cancel'
   },
   EndEditResult = { // Возможные результаты события "onEndEdit"
      CANCEL: 'Cancel' // Отменить завершение редактирования/добавления
   };

   var EditInPlace = Control.extend({
      _template: template,
      /**
       * @class Controls/List/EditInPlace
       * @author Зайцев А.С.
       * @public
       */

      /**
       * @typedef {String|WS.Data/Entity/Record|Core/Deferred} BeginEditResult
       * @variant {String} Cancel Cancel start of editing.
       * @variant {WS.Data/Entity/Record} item Editing record.
       * @variant {Core/Deferred} Deferred Deferred is used for asynchronous preparation of edited record. It is necessary to fullfill deferred with a record which will be opened for editing.
       */

      /**
       * @typedef {String|Core/Deferred} EndEditResult
       * @variant {String} Cancel Cancel ending of editing\adding.
       * @variant {Core/Deferred} Deferred Deferred is used for saving with custom logic.
       */

      /**
       * @typedef {Object} BeginAddOptions
       * @param {WS.Data/Entity/Record} [options.item] Record with initial data.
       */

      /**
       * @typedef {String|Core/Deferred|BeginAddOptions} BeginAddResult
       * @variant {String} Cancel Cancel start of adding.
       * @variant {BeginAddOptions} Options of adding.
       * @variant {Core/Deferred} Deferred Deferred is used for asynchronous preparation of adding record. It is necessary to fullfill deferred with options of adding.
       */

      /**
       * @event Controls/List/EditInPlace#beginEdit Happens before start of editing.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {WS.Data/Entity/Record} item Editing record.
       * @returns {BeginEditResult}
       */

      /**
       * @event Controls/List/EditInPlace#beginAdd Happens before start of adding.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {BeginAddOptions} Options of adding.
       * @returns {BeginAddResult}
       */

      /**
       * @event Controls/List/EditInPlace#afterBeginEdit Happens after start of editing\adding.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {WS.Data/Entity/Record} item Editing record.
       * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
       */

      /**
       * @event Controls/List/EditInPlace#endEdit Happens before the end of editing\adding.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {Boolean} commit If it is true editing ends with saving.
       * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
       * @returns {EndEditResult}
       */

      /**
       * @event Controls/List/EditInPlace#afterEndEdit Happens after the end of editing\adding.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {WS.Data/Entity/Record} item Editing record.
       * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
       */

      _beforeMount: function(newOptions) {
         if (newOptions.editingConfig) {
            if (newOptions.editingConfig.item) {
               this._editingItem = newOptions.editingConfig.item;
               newOptions.listModel.setEditingItem(this._editingItem);
               if (newOptions.listModel._itemsModel._isAdd) {
                  this._isAdd = true;
               } else {
                  this._oldItem = newOptions.listModel.getItemById(this._editingItem.get(newOptions.listModel._options.idProperty)).getContents();
               }
            }
         }
      },

      /**
       * Starts editing in place.
       * @param {WS.Data/Entity/Record} record Editing record.
       * @returns {Core/Deferred}
       */
      //TODO: управлять индикатором загрузки
      beginEdit: function(record) {
         var self = this,
            editingItemIndex = this._options.listModel.getEditingItemIndex(),
            currentItemIndex = this._options.listModel.getItems().getIndex(record);
         //Если currentItemIndex = -1, то происходит добавление
         if (editingItemIndex !== currentItemIndex && ~currentItemIndex) {
            return this.commitEdit().addCallback(function() {
               return _private.beginEdit(self, record).addCallback(function(newRecord) {
                  return _private.afterBeginEdit(self, newRecord);
               });
            });
         }
      },

      /**
       * Starts adding.
       * @param {BeginAddOptions} options Options of adding.
       * @returns {Core/Deferred}
       */
      //TODO: управлять индикатором загрузки
      beginAdd: function(options) {
         var self = this;
         return this.commitEdit().addCallback(function() {
            return _private.beginAdd(self, options || {}).addCallback(function(newOptions) {
               return _private.afterBeginAdd(self, newOptions);
            });
         });
      },

      /**
       * Ends editing in place with saving.
       * @returns {Core/Deferred}
       */
      commitEdit: function() {
         var self = this;

         return _private.validate(this).addCallback(function(result) {
            for(var key in result) {
               if (result.hasOwnProperty(key) && result[key]) {
                  return Deferred.fail();
               }
            }
            return _private.endEdit(self, true);
         });
      },

      /**
       * Ends editing in place without saving.
       * @returns {Core/Deferred}
       */
      cancelEdit: function() {
         return _private.endEdit(this, false);
      },

      _onKeyDown: function(e) {
         if (this._editingItem) {
            switch(e.nativeEvent.keyCode) {
               case 13: //Enter
                  if (this._options.editingConfig && this._options.editingConfig.singleEdit) {
                     this.commitEdit();
                  } else {
                     _private.editNextRow(this, true);
                  }
                  break;
               case 27: //Esc
                  this.cancelEdit();
                  break;
               case 9: //Tab //TODO: для грида это не подойдет, так что надо перейти на _onRowDeactivated после решения проблем с ним
                  _private.editNextRow(this, !e.nativeEvent.shiftKey);
                  break;
            }
         }
      },

      _onItemClick: function(e, record) {
         if (this._options.editingConfig && this._options.editingConfig.editOnClick) {
            this.beginEdit(record);
         }
      },

      _onRowDeactivated: function(e, isTabPressed) {
         //TODO: по табу стреляет несколько раз на одной и той же строке, надо Шипину показать
         //TODO: про таб знаем, а про шифт нет, нужно доработать немножко
         if (isTabPressed) {
            // _private.editNextRow(this, true);
            // console.log('ушёл фокус со строки по табу');
         }
         e.stopPropagation();
      },

      _beforeUnmount: function() {
         _private.resetVariables(this);
      }
   });

   EditInPlace._private = _private;
   return EditInPlace;
});