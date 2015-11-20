/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationUnload', [
   'js!SBIS3.CONTROLS.PrintUnloadBase',
   'js!SBIS3.CONTROLS.Utils.DataProcessor'
], function(PrintUnloadBase, Unloader) {
   //TODO Идея! нужно просто вызвать у view.unload, он в свою очередь поднимает событие onUnload, а событие подхыватит выгрузчик. тогда в кнопке вообще только визуализация будет

   var OperationUnload = PrintUnloadBase.extend({
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
       *     unloadMethod: 'Excel.Сохранить'
       *  }
       * ]
       *  </pre>
       */
      $protected: {
         _options: {
            icon: 'sprite:icon-24 action-hover icon-Save icon-primary',
            title: 'Выгрузить',
            linkText: 'Выгрузить',
            caption: 'Выгрузить',
            //TODO перенести настройку опции в item. Чтобы можно было отдельно выгружать либо Excel, либо PDF
            serverSideUnload : false,
            items: [
               {
                  id : 'PDF',
                  title : 'Список в PDF',
                  icon : 'sprite:icon-24 icon-PDF2 icon-multicolor action-hover'
               },
               {
                  id : 'Excel',
                  title : 'Список в Excel',
                  icon : 'sprite:icon-24 icon-Excel icon-multicolor action-hover',
                  unloadMethod: 'Excel.Сохранить'
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
         //Для IOS всегда будем выгружать через сервер. Android прекрасно умеет выгружать
         this._options.serverSideUnload = this._options.serverSideUnload || $ws._const.browser.isMobileSafari;
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
         this._prepareOperation('Что сохранить в ' + this._controlsId[itemId].objectName);
      },
      _isSelectedState: function(){
         return this._getView().getSelectedKeys().length > 0;
      },
      /**
       * @param columns
       * @private
       */
      _notifyOnApply : function(columns){
         return this._notify('onApplyOperation', 'unload', columns);
      },
      _applyMassOperation : function(ds){
         if (this._isClientUnload()) {
            this._applyOperation(ds);
            return;
         }
         this.processSelectedOperation(ds.getCount());
      },
      /**
       * Обработка результатов выбора пользователя (после показа диалога выбора количества выгружаемых записей)
       * Если есть возможность, формируем фильтры и выполняем выгрузку на сервере через GET-запрос
       * Если у нас возможно
       * @param {number} [pageSize] сколько записей нужно выгружать()
       */
      processSelectedOperation: function(pageSize){
         var record = this._dataSet.getRecordByKey(this._currentItem).getRaw(),
             objectArr,
             fullFilter,
             unloader;
         //TODO когда появится воможность выгружать в PDF надо убрать проверку на Excel
         //Для Excel всегда выгружаем на сервере
         if (this._isClientUnload() || !record.unloadMethod) {
            OperationUnload.superclass.processSelectedOperation.apply(this, arguments);
            return;
         }
         unloader = new Unloader(this._prepareUnloaderConfig());
         fullFilter = unloader.getFullFilter(pageSize);
         fullFilter['Название'] = this._getUnloadFileName();
         objectArr = record.unloadMethod.split('.');
         unloader.unload(objectArr[0], objectArr[1], this._getUnloadFileName(), fullFilter, true );
      },
      _prepareUnloaderConfig : function() {
         var  view = this._getView(),
            cfg = {
               dataSet: view.getDataSet(),
               columns: this._prepareOperationColumns(),
               dataSource : view._dataSource,
               filter : view._filter,
               offset: view._offset
            };
         if (view._options.hasOwnProperty('hierField')) {
            cfg.hierField = view._options.hierField;
            cfg.openedPath = view.getOpenedPath();
            cfg.root = view.getCurrentRoot();
         }
         return cfg;
      },
      applyOperation: function(dataSet, cfg){
         var p = new Unloader(cfg);
         //TODO Если не задали имя файла в опции, то возьмем из 1ой колонки, а в 1ой пусто, Вставим текст
         p.unload(this._controlsId[this._currentItem].objectName, this._controlsId[this._currentItem].method, this._getUnloadFileName() );
      },
      _getUnloadFileName: function(){
         return  this._options.fileName || this._getView().getColumns()[0].title || 'Как на экране';
      },
      _isClientUnload : function(){
         //Смотрим на наличие выбранных потому, что у нас есть ограничение по передаче количества символов в GET и это будет бесполезно выгружать на сервере.
         return !this._options.serverSideUnload && this._controlsId[this._currentItem].objectName !== 'Excel' && !this._isSelectedState();
      }
   });

   return OperationUnload;

});