define('Controls/List/EditInPlace', [
   'Core/Control',
   'tmpl!Controls/List/EditInPlace/EditInPlace',
   'Core/Deferred',
   'WS.Data/Entity/Record'
], function (Control, template, Deferred, Record) {

   var _private = {
      editItem: function(self, options, isAdd) {
         var result = self._notify(isAdd ? 'beforeItemAdd' : 'beforeItemEdit', [options]);
         if (!isAdd) {
            self._oldItem = options.item;
         }
         return _private.processBeforeItemEditResult(self, options, result, isAdd);
      },

      afterItemEdit: function(self, options, isAdd) {
         if (isAdd) {
            self._isAdd = true;
         }
         self._editingItem = options.item.clone();
         self._notify('afterItemEdit', [options.item, isAdd]);
         self._options.listModel.setEditingItem(self._editingItem);

         return self._editingItem;
      },

      processBeforeItemEditResult: function(self, originalResult, result, isAdd) {
         if (result) {
            if (result === ItemEditResult.CANCEL) {
               return Deferred.fail(originalResult);
            }

            if (result instanceof Deferred) {
               return result.addCallback(function(newOptions) {
                  return newOptions;
               });
            }

            if (result.item instanceof Record) {
               return Deferred.success(result);
            }

            if (isAdd) {
               return _private.createModel(self, result);
            }
         }

         return Deferred.success(originalResult);
      },

      endItemEdit: function(self, commit) {
         //Чтобы при первом старте редактирования не летели лишние события
         if (!self._editingItem) {
            return Deferred.success();
         }

         var result = self._notify('beforeItemEndEdit', [self._editingItem, commit, self._isAdd]);

         if (result === ItemEndEditResult.CANCEL) {
            return Deferred.fail();
         }

         if (result instanceof Deferred) {
            //Если мы попали сюда, то прикладники сами сохраняют запись
            return result.addCallback(function() {
               _private.afterItemEndEdit(self);
            });
         }

         return _private.updateModel(self, commit).addCallback(function() {
            _private.afterItemEndEdit(self);
         });
      },

      afterItemEndEdit: function(self) {
         //Это событие всплывает, т.к. прикладники после завершения сохранения могут захотеть показать кнопку "+Запись" (по стандарту при старте добавления она скрывается)
         self._notify('afterItemEndEdit', [self._oldItem, self._isAdd]);
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
               self.editItem({
                  item: items.at(index + 1)
               });
            } else if (self._options.editingConfig && self._options.editingConfig.autoAdd) {
               self.addItem();
            } else {
               self.commitEdit();
            }
         } else {
            if (index > 0) {
               self.editItem({
                  item: items.at(index - 1)
               });
            } else {
               self.commitEdit();
            }
         }
      }
   },
   ItemEditResult = { // Возможные результаты события "ItemEditResult"
      CANCEL: 'Cancel'
   },
   ItemEndEditResult = { // Возможные результаты события "onItemEndEdit"
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
       * @typedef {Object} ItemEditOptions
       * @param {WS.Data/Entity/Record} [options.item] Record with initial data.
       */

      /**
       * @typedef {String|WS.Data/Entity/Record|Core/Deferred} ItemEditResult
       * @variant {String} Cancel Cancel start of editing.
       * @variant {ItemEditOptions} options Options of editing.
       * @variant {Core/Deferred} Deferred Deferred is used for asynchronous preparation of edited record. It is necessary to fullfill deferred with a record which will be opened for editing.
       */

      /**
       * @typedef {String|Core/Deferred} ItemEndEditResult
       * @variant {String} Cancel Cancel ending of editing\adding.
       * @variant {Core/Deferred} Deferred Deferred is used for saving with custom logic.
       */

      /**
       * @typedef {Object} AddItemOptions
       * @param {WS.Data/Entity/Record} [options.item] Record with initial data.
       */

      /**
       * @typedef {String|Core/Deferred|AddItemOptions} AddItemResult
       * @variant {String} Cancel Cancel start of adding.
       * @variant {AddItemOptions} Options of adding.
       * @variant {Core/Deferred} Deferred Deferred is used for asynchronous preparation of adding record. It is necessary to fullfill deferred with options of adding.
       */

      /**
       * @event Controls/List/EditInPlace#beforeItemEdit Happens before start of editing.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {ItemEditOptions} item Options of editing.
       * @returns {BeforeItemEditResult}
       */

      /**
       * @event Controls/List/EditInPlace#beforeItemAdd Happens before start of adding.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {AddItemOptions} Options of adding.
       * @returns {AddItemResult}
       */

      /**
       * @event Controls/List/EditInPlace#afterItemEdit Happens after start of editing\adding.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {WS.Data/Entity/Record} item Editing record.
       * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
       */

      /**
       * @event Controls/List/EditInPlace#beforeItemEndEdit Happens before the end of editing\adding.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {Boolean} commit If it is true editing ends with saving.
       * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
       * @returns {ItemEndEditResult}
       */

      /**
       * @event Controls/List/EditInPlace#afterItemEndEdit Happens after the end of editing\adding.
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
       * @variant {ItemEditOptions} options Options of editing.
       * @returns {Core/Deferred}
       */
      //TODO: управлять индикатором загрузки
      editItem: function(options) {
         var self = this,
            editingItemIndex = this._options.listModel.getEditingItemIndex(),
            currentItemIndex = this._options.listModel.getItems().getIndex(options.item);
         //Если currentItemIndex = -1, то происходит добавление
         if (editingItemIndex !== currentItemIndex && ~currentItemIndex) {
            return this.commitEdit().addCallback(function() {
               return _private.editItem(self, options).addCallback(function(newOptions) {
                  return _private.afterItemEdit(self, newOptions);
               });
            });
         }
      },

      /**
       * Starts adding.
       * @param {AddItemOptions} options Options of adding.
       * @returns {Core/Deferred}
       */
      //TODO: управлять индикатором загрузки
      addItem: function(options) {
         var self = this;
         return this.commitEdit().addCallback(function() {
            return _private.editItem(self, options || {}, true).addCallback(function(newOptions) {
               return _private.afterItemEdit(self, newOptions, true);
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
            return _private.endItemEdit(self, true);
         });
      },

      /**
       * Ends editing in place without saving.
       * @returns {Core/Deferred}
       */
      cancelEdit: function() {
         return _private.endItemEdit(this, false);
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
            this.editItem({
               item: record
            });
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