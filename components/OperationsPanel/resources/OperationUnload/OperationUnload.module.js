/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationUnload', [
   'js!SBIS3.CONTROLS.PrintUnloadBase',
   'js!SBIS3.CONTROLS.Utils.DataProcessor'
], function(PrintUnloadBase, Unloader) {

   var OperationUnload = PrintUnloadBase.extend({

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
      },
      _clickHandlerOverwritten: function() {
         var items = this.getItems(),
             item, extraText, itemId;
         //view.deleteRecords(records);
         extraText =  this._isSelectedState() ? ' отмеченных ' : ' ';
         while ((item = items.getNextItem(itemId))) {
            itemId = item.id;
            //Меняем текст только у платформенных пунктов меню
            if (this._controlsId[itemId]) {
               item.title = 'Список'  + extraText + 'в ' + itemId;
               //item.caption = 'Список'  + extraText + 'в ' + itemId;
               //TODO Возможно, когда-нибудь будет правильный метод для перерисовки внутренностей меню и внизу можно будет вызывать полную перерисовку picker без его уничтожения
               this._picker._container.find('>[data-id="' + itemId + '"]').find('.controls-MenuItem__text').text( item.title );
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
      applyOperation: function(dataSet, cfg){
         var p = new Unloader(cfg);
         //TODO Если не задали имя файла в опции, то возьмем из 1ой колонки, а в 1ой пусто, Вставим текст
         p.unload(this._currentItem, this._controlsId[this._currentItem], this._options.fileName || this._getView().getColumns()[0].title || 'Как на экране');
      }
   });

   return OperationUnload;

});