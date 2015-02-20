define('js!SBIS3.CORE.SwitchableArea/design/DesignPlugin',
   [
      'js!SBIS3.CORE.SwitchableArea',
      'css!SBIS3.CORE.SwitchableArea/design/DesignPlugin'
   ],
   function(SwitchableArea){
      var ITEM_CLASS = 'ws-SwitchableArea__item',
         PLACEHOLDER_CLASS = 'genie-Placeholder';

      //region Приватные функции
      function _correctDivIndexes() {
         var areaCollection = this.getItems();
         for (var i = 0, l = areaCollection.length; i < l; i++){
            areaCollection[i].getContainer().attr('data-name', 'items[' + i + '].content');
         }
      }
      function _onInsertItemFunc(event, items, indexes) {
         for (var i = 0; i < items.length; i++) {
            this._initAddedArea(indexes[i]);
            this.getItems()[indexes[i]].getContainer().addClass('genie-dragdrop ' + PLACEHOLDER_CLASS);
         }
         _correctDivIndexes.apply(this);
      }
      function _onRemoveItemFunc(event, items) {
         for (var i = 0; i < items.length; i++) {
            this.removeArea(items[i].getId());
         }
         _correctDivIndexes.apply(this);
      }
      function _onMoveItemFunc() {
         _correctDivIndexes.apply(this);
      }
      //endregion

   /**
    * @class $ws.proto.SwitchableArea.DesignPlugin
    * @extends $ws.proto.SwitchableArea
    * @plugin
    */
   $ws.proto.SwitchableArea.DesignPlugin = SwitchableArea.extendPlugin({
      $constructor: function(){
         this.getContainer().children('.' + ITEM_CLASS).addClass(PLACEHOLDER_CLASS);

         var self = this,
            items = this.getItems();
         items.subscribe('onInsertItem', _onInsertItemFunc.bind(self));
         items.subscribe('onRemoveItem', _onRemoveItemFunc.bind(self));
         items.subscribe('onMove', _onMoveItemFunc.bind(self));
      },

      // возвращает имя области для вставки компонента по умолчанию (при копипасте компонентов)
      getActiveContentAreaName: function() {
         return this.getContainer().children('.' + ITEM_CLASS + '.' + PLACEHOLDER_CLASS + ':not(.ws-hidden)').attr('data-name');
      },

      // возвращает контейнер контентной области по индексу.
      getAreaContainer: function (index) {
         var areaCollection = this.getItems();
         return areaCollection[index] && areaCollection[index].getContainer();
      },

      genieHandlerAfterCreation : function() {

         // в джине контент областей прогружается в начале. при переключении области его не нужно перегружать
         var self = this,
            setAreasLoaded = function(){
               var areaCollection = self.getItems();
               for (var i = 0; i < areaCollection.length; i++) {
                  areaCollection[i].setLoaded(true);
               }
            };

         /**
          * нам надо отловить ситуацию, когда готов контрол переключаемых областей
          * по непонятным причинам функция genieHandlerAfterCreation иногда выполнятеся до события onReady закладок, а иногда после
          * поэтому вставлена проверка. Если закладки готовы, то выполняем действия сразу. Иначе подписываемся на onReady
          */
         if (this._isReady){
            setAreasLoaded();
         }
         else {
            this.subscribe('onReady', function(){
               setAreasLoaded();
            });
         }
      }
   });
});