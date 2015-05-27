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
    * @class $ws.proto.Paging
    * @extends $ws.proto.Control
    * @control
    * @category Decorate
    */

   var Pager = CompoundControl.extend(/** @lends $ws.proto.Paging.prototype */{
      /**
       * @event onPageChange При изменении страницы
       * <wiTag group="Управление">
       * Происходит при смене текущей страницы: при клике по номеру страницы или стрелке перехода на другую страницу.
       * @param {$ws.proto.EventObject} Дескриптор события.
       * @param {Number} number номер новой страницы
       * @param {$ws.proto.Deferred} deferred для режима частичной постраничной навигации.
       * Необходимо вызвать функцию на успех с аргументом типа Boolean: есть ли следующая страница.
       * @example
       * <pre>
       *    paging.subscribe('onPageChange', function(event, pageNumber){
       *       $ws.single.ControlStorage.getByName('table').setPage(page);
       *    });
       * </pre>
       */
      $protected: {
         _dotTplFn: dotTplFn,
         _options: {
            ignoreLocalPageSize : false,
            pagingOptions: {}
         },
         _fddData: {
            keys: [10, 20, 25, 50, 100, 200, 500, 1000],
            values: [10, 20, 25, 50, 100, 200, 500, 1000]

         }
      },
      $constructor: function(){
         var localPageSize = $ws.helpers.getLocalStorageValue('ws-page-size');
         this._publish('onPageChange');
         this._options.pageSize = !this._options.ignoreLocalPageSize  && localPageSize ? localPageSize : this._options.pageSize;
         this.getLinkedContext().setValue('controls-pageSize', this._options.pageSize);
         this._updateLocalStorageValue();
      },
      _updateLocalStorageValue: function(){
         if (!this._options.ignoreLocalPageSize) {
            $ws.helpers.setLocalStorageValue('ws-page-size', this._options.pageSize);
         }
      },
      init: function(){
         var self = this, fdd, paging;
         Pager.superclass.init.call(this);
         fdd = this.getChildControlByName('controls-Pager_comboBox');
         //TODO подписаться на изменение проперти в контексте. Пока Витя не допилил - подписываюсь на комбобокс
         fdd.setData(this._fddData);
         fdd.setValue(this._options.pageSize);
         fdd.subscribe('onChange', function(event, value){
            //TODO здесь поменять у связанного DataGrid - pageSize
            self._options.pageSize = value;
            self.getOpener().setPageSize(value);
            $ws.helpers.setLocalStorageValue('ws-page-size', self._options.pageSize);
         });
         paging = this.getChildControlByName('controls-Pager_paging');
         paging.subscribe('onPageChange', function(event, pageNum, deferred){
            self._notify('onPageChange', pageNum, deferred);
         })
      },
      getPaging: function(){
         return this.getChildControlByName('controls-Pager_paging');
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
