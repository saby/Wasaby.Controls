define('Controls/List/EditInPlace', [
   'Core/Control',
   'Core/Deferred',
   'WS.Data/Entity/Record',
   'WS.Data/Type/descriptor',
   'css!Controls/List/EditInPlace/EditInPlace'
], function (Control, Deferred, Record, types) {

   var _private = {
      /**
       *
       * @param self
       * @param {WS.Data/Entity/Record} record
       * @returns {Core/Deferred}
       */
      beginEdit: function(self, record) {
         var result = self._notify('beginEdit', [record], {bubbling: true});

         if (result === BeginEditResult.CANCEL) {
            return Deferred.fail(record);
         }

         self._oldItem = record;

         if (result instanceof Deferred) {
            return result.addCallback(function(newRecord) {
               return newRecord;
            });
         }

         if (result instanceof Record) {
            return Deferred.success(result);
         }

         return Deferred.success(record);
      },

      /**
       *
       * @param self
       * @param {WS.Data/Entity/Record} record
       * @returns {WS.Data/Entity/Record}
       */
      afterBeginEdit: function(self, record) {
         self._editingItem = record.clone();
         self._notify('afterBeginEdit', [self._editingItem], {bubbling: true});

         return self._editingItem;
      },

      /**
       *
       * @param self
       * @param {Object} options
       * @returns {Core/Deferred}
       */
      beginAdd: function(self, options) {
         //TODO: надо где-нибудь запоминать опции
         var result = self._notify('beginAdd', [options], {bubbling: true});

         if (result === BeginEditResult.CANCEL) {
            return Deferred.fail(options);
         }

         if (result) {
            if (result instanceof Deferred) {
               return result.addCallback(function(newRecord) {
                  options.record = newRecord;
                  return options;
               });
            }
            if (result.record instanceof Record) {
               return Deferred.success(result);
            }
         }

         if (!options.record) {
            return self._options.source.create(options).addCallback(function(newRecord) {
               options.record = newRecord;
               return options;
            });
         } else {
            return Deferred.success(options);
         }
      },

      afterBeginAdd: function(self, options, items, source) {
         //TODO: копипаста
         self._isAdd = true;
         self._editingItem = options.record.clone();
         self._notify('afterBeginEdit', [self._editingItem, true], {bubbling: true});

         return self._editingItem;
      },

      /**
       *
       * @param self
       * @param {Boolean} commit - true - сохранять запись, false - не сохранять запись
       * @returns {Core/Deferred}
       */
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
               self._notify('afterEndEdit', [], {bubbling: true});
            });
         }

         return _private.updateModel(self, commit).addCallback(function() {
            self._notify('afterEndEdit', [], {bubbling: true});
         });
      },

      updateModel: function(self, commit) {
         if (commit) {
            //TODO: если есть source, то тут нужно сбегать на БЛ
            if (self._isAdd) {
               self._editingItem.acceptChanges();
               //TODO: поддержать вставку в произвольное место
               self._options.items.add(self._editingItem);
            } else {
               self._editingItem.acceptChanges();
               self._oldItem.merge(self._editingItem);
            }
         }

         self._oldItem = undefined;
         self._editingItem = undefined;
         self._isAdd = undefined;

         return Deferred.success();
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
      /**
       * @class Controls/List/EditInPlace
       * @author Зайцев А.С.
       * @public
       */

      /**
       * @event Controls/List/EditInPlace#beginEdit Происходит перед началом редактирования
       * @param item Редактируемый элемент
       */

      /**
       * @event Controls/List/EditInPlace#afterBeginEdit Происходит после начала редактирования
       */

      /**
       * @event Controls/List/EditInPlace#endEdit Происходит перед окончанием редактирования
       * @param {WS.Data/Entity/Record} item Редактируемый элемент
       * @param {Boolean} commit commit - true - изменения сохраняются, false - изменения не сохраняются
       */

      /**
       * @event Controls/List/EditInPlace#afterEndEdit Происходит после окончания редактирования
       */

      _beforeMount: function(newOptions) {
         if (newOptions.initialConfig) {
            this._isAdd = newOptions.initialConfig.isAdd;
            this._editingItem = newOptions.initialConfig.record;
         }
      },

      /**
       * Начинает редактирование по месту.
       * @param {WS.Data/Entity/Record} record
       * @returns {Core/Deferred}
       */
      beginEdit: function(record) {
         var self = this;
         return this.commitEdit().addCallback(function() {
            return _private.beginEdit(self, record).addCallback(function(newRecord) {
               return _private.afterBeginEdit(self, newRecord);
            });
         });
      },

      /**
       * Начинает добавление по месту
       * @param {Object} options
       * @param {WS.Data/Entity/Record} options.record
       * @param {String} options.addPosition
       * @returns {Core/Deferred}
       */
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
         return _private.endEdit(this, true);
      },

      /**
       * Отменяет редактирование по месту
       * @returns {Core/Deferred}
       */
      cancelEdit: function() {
         return _private.endEdit(this, false);
      }
   });

   return EditInPlace;
});