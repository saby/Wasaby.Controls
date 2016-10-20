/* global define, $ws */
define('js!SBIS3.CONTROLS.Action.List.ListMixin', ['Core/core-instance'], function (cInstance) {
   'use strict';
   /**
    * @mixin SBIS3.CONTROLS.Action.List.ListMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var ListMixin = /** @lends SBIS3.CONTROLS.Action.List.ListMixin.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {*} связанный список.
             * @remark
             * Список должен быть с примесью миксинов ({@link SBIS3.CONTROLS.ItemsControlMixin} или {@link WS.Data/Collection/IList}) для работы с однотипными элементами.
             * Подробнее о базовых платформенных списках вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-types/">Виды списков</a>.
             * @see getLinkedObject
             * @see setLinkedObject
             */
            linkedObject: undefined,
            /**
             * @cfg {WS.Data/Source/ISource} связанный истоник данных.
             * @see getDataSource
             * @see setDataSource
             * @see #WS.Data/Source/ISource
             */
            dataSource: undefined
         }
      },
      /**
       * Возвращает связанный объект с данными
       * @returns {WS.Data/Collection/IList|SBIS3.CONTROLS.ListView}
       * @see linkedObject
       */
      getLinkedObject: function () {
         return this._options.linkedObject;
      },
      /**
       * Устанавливает связанный объект с данными
       * @param {WS.Data/Collection/IList|SBIS3.CONTROLS.ListView} list
       * @see linkedObject
       */
      setLinkedObject: function (list) {
         this._options.linkedObject = list;
      },
      /**
       * Возвращает связанный источник данных
       * @returns {WS.Data/Source/ISource} dataSource
       * @see dataSource
       */
      getDataSource: function() {
         if (this._options.dataSource)
            return this._options.dataSource;

         if (cInstance.instanceOfMixin(this.getLinkedObject(), 'SBIS3.CONTROLS.ItemsControlMixin')) {
            return this.getLinkedObject().getDataSource();
         }
      },
      /**
       * Устанавливает связанный источник данных
       * @param {WS.Data/Source/ISource}
       * @see dataSource
       */
      setDataSource: function(dataSource) {
         this._options.dataSource = dataSource;
      },
      /**
       * Возвращает выделенные элементы в linkedObject
       * @returns Array
       */
      getSelectedItems: function() {
         if(!this.getLinkedObject())
            return [];

         if (cInstance.instanceOfMixin(this.getLinkedObject(), 'SBIS3.CONTROLS.MultiSelectable')) {
            var selItems = this.getLinkedObject().getSelectedItems(false),
               records = [];
            if (selItems && selItems.getCount()) {
               selItems.each(function(record) {
                  records.push(record);
               });
               return records;
            }
         }
         if (cInstance.instanceOfMixin(this.getLinkedObject(), 'SBIS3.CONTROLS.Selectable')) {
            var key = this.getLinkedObject().getSelectedKey(),
               record = this.getLinkedObject().getItems().getRecordById(key);
            return record ? [record] : undefined;
         }
      },
      /**
       * Возвращает связанный список элементов
       * @returns {WS.Data/Collection/IList}
       * @protected
       */
      _getItems: function() {
         var listView = this.getLinkedObject();
         if (cInstance.instanceOfModule(listView, 'SBIS3.CONTROLS.ListView')) {
            return this.getLinkedObject().getItems();
         }
         return this.getLinkedObject();
      },
      /**
       * Если связанный объект списочный контрол вернет его, иначе undefined
       * @returns {SBIS3.CONTROLS.ListView|undefined}
       * @protected
       */
      _getListView: function() {
         var listView = this.getLinkedObject();
         if (cInstance.instanceOfModule(listView, 'SBIS3.CONTROLS.ListView')) {
            return listView;
         }
         return undefined;
      }
   };
   return ListMixin;
});