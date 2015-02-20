/**
 * Created by tm.baeva on 04.12.13.
 */
define('js!SBIS3.CORE.Selector', [],
   function(  ) {

   'use strict';

   /**
    * Описание логики выбора из диалога/панели.
    * Selector используется полем связи.
    * @mixin
    * @name SBIS3.CORE.Selector
    */
   var selectorMixinConfig = { /** @lends SBIS3.CORE.Selector.prototype */
      $protected: {
         _browser: null,
         _data: null,
         _afterRenderHandler: undefined,
         _selectionConfirmHandler: undefined,
         _dRender: null,
         _readySetupBrowser: null,
         _canceled: {},
         _options: {
           /**
            * @cfg {String} Тип выбираемых записей
            * <wiTag group="Управление">
            * Опция задаёт тип записей, которые можно выбирать в данном представлении данных.
            * @example
            * <pre>
            *     <option name="selectionType">node</option>
            * </pre>
            * @variant node Только узлы
            * @variant leaf Только листья
            * @variant all Узлы и листья, по умолчанию
            * @see setSelectionType
            */
            selectionType: 'all',
           /**
            * @cfg {Array} Массив первичных ключей выбранных записей
            * <wiTag group="Данные">
            * @see selectedRecords
            */
            currentValue: [],
           /**
            * @cfg {Boolean} Выделить флаги в связанном представлении данных у переданных в Selector записей
            * <wiTag group="Управление">
            * Опция имеет смысл, если в связанном представлении данных {@link $ws.proto.TableView#showSelectionCheckbox включено отображение флагов}.
            * Возможные значения:
            * <ul>
            *    <li>true - выделить переданные записи;</li>
            *    <li>false - не выделять.</li>
            * </ul>
            * @see selectedRecords
            */
            selectCurrentValue: true,
           /**
            * @cfg {Array} Массив выбранных записей ($ws.proto.Record)
            * <wiTag group="Управление">
            * @see setResult
            * @see currentValue
            * @see selectCurrentValue
            */
            selectedRecords: null,
            selectorFieldLink: false,
           /**
            * @cfg {Boolean} Разрешить множественный выбор записей
            * <wiTag group="Управление">
            * Возможные значения:
            * <ul>
            *    <li>true - разрешён выбор нескольких записей одновременно;</li>
            *    <li>false - выбор только одной записи.</li>
            * </ul>
            * @example
            * <pre>
            *     <option name="multiSelect">true</option>
            * </pre>
            */
            multiSelect: false
         }
      },
      $constructor: function(){
         var self = this;
         self._readySetupBrowser = new $ws.proto.Deferred();
         this._publish('onChange');
         if( !(self._dRender instanceof $ws.proto.Deferred) ) {
            //Для случая выезжающей панели заполним _dRender
            self._dRender = new $ws.proto.Deferred();
            self.subscribe('onAfterLoad', function(){
               self._dRender.callback();
            });
         }
         this._afterRenderHandler = function(){
            var browser = this;
            if(this.isLoading() && self._options.currentValue && self._options.currentValue instanceof Array){
               var values = self._options.currentValue,
                   showBranch;
               if (this.getRecordSet().getRecords().length > 0 || this.getContainer().find('.ws-browser-empty').is(':visible')){
                  self._options.currentValue = undefined;
                  if(values[0] !== undefined && this.isHierarchyMode()){
                     var records = self._options.selectedRecords,
                         record,
                         branchKey;
                     for (var i = 0, len = records.length; i < len; i++) {
                        if (records[i] && records[i].getKey() === values[0]) {
                           record = records[i];
                           break;
                        }
                     }
                     try {
                        if (record) {
                           branchKey = record.isBranch() ? values[0] : record.getParentKey();
                           showBranch = this.showBranch(branchKey);
                           if (self._options.selectCurrentValue && showBranch instanceof $ws.proto.Deferred) {
                              showBranch.addCallback(function(){
                                 browser.setSelection(values);
                              });
                           }
                        }
                     } catch (e) {
                        $ws.single.ioc.resolve('ILogger').log('Selector', 'Попытка чтения параметров иерархической записи не удалась');
                     }

                  }
                  if (self._options.selectCurrentValue && values && showBranch === undefined){
                     this.setSelection(values);
                  }
               }
            }
         };
         this._selectionConfirmHandler = function (event, result) {
            var values = self._options.selectedRecords,
                canceled = self._canceled;
            if (self._options.selectorFieldLink && self._options.multiSelect && values && values.length) {
               if (result && result.length) {
                  for (var i = 0, len = result.length; i < len; i++) {
                     if (!self._foundRecordByPK(values, result[i])) {
                        values.push(result[i]);
                     }
                  }
               }
               if (canceled && typeof canceled === 'object') {
                  for (var rec in canceled) {
                     for (var j = 0, lenValues = values.length; j < lenValues; j++) {
                        if (values[j].getKey() == rec) {
                           values.splice(j, 1);
                           break;
                        }
                     }
                  }
               }
               self._notify('onChange', values);
            } else {
               self._notify('onChange', result);
            }
         };
         this._dRender.addCallback(function(v){
            var childControls = self.getChildControls(),
                find = false;
            for(var i = 0, l = childControls.length; i < l; i++){
               var childControl = childControls[i];
               if( ($ws.proto.DataView && childControl instanceof $ws.proto.DataView ||
                  $ws.proto.DataViewAbstract && childControl instanceof $ws.proto.DataViewAbstract) &&
                     childControl.getName() !== 'requestsView'){
                  find = true;
                  self.setBrowser(childControl);
                  break;
               }
            }
            if(find === false){
               self._readySetupBrowser.callback();
            }
            return v;
         });
      },
      _foundRecordByPK: function(arr, val) {
         if (val === null) {
            return false;
         }
         for (var x = 0, lenOld = arr.length; x < lenOld; x++) {
            if (arr[x].getKey() == val.getKey()) {
               return true;
               }
            }
         return false;
      },
      _refreshBrowser: function(){
         if (this._browser && this._data instanceof $ws.proto.RecordSet) {
            this._browser.setData(this._data);
         }
      },
     /**
      * <wiTag group="Управление">
      * Возвращает deferred готовности представления данных.
      * Когда построится связанное представление данных на шаблоне, находящемся внутри Selector, оно
      * пробросит событие onReady, и в этот же момент придет callback с этим представлением данным  в deferred.
      * @returns {$ws.proto.Deferred|*} Deferred готовности.
      * @example
      * Когда представление данных будет построено, подпишемся на клик и будем подкрашивать красным цветом каждую кликнутую строчку:
      * <pre>
      *    //при условии, что this - это DialogSelector
      *    this.getReadyDeferred().addCallback(function(browser){
      *       browser.subscribe('onRowClick', function(event, row, record){
      *          row.addClass('red-text');
      *       });
      *    })
      * </pre>
      */
      getReadyDeferred: function(){
         return this._readySetupBrowser;
      },
     /**
      * <wiTag group="Данные">
      * Изменить набор данных в связанном представлении данных.
      * @param {$ws.proto.RecordSet} data Новый набор данных.
      * @example
      * <pre>
      *    var self = this; // при условии, что this - это DialogSelector
      *    $ws.helpers.newRecordSet("Сотрудник", "Список").addCallback(function(recordSet){
      *       self.getReadyDeferred().addCallback(function(dataView)){
      *          dataView.setData(recordSet);
      *       });
      *    });
      * </pre>
      */
      setData: function(data){
         this._data = data;
         this._refreshBrowser();
      },
      _browserChangeSelection: function(event, data, addFlag) {
         if (!data) { //Если передан пустой data - то ничего не делаем
            return;
         }
         var i, key, len,
            isArray = Object.prototype.toString.call(data) === '[object Array]';
         if (addFlag) {
            if (isArray) {
               for (i = 0, len = data.length; i < len; i++) {
                  key = data[i].getKey();
                  if (this._canceled[key]) delete this._canceled[key];
               }
            } else {
               key = data.getKey();
               if (this._canceled[key]) delete this._canceled[key];
            }
         } else {
            if (isArray) {
               for (i = 0, len = data.length; i < len; i++) {
                  this._canceled[data[i].getKey()] = true;
               }
            } else {
               this._canceled[data.getKey()] = true;
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * Установить связанное представление данных.
       * @param {$ws.proto.DataView} browser Экземпляр класса представления данных.
       * @example
       * <pre>
       *    //при условии, что this - это DialogSelector
       *    var dataView = this.getTopParent().getChildByName('myNewCreatedBrowser');
       *    this.setBrowser(dataView);
       * </pre>
       * @see getBrowser
       */
      setBrowser: function(browser){
         if(this._browser){
            try{ // тут браузер уже мог начать разрушаться
               this._browser.unsubscribe('onAfterRender', this._afterRenderHandler);
               if (this._options.selectorFieldLink) {
                  this._browser.unsubscribe('onChangeSelection', this._browserChangeSelection.bind(this));
               }
               this._browser.unsubscribe('onSelectionConfirm', this._selectionConfirmHandler);
            } catch(e){}
         }
         this._browser = browser;
         if(browser){
            this._browser.setSelectionType(this._options.selectionType);
            this._browser.setSelectionMode(true);
            this._browser.setMultiSelect(this._options.multiSelect);
            this._refreshBrowser();
            this._browser.subscribe('onAfterRender', this._afterRenderHandler);
            if (this._options.selectorFieldLink) {
               this._browser.subscribe('onChangeSelection', this._browserChangeSelection.bind(this));
            }
            this._browser.subscribe('onSelectionConfirm', this._selectionConfirmHandler);
         }

         if (!this._readySetupBrowser.isReady()) {
            this._readySetupBrowser.callback();
         }
      },
      /**
       * <wiTag group="Данные">
       * Получить связанное представление данных.
       * @return {$ws.proto.DataView}
       * @example
       * <pre>
       *     //при условии, что this - это DialogSelector
       *     var dataView;
       *     if (this.getBrowser().getName() !== 'myNewCreatedBrowser') {
       *        dataDiew = this.getTopParent().getChildByName('myNewCreatedBrowser');
       *        this.setBrowser(dataView);
       *     }
       * </pre>
       * @see setBrowser
       */
      getBrowser: function(){
         return this._browser;
      },
      /**
       * Вызывает onChange и передает в него то, что отдал пользователь
       * @param {$ws.proto.Record|Array} result Набор выбранных записей.
       * @example
       * <pre>
       *     //при условии, что this - это DialogSelector
       *     this.setResult(this.getBrowser().getRecordSet().getRecords());
       * </pre>
       * @see getBrowser
       * @see selectedRecords
       */
      setResult: function(result) {
         this._notify('onChange', result);
      }
   };

   return selectorMixinConfig;

});
