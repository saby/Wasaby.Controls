define('js!SBIS3.CORE.RightAccordionPlugin', [ 'js!SBIS3.CORE.TableView', 'css!SBIS3.CORE.RightAccordionPlugin' ], function(TableView) {
   /**
    * @class   $ws.proto.TableView.RightAccordion
    * @extends $ws.proto.TableView
    * @plugin
    */
   $ws.proto.TableView.RightAccordionPlugin = TableView.extendPlugin({
      /**
       * @lends $ws.proto.TableView.RightAccordion.prototype
       */
      $protected: {
         _isSetDblLine: false
      },
      $withoutCondition: ['init'],
      $constructor: function () {
         this._options.display.isRightAccordion = this._options.display.isRightAccordion || this._container.hasClass('ws-right-accordion');
         if (this._options.display.isRightAccordion) {
            this._container.addClass('ws-right-accordion');
            if ($ws.helpers.instanceOfModule(this, 'SBIS3.CORE.TreeView')) {
               this._options.display.viewMode = 'foldersTree';
               this._options.display.folderIconOpen = 'icon-16 icon-Arrow1730 icon-disabled action-hover';
               this._options.display.folderIconClose = 'icon-16 icon-DayForward icon-disabled action-hover';
               this.subscribe('onFolderOpen', this._setDblLine);
               this.subscribe('onKeyPressed', this._cancelKeyPressed);
               this.subscribe('onAfterRender', this._forCheckDbLine);
            }
            this._options.mode = 'navigationMode';
         }
      },
      $condition: function () {
         return this._options.display.isRightAccordion;
      },
      _isNavigation: function(){
         return true;
      },
      _cancelKeyPressed: function(event,e){
         event.setResult(false);
      },
      _setDblLine: function(){
         this._container
               .find('tr .ws-browser-cell-container').each(function(){
                  if(this.scrollHeight !== this.clientHeight || this.scrollWidth !== this.clientWidth) {
                     $(this).parents('tr.ws-browser-table-row').addClass('ws-browser-row-dblline');
                  }
               });
      },
      _onResizeHandler: function(){
         //Бывает такое, что onResizeHandler срабатывает, когда ещё колонок в браузере нету
         //Добавляю проверку на загруженность колонок
         if (this._isVisibleWithParents() && !this._isSetDblLine && !Object.isEmpty(this._currentRecordSet.getColumns())) {
            this._setDblLine();
            this._isSetDblLine = true;
         }
      },
      /**
       *
       * @private
       *
       * Нужна для того, чтобы после рефреша страницы/скрытия контрола
       * при повторном построении аккордиона правильно проставлялся класс ws-browser-row-dblline
       */
      _forCheckDbLine: function() {
         this._setDblLine();
         this._onResizeHandler();
         this._isSetDblLine = false;
      },
      _drawBody: function() {
         this._setDblLine();
      },
      /**
       * Включение/выключение выделения строк, ключи которых переданы в массиве
       * @param {Array} keys массив ключей записей, для которых включаем/выключаем выделение
       * @param {Boolean} [enable=true] Чтобы включить возможность выделения строки,
       * false, чтобы выключить
       */
      setEnabledRows: function (keys, enable) {
         var rowKey;
         for( var i = 0, len = keys.length; i < len; i++ ) {
            rowKey = keys[i];
            this._container.find('tr[rowKey='+ rowKey +']')
               .toggleClass('ws-browser-disabled-item', !enable);
         }
         //снимаем выделение с активной строки, если она задизаблена
         if(this._activeElement && this._isDisabledRow(this._activeElement)) {
            this._activeElement.removeClass('ws-browser-row-selected');
         }
      }
   });

});