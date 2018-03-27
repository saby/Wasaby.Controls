define('Controls/List/Remove', [
   'Core/Control',
   'tmpl!Controls/List/Remove/Remove',
   'Core/Deferred',
   'Controls/List/Remove/BeginRemoveResult'
], function (Control, template, Deferred, BeginRemoveResult) {

   var _private = {
      clearSelection: function(items) {
         //TODO: Удалить выделение
      },
      normalizeItems: function(items) {
         return Array.isArray(items) ? items : [items];
      },
      removeFromSource: function(items) {
         return this._source ? this._source.destroy(items) : Deferred.success(true);
      },
      removeFromListModel: function(items) {
         this._listModel.removeItems(items);
      },
      showLoadingIndicator: function() {
         //TODO: Показать индикатор
      },
      reload: function() {
         return Deferred.success();//TODO: Перезагрузить список
      },
      showError: function(error) {
         this._children.popupOpener.open({
            message: error,
            style: 'error'
         });
      },
      getRemoveMessage: function(count) {
         var result;
         if (typeof this._message === 'string') {
            result = this._message;
         } else if (typeof this._message === 'function') {
            result = this._message(count);
         } else {
            result = count !== 1 ? rk("Удалить записи?", "ОперацииНадЗаписями") : rk("Удалить текущую запись?", "ОперацииНадЗаписями");
         }
         return result;
      },
      showQuestion: function(message) {
         return this._children.popupOpener.open({
            message: message,
            type: 'yesno'
         });
      }
   };

   var Remove = Control.extend( {
      _template: template,
      _listModel: undefined,
      _source: undefined,
      _message: undefined,

      constructor: function (cfg) {
         Remove.superclass.constructor.apply(this, arguments);
         this._publish(['onBeginRemove', 'onEndRemove']);
      },

      _beforeMount: function(newOptions) {
         this._initOptions(newOptions);
      },

      _beforeUpdate: function(newOptions) {
         this._initOptions(newOptions);
      },

      _initOptions: function(newOptions) {
         if (newOptions.listModel && (this._listModel !== newOptions.listModel)) {
            this._listModel = newOptions.listModel;
         }
         if (newOptions.source && (this._source !== newOptions.source)) {
            this._source = newOptions.source;
         }
         if (newOptions.message && (this._message !== newOptions.message)) {
            this._message = newOptions.message;
         }
      },

      removeItems: function(items) {
         var
            self = this,
            beginRemoveResult;

         items = _private.normalizeItems(items);
         _private.showQuestion.call(this, _private.getRemoveMessage.call(this, items.length)).addCallback(function(result) {
            if (result === true) {
               beginRemoveResult = self._notify('onBeginRemove', items);
               beginRemoveResult = beginRemoveResult instanceof Deferred ? beginRemoveResult : Deferred.success(beginRemoveResult);
               beginRemoveResult.addBoth(function (result) {
                  self._removeItems(items, result);
               });
            }
         });
      },

      _removeItems: function(items, beginRemoveResult) {
         var
            self = this,
            resultDeferred,
            indicatorDeferred;

         if (beginRemoveResult !== BeginRemoveResult.CANCEL) {
            indicatorDeferred = _private.removeFromSource.call(this, items).addCallback(function(result) {
               if (self._source && beginRemoveResult !== BeginRemoveResult.WITHOUT_RELOAD) {
                  resultDeferred = _private.reload().addBoth(function () {
                     _private.clearSelection.call(self, items);
                     return result;
                  });
               } else {
                  _private.removeFromListModel.call(self, items);
                  _private.clearSelection.call(self, items);
                  resultDeferred = Deferred.success(result);
               }
               return resultDeferred;
            }).addErrback(function (result) {
               _private.showError.call(self, result.message);
               return result;
            }).addBoth(function (result) {
               self._notify('onEndRemove', items, result);
            });
            _private.showLoadingIndicator.call(this, indicatorDeferred);
         }
      }
   });

   return Remove;
});