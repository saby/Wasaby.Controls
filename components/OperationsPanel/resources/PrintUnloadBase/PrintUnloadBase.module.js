/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.PrintUnloadBase', [
   'js!SBIS3.CONTROLS.MenuLink',
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.ArrayStrategy'
], function(MenuLink, Dialog, StaticSource, ArrayStrategy) {

   var PrintUnloadBase = MenuLink.extend({

      $protected: {
         _options: {
         },
         _view : undefined
      },

      $constructor: function() {
         //TODO возможно кнопка печати может стать кнопкой меню, в зависимости от набора отчетов на печать
         this._view = this.getParent().getLinkedView();
      },
      /**
       * Must be implemented
       */
      _clickHandler: function() {
         
      },
      _prepareOperation: function(title){
         var selectedItems = this._view.getSelectedItems(),
               self = this;
         if (!selectedItems.length) {
            //Показать диалог выбора записей
            new Dialog ({
               template: 'js!SBIS3.CONTROLS.PrintMassSelectorDialog',
               caption : title,
               resizable: false,
               handlers: {
                  onBeforeShow: function(){
                     var dialog = this;
                     //this.getLinkedContext().setValue('NumOfRecords', self._view._dataSet.getCount()); Хочется, чтобы было так
                     //TODO Но пришлось сделать так:
                     this.getChildControlByName('controls-PrintMassSelectorDialog').getContext().setValue('NumOfRecords', self._view._dataSet.getCount());
                     this.getChildControlByName('controls-buttonPrint').subscribe('onActivated', function(){

                        if(dialog.validate()){
                           dialog.ok();
                           self.applyOperation(self._view.dataSet);
                           //self._getDataSetFromItems([]).addCallback(function(dataSet){
                           //   self.applyOperation(dataSet);
                           //});
                        }
                     });
                  },
                  onAfterClose : function(){
                     //self.applyOperation(self._view.dataSet);
                  }
               }
            });
         } else {
            self._getDataSetFromItems(self._getSelectedRecords()).addCallback(function(dataSet){
               self.applyOperation(dataSet);
            });

         }   
      },
      _getSelectedRecords: function(){
         var items = [],
               selected = this._view.getSelectedItems(),
               record;
         for (var i = 0, len = selected.length; i < len; i++) {
            record = this._view._dataSet.getRecordByKey(selected[i]);
            items.push(record);
         }
         return items;

      },
      _getDataSetFromItems : function(items){
         var deferred = new $ws.proto.Deferred(),
               dataSource = new StaticSource({
                  data: [],
                  strategy: new ArrayStrategy(),
                  keyField: 'id' //Найти в записи
               });
         //TODO переписать на .filter
         dataSource.query(undefined, undefined, 0).addCallback(function (dataSet) {
            //TODO должна быть другая возможность создать подВхождение датаСета
            dataSet.setRecords(items);
            deferred.callback(dataSet);
         });
         return deferred;
      },
      /**
       * Must be implemented
       * @param dataSet
       */
      applyOperation : function(dataSet){

      }
   });

   return PrintUnloadBase;

});