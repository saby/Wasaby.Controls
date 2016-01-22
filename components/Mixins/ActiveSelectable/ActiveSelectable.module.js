/**
 * Created by am.gerasimov on 24.11.2015.
 */
define('js!SBIS3.CONTROLS.ActiveSelectable', ['js!SBIS3.CONTROLS.Data.Model'], function(Model) {

   function propertyUpdateWrapper(func) {
      return function() {
         return this.runInPropertiesUpdate(func, arguments);
      };
   }

   /**
    * Миксин, добавляющий поведение хранения выбранного элемента
    * @mixin SBIS3.CONTROLS.ActiveSelectable
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var ActiveSelectable = /**@lends SBIS3.CONTROLS.ActiveSelectable.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Выбранное значение (запись)
             * @example
             * <pre class=”brush: xml”>
             *    <option name="selectedItem">Выбранное значение</option>
             * </pre>
             * @see setSelectedItem
             * @see getSelectedItem
             */
            selectedItem : undefined
         }
      },

      $constructor: function() {
         if(!$ws.helpers.instanceOfMixin(this, 'SBIS3.CONTROLS.Selectable')) {
            throw new Error('Selectable mixin is required');
         }

         this._options.selectedItem = $ws.helpers.instanceOfMixin(this, 'SBIS3.CONTROLS.Data.Model') ?
             this._options.selectedItem :
             new Model();
      },
      /**
       * Устанавливает выбранную запись
       */
      setSelectedItem: propertyUpdateWrapper(function(item) {
         if($ws.helpers.instanceOfModule(item, 'SBIS3.CONTROLS.Data.Model')) {
            this._options.selectedItem = item;
            this.setSelectedKey(item.getIdProperty() ? item.getId() : null);
            this._notifyOnPropertyChanged('selectedItem');
         }

      }),

      /**
       * Возвращает выбранную запись
       * @param loadItem загружать ли запись, если о ней нет информации в dataSet
       * @returns {*}
       */
      getSelectedItem: function(loadItem) {
         var dResult = new $ws.proto.Deferred(),
             selItem = this._options.selectedItem,
             selKey = this._options.selectedKey,
             self = this;

         this._syncSelectedItem();

         if(!loadItem) {
            return selItem;
         }

         if(selKey !== null) {
            if (!selItem) {
               var item = this._dataSet && this._dataSet.getRecordByKey(selKey);

               if (item) {
                  dResult.callback(this._options.selectedItem = item);
                  this._notifyOnPropertyChanged('selectedItem');
               } else {
                  this._dataSource.read(selKey).addCallback(function (rec) {
                     dResult.callback(self._options.selectedItem = rec);
                     self._notifyOnPropertyChanged('selectedItem');
                  })
               }
            } else {
               dResult.callback(selItem);
            }
         } else {
            dResult.callback(selItem);
         }

         return dResult;
      },

      /* Синхронизирует выбранные ключи и выбранные записи */
      _syncSelectedItem: function() {
         var selItem = this._options.selectedItem,
             selKey = this._options.selectedKey;

         if(selKey === null && !selItem.getIdProperty()) {
            return;
         }
         if(selKey !== selItem.get(selItem.getIdProperty())) {
            this.setSelectedItem(new Model());
         }
      }

   };

   return ActiveSelectable;

});