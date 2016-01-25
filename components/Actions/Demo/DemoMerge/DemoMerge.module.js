define('js!SBIS3.CONTROLS.Demo.DemoMerge', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.DemoMerge', 'js!SBIS3.CONTROLS.Data.Source.SbisService', 'js!SBIS3.CONTROLS.TreeDataGridView', 'js!SBIS3.Engine.Browser', 'js!SBIS3.CONTROLS.OperationsPanelButton', 'js!SBIS3.CONTROLS.MergeAction'],
function(CompoundControl, dotTplFn, SbisServiceSource) {
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.DemoMerge.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
         $ws.single.CommandDispatcher.declareCommand(this, 'mergeItems', this._mergeItems);
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         var self = this;
         this._operationsPanel = this.getChildControlByName('browserOperationsPanel');
         this._view = this.getChildControlByName('Browser').getView();
         this._mergeAction = this.getChildControlByName('MergeAction');
         //Привяжем панель к кнопке
         this.getChildControlByName('panelsButton').setLinkedPanel(this._operationsPanel); 
         //Подпишемся на завершение объединения
         this._mergeAction.subscribe('onExecuted', function(event, meta) {
            self._view.removeItemsSelectionAll();
            self._view.setSelectedKey(meta.mergeTo);
            //Можно самостоятельно перерисовать данные в браузере использовав meta.mergeKeys
            self._view.reload();
         });
         //Будем показывать кнопку объединения в ПМО, только если объединение доступно
         this._view.subscribe('onSelectedItemsChange', function(event, keys) {
            var mergeButton = this._operationsPanel.getItemInstance('merge');
            mergeButton && mergeButton.toggle(this._isMoveAvailable(keys));
         }.bind(this));
         this._setSbisServiceSource();
      },
      
      _mergeItems: function(items) {
         //Тут можно изменить набор объединяемых записей, по умолчанию в items приходят выделенные записи
         if (this._isMoveAvailable(items)) {
            this._mergeAction.execute({
               items: items
               //Можно предустановить целевую запись
               //selectedKey: this._view.getSelectedKey()
            });
         }
      },
      _isMoveAvailable: function(keys) {
         //Тут проверим что в браузере выбрано хотя бы 2 листа, тогда операция объединения доступна
         var recordsCount = 0,
            dataset = this._view.getDataSet();
         for (var i = 0; i < keys.length; i++) {
            if (dataset.getRecordByKey(keys[i]).get('parent@') !== true) {
               recordsCount++;
            }
         }
         return recordsCount  > 1;
      },
      _setSbisServiceSource: function() {
         //Создадим DataSource и установим в браузер и в action объединения
         var ds = new SbisServiceSource({
            resource: 'Товар',
            queryMethodName: 'СписокЗаписей',
            //'Объединить' используется по умолчанию
            mergeMethodName: 'Объединить'
         });
         this._view.setDataSource(ds);
         this._mergeAction.setDataSource(ds);
      }
   });

   
   
   
   moduleClass.webPage = {
      outFileName: "index", 
      htmlTemplate: "/Theme/Shop.html"
   };
   return moduleClass;
});