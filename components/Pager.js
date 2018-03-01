/**
 * Created with JetBrains PhpStorm.
 * User: ad.chistyakova
 * Date: 25.05.15
 * Time: 10:50
 * To change this template use File | Settings | File Templates.
 */
define('SBIS3.CONTROLS/Pager', [
   'Lib/Control/CompoundControl/CompoundControl',
   'tmpl!SBIS3.CONTROLS/Pager/Pager',
   'Core/core-instance',
   'Core/helpers/string-helpers',
   'SBIS3.CONTROLS/DropdownList',
   'Lib/Control/Paging/Paging',
   'i18n!SBIS3.CONTROLS/Pager',
   'css!SBIS3.CONTROLS/Pager/Pager'
], function(CompoundControl, dotTplFn, cInstance, strHelpers) {

   'use strict';

   /**
    * Класс контрола "Блок управления постраничной навигацией".
    * Обычно такой контрол используют совместно со списками и размещают в правом нижнем углу.
    * Контрол состоит из Кнопок постраничной навигации (см. {@link SBIS3.CONTROLS/Paging}) и выпадающего списка, через который устанавливают количество записей на странице.
    * @class SBIS3.CONTROLS/Pager
    * @extends Lib/Control/CompoundControl/CompoundControl
    * @control
    * @category Decorate
    * @public
    * @author Крайнов Д.О.
    */

   var Pager = CompoundControl.extend(/** @lends SBIS3.CONTROLS/Pager.prototype */{
      /**
       * @event onPageChange Происходит при смене текущей страницы: клик по номеру страницы или стрелке перехода на другую страницу.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Number} number Номер новой страницы.
       * @param {Deferred} deferred
       * @example
       */
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
             /**
              * @name SBIS3.CONTROLS/Pager#noSizePicker
              * @cfg {Boolean} Признак, с помощью которого управляют отображением выпадающего списка, через который в пользовательском интерфейсе устанавливается количество записей на странице.
              * @remark
              * В значении false выпадающий список будет скрыт.
              */
            pagingOptions: {}
         },
         _dropdDataKeys: [10, 20, 25, 50, 100, 200, 500, 1000],
         _paging : undefined,
         _dropd: undefined,
         _lastNumRecords: undefined,
         _lastNextPage: undefined,
         // Флаг обозначаюий что была достигнута последняя страница
         _lastPageReached: false
      },
      $constructor: function(){
         this._publish('onPageChange');
      },
      init: function(){
         var self = this,
               numPageSize = parseInt(this._options.pageSize, 10),
               sortNumber = function(a, b) {
                  return a - b;
               },
               fddData = [],
               opener;
         Pager.superclass.init.call(this);
         if(!this._options.noSizePicker) {
            this._dropd = this.getChildControlByName('controls-Pager_comboBox');
            //Если переданный pageSize не входит в стандартный набор - добавим и отсортируем по возрастанию
            if (Array.indexOf(this._dropdDataKeys, numPageSize) < 0) {
               this._dropdDataKeys.push(numPageSize);
               this._dropdDataKeys.sort(sortNumber);
            }
            for (var i = 0; i < this._dropdDataKeys.length; i++) {
               fddData.push({
                  'id': this._dropdDataKeys[i],
                  'value': this._dropdDataKeys[i]
               });
            }
            //TODO подписаться на изменение проперти в контексте. Пока Витя не допилил - подписываюсь на комбобокс
            this._dropd.setItems(fddData);
            this._dropd.setSelectedKeys([numPageSize]);
            this._dropd.subscribe('onSelectedItemsChange', function (event, arr, result) {
               //TODO может менять pageSize модно будет в фильтре?
               if (result.added.length || result.removed.length) {
                  var value = arr[0];
                  self._options.pageSize = value;
                  self.getPaging()._maxPage = self.getPaging().getPage();
                  self.getPaging().setPageSize(value);
                  self.getOpener().setPageSize(value);
               }
            });
         }
         this._paging = this.getChildControlByName('controls-Pager_paging');
         this._paging.subscribe('onPageChange', function(event, pageNum, deferred){
            self._notify('onPageChange', pageNum, deferred);
         });
         //TODO Надо как-то по-другому понимать изменения в выделении listView
         opener = this.getOpener();
         if (cInstance.instanceOfMixin(opener, 'SBIS3.CONTROLS/Mixins/MultiSelectable')){
            this.subscribeTo(opener, 'onSelectedItemsChange', function(ev, array){
               self.updateAmount(self._lastNumRecords, self._lastNextPage, array.length);
            });
         }
      },
       /**
        * @param {Number} numRecords
        * @param {Number} hasNextPage
        * @param {Number} selectedCount
        */
      updateAmount : function(numRecords, more, selectedCount){
         if(!this._options.noPagerAmount) {
            var pagerStr = '';
            this._lastNumRecords = numRecords;
            this._lastNextPage = more;
            selectedCount = selectedCount || 0;

            var strEnd = '',//typeof hasNextPage !== 'boolean' && hasNextPage ? (' из ' + hasNextPage) : '',
               page = this.getPaging().getPage() - 1,
               startRecord = page * this._dropd.getSelectedKeys()[0] + 1;
            if (numRecords === 0) {
               pagerStr = '';
            }
            else if (numRecords === 1 && page === 0) {
               pagerStr = '1 ' + rk('запись');
            }
            else {
               pagerStr = startRecord + ' - ' + (startRecord + numRecords - 1) + strEnd;
            }

            if (typeof more === 'number') {
               if (pagerStr) {
                  pagerStr += ' ' + rk('из') + ' ' + more;
               }
               else {
                  pagerStr = rk('Всего') + ': ' + more;
               }
            }

            if (selectedCount > 0) {
               if (numRecords == 1) {
                  pagerStr = rk('Выбрана') + ' 1 ' + rk('запись');
               } else {
                  pagerStr = strHelpers.wordCaseByNumber(selectedCount, rk('Выбрано'), rk('Выбрана'), rk('Выбраны')) +
                     ' ' + selectedCount + strHelpers.wordCaseByNumber(selectedCount, ' ' + rk('записей'), ' ' + rk('запись', 'множественное'), ' ' + rk('записи')) + '. ' + pagerStr;
               }
            }
            this.getContainer().find('.controls-Amount-text_js').text(pagerStr + ',');
         }
      },
      /**
       * Получить Lib/Control/Paging/Paging
       * @returns {Lib/Control/Paging/Paging}
       */
      getPaging: function(){
         return this._paging;
      },
      setPageSize: function(pageSize) {
         if (this._dropd && this._dropd.getItems().getRecordById(pageSize)) {
            this._dropd.setSelectedKeys([pageSize]);
         } else {
            this.getPaging().setPageSize(pageSize);
         }
      },
      destroy: function () {
         if (this._block) {
            this._block.empty().remove();
            this._block = null;
         }
         Pager.superclass.destroy.apply(this, arguments);
      }
   });

   return Pager;

});
