/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationUnload', [
   'js!SBIS3.CONTROLS.MenuLink'
], function(MenuLink) {

   var OperationUnload = MenuLink.extend({

      $protected: {
         _options: {
            icon: 'sprite:icon-24 action-hover icon-Save icon-primary',
            title: 'Выгрузить',
            linkText: 'Выгрузить',
            caption: 'Выгрузить',
            items: [
               {
                  id : 'PDF',
                  title : 'Список в PDF',
                  test: 'saver',
                  icon : 'sprite:icon-24 icon-PDF2 icon-multicolor action-hover'
               },
               {
                  id : 'Excel',
                  title : 'Список в Excel',
                  icon : 'sprite:icon-24 icon-Excel icon-multicolor action-hover'
               }
            ]
         },
         _view: undefined,
         _controlsId: {
            'PDF' : true,
            'Excel'  : true
         }
      },

      $constructor: function() {
         //TODO А если кнопка лежит не в панели как найти связанный ListView?
         this._view = this.getParent().getLinkedView();
         //Почему-то нельзя в опциях указать handlers {'onMenuActivated' : function(){}} Поэтогму подписываемся здесь
         this.subscribe('onMenuItemActivate', this._menuItemActivated);
         this._clickHandler = this._clickHandler.callNext(this._clickHandlerOverwritten);
      },
      _clickHandlerOverwritten: function() {
         var items = this.getItems(),
             item, extraText, itemId;
         console.log('_clickHandler');
         //view.deleteRecords(records);
         extraText =  this._isSelectedState() ? ' сохраненных ' : ' ';
         while (item = items.getNextItem(itemId)) {
            itemId = item.id;
            //Меняем текст только у платформенных пунктов меню
            if (this._controlsId[itemId]) {
               item.title = 'Список'  + extraText + 'в ' + itemId;
               //item.caption = 'Список'  + extraText + 'в ' + itemId;
               //TODO Возможно, когда-нибудь будет правильный метод для перерисовки внутренностей меню и внизу можно будет вызывать полную перерисовку picker без его уничтожения
               this._picker._container.find('>[data-id="' + itemId + '"]').find('.controls-MenuItem__text').text( item.title );
            }
         }
         //Относится к TODO в while выше
         //this._drawItemsCallback();

         //selectedItems = this._view.getSelectedItems(),
         //      records = selectedItems.length ? selectedItems : this._view._dataSet._indexId
      },
      _menuItemActivated: function(event, itemId){
         if (this._isSelectedState()){
            debugger;

         }
      },
      _isSelectedState: function(){
         return this._view.getSelectedItems().length > 0;
      },
      _saveTo: function(idReport, isReportForList, fileType) {
         var self = this,
               title = 'Что сохранить в ' + fileType;

         this._validateRecordCount(title).addCallback(function(records) {
            self._prepareDataToSave(fileType,
                  fileType === 'EXCEL' && typeof self._options.saveToExcelListMethod === 'string' && self._options.saveToExcelListMethod.length ? undefined : idReport,
                  isReportForList,
                  records);
         });
      }

   });

   return OperationUnload;

});