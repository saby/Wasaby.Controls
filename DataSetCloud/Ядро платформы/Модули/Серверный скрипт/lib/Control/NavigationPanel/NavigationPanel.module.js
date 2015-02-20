/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 14:15
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.NavigationPanel',
      ['js!SBIS3.CORE.Control', 'js!SBIS3.CORE.TDataSource', 'html!SBIS3.CORE.NavigationPanel', 'js!SBIS3.CORE.Marker', 'css!SBIS3.CORE.Accordion', 'css!SBIS3.CORE.NavigationPanel'],
      function( Control, TDataSource, dotTplFn ) {

   'use strict';

   $ws.single.DependencyResolver.register('SBIS3.CORE.NavigationPanel', function(config){
      return config.isCollapsing ? ['js!SBIS3.CORE.NavigationPanelCollapsePlugin'] : [];
   });

   var NAVIGATION_PANEL_PADDING = 16;

   /**
    * Панель навигации
    *
    * @class $ws.proto.NavigationPanel
    * @extends $ws.proto.Control
    * @control
    * <component data-component='SBIS3.CORE.NavigationPanel'>
    * </component>
    * @category Navigation
    */

   $ws.proto.NavigationPanel = Control.Control.extend(/** @lends $ws.proto.NavigationPanel.prototype */{
      /**
       * @event onElementClick Событие при клике на запись. Происходит при непосредственном клике на строку навигационной панели, либо после вызова метода openElement. Результат не обрабатывается
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject Дескриптор события
       * @param {$ws.proto.Record} record Новая активная запись
       * @example
       * <pre>
       *    navigationPanel.subscribe('onElementClick', function(eventObject, record){
       *       $ws.core.alert("Выбрана запись с первичным ключем " + record.getKey());
       *    });
       * </pre>
       */
      /**
       * @event onAfterLoad Событие, происходящее после загрузки дынных. Результат не обрабатывается
       * <wiTag group="Данные">
       * @param {$ws.proto.EventObject} eventObject Дескриптор события
       * @param {$ws.proto.RecordSet} recordSet Экземпляр рекордсета
       * @param {Boolean} isSuccess успешна ли загрузка
       * @param {Error} error произошедшая ощибка (если загрузка неуспешная)
       */
      /**
       * @event onAfterRender Событие, происходящее после готовности контрола (контрол отрисован, повесил обработчики на свои элементы, установил активный пункт или не установил, если выбрана опция noSelectAtFirstLoad). Результат не обрабатывается
       * <wiTag group="Отображение">
       * @param {$ws.proto.EventObject} eventObject Дескриптор события
       */
      $protected: {
         _options : {
            /**
             * @cfg {Boolean} Сохранять состояние
             * <wiTag group="Управление">
             * Этот параметр устанавливает необходимость сохранения состояния контрола
             */
            saveState : true,
            /**
             * @cfg {Object} Параметры получения данных, передаются непосредственно в $ws.proto.RecordSet
             * <wiTag group="Данные">
             * <pre>
             *    dataSource: {
             *       readerParams: {
             *          linkedObject: 'Сотрудники',
             *          queryName: 'Список'
             *       }
             *    }
             * </pre>
             * Подробный пример смотри в описании $ws.proto.RecordSet
             * @editor TDataSourceEditor
             */
            dataSource: TDataSource,
            /**
             * @cfg {String} Поведение
             * <wiTag group="Управление">
             * @variant default в той же позиции
             * @variant dragToTop вверху (активная вкладка открывается вверху панели)
             */
            behavior: 'default',
            autoHeight: false,
            /**
             * @cfg {String} Поле с названием иерархии
             * <wiTag group="Данные">
             * Это свойство хранит имя отображаемого в панели поля записи
             */
            altTreeNameFld: '',
            /**
             * @cfg {String} Поле иерархии
             * <wiTag group="Данные">
             * Данное свойство указывает на поле, хранящее ключ иерархии (поле hierColumn каждой записи покажет ключ родителя этой записи)
             * По умолчанию это поле имеет значение "Раздел"
             */
            hierColumn: 'Раздел',
            /**
             * @typedef {Object} FilterParam
             * @property {string} fieldName Имя поля
             * @property {boolean} [autoreload=true] Перезагружать данные при изменении поля в контексте
             */
            /**
             * @cfg {Object.<string, boolean|number|string|FilterParam>} Параметры фильтрации списочного метода бизнес-логики
             * <wiTag group="Данные">
             * В данном свойстве можно указать параметры фильтрации источника данных
             * <pre>
             *    filterParams: {
             *       "ИдСотрудника": 12
             *    }
             * </pre>
             */
            filterParams: {},
            /**
             * @cfg {Boolean} Отображать ли маркер
             * <wiTag group="Отображение">
             * Данный параметр указывает на то, будет ли отображаться маркер (обводка) на активном элементе панели
             */
            hasMarker: true,
            /**
             * @cfg {Function} Функция отрисовки строки
             * <wiTag group="Отображение">
             * Функция в качестве аргументов получает рекорд строки и jQuery обертку строки (!!! которой еще нет в DOM-дереве) и должна возвращать
             * jQuery элемент.
             * Для задания этой опции используйте функцию setRender, для получения - getRender
             * <pre>
             *    render: function(rec, $str){
             *       return rec.hasChildren() ?
             *          $str.append('<span>' + this.getRecordSet().recordChilds(rec.getKey()).length + '</span>') :
             *          $str.css('color', '#999');
             *    }
             * </pre>
             */
            render: undefined,
            /**
             * @cfg {Boolean} Оставлять ли открытыми вкладки при первой загрузке
             * <wiTag group="Отображение">
             * Параметр показывает, будут ли открыты какие-либо вкладки по умолчанию при первой загрузке контрола.
             * Следует учитывать, что при при активации адного из элементов контрол начнет работу в обычном режиме (активной будет только одна вкладка)
             */
            openDefault: false,
            /**
             * @cfg {String} Поле "Открыт по умолчанию"
             * <wiTag group="Отображение">
             * Этот параметр указывает на поле, которое отвечает за то, будет ли открыта какая-либо категория или раздел по умолчанию.
             */
            openDefaultField: 'Открыт по умолчанию',
            /**
             * @cfg {Boolean} Не выделять запись при первой загрузке
             * <wiTag group="Отображение">
             * Дает возможность при первой загрузке контрола не активировать ни один из пунктов (Но в случае применения сохраненного состояние
             * из адресной строки, активация при первой загрузке произойдет)
             */
            noSelectAtFirstLoad: false,
            /**
             * @cfg {String} Поле "Фиктивный"
             */
            fictitiousField: null,
            /**
             * @cfg {Boolean} Устанавливать ли название выбранного раздела в заголовок страницы
             * <wiTag group="Отображение">
             * Если включить данную опцию, то название выбранного раздела будет установлено в качестве заголовка страницы
             */
            setTitle: true,
            /**
             * @cfg {Boolean} Отображать ли счетчики
             */
            showCounters: false,
            cssClassName: 'ws-accordion ws-navigation-panel'
         },
         _dReady : null,
         _defTopParent: null,
         _roots: [],
         _areaHeight: [],
         _recordSet: null,
         _activeElement : null,
         _onAfterLoadHandler: null,
         _onAfterLoadRecordSet : null,
         _ftime: false,
         _activeGroup: null,
         _initialDocTitle: undefined,
         _systemFilterParams: {},
         _initialFilterParams: {}
      },
      $constructor: function(){
         this._publish('onElementClick', 'onReplaceMarker', 'onAfterLoad', 'onAfterRender');

         var self = this;
         this._onAfterLoadHandler = function(e, data, isSuccess, error){
            self._notify('onAfterLoad', data, isSuccess, error);
            if(!isSuccess){
               $ws.single.ioc.resolve('ILogger').error('NavigationPanel', error.message);
               self._dReady.errback();
               return;
            }
            self._recordSet = data;
            self._roots = data.recordChilds(null);
            self._container.html(dotTplFn(self));
            self._bindInternals();
            if(!self._options.noSelectAtFirstLoad || self._activeElement !== null){
               if (self._activeElement !== null){
                  if(!self._isValidRecord(self._activeElement)){
                     if (!self._isValidRecord(self._activeGroup)) {
                        self._activeElement = self._roots[0];
                        self._openGroup(self._activeElement);
                        self._selfNotify(self._activeElement, undefined, true);
                     } else {
                        self._activeElement = self._activeGroup;
                        self._ftime = false;
                        self.openElement(self._activeElement, self._ftime, true);
                     }
                  } else {
                     var state = $ws.single.NavigationController.getStateByKey(self.getStateKey()) || {};
                     self._ftime = false;
                     self.openElement(self._activeElement, self._ftime, false, !(state.state !== self._activeElement));
                     self._container
                           .find('.ws-accordion-wr.ws-navigation-panel-open-default')
                           .removeClass('ws-navigation-panel-open-default');
                  }
               }
               else if(self._roots.length){
                  self._activeElement = self._roots[0];
                  self._openGroup(self._activeElement);
                  self._selfNotify(self._activeElement, undefined, true);
               }
            }
            else{
               self._notify('onElementClick', undefined);
            }

            self._dReady.callback();
            self._ftime = true;
            self._notifyBatchDelayed('onAfterRender');
         };

         this._dReady = new $ws.proto.Deferred();
         this._defTopParent = new $ws.proto.Deferred();

         function createMarker() {
            if(self._options.hasMarker && self._activeElement){
               var
                     element = self.getContainer().find('[element="' + self._activeElement + '"]'),
                     cfg = self.elementIsRoot(self._activeElement) ? {} : {left: -element.position().left, width: NAVIGATION_PANEL_PADDING + element.position().left };
               $ws.single.Marker.positionToElement(element, cfg);
            }
            self._defTopParent.callback();
         }

         var topParent = this.getTopParent();
         if( $ws.helpers.instanceOfModule(topParent, 'SBIS3.CORE.NavigationPanel') )
            createMarker();
         else {
            topParent.subscribe('onReady', function(){
               self._dReady.addCallback(function(){
                  createMarker();
               });
            });
         }

         if(this._options.autoHeight)
            this._container.css({
               'height': 'auto',
               'overflow-y': 'visible'
            });
         this._systemFilterParams = {
            'Разворот': 'С разворотом',
            'ЗаголовокИерархии': this._options.altTreeNameFld
         };
         this._options.dataSource.filterParams = $ws.core.clone(this._systemFilterParams);
         this._options.dataSource.filterParams = $ws.core.merge(this._options.dataSource.filterParams, this._options.filterParams, {rec: true});
         this._initialFilterParams = $ws.core.clone(this._options.dataSource.filterParams);
         this._options.dataSource.hierarchyField = this._options.hierColumn;
         this._deleteOpenDefault();
         this.subscribe('onReplaceMarker', function(e, key){
            self._onReplaceMarkerHandler(key);
         });
         this.once('onInit', function(){
               //обеспечиваем поднятие события строго после подписки на него NavigationController'ом
               self._notify('onStateChanged');
               self._createRecordSet($ws.core.clone(self._options.dataSource), self._onAfterLoadHandler);
         });
      },
      _onReplaceMarkerHandler: function(key){
         var element = this.getContainer().find('[element="' + key + '"]');
         if(this._options.hasMarker && this._defTopParent.isReady()){
            var cfg = this.elementIsRoot(key) ? {} : {left: -element.position().left, width: NAVIGATION_PANEL_PADDING + element.position().left };
            $ws.single.Marker.positionToElement(element, cfg);
         }
      },
      /**
       * @param {Object} filterParams Параметры фильтрации источника данных
       * <wiTag group="Управление">
       * Обновляет рекордсет панели. Используется в случае, если данные, отображаемые панелью, изменились
       */
      refresh: function(filterParams){
         var self = this;
         filterParams = filterParams || {};
         self._dReady = new $ws.proto.Deferred();
         self._areaHeight = [];
         self._options.dataSource.filterParams = $ws.core.clone(self._initialFilterParams);
         if (!$.isEmptyObject(filterParams)) {
            $ws.core.merge(self._options.dataSource.filterParams, filterParams, {rec: true, preferSource: false});
         }

         if (self._onAfterLoadRecordSet instanceof $ws.proto.RecordSet && !self._onAfterLoadRecordSet.isInit()){
            self._onAfterLoadRecordSet.destroy();
         }
         self._onAfterLoadRecordSet = self._createRecordSet($ws.core.clone(self._options.dataSource), self._onAfterLoadHandler)
      },
      //проверяет, есть ли в нашем рекордсете рекорд с заданным id
      _isValidRecord: function(id){
         try{
            this._recordSet.getRecordByPrimaryKey(id);
            return true;
         }
         catch(e){ return false; }
      },
      _createRecordSet : function(options, handler){
         options.handlers = options.handlers || {};
         options.handlers.onAfterLoad = handler;
         return new $ws.proto.RecordSet(options);
      },
      /*
       * Проверка раздела на "фиктивность"
       * Вернет:
       * true — раздел фиктивный, открываем первый дочерний
       * false — раздел не фиктивный, ничего не делаем
       * */
      _checkFictitiousField: function(key) {
         var rs = this.getRecordSet(),
               isFictitiousField = this._options.fictitiousField && rs.getRecordByPrimaryKey(key).get(this._options.fictitiousField),
               childs = rs.recordChilds(key);
         if (isFictitiousField && childs.length) {
            this.openElement(childs[0], undefined, true);
            return true;
         }
         return false;
      },
      _labelClickHandler: function(key){
         if (this._checkFictitiousField(key)) return;
         this._activeElement = key;
         this._openGroup(key);
         this._selfNotify(key, undefined, true);
      },
      _bindInternals: function(){
         var self = this;

         this._container.find('.ws-accordion-wr>.ws-accordion-element-title')
               .hover(function(e){
                  $(this).parent().toggleClass('ws-accordion-wr-hover', e.type == 'mouseenter' && self.isEnabled());
               })
               .click(function(){
                  if (self.isEnabled()) {
                     self._labelClickHandler($(this).attr('element'));
                  }
               });
         this._container.find('.ws-navigation-panel-item .ws-navigation-panel-text-container')
               .click(function(){
                  if (self.isEnabled()) {
                     self.openElement($(this).attr('element'), undefined, true);
                  }
               });
      },
      /**
       * Удаляем классы open default, ведем себя как обычно
       */
      _deleteOpenDefault: function(){
         var self = this,
             deleteOpenDefaultClass = function(){
                self._container
                   .find('.ws-accordion-wr.ws-navigation-panel-open-default')
                   .removeClass('ws-navigation-panel-open-default');
                // запомним в историю браузера состояние "Ничего не выбрано"
                var state = $ws.single.NavigationController.getStateByKey(self.getStateKey()) || {};
                if (state.state !== self._activeElement) {
                   $ws.single.HashManager.pushState();
                }
             },
             onElementClickHandler =  function(e, rec) {
                if(rec) {
                   self.unsubscribe('onElementClick', onElementClickHandler);
                   deleteOpenDefaultClass();
                }
             };
         self.subscribe('onElementClick', onElementClickHandler, true);
      },
      /**
       * <wiTag group="Управление">
       * Делает активной запись панели(раздел или категорию)
       * @param {Number} key - id записи активизируемой
       * @param {Boolean} noNotifyClick - нужно ли активировать событие onElementClick
       * @param {Boolean} changeState - нужно ли не запоминать новое состояние в истории браузера
       * @example
       * <pre>
       *    navigationPanel.subscribe('onElementClick', function(eventObject, record){
       *       if(record.getKey() == 1)
       *          this.openElement(2);
       *    });
       * </pre>
       */
      openElement : function(key, noNotifyClick, changeState, noNotifyState) {
         var element,
             parent,
             isRoot;

         if (this._checkFictitiousField(key)) return;

         element = this._container.find('[element="'+ key +'"]');
         parent = element.parent();
         isRoot = parent.hasClass('.ws-accordion-wr');

         if (!element.length) return;

         if(isRoot) {
            this._openGroup(key);
         } else {
            // Открывает родительскую группу (в которой сидит сам
            this._openGroup(element.parents('.ws-accordion-wr').children('.ws-accordion-element-title').attr('element'));
            // Показывает вложенные группы
            element.parent().children('ul.ws-navigation-panel-list').show();
            // Показывает собственного родителя
            element.parents('.ws-navigation-panel ul.ws-navigation-panel-list').show();
            // Для каждого из родителей, ищем соседние элементы и внутри каждого скрываем списки аккордеона.
            // Не поднимаемся выше собственного контейнера чтобы не искать лишнего
            element.parentsUntil('.ws-navigation-panel').siblings().find('ul.ws-navigation-panel-list').hide();
         }
         this._notifyOnSizeChanged(this, this);
         this._activeElement = key;
         this._selfNotify(key, noNotifyClick, changeState, noNotifyState);
      },
      _setDocumentTitle: function(title){
         if(title) {
            var docTitle = document.title;
            document.title = /\//.test(docTitle) ?
                  [title, '/', docTitle.split('/').pop()].join('') :
                  [title, '/', docTitle].join('');
            if (!this._initialDocTitle) {
               this._initialDocTitle = (/^.+(?=\/)|[^\/]+$/.exec(docTitle) || ['']).pop();
            }
         }
      },
      /**
       * <wiTag group="Отображение">
       * Очистить значения счетчиков
       */
      clearCounters: function() {
         this._container.find('[countermenu]').html('');
         this._activeElement && this._notifyBatchDelayed('onReplaceMarker', this._activeElement);
      },
      /**
       * <wiTag group="Отображение">
       * Устанавливает счетчики
       * @param {Object} counters (key — идентификатор элемента меню, value — значение счетчика)
       * @example
       * <pre>
       *    navigationPanel.setCounters({
       *       'ИдентификаторМеню1': 'Значение счетчика 1'
       *       'ИдентификаторМеню2': 'Значение счетчика 2'
       *    });
       * </pre>
       */
      setCounters: function(counters) {
         for (var key in counters) {
            if (counters.hasOwnProperty(key) && this._isValidRecord(key)) {
               this._container.find('[countermenu="' + key + '"]').html(counters[key]);
            }
         }
         this._activeElement && this._notifyBatchDelayed('onReplaceMarker', this._activeElement);
      },
      /**
       * <wiTag group="Управление">
       * Применение сохраненного состояния
       * @param {Number} key - id записи
       */
      applyState : function(key){
         var self = this;
         if (this._recordSet === null){
            this._activeElement = key;
         }
         else{
            this._dReady.addCallback(function(){
               var state = $ws.single.NavigationController.getStateByKey(self.getStateKey()) || {};
               self.openElement(key, undefined, !(state.state === key), true);
            });
         }
      },

      applyEmptyState: function(){
         if(this._options.noSelectAtFirstLoad){
            this.redraw(true);
            this._clearActiveElement();
            this._deleteOpenDefault();
            this._setDocumentTitle(this._initialDocTitle);
            this._notify('onElementClick', undefined);
         }
      },

      _clearActiveElement: function(){
         this._activeElement = null;
         $ws.single.Marker.hide();
      },

      _openGroup: function(id){
         this._activeGroup = this._activeElement = id;
         if(this._container.find('[element="'+ id +'"]').hasClass('ws-accordion-active'))
            return;
         this._closeActiveGroup();
         var
               wr = this._container.find('[element="'+ id +'"]').parent().addClass('ws-accordion-wrapper-active'),
               title = wr.children('.ws-accordion-element-title').addClass('ws-accordion-active'),
               area = wr.children('.ws-accordion-element-area').show();
         area.children('ul.ws-navigation-panel-list').css('display', 'block');
         this._container.find('.ws-accordion-element-title').trigger('mouseleave');
         if(!this._options.autoHeight && !this._areaHeight[id]){
            this._areaHeight[id] = this._container.outerHeight() - this._roots.length * title.outerHeight()
                  - this._container.find('.ws-accordion-shadow').height() - parseInt(area.css('padding-top'), 10);
            if(area.height() < this._areaHeight[id])
               area.height(this._areaHeight[id]);
         }
         if(this._options.behavior == 'dragToTop' && wr.prev().length){
            this._dragToTop(wr);
         }
         if(this._options.setTitle)
            this._setDocumentTitle(this.getActiveRecord().get(this._options.altTreeNameFld));
         this._notifyOnSizeChanged(this, this);
      },

      _dragToTop: function(wr){
         var
               wasActive = this._container.find('.ws-accordion-wr').first(),
               wasActiveId = wasActive.attr('id').replace(this.getId() + '-', ''),
               indexBefore = Array.indexOf(this._roots, String(wasActiveId)) - 1,
               self = this,
               getWr = function(idx){
                  return self._container.find('#' + self.getId() + '-' + self._roots[idx]);
               },
               befored;
         //перетащим новую активную вкладку на самый верх
         wasActive.before(wr);
         //поставим бывшую активную вкладку на нужное место
         if(indexBefore > -1){
            if(!(befored = getWr(indexBefore)).hasClass('ws-accordion-wrapper-active'))
               befored.after(wasActive);
            else
               getWr(--indexBefore).after(wasActive);
         }
      },

      _closeActiveGroup: function(){
         this._container.find('.ws-accordion-wrapper-active')
               .removeClass('ws-accordion-wrapper-active')
               .children('.ws-accordion-element-title')
               .removeClass('ws-accordion-active')
               .end()
               .children('.ws-accordion-element-area')
               .hide()
               .end()
               .find('ul.ws-navigation-panel-list')
               .hide();
      },
      /**
       * <wiTag group="Управление">
       * Проверяет, лежит ли запись в корне (является ли категорией)
       * @param {Number} id Идентификатор записи
       * @return {Boolean}
       * @example
       * <pre>
       *    navigationPanel.subscribe('onElementClick', function(eventObject, record){
       *       if(this.elementIsRoot(record.getKey()))
       *          $ws.core.alert("Выбрана категория " + record.get('Название'));
       *    });
       * </pre>
       */
      elementIsRoot: function(id){
         return !!(Array.indexOf(this._roots, String(id)) != -1);
      },
      /**
       * <wiTag group="Управление">
       * Возвращает jQuery обертку активного элемента
       * @return {jQuery}
       * @example
       * <pre>
       *    navigationPanel.getActiveElement().append('<img src="active.png"/>');
       * </pre>
       */
      getActiveElement : function(){
         return this._container.find('[element="'+ this._activeElement +'"]');
      },
      /**
       * <wiTag group="Управление">
       * Возвращает рекорд активного элемента
       * @return {$ws.proto.Record}
       * @example
       * <pre>
       *    var info = navigationPanel.getActiveRecord().get('Инфо');
       *    if(!!info)
       *       $ws.core.alert(info)
       * </pre>
       */
      getActiveRecord : function(){
         var res = null;
         if (this._recordSet instanceof $ws.proto.RecordSet){
            try{
               res = this._recordSet.getRecordByPrimaryKey(this._activeElement);
            }
            catch (e){
               res = null;
            }
         }
         return res;
      },
      /**
       * <wiTag group="Данные">
       * Возвращает рекордсет панели
       * @return {$ws.proto.RecordSet}
       * @example
       * <pre>
       *    var recordSet = navigationPanel.getRecordSet();
       *    recordSet.appendRecord(new $ws.proto.Record(cfg));
       *    navigationPanel.refresh();
       * </pre>
       */
      getRecordSet : function(){
         return this._recordSet;
      },

      _selfNotify: function(key, noNotifyClick, changeState, noNotifyState){
         this._notifyBatchDelayed('onReplaceMarker', key);
         if (!noNotifyClick) {
            this._notify('onElementClick', this._recordSet.getRecordByPrimaryKey(key));
         }
         if (!noNotifyState) {
            this._notify('onStateChanged', key, !changeState);
         }
      },
      /**
       * <wiTag group="Управление">
       * Задает функцию отрисовки строки
       * @param {Function|undefined} fn функция отрисовки или undefined
       * @example
       * <pre>
       *    navigationPanel.setRender(function(rec, str){
       *       return str.css('color', '#f00').append('<span>123</span>');
       *    });
       *    navigationPanel.redraw()
       * </pre>
       */
      setRender: function(fn){
         if(typeof(fn) === 'function' || typeof(fn) === 'undefined')
            this._options.render = fn;
      },
      /**
       * <wiTag group="Управление">
       * Возвращает функцию отрисовки
       * @return {Function}
       */
      getRender: function(){
         return this._options.render;
      },
      /**
       * <wiTag group="Отображение">
       * Перерисовывает панель, не запрашивая заново данные. Пример можно посмотреть в описании функции setRender
       */
      redraw: function(noNotify){
         this._container.html(dotTplFn(this));
         this._bindInternals();
         if(!noNotify){
            this.openElement(this._activeElement, true, true);
            this._notifyBatchDelayed('onAfterRender');
         }
         this._notifyOnSizeChanged(this, this);
      },
      /**
       * <wiTag group="Управление">
       * Устанавливает флаг "Открывать вкладки при первой загрузке"
       * @param {Boolean} opDef открывать ли по умолчанию какие-либо вкладки
       */
      setOpenDefault: function(opDef){
         if(typeof(opDef) === 'boolean')
            this._options.openDefault = opDef;
      },
      _rowRender: function(rec, cssClass, id){
         var
               render = this._options.render,
               opt = this._options,
               str;
         if (typeof(render) == 'function') {
            str = render.apply(this, [rec, $('<span>' + rec.get(this._options.altTreeNameFld) + '</span>')]);
            if (typeof(str) === 'object' && 'jquery' in str) {
               str.addClass(cssClass + ' ws-navigation-panel-custom-render');
               if (!opt.showCounters) {
                  str.attr('element', id);
               }
               str = $ws.helpers.escapeTagsFromStr($ws.helpers.jQueryToString(str), ['script']);
            }
         }
         return str;
      },
      _buildBody: function(key){
         var
               self = this,
               rs = this._recordSet,
               opt = this._options,
               childs = rs.recordChilds(key),
               result = [],
               opDef = opt.openDefault && !this.elementIsRoot(key) && rs.getRecordByPrimaryKey(key).get(opt.openDefaultField) ?
                       ' ws-navigation-panel-open-default' : '',
               len = childs.length,
               value,
               wrapper,
               rec;
         if (len) {
            result.push('<ul id="ws-navigation-panel-list-', key, '" class="ws-navigation-panel-list', opDef, '">');
            for (var j = 0; j < len; j++) {
               rec = rs.getRecordByPrimaryKey(childs[j]);
               if (opt.showCounters) {
                  value = self._rowRender(rec, 'ws-navigation-panel-text', childs[j]) ||
                        '<div class="ws-navigation-panel-text">' + rec.get(opt.altTreeNameFld) + '</div>'
                  wrapper = '<li id="ws-navigation-panel-item-$elementName$s$" class="ws-navigation-panel-item"><span class="ws-navigation-panel-text-container counters ws-navigation-panel-no-render" element="$elementName$s$">$value$s$ $counter$s$</span>$body$s$</li>';
               } else {
                  value = self._rowRender(rec, 'ws-navigation-panel-text-container', childs[j]) ||
                        '<span class="ws-navigation-panel-text-container ws-navigation-panel-no-render" element="' + childs[j] + '">' + rec.get(opt.altTreeNameFld) + '</span>'
                  wrapper = '<li id="ws-navigation-panel-item-$elementName$s$" class="ws-navigation-panel-item">$value$s$ $body$s$</li>';
               }
               result.push($ws.helpers.format({
                        elementName: childs[j],
                        value: value,
                        body: self._buildBody(childs[j]),
                        counter: '<div countermenu="' + childs[j] + '" class="ws-navigation-panel-counter"></div>'
                     },
                     wrapper
               ));
            }
            result.push('</ul>');
         }
         return result.join('');
      },
      _buildTitle: function(id) {
         var self = this,
               opt = this._options,
               record = self._recordSet.getRecordByPrimaryKey(id),
               prepareHtml;

         if (opt.showCounters) {
            return $ws.helpers.format({
                     elementName: id,
                     value: self._rowRender(record, 'ws-navigation-panel-text-container ws-navigation-panel-text', id) ||
                           '<div class="ws-navigation-panel-text-container ws-navigation-panel-text ws-navigation-panel-no-render">' + record.get(self._options.altTreeNameFld) + '</div>',
                     counter: '<div countermenu="' + id + '" class="ws-navigation-panel-counter"></div>'
                  },
                  '<span element="$elementName$s$" class="ws-accordion-element-title counters"><div class="ws-accordion-element-title-table-wrapper">$value$s$ $counter$s$</div></span>'
            );
         } else {
            return self._rowRender(record, 'ws-accordion-element-title', id) ||
                  '<span class="ws-accordion-element-title ws-navigation-panel-no-render" element="' + id + '">' + record.get(self._options.altTreeNameFld) + '</span>';
         }
      },
      destroy: function(){
         this._container.find('.ws-accordion-wr>.ws-accordion-element-title, ' +
                              '.ws-navigation-panel-item .ws-navigation-panel-text-container')
                        .unbind();
         $ws.single.Marker.hide();
         $ws.proto.NavigationPanel.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.NavigationPanel;

});