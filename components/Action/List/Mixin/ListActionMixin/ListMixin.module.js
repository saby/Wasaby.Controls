/* global define, $ws */
define('js!SBIS3.CONTROLS.Action.List.ListMixin', function () {
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
             * Список должен быть с примесью миксинов ({@link SBIS3.CONTROLS.ItemsControlMixin} или {@link SBIS3.CONTROLS.Data.Collection.IList}) для работы с однотипными элементами.
             * Подробнее о базовых платформенных списках вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/list-types/">Виды списков</a>.
             * @see getLinkedObject
             * @see setLinkedObject
             */
            linkedObject: undefined,
            /**
             * @cfg {SBIS3.CONTROLS.Data.Source.ISource} связанный истоник данных.
             * @see getDataSource
             * @see setDataSource
             * @see #SBIS3.CONTROLS.Data.Source.ISource
             */
            dataSource: undefined
         }
      },
      /**
       * Возвращает связанный объект с данными
       * @returns {*}
       * @see linkedObject
       */
      getLinkedObject: function () {
         return this._options.linkedObject;
      },
      /**
       * Устанавливает связанный объект с данными
       * @param {*} list
       * @see linkedObject
       */
      setLinkedObject: function (list) {
         this._options.linkedObject = list;
      },
      /**
       * Возвращает связанный источник данных
       * @returns {SBIS3.CONTROLS.Data.Source.ISource} dataSource
       * @see dataSource
       */
      getDataSource: function() {
         if (this._options.dataSource)
            return this._options.dataSource;

         if ($ws.helpers.instanceOfMixin(this.getLinkedObject(), 'SBIS3.CONTROLS.ItemsControlMixin')) {
            return this.getLinkedObject().getDataSource();
         }
      },
      /**
       * Устанавливает связанный источник данных
       * @param {*}
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

         if ($ws.helpers.instanceOfMixin(this.getLinkedObject(), 'SBIS3.CONTROLS.MultiSelectable')) {
            var selItems = this.getLinkedObject().getSelectedItems(false),
               records = [];
            if (selItems && selItems.getCount()) {
               selItems.each(function(record) {
                  records.push(record);
               });
               return records;
            }
         }
         if ($ws.helpers.instanceOfMixin(this.getLinkedObject(), 'SBIS3.CONTROLS.Selectable')) {
            var key = this.getLinkedObject().getSelectedKey(),
               record = this.getLinkedObject().getItems().getRecordById(key);
            return record ? [record] : undefined;
         }
      },
      _getItems: function() {
         if($ws.helpers.instanceOfMixin(this.getLinkedObject(), 'SBIS3.CONTROLS.ItemsControlMixin')) {
            return this.getLinkedObject().getItems();
         }
         return this.getLinkedObject();
      }
   };
   return ListMixin;
});