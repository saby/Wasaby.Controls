/**
 * Created with JetBrains PhpStorm.
 * User: ad.chistyakova
 * Date: 25.05.15
 * Time: 10:50
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CONTROLS.Pager', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Pager',
   'js!SBIS3.CONTROLS.DropdownList',
   'js!SBIS3.CORE.Paging',
   'Core/core-instance',
   'Core/helpers/string-helpers',
   'i18n!SBIS3.CONTROLS.Pager',
   'css!SBIS3.CONTROLS.Pager'
], function(CompoundControl, dotTplFn, Combobox, Paging, cInstance, strHelpers) {

   'use strict';

   /**
    * @class SBIS3.CONTROLS.Pager
    * @extends SBIS3.CORE.CompoundControl
    * @control
    * @category Decorate
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var Pager = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Pager.prototype */{
      /**
       * @event onPageChange При изменении страницы
       * <wiTag group="Управление">
       * Происходит при смене текущей страницы: при клике по номеру страницы или стрелке перехода на другую страницу.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Number} number номер новой страницы
       * Необходимо вызвать функцию на успех с аргументом типа Boolean: есть ли следующая страница.
       * @example
       */
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            pagingOptions: {}
         },
         _dropdDataKeys: [10, 20, 25, 50, 100, 200, 500, 1000],
         _paging : undefined,
         _dropd: undefined,
         _lastNumRecords: undefined,
         _lastNextPage: undefined
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
         this._dropd = this.getChildControlByName('controls-Pager_comboBox');
         //Если переданный pageSize не входит в стандартный набор - добавим и отсортируем по возрастанию
         if (Array.indexOf(this._dropdDataKeys, numPageSize) < 0){
            this._dropdDataKeys.push(numPageSize);
            this._dropdDataKeys.sort(sortNumber);
         }
         for (var i = 0; i < this._dropdDataKeys.length; i++) {
            fddData.push({
               'id' : this._dropdDataKeys[i],
               'value' :  this._dropdDataKeys[i]
            });
         }
         //TODO подписаться на изменение проперти в контексте. Пока Витя не допилил - подписываюсь на комбобокс
         this._dropd.setItems(fddData);
         this._dropd.setSelectedKeys([numPageSize]);
         this._dropd.subscribe('onSelectedItemsChange', function(event, arr){
            //TODO может менять pageSize модно будет в фильтре?
            var value = arr[0];
            self._options.pageSize = value;
            self.getPaging()._maxPage = self.getPaging().getPage();
            self.getPaging().setPageSize(value);
            self.getOpener().setPageSize(value);
         });
         this._paging = this.getChildControlByName('controls-Pager_paging');
         this._paging.subscribe('onPageChange', function(event, pageNum, deferred){
            self._notify('onPageChange', pageNum, deferred);
         });
         //TODO Надо как-то по-другому понимать изменения в выделении listView
         opener = this.getOpener();
         if (cInstance.instanceOfMixin(opener, 'SBIS3.CONTROLS.MultiSelectable')){
            opener.subscribe('onSelectedItemsChange', function(ev, array){
               self.updateAmount(self._lastNumRecords, self._lastNextPage, array.length);
            });
         }
      },
      updateAmount : function(numRecords, hasNextPage, selectedCount){
         var pagerStr = '';
         this._lastNumRecords = numRecords;
         this._lastNextPage = hasNextPage;
         selectedCount = selectedCount || 0;
         if (typeof hasNextPage === 'boolean'){
            var strEnd = '',//typeof hasNextPage !== 'boolean' && hasNextPage ? (' из ' + hasNextPage) : '',
                  page = this.getPaging().getPage() - 1,
                  startRecord = page * this._dropd.getSelectedKeys()[0] + 1;
            if(numRecords === 0){
               pagerStr = '';
            }
            else if(numRecords === 1 && page === 0){
               pagerStr = '1 ' + rk('запись');
            }
            else{
               pagerStr = startRecord + ' - ' + (startRecord + numRecords - 1) + strEnd;
            }
         } else {
            pagerStr += pagerStr === '' ? rk('Всего') + ' : ' : '. ' + rk('Всего') + ' : ';
            pagerStr += numRecords;
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
      },
      /**
       * Получить SBIS3.CORE.Paging
       * @returns {$ws.proto.Paging}
       */
      getPaging: function(){
         return this._paging;
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
