/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationUnload', [
   'js!SBIS3.CONTROLS.PrintUnloadBase',
   'js!SBIS3.CONTROLS.Utils.DataProcessor'
], function(PrintUnloadBase, Unloader) {

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
            'PDF' : 'Сохранить',
            'Excel'  : 'СохранитьПоHTML'
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
               items[i].title = 'Список'  + extraText + 'в ' + itemId;
               //TODO Возможно, когда-нибудь будет правильный метод для перерисовки внутренностей меню и внизу можно будет вызывать полную перерисовку picker без его уничтожения
               this._picker._container.find('>[data-id="' + itemId + '"]').find('.controls-MenuItem__text').text( items[i].title );
            }
         }
         //this._picker._drawItems(); - это заенит строку выше с .text, когда заработает
      },
      _menuItemActivated: function(event, itemId){
         this._currentItem = itemId;
         this._prepareOperation('Что сохранить в ' + itemId);
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
       * @param selectedNumRecords сколько записей нужно выгружать
       */
      processSelectedOperation: function(selectedNumRecords){
         var record,
             objectArr = [],
             cfg = {};
         //TODO когда появится воможность выгружать в PDF надо убрать проверку на Excel
         //Для Excel всегда выгружаем на сервере
         if (this._isClientUnload()) {
            OperationUnload.superclass.processSelectedOperation.apply(this, arguments);
            return;
         }
         cfg = this.prepareGETOperationFilter(selectedNumRecords);

         record = this._dataSet.getRecordByKey(this._currentItem).getRaw();
         if (record.unloadMethod) {
            objectArr = record.unloadMethod.split('.');
            $ws.helpers.saveToFile(objectArr[0], objectArr[1], cfg, undefined, true);
         }
      },
      /**
       * Метод для формирования параметров фильтрации выгружаемого на сервере файла.
       * Чтобы сформировать свои параметры этот метод можно переопределить
       * @example
       * <pre>
       *    //В своем прикладном модуле (myModule), отнаследованном от OperationUnload
       *    prepareGETOperationFilter: function(selectedNumRecords){
       *       var cfg = myModule.superclass.processSelectedOperation.apply(this, arguments);
       *       //Сформируем свой набор колонок для выгрузки
       *       cfg['Поля'] = this.getUserFields();
       *       cfg['Заголовки'] = this.getUserTitles();
       *       return cfg;
       *    }
       * </pre>
       * @param selectedNumRecords сколько записей нужно выгружать
       * @returns {{}}
       */
      prepareGETOperationFilter: function(selectedNumRecords){
         var view =  this._getView(),
               dataSource = view._dataSource,
               columns,
               fields = [],
               titles = [],
               filter,
               queryParams,
               cfg = {},
               openedPath,
               hierField;
         /**
          * Здесь обрабатываем выгрузку в Excel на сервере
          */
         columns = this._prepareOperationColumns();
         for (var i = 0; i < columns.length; i++) {
            fields.push(columns[i].field);
            titles.push(columns[i].title || columns[i].field);
         }
         //openedPath[key] = true;
         filter = $ws.core.clone(view.getFilter());
         if (view._options.hierField){
            hierField = view.getHierField();
            cfg['Иерархия'] = view._options.hierField;
            openedPath = view.getOpenedPath();
            // - getOpenedPath - 'это работает только у дерева!!
            if (openedPath && !Object.isEmpty(openedPath)) {

               filter[hierField] = filter[hierField] === undefined ? [view.getCurrentRoot()] : filter[hierField];
               filter[hierField] = filter[hierField] instanceof Array ? $ws.core.clone(filter[hierField]) : [filter[hierField]];
               for (i in openedPath) {
                  if (openedPath.hasOwnProperty(i) && Array.indexOf( filter[hierField], i) < 0) {
                     filter[hierField].push(i);
                  }
               }
            }
         }
         queryParams =  dataSource.prepareQueryParams(filter, null, view._offset , selectedNumRecords || view.getDataSet().getCount(), false);
         cfg = $ws.core.merge(cfg, {
            //TODO дать настройку ?
            'ИмяМетода' : dataSource._options.service + '.' + dataSource._options.queryMethodName,
            'Фильтр': queryParams['Фильтр'],
            'Сортировка' : queryParams['Сортировка'],
            'Навигация' : queryParams['Навигация'],
            'Поля': fields,
            //TODO возможно стоит тоже дать настройку ?
            'Заголовки' : titles,
            'Название' : this._getUnloadFileName(),
            'fileDownloadToken' : ('' + Math.random()).substr(2)* 1
         });
         return cfg;
      },
      applyOperation: function(dataSet, cfg){
         var p = new Unloader(cfg);
         //TODO Если не задали имя файла в опции, то возьмем из 1ой колонки, а в 1ой пусто, Вставим текст
         p.unload(this._currentItem, this._controlsId[this._currentItem], this._getUnloadFileName() );
      },
      _getUnloadFileName: function(){
         return  this._options.fileName || this._getView().getColumns()[0].title || 'Как на экране';
      },
      _isClientUnload : function(){
         //Смотрим на наличие выбранных потому, что у нас есть ограничение по передаче количества символов в GET и это будет бесполезно выгружать на сервере.
         return !this._options.serverSideUnload && this._currentItem !== 'Excel' && !this._isSelectedState();
      }
   });

   return OperationUnload;

});