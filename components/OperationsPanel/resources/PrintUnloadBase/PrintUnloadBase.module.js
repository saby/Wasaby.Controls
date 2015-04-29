/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.PrintUnloadBase', [
   'js!SBIS3.CONTROLS.MenuLink',
   'js!SBIS3.CORE.DialogSelector'
], function(MenuLink, Dialog) {

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
       * Can be implemented
       */
      _clickHandler: function() {
         PrintUnloadBase.superclass._clickHandler.apply(this, arguments);
      },
      _prepareOperation: function(title){
         var selectedItems = this._view.getSelectedItems(),
               selectedItemsObj = {},
               ds;
         if (!selectedItems.length) {
            this._processMassOperations(title);
         } else {
            for (var i = 0, len = selectedItems.length; i < len; i++){
               selectedItemsObj[selectedItems[i]] = true;
            }
            ds = this._view._dataSet.filter(function(item){
               return selectedItemsObj[item.getKey()];
            });
            this._applyOperation(ds);
         }
      },
      _processMassOperations:function(title){
         var numOfRecords = this._view._dataSet.getCount(),
            num = 0,
            self = this,
            ds = this._view._dataSet;
         if (this._view._hasNextPage(this._view._dataSet.getMetaData().more)) {
            //Показать диалог выбора записей
            new Dialog ({
               opener : this,
               template: 'js!SBIS3.CONTROLS.MassAmountSelector',
               caption : title,
               resizable: false,
               handlers: {
                  onBeforeShow: function(){
                     //this.getLinkedContext().setValue('NumOfRecords', self._view._dataSet.getCount()); Хочется, чтобы было так
                     //TODO Но пришлось сделать так:
                     this.getChildControlByName('controls-MassAmountSelector').getContext().setValue('NumOfRecords', numOfRecords);
                  },
                  onChange: function(event, selectedNumRecords){
                     if(selectedNumRecords > numOfRecords){
                        $ws.helpers.question('Операция займет продолжительное время. Провести операцию?', {}, self).addCallback(function(answer){
                           if (answer) {
                              self._view._dataSource.query(self._view._filter, self._view._sorting, 0, selectedNumRecords).addCallback(function (dataSet) {
                                 self._applyOperation(dataSet);
                              });
                           }
                        });
                     } else {
                        if (selectedNumRecords < numOfRecords) {
                           num = 0;
                           //TODO здесь должен быть не filter, а что-то типа .range - получение первых N записей
                           //Выберем selectedNumRecords записей из dataSet
                           ds = self._view._dataSet.filter(function(){
                              return num++ < selectedNumRecords;
                           });
                        }
                        self._applyOperation(ds);
                     }
                  }
               }
            });
         }
         else {
            self._applyOperation(ds);
         }

      },
      _applyOperation : function(dataSet){
         //Скроем панель с массовыми операциями
         this.getTopParent().hidePicker();
         this.applyOperation(dataSet);
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