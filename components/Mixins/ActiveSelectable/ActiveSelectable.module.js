/**
 * Created by am.gerasimov on 24.11.2015.
 */
define('js!SBIS3.CONTROLS.ActiveSelectable', [
   "Core/Deferred",
   "js!WS.Data/Entity/Model",
   "Core/core-instance"
], function( Deferred,Model, cInstance) {
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
             * @cfg {WS.Data/Entity/Model} Устанавливает выбранным элемент коллекции по переданному экземпляру класса.
             * Устанавливает экземпляр класса {@link WS.Data/Entity/Model} с данными выбранной записи.
             * Опция актуальна, когда контрол находится в режиме единичного выбора значений.
             * @see setSelectedItem
             * @see getSelectedItem
             */
            selectedItem : null
         }
      },

      after: {
         _modifyOptions: function(opts) {
            if(opts.selectedItem instanceof Model) {
               return opts;
            }

            /* Пре-инициализация selectedItem, если selectedItem пришёл как объект
               требуется проинициализировать, чтобы была возможность построить вёрстку на уровне шаблонизатора */
            if(opts.selectedItem && !Object.isEmpty(opts.selectedItem) && opts.selectedItem[opts.idProperty] && opts.selectedItem[opts.displayProperty]) {
               opts.selectedItem = new Model({
                  idProperty: opts.idProperty,
                  rawData: opts.selectedItem
               });
               opts.selectedKey = opts.selectedItem.get(opts.idProperty);
            }

            return opts;
         }
      },

      $constructor: function() {
         if(!cInstance.instanceOfMixin(this, 'SBIS3.CONTROLS.Selectable')) {
            throw new Error('Selectable mixin is required');
         }

         this._options.selectedItem = this._options.selectedItem instanceof Model ? this._options.selectedItem : null;
      },
      /**
       * Устанавливает выбранный элемент коллекции.
       * @param {WS.Data/Entity/Model} item Выбранный элемент коллекции.
       * @example
       * <pre>
       *     var selItem = this.getChildControlByName('MyControl').getSelectedItem();
       *       . . .
       *     if (selItem != '') {
       *        NewControl.setSelectedItem(selItem);
       *     }
       * </pre>
       * @see selectedItem
       * @see getSelectedItem
       */
      setSelectedItem: function(item) {
         var isModel = item instanceof Model,
             key;


         if(!isModel && !this._options.selectedItem) {
            return;
         }

         this._options.selectedItem = isModel ? item : null;

         key = isModel ? item.get(this._options.idProperty) : null;

         if(key === undefined) {
            throw new Error(this._moduleName + ': record key is undefined.');
         }

         this._options.selectedKey = key;

         this._notifyOnPropertyChanged('selectedItem');
         this.setSelectedKey(key);
      },

      initializeSelectedItem: function() {
         this._options.selectedItem = new Model({idProperty: this._options.idProperty});
      },

      /**
       * Возвращает выбранный элемент коллекции.
       * @param loadItem загружать ли запись, если о ней нет информации в dataSet
       * @returns {null|WS.Data/Entity/Model}
       * @example
       * <pre>
       *     var myItem = this.getChildControlByName('MyControl').getSelectedItem();
       * </pre>
       * @see selectedItem
       * @see setSelectedItem
       */
      getSelectedItem: function(loadItem) {
         var
            dResult = new Deferred(),
            selItem, selKey, self = this;

         this._syncSelectedItem();

         selItem = this._options.selectedItem;
         selKey = this._options.selectedKey;

         if(!loadItem) {
            return selItem;
         }

         if(selKey !== null) {
            if (!selItem) {
               var item = this.getItems() && this.getItems().getRecordById(selKey);

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
             selKey = this._options.selectedKey,
             key;

         if(selItem) {
            key = selItem.get(this._options.idProperty);
         }

         /* При синхронизации запись без ключа считаем невыбранной, т.к. с помощью метода set такую запись установить нельзя,
            т.е. она может только проинициализироваться из контекста */
         /* Ключ может быть строкой или числом, учитываем при проверке */
         if( key && (selKey === null || (selKey !== key) && selKey !== String(key)) ) {
            this._options.selectedItem = null;
            this._notifyOnPropertyChanged('selectedItem');
         }
      }

   };

   return ActiveSelectable;

});