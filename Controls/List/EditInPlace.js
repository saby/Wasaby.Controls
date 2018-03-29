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
         self._notify('afterBeginEdit', [self._editingItem], {bubbling: true});
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
               return _private.createModel(self);
            }
         }

         return Deferred.success(originalResult);
      },

      afterBeginAdd: function(self, options) {
         self._isAdd = true;
         self._editingItem = options.item.clone();
         self._notify('afterBeginEdit', [self._editingItem, true], {bubbling: true});
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
               _private.acceptChanges(self);
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

      createModel: function(self) {
         return self._options.source.create(options).addCallback(function(newRecord) {
            options.item = newRecord;
            return options;
         });
      },

      updateModel: function(self, commit) {
         if (commit) {
            if (self._options.source) {
               return self._options.source.update(self._editingItem).addCallback(function() {
                  _private.acceptChanges(self);
               }).addErrback(function(error) {
                  return error;
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
      CANCEL: 'Cancel',
      PENDING_ALL: 'PendingAll', // В результате редактирования ожидается вся запись, как есть (с текущим набором полей)
      PENDING_MODIFIED_ONLY: 'PendingModifiedOnly' // В результате редактирования ожидаются только измененные поля
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
       * @variant {String} Cancel Отменить завершение редактирования.
       * @variant {String} PendingAll В результате редактирования ожидается вся запись, как есть (с текущим набором полей).
       * @variant {String} PendingModifiedOnly В результате редактирования ожидаются только измененные поля. Это поведение используется по умолчанию.
       * @variant {WS.Data/Entity/Record} item -  Редактируемая запись.
       * @variant {Core/Deferred} Deferred - используется для асинхронной подготовки редактируемой записи. Из Deferred необходимо обязательно возвращать запись, открываемую на редактирование.
       */

      /**
       * @typedef {String|Core/Deferred} EndEditResult
       * @variant {String} Cancel Отменить завершение редактирования/добавления.
       * @variant {Core/Deferred} Deferred - используется для завершения редактирования\добавления, согласно логике, определённой прикладным разработчиком.
       */

      /**
       * @typedef {Object} BeginAddOptions
       * @param {WS.Data/Entity/Record} [options.item] - запись с начальным набором данных
       * @param {String} [options.addPosition=bottom] - тут пока непонятно как назвать
       */

      /**
       * @typedef {Core/Deferred|BeginAddOptions} BeginAddResult
       * @variant {BeginAddOptions} Настройки добавления по месту.
       * @variant {Core/Deferred} Deferred - используется асинхронной подготовки добавляемой записи. Из Deferred обязательно возвращать настройки добавления по месту.
       */

      /**
       * @event Controls/List/EditInPlace#beginEdit Происходит перед началом редактирования.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Record} item Редактируемая запись.
       * @returns {BeginEditResult}
       */

      /**
       * @event Controls/List/EditInPlace#beginAdd Происходит перед началом редактирования.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Дескриптор события.
       * @param {BeginAddOptions} Настройки добавления по месту.
       * @returns {BeginAddResult}
       */

      /**
       * @event Controls/List/EditInPlace#afterBeginEdit Происходит после начала редактирования\добавления.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Record} item Редактируемая запись.
       * @param {Boolean} isAdd Флаг, позволяющий различать редактирование и добавление.
       */

      /**
       * @event Controls/List/EditInPlace#endEdit Происходит перед окончанием редактирования\добавления.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Record} item Редактируемая запись.
       * @param {Boolean} commit - true - изменения сохраняются, false - изменения не сохраняются.
       * @param {Boolean} isAdd Флаг, позволяющий различать редактирование и добавление.
       * @returns {EndEditResult}
       */

      /**
       * @event Controls/List/EditInPlace#afterEndEdit Происходит после окончания редактирования\добавления.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Дескриптор события.
       * @param {WS.Data/Entity/Record} item Редактируемая запись.
       * @param {Boolean} isAdd Флаг, позволяющий различать редактирование и добавление.
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
       * Начинает редактирование по месту.
       * @param {WS.Data/Entity/Record} record
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
       * Начинает добавление по месту
       * @param {BeginAddOptions} options Настройки добавления по месту
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
       * Завершает редактирование по месту
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
       * Отменяет редактирование по месту
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

   return EditInPlace;
});