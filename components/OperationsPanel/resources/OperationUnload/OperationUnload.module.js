/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationUnload', [
   'js!SBIS3.CONTROLS.PrintUnloadBase',
   'js!SBIS3.CONTROLS.Utils.DataProcessor',
   'js!SBIS3.CONTROLS.Data.Record',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'i18n!SBIS3.CONTROLS.OperationUnload'
], function(PrintUnloadBase, Exporter, Record, SbisAdapter, rk) {
   //TODO Идея! нужно просто вызвать у view.export, он в свою очередь поднимает событие onUnload, а событие подхыватит выгрузчик. тогда в кнопке вообще только визуализация будет
   /**
    * Контрол для экспорта в Excel, PDF  подготовленных данных
    * @class SBIS3.CONTROLS.OperationUnload
    * @extends SBIS3.CONTROLS.PrintUnloadBase
    * @author Крайнов Дмитрий Олегович
    * @control
    * @public
    */
   var OperationUnload = PrintUnloadBase.extend(/** @lends SBIS3.CONTROLS.OperationUnload.prototype */{
      /**
       * <pre>
       *
       * items: [
       *  {
       *     id : 'PDF',
       *     title : 'Список в PDF',
       *     icon : 'sprite:icon-24 icon-PDF2 icon-multicolor action-hover'
       *  },
       *  {
       *     id : 'Excel',
       *     title : 'Список в Excel',
       *     icon : 'sprite:icon-24 icon-Excel icon-multicolor action-hover',
       *  }
       * ]
       *  </pre>
       */
      $protected: {
         _options: {
            icon: 'sprite:icon-24 action-hover icon-Save icon-primary',
            title: rk('Выгрузить'),
            linkText: rk('Выгрузить'),
            caption: rk('Выгрузить'),
            /**
             * @typedef {Object} Binding
             * @property {String} saveList Списочный метод БЛ, который будет использоваться при сохранении всего списка записей.
             * @property {String} saveDataSet Списочный метод БЛ, который будет использоваться при сохранении выбранных записей.
             */
            /**
             * @typedef {Object} Items
             * @property {Binding} binding Имена методов БЛ, которые будут использованы при сохранении.
             * @property {Boolean} serverSideExport Использовать серверную выгрузку.
             */
            /**
             * @cfg {Items[]} Набор вариантов выгрузки.
             */
            items: [
               {
                  id : 'PDF',
                  title : rk('Список в PDF'),
                  pageOrientation: 1,
                  serverSideExport : true,
                  binding: {
                     saveList: undefined,
                     saveDataSet: undefined
                  },
                  icon : 'sprite:icon-24 icon-PDF2 icon-multicolor action-hover'
               },
               {
                  id : 'Excel',
                  title : rk('Список в Excel'),
                  serverSideExport : true,
                  binding: {
                     saveList: undefined,
                     saveDataSet: undefined
                  },
                  icon : 'sprite:icon-24 icon-Excel icon-multicolor action-hover'
               }
            ]
         },
         _controlsId: {
            'PDF' : {
               objectName : 'PDF',
               method: 'Сохранить'
            },
            'Excel'  : {
               objectName : 'Excel',
               method: 'СохранитьПоHTML'
            }
         },
         _currentItem: undefined
      },

      $constructor: function() {
         //Почему-то нельзя в опциях указать handlers {'onMenuActivated' : function(){}} Поэтогму подписываемся здесь
         this.subscribe('onMenuItemActivate', this._menuItemActivated);
         this._clickHandler = this._clickHandler.callNext(this._clickHandlerOverwritten);
      },
      _clickHandlerOverwritten: function() {
         var items = this._options.items,
              extraText, itemId;
         //view.deleteRecords(records);
         extraText =  this._isSelectedState() ? ' отмеченных ' : ' ';
        for (var i = 0; i < items.length; i++) {
            itemId = items[i].id;
            //Меняем текст только у платформенных пунктов меню
            if (this._controlsId[itemId]) {
               items[i].title = 'Список'  + extraText + 'в ' + this._controlsId[itemId].objectName;
               //TODO Возможно, когда-нибудь будет правильный метод для перерисовки внутренностей меню и внизу можно будет вызывать полную перерисовку picker без его уничтожения
               this._picker._container.find('>[data-id="' + itemId + '"]').find('.controls-MenuItem__text').text( items[i].title );
            }
         }
         //this._picker._drawItems(); - это заенит строку выше с .text, когда заработает
      },
      _menuItemActivated: function(event, itemId){
         this._currentItem = itemId;
         if (this._controlsId[itemId]) {
            this._prepareOperation('Что сохранить в ' + this._controlsId[itemId].objectName);
         }
      },
      _isSelectedState: function(){
         return this._getView().getSelectedKeys().length > 0;
      },
      /**
       * @param columns
       * @private
       */
      _notifyOnApply : function(columns){
         return this._notify('onApplyOperation', 'export', columns);
      },
      _applyMassOperation : function(ds){
         if (this._isClientUnload()) {
            this._applyOperation(ds);
            return;
         }
         this.processSelectedPageSize(ds.getCount());
      },
      /**
       * Обработка результатов выбора пользователя (после показа диалога выбора количества выгружаемых записей)
       * Если есть возможность, формируем фильтры и выполняем выгрузку на сервере через GET-запрос
       * Если у нас возможно
       * @param {number} [pageSize] сколько записей нужно выгружать()
       */
      processSelectedPageSize: function(pageSize){
         var fullFilter,
             exporter,
             pageOrient = this._getPDFPageOrient(),
             methodName = this._getCurrentItem().get('binding').saveList;
         if (this._isClientUnload()) {
            OperationUnload.superclass.processSelectedPageSize.apply(this, arguments);
            return;
         }

         exporter = new Exporter(this._prepareExporterConfig());
         fullFilter = exporter.getFullFilter(pageSize, true);
         fullFilter['FileName'] = this._getUnloadFileName();
         if (this._currentItem === 'PDF') {
            delete fullFilter.HierarchyField;
         }
         if (methodName) {
            fullFilter['MethodName'] = methodName;
         }
         exporter.exportList(this._getUnloadFileName(), this._currentItem, undefined, fullFilter, pageOrient );
      },
      _getPDFPageOrient: function(){
         var pageOrient;
         if (this._currentItem === 'PDF'){
            pageOrient = this._dataSet.getRecordById(this._currentItem).getRaw().pageOrientation;
         }
         return pageOrient
      },
      /**
       * @deprecated Переименован в _prepareExporterConfig
       * @returns {*}
       * @private
       */
      _prepareUnloaderConfig:function(){
         return this._prepareExporterConfig();
      },
      _prepareExporterConfig : function() {
         var  view = this._getView(),
            cfg = {
               dataSet: view.getDataSet(),
               columns: this._prepareOperationColumns(),
               dataSource : view.getDataSource(),
               filter : view.getFilter(),
               offset: view._offset
            };
         if ($ws.helpers.instanceOfMixin(view, 'SBIS3.CONTROLS.TreeMixin')) {
            cfg.hierField = view.getHierField();
            cfg.openedPath = view.getOpenedPath();
            cfg.root = view.getCurrentRoot();
         }
         return cfg;
      },
      applyOperation: function(cfg){
         var
             filter,
             fullFilter,
             pageOrient = this._getPDFPageOrient(),
             methodName = this._getCurrentItem().get('binding').saveDataSet,
             exporter = new Exporter(methodName ? this._prepareExporterConfig() : cfg);

         if (this._isClientUnload()) {
            //TODO что делать, если метод шибко прикладной?
            exporter.exportHTML(this._getUnloadFileName(), this._currentItem, undefined, undefined, pageOrient);
         } else {
            if (methodName) {
               filter = new Record({
                  adapter: new SbisAdapter(),
                  format: [{
                     name: 'selectedIds',
                     type: 'array',
                     kind: 'string'
                   }]
               });
               filter.set('selectedIds', this._getView().getSelectedKeys());
               fullFilter = exporter.getFullFilter(cfg.dataSet.getCount(), true);
               fullFilter['MethodName'] = methodName;
               fullFilter['FileName'] = this._getUnloadFileName();
               fullFilter['Filter'] = filter;
               if (this._currentItem === 'PDF') {
                  delete fullFilter.HierarchyField;
               }
               exporter.exportList(this._getUnloadFileName(), this._currentItem, undefined, fullFilter, pageOrient);
            } else {
               exporter.exportDataSet(this._getUnloadFileName(), this._currentItem, undefined, undefined, pageOrient);
            }
         }
         //p.exportData(this._controlsId[this._currentItem].objectName, this._controlsId[this._currentItem].method, this._getUnloadFileName() );
      },
      _getUnloadFileName: function(){
         return  this._options.fileName || this._getView().getColumns()[0].title || 'Как на экране';
      },
      _getCurrentItem: function() {
         return this.getItems().getRecordById(this._currentItem);
      },
      _isClientUnload : function() {
         //Для IOS всегда будем выгружать через сервер. Android прекрасно умеет выгружать
         return !(this._getCurrentItem().get('serverSideExport') || $ws._const.browser.isMobileSafari);
      }
   });

   return OperationUnload;

});