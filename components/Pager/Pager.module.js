/**
 * Created with JetBrains PhpStorm.
 * User: ad.chistyakova
 * Date: 25.05.15
 * Time: 10:50
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CONTROLS.Pager', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Pager', 'js!SBIS3.CORE.FieldDropdown',  'js!SBIS3.CORE.Paging'], function(CompoundControl, dotTplFn, Combobox, Paging) {

   'use strict';

   /**
    * @extends $ws.proto.CompoundControl
    * @control
    * @category Decorate
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var Pager = CompoundControl.extend(/** @lends $ws.proto.Paging.prototype */{
      /**
       * @event onPageChange При изменении страницы
       * <wiTag group="Управление">
       * Происходит при смене текущей страницы: при клике по номеру страницы или стрелке перехода на другую страницу.
       * @param {$ws.proto.EventObject} Дескриптор события.
       * @param {Number} number номер новой страницы
       * Необходимо вызвать функцию на успех с аргументом типа Boolean: есть ли следующая страница.
       * @example
       */
      $protected: {
         _dotTplFn: dotTplFn,
         _options: {
            ignoreLocalPageSize : false,
            pagingOptions: {}
         },
         _fddDataKeys: [10, 20, 25, 50, 100, 200, 500, 1000],
         _paging : undefined,
         _fdd: undefined,
         _lastNumRecords: undefined,
         _lastNextPage: undefined
      },
      $constructor: function(){
         var localPageSize = $ws.helpers.getLocalStorageValue('ws-page-size');
         this._publish('onPageChange');
         this._options.pageSize = !this._options.ignoreLocalPageSize  && localPageSize ? localPageSize : this._options.pageSize;
         this.getLinkedContext().setValue('controls-pageSize', this._options.pageSize);
         this._updateLocalStorageValue();
      },
      _updateLocalStorageValue: function(){
         if (!this._options.ignoreLocalPageSize && this._options.pageSize <= 100) {
            $ws.helpers.setLocalStorageValue('ws-page-size', this._options.pageSize);
         }
      },
      init: function(){
         var self = this,
               numPageSize = parseInt(this._options.pageSize, 10),
               sortNumber = function(a, b) {
                  return a - b;
               },
               fddData = {},
               opener;
         Pager.superclass.init.call(this);
         this._fdd = this.getChildControlByName('controls-Pager_comboBox');
         //Если переданный pageSize не входит в стандартный набор - добавим и отсортируем по возрастанию
         if (Array.indexOf(this._fddDataKeys, numPageSize) < 0){
            this._fddDataKeys.push(numPageSize);
            this._fddDataKeys.sort(sortNumber);
         }
         fddData.keys = this._fddDataKeys;
         fddData.values = this._fddDataKeys;
         //TODO подписаться на изменение проперти в контексте. Пока Витя не допилил - подписываюсь на комбобокс
         this._fdd.setData(fddData);
         this._fdd.setValue(numPageSize);
         this._fdd.subscribe('onValueChange', function(event, value){
            //TODO может менять pageSize модно будет в фильтре?
            self._options.pageSize = value;
            self.getPaging().setPageSize(value);
            self.getOpener().setPageSize(value);
            self._updateLocalStorageValue();
         });
         this._paging = this.getChildControlByName('controls-Pager_paging');
         this._paging.subscribe('onPageChange', function(event, pageNum, deferred){
            self._notify('onPageChange', pageNum, deferred);
         });
         //TODO Надо как-то по-другому понимать изменения в выделении listView
         opener = this.getOpener();
         if ($ws.helpers.instanceOfMixin(opener, 'SBIS3.CONTROLS.MultiSelectable')){
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
                  startRecord = page * this._fdd.getValue() + 1;
            if(numRecords === 0){
               pagerStr = '';
            }
            else if(numRecords === 1 && page === 0){
               pagerStr = '1 запись';
            }
            else{
               pagerStr = startRecord + ' - ' + (startRecord + numRecords - 1) + strEnd;
            }
         } else {
            pagerStr += pagerStr === '' ? 'Всего : ' : '. Всего : ';
            pagerStr += numRecords;
         }
         
         if (selectedCount > 0) {
            if (numRecords == 1) {
               pagerStr = 'Выбрана 1 запись';
            } else {
               pagerStr = 'Выбра' + $ws.helpers.wordCaseByNumber(selectedCount, 'но', 'на', 'ны') +
               ' ' + selectedCount + ' запис' + $ws.helpers.wordCaseByNumber(selectedCount, 'ей', 'ь', 'и') + '. ' + pagerStr;
            }
         }
         this.getContainer().find('.controls-Amount-text_js').text(pagerStr);
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
