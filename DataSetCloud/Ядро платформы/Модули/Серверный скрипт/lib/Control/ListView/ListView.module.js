/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 1:24
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.ListView", ["js!SBIS3.CORE.DataView"], function( DataView ) {

   "use strict";

   /**
    * @class $ws.proto.ListView
    * @extends $ws.proto.DataView
    *
    * @category Content
    */
   $ws.proto.ListView = DataView.extend(/** @lends $ws.proto.ListView.prototype */{
      $protected: {
         _options: {
            display: {
              /**
               * @cfg {Function} Функция: на входе {$ws.proto.Record}, соответствующий текущей выбранной строке
               * Используется, если нужно получить строковое предстваление строки данных
               */
               displayValue: ''
            },
           /**
            * @cfg {String} Режим управления
            * <wiTag group="Управление">
            * @variant oneClickMode одинарным щелчком
            * @variant dblClickMode двойным щелчком
            * @group Edit
            */
            mode: 'oneClickMode'
         }
      },
      /**
       * Создает основную структуру html
       */
      _createContainer:function(){ // переписать с учетом всего, что нужно.
         var head = '',
             foot = this._options.display.showRecordsCount || this._options.display.showPaging || this._options.display.showSelectionCheckbox ? '<div class="ws-browser-footer"><table class="ws-browser-foot" cellspacing="0"><tfoot><tr><td class="ws-browser-pager-cont"></td></tr></tfoot></table></div>' : "";
         if(this._options.display.showToolbar || this._options.viewType == 'hierarchy')
            head = '<div class="ws-browser-head-container"></div>';
         this._container.append('<div class="ws-browser-ajax-loader ws-hidden"><div class="ws-loading-indicator-outer"><div class="ws-loading-indicator-block"><div class="ws-loading-indicator ws-browser-loading-indicator">' +
            ( $ws._const.theme === 'wi_scheme' ? '' : 'Загрузка') + '</div></div></div></div>')
            .append(this._rootElement = $('<div class="ws-browser-data-container ws-listview"><div>' + head + '<div class="ws-browser-container-wrapper"><div class="ws-browser-container" tabindex="-1"><div class="ws-browser"/></div></div>' + foot + '</div>'));
         this._body = this._rootElement.find('.ws-browser').height(this._isHeightGrowable() ? 'Auto' : '100%');
         $ws.proto.ListView.superclass._createContainer.apply(this, arguments);
         this._emptyDataBlock.addClass('listView');
      },
      /**
       * Рисует тело таблицы и заполняет его данными
       */
      _drawBodyCycle: function(){
         var dataRow,
             id = 0,
             visibleId = 0,
             container = document.createElement('div'),
             owner = this._data.parent(),
             rowkey, element;

         this._currentRecordSet.rewind();
         while ((dataRow = this._currentRecordSet.next()) !== false){
            if(this._options.display.viewType !== 'hierarchy' ||
               (this._options.display.viewType === 'hierarchy' && dataRow.get(this._hierColumnParentId) == this._currentRootId || this._turn == "OnlyLeaves"
                     || this._turn == "OnlyFolders")){
               rowkey = dataRow.getKey();
               element = this._options.display.displayValue.apply(this, [dataRow]);
               if(element) {
                  if(element instanceof Object && 'jquery' in element) {
                     element.attr("rowkey", rowkey);
                     if(this.isHierarchyMode() && dataRow.get(this._hierColumnIsLeaf) === true){
                        element.addClass("ws-browser-folder");
                        if(this._options.mode === "oneClickMode")
                           element.addClass("ws-browser-folder-link");
                     }else if(this._options.mode === "oneClickMode")
                        element.addClass("ws-browser-edit-link");
                     element.addClass("ws-visible");
                     $(container).append(element);
                     ++visibleId;
                  } else {
                     $ws.single.ioc.resolve('ILogger').log("ListView", "element rendering function returned not a jQuery element");
                  }
               }
            }
            id++;
         }
         this._count = visibleId;
         this._body.remove();
         this._body = $(container).addClass("ws-browser").height(this._isHeightGrowable() ? 'Auto' : '100%');
         this._data = this._body;
         owner.append(container);
         // фиксы багов, когда авторазмерный по ширине браузер находится справа за пределами экрана.
         if(this._haveAutoWidth()){
            container = this._rootElement.find('.ws-browser-container');
            container.css('float','left');
            var footer=this._rootElement.find('.ws-browser-footer').hide(),
               header=this._rootElement.find('.ws-browser-head-container').hide();
            this._container.css('width',10000);
            container.find('.ws-browser').css('overflow', 'hidden');
            var width=container.width();
            header.css('width', width).show();
            footer.css('width', width).show();
            this._container.css('width','auto');
            setTimeout(function(){
               container.find('.ws-browser').css('overflow', '');
            }, 0);
            container.css('float','');
         }
      },
      _setWidth: function(){
         var width = this._options.display.width;
         this._container.width(width);
      }
   });

   return $ws.proto.ListView;

});