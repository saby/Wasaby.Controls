/**
 * Created with JetBrains PhpStorm.
 * User: aa.adilov
 * Date: 07.11.12
 * Time: 13:34
 * To change this template use File | Settings | File Templates.
 */

define("js!SBIS3.CORE.LadderPlugin", ["js!SBIS3.CORE.TableView"], function(TableView){

/**
 * @class   $ws.proto.TableView.LadderPlugin
 * @extends $ws.proto.TableView
 * @plugin
 */
$ws.proto.TableView.LadderPlugin = TableView.extendPlugin(/** @lends $ws.proto.TableView.LadderPlugin.prototype */{
   $protected: {
      _options: {
         display: {
            /**
             * @cfg {String[]} Лесенка
             * <wiTag page=3>
             * Массив имен столбцов, по которым строится лесенка
             * @group Ladder
             */
            ladder: [],
            /**
             * @cfg {Boolean} Использовать ли "лесенку" по словам
             * <wiTag page=3>
             * Лесенка по словам позволяет скрыть повторяющиеся в столбце первые n слов.
             * @group Ladder
             */
            useWordsLadder: false,
            /**
             * @cfg {Number} Сколько слов в "лесенке" по словам
             * <wiTag page=3>
             * Сколько слов необходимо сравнивать при отображении лесенки по словам.
             * @group Ladder
             */
            wordsLadderCount: 1,
            /**
             * @cfg {Boolean} Объединять ячейки с одинаковым содержимым в одну
             * <wiTag page=3>
             * @group Ladder
             */
            mergeCells: false
         }
      },
      _hasLadder: false,                      //Флаг, была ли в предыдущем столбце лесенка
      _ladder: {},                            //Хэш-мэп лесенки
      _previousRecord: null,                  //Предыдущая запись
      _typesForWordsLadder: {                 //Типы полей, по которым можно строить лесенку по словам
         "Строка" : true,
         "Текст" : true,
         "varchar" : true,
         "text" : true
      }
   },
   $condition: function(){
      var ladder = this._options.display.ladder;
      return ladder && ladder.length;
   },
   $constructor: function(){
      var ladder = this._options.display.ladder;
      if(ladder && ladder.length) {
         for (var i = 0, l = ladder.length; i < l; i++) {
            this._ladder[ladder[i]] = i;
         }
      }
   },
    /*
     * для столбцов с лесенкой необходимо добавить имя класса
     */
   _mapColumns: function(){
      var colDef = {};
      for (var i = 0, l = this._columnMap.length; i < l; i++) {
         colDef = this._columnMap[i];
         if (this._ladder && this._ladder[colDef.field] !== undefined) {
            colDef.className += ' ws-browser-column-with-ladder';
         }
      }
   },
   _renderTD: function(colDef, record, controlResult){
      var data = controlResult || '';
      if(this._ladder && this._ladder[colDef.field] !== undefined){
         var previousData,
             previousResult = '',
             usingLadder = false,
             ladder = this._options.display.ladder,
             ladderIdx = Array.indexOf(ladder, colDef.field);
         if(this._previousRecord instanceof $ws.proto.Record && ( ladderIdx > 0 && this._hasLadder || ladderIdx === 0)){
            this._hasLadder = true;
            usingLadder = true;
            previousData = this._previousRecord.hasColumn(colDef.field) ? this._previousRecord.get(colDef.field) : "";
            previousResult = this._prepareColumnData(colDef, previousData, this._previousRecord);
         }
         if(ladderIdx === (Object.keys(this._ladder).length - 1)){
            this._hasLadder = false;
            this._previousRecord = record;
         }
         if(usingLadder === true){
            if(this._options.display.useWordsLadder && colDef.type in this._typesForWordsLadder){
               var arrData = String.trim(data).split(' '),
                   arrPrev = String.trim(previousResult).split(' ', this._options.display.wordsLadderCount),
                   minSize = Math.min(this._options.display.wordsLadderCount, arrPrev.length),
                   sameWordsLadderCount = 0;
               while(sameWordsLadderCount < minSize && arrData[sameWordsLadderCount] == arrPrev[sameWordsLadderCount])
                  sameWordsLadderCount++;
               if( sameWordsLadderCount ){
                  data = [
                     '<span class="ws-invisible ws-browser-ladder-element">',
                     arrData.splice(0, sameWordsLadderCount).join(' '),
                     ' </span>',
                     arrData.join(' ')
                  ].join('');
               }
            } else if( controlResult === previousResult )
               data = ["<div class='ws-browser-ladder-element ws-hidden'>", data, "</div>"].join('');
            else
               this._hasLadder = false;
         }
      }
      return data;
   },
   _drawBodyCycle: function(){
      this._previousRecord = null;
      if(!this._options.display.useWordsLadder && this._options.display.mergeCells){
         var firstCells = this._body.find(".ws-ladder-first"),
               self = this,
               colIdx = [],
               countCells = 0,
               rowGroup = 0,
               setCells,
               rowspan,
               td;
         if(firstCells.length)
            $(firstCells).removeClass(".ws-ladder-first");
         this._body.find(".ws-browser-table-row").each(function(){
            var row = $(this),
                  cell = row.find(".ws-ladder-bottom-last");
            if(self._options.display.hasZebra){
               row.removeClass("ws-ladder-top ws-ladder-bottom ws-ladder-top-last");
               if(cell.length)
                  cell.each(function(){
                     $(this).removeClass("ws-ladder-bottom-last");
                  });
            }
         });
         this._body.find(".ws-browser-table-row:first td").each(function(){
            var cell = $(this);
            if(cell.hasClass('ws-browser-column-with-ladder'))
               colIdx.push(cell.index());
            countCells++;
         });
         for(var i = 0, l = colIdx.length; i < l; i++){
            setCells = [];
            rowspan = 1;
            this._body.find(".ws-browser-table-row").each(function(){
               var cells = $(this).children(),
                     index = cells.length === countCells ? colIdx[i] : 0;
               setCells.push(cells.eq(index));
            });
            for(var j = 0, len = setCells.length; j < len; j++){
               if(setCells[j].find(".ws-browser-ladder-element").length){
                  if(td === undefined)
                     td = j - 1;
                  rowspan++;
               }
               if(td !== undefined && ((j === len - 1) || (!setCells[j+1].find(".ws-browser-ladder-element").length))){
                  var lastIndex = rowspan + td;
                  if(i === 0){
                     rowGroup++;
                     for(var n = td; n <= j; n++){
                        var tr = $(setCells[n].closest("tr")[0]).attr("rowgroup", rowGroup);
                        if(this._options.useSelection){
                           tr.hover(function(){
                              self._body.find(".ws-browser-table-row[rowgroup="+ $(this).attr("rowgroup") +"]").addClass("ws-ladder-hover");
                              if(self._options.useHoverRowAsActive){
                                 var activeGroup = self._body.find(".ws-active-hover");
                                 if(activeGroup.length)
                                    activeGroup.removeClass("ws-active-hover");
                              }
                           },
                           function(){
                              var currentGroup = self._body.find(".ws-browser-table-row[rowgroup="+ $(this).attr("rowgroup") +"]");
                              $(currentGroup).removeClass("ws-ladder-hover");
                              if(self._options.useHoverRowAsActive){
                                 $(currentGroup).removeClass("ws-browser-item-over");
                              }
                           });
                        }
                     }
                     if(this._options.display.hasZebra){
                        var className = lastIndex !== len ? "ws-ladder-bottom" : "ws-ladder-top-last";
                        setCells[td].addClass("ws-ladder-bottom-last");
                        setCells[td].closest("tr").addClass("ws-ladder-top");
                        setCells[lastIndex - 1].closest("tr").addClass(className);
                     }
                  }
                  setCells[td].attr("rowspan", rowspan);
                  for(var k = td + 1; k < lastIndex; k++){
                     var nextCell = setCells[k].next();
                     if(nextCell.length)
                        $(nextCell).addClass("ws-ladder-first");
                     setCells[k].remove();
                  }
                  td = undefined;
                  rowspan = 1;
               }
            }
         }
      }

   },
   setActiveElement: function(newActiveRow, needScroll, noNotify){
      if(!this._options.display.useWordsLadder && this._options.display.mergeCells &&
         this._options.useSelection && newActiveRow){
         if(this._options.useHoverRowAsActive)
            this._body.find(".ws-browser-table-row[rowgroup="+ rowGroup +"]").addClass("ws-active-hover");
         else{
            var rowGroup = $(newActiveRow).attr("rowgroup"),
                  group = this._body.find(".ws-browser-table-row[rowgroup="+ rowGroup +"] td[rowspan]"),
                  selectedElement = this._body.find(".ws-selected"),
                  l = group.length,
                  rowspan = 1,
                  td;
            if(selectedElement.length)
               selectedElement.removeClass("ws-selected");
            if(l){
               td = $(group[0]);
               for(var i = 0; i < l; i++){
                  var currentRowspan = $(group[i]).attr("rowspan");
                  if(currentRowspan > rowspan){
                     rowspan = currentRowspan;
                     td = $(group[i]);
                  }
               }
               if(!$(newActiveRow).find(td).length && td.is("td:first-child")){
                  $(newActiveRow).addClass("ws-bg-none");
                  td.addClass("ws-selected");
                  this._body.find(".ws-browser-table-row[rowgroup="+ rowGroup +"] td:first-child:not(.ws-selected)").each(function(){
                     if($(this).get(0) !== td.get(0))
                        $(this).addClass("ws-ladder-first");
                  });
               }
            }
         }
      }
   },
   _rowOptionsEventHandler: function(e){
      if(!this._options.display.useWordsLadder && this._options.display.mergeCells &&
            this._options.useSelection && this._rowOptionsHoverRow){
         this._body.find(".ws-browser-table-row[rowgroup="+ this._rowOptionsHoverRow.attr("rowgroup") +"]")[e.type === 'mousenter' ?
               'addClass' : 'removeClass']('ws-ladder-hover');
      }
   },
   _startEditTd: function(td, event){
      var parentTr = $(td).closest("tr"),
            rowGroup = parentTr.attr("rowgroup");
      if(rowGroup){
         var group = this._body.find(".ws-browser-table-row[rowgroup="+ rowGroup +"]"),
               className = "ws-browser-editable-rowgroup";
         $(group).each(function(){
            var tr = $(this);
            if(tr.hasClass(className))
               tr.removeClass(className);
            tr.addClass(className);
         });
      }
   },
   /**
    * Скрывает/отображает данные, скрытые лесенкой в нужной строке
    * @param {jQuery} trWithLadder строка с лесенкой
    */
   _toggleClassForLadder: function(trWithLadder){
      var collection = trWithLadder.find('.ws-browser-column-with-ladder');
      for(var i = 0, l = collection.length; i < l; i++){
         var element = collection[i].getElementsByClassName('ws-browser-ladder-element')[0];
         if(element !== undefined)
            $(element).toggleClass(element.tagName === 'DIV' ? 'ws-hidden' : 'ws-invisible');
      }
   },
   /**
    * Обработчик скролла в теле браузера
    */
   _onScrollActions: function(){
      if(!Object.isEmpty(this._ladder)){
         var scrollPosition = this._browserContainer.offset().top,
            elem = this._browserContainer.find('tr:visible:first'),
            position = elem.offset();
         while(position !== null && position.top < scrollPosition){
            elem = elem.next('tr:visible');
            position = elem.offset();
         }
         if(elem !== this._previousTRWithLadder){
            this._toggleClassForLadder(elem);
            if(this._previousTRWithLadder !== undefined)
               this._toggleClassForLadder(this._previousTRWithLadder);
            this._previousTRWithLadder = elem;
         }
      }
   }
});
});