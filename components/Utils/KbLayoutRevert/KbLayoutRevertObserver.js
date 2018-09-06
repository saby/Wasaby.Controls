/**
 * Created by am.gerasimov on 16.09.2016.
 */
define('SBIS3.CONTROLS/Utils/KbLayoutRevert/KbLayoutRevertObserver',
   [
      "Core/core-extend",
      "Core/helpers/String/diffAt",
      "Core/core-clone",
      "SBIS3.CONTROLS/Utils/KbLayoutRevert/KbLayoutRevertUtil",
      "SBIS3.CONTROLS/Utils/KbLayoutRevert/resources/MissSpell",
      'SBIS3.CONTROLS/Utils/QueryUtil',
      'Core/core-instance'
   ],
   function (cExtend, diffAt, coreClone, KbLayoutRevertUtil, MissSpell, queryUtil, cInstance) {
      'use strict';

      /* Вспомогательный класс, для посчёта времени запроса.
       Нужен, чтобы понять, требуется ли скрывать/отображать индикатор  */
      function Timer(){
         this.startTime = null;
         this.stared = false;

         this.start = function() {
            this.startTime = new Date();
            this.stared = true;
         };
         this.stop = function() {
            this.startTime = null;
            this.stared = false;
         };
         this.getTime = function() {
            /* Возвращаем время в мс */
            return this.startTime ? new Date().getTime() - this.startTime.getTime() : 0; //startTime может не быть, если memory source
         };
      }
      
      function analyzeQueryResult (queryResult, items) {
         if (queryResult.getCount() < this._options.view.getPageSize()) {
            //Такое может произойти (данные в item и в queryResult одинаковы), когда вёдется поиск в нескольких вкладках,
            //потому что запрос отправляется отдельно от списка (не через reload, а через source.query())
            if (!items.isEqual(queryResult)) {
               items.prepend(queryResult);
            }
         } else {
            items.assign(queryResult);
         }
      }

      /* Обобщение механизма ожидания делается по задаче
       https://inside.tensor.ru/opendoc.html?guid=7ef15c0d-c70e-4956-ba97-7f9e6d0d4f15&des=
       Задача в разработку 25.03.2016 нужно обобщить появление ромашки ожидания. в FormController, в ListView логика ожидания должна быть … */
      var INDICATOR_DELAY = 750;

      /**
       * Класс, который позволяет отслеживать изменения раскладки введённого текста и автоматически изменять её (с кириллицы на латиницу и наоборот), если в результате запроса не было выбрано ни одной записи.
       * Класс (утилита) предназначен, чтобы связать работу поля ввода и списка, который создан на основе {@link SBIS3.CONTROLS/ListView}.
       * @class SBIS3.CONTROLS/Utils/KbLayoutRevert/KbLayoutRevertObserver
       * @author Крайнов Д.О.
       * @extends Core/core-extend
       * @public
       */
      var KbLayoutRevertObserver = cExtend({}, /** @lends SBIS3.CONTROLS/Utils/KbLayoutRevert/KbLayoutRevertObserver.prototype */{
         $protected: {
            _options: {
               /**
                * @cfg {SBIS3.CONTROLS/TextBox/TextBoxBase} Устанавливает экземляр класса контрола, через который пользователь осуществляет ввод поискового запроса.
                * @remark
                * В опцию можно передать любой экземпляр класса, который наследуется от {@link SBIS3.CONTROLS/TextBox/TextBoxBase}.
                * В этом контроле будет автоматически изменена раскладка, если запрос в связанном списке (см. {@link view}) вернул 0 записей.
                *
                */
               textBox: null,
               /**
                * @cfg {SBIS3.CONTROLS/ListView} Устанавливает экземляр класса списка, в котором отображаются результаты поиска.
                * @remark
                * В опцию можно передать любой экземпляр класса, который наследуется от {@link SBIS3.CONTROLS/ListView}.
                */
               view: null,
               /**
                * @cfg {String} Устанавливает имя параметра фильтрации.
                * @remark
                * Смысл этого параметра фильтрации подробно описан в опции {@link SBIS3.CONTROLS/Mixins/SuggestTextBoxMixin#seacrhParam}.
                * @see setParam
                * @see getParam
                */
               param: null,
               /**
                * @cfg {Boolean} Устаналивает поведение для смены раскладки, когда в результате поиска возвращается 0 записей.
                * @remark
                * Если запрос был выполнен в кириллице, то раскладка меняется на латиницу, и наоборот. Одна в зависимости от значения опции newStandart возможно следующее поведение:
                * <ul>
                *     <li>true - перед сменой раскладки выводится сообщение "Возможно вы имели ввиду ...", где предложен поисковый запрос в другой раскладке.</li>
                *     <li>false - автоматически выполняется запрос в другой раскладке. </li>
                * </ul>
                */
               newStandart: false
            },
            _textBeforeTranslate: null,
            _itemsBeforeTranslate: null,
            _onViewDataLoadHandler: null,
            _observed: false,
            _oldSearchValue: '',
            _timer: null,
            _missSpell: null,
            _missSpellUsed: false,
            _currentItems: null
         },

         $constructor: function() {
            this._onViewDataLoadHandler = this._onViewDataLoad.bind(this);
            this._onBeforeDataLoadHandler = this._onBeforeDataLoad.bind(this);
         },
          /**
           * Запускает работу утилиты.
           * @example
           * <pre>
           * var util = new KbLayoutRevertObserver({
           *    textBox: myTextBoxInstance,
           *    view: myViewInstance,
           *    param: 'searchString',
           *    newStandart: true
           * });
           * util.startObserve();
           * </pre>
           * @see stopObserve
           */
         startObserve: function() {
            if(!this._observed) {
               this._toggleViewEvents(true);
               this._observed = true;
            }
         },
          /**
           * Останавливает работы утилиты.
           * @example
           * <pre>
           * var util = new KbLayoutRevertObserver({
           *    textBox: myTextBoxInstance,
           *    view: myViewInstance,
           *    param: 'searchString',
           *    newStandart: true
           * });
           * util.stopObserve();
           * </pre>
           * @see stopObserve
           */
         stopObserve: function() {
            if(this._observed) {
               this._toggleViewEvents(false);
               this._textBeforeTranslate = null;
               this._itemsBeforeTranslate = null;
               this._observed = false;
               this._oldSearchValue = '';
               this._hideMissSpell();
               this._toggleItemsEventRaising(true);
            }
         },
   
         /**
          * Устанавливает параметр фильтрации.
          * @param {String} param
          * @see param
          * @see getParam
          */
         setParam: function(param) {
            this._options.param = param
         },
          /**
           * Возвращает параметр фильтрации.
           * @retruns {String}
           * @see param
           * @see setParam
           */
         getParam: function() {
            return this._options.param;
         },

         _toggleViewEvents: function (toggle) {
            var view = this._options.view,
                method = toggle ? 'subscribeTo' : 'unsubscribeFrom';
            if(view.getDataSource()) {
               view[method](view.getDataSource(), 'onBeforeProviderCall', this._onBeforeDataLoadHandler);
            }
            view[method](view, 'onDataLoad', this._onViewDataLoadHandler);
         },

         _onBeforeDataLoad: function() {
            var timer = this._getTimer();

            if(!timer.stared) {
               timer.start();
            }
         },

         _getTimer: function() {
            if(!this._timer) {
               this._timer = new Timer();
            }
            return this._timer;
         },

         _onViewDataLoad: function(event, data) {
            var view = this._options.view,
               viewFilter = coreClone(view.getFilter()),
               searchParam = this._options.param,
               searchValue = viewFilter[searchParam],
               textBox = this._options.textBox,
               /* Для memorySource особая логика, т.к. query у memorySource отрабатывают синхронно,
                  и получается, что код выполняемый на callback второго query, отрабатываем быстрее, чем код первого query. */
               isMemorySource = cInstance.instanceOfModule(view.getDataSource(), 'WS.Data/Source/Memory'),
               useCustomQuery = cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS/Interfaces/IItemsControl') || isMemorySource,
               self = this;

            function reloadWithRevert() {
               var revertedSearchValue = changeStringLayout(searchValue, self._oldSearchValue);

               if(revertedSearchValue !== searchValue) {
                  self._textBeforeTranslate = searchValue;
                  viewFilter[searchParam] = revertedSearchValue;

                  /* Чтобы не запускать цепочку кода, которая следует на reload'ом,
                     просто отдельно выполняем запрос, если контрол поддерживает интерфейс.
                     При memory источнике тоже необходимо делать запрос без reload'a списка, т.к. запросы будут синхронными,
                     из-за этого получается путаница с ответами, т.к. код второго запроса отработает быстрее первого. */
                  if(useCustomQuery) {
                     view.setFilter(viewFilter, true);
                     queryUtil(view.getDataSource(), [viewFilter, view.getSorting(), view.getOffset(), view.getPageSize()]).addCallback(function (res) {
                        self._onViewDataLoad(null, res.getAll());
                        return res;
                     });
                  } else {
                     self._toggleItemsEventRaising(false);
                     /* Для того, чтобы индикатор не моргал между запросами, если запрос работает > INDICATOR_DELAY */
                     if (self._getTimer().getTime() > INDICATOR_DELAY) {
                        view._showLoadingOverlay();
                        view._showIndicator();
                     }
                     self._getTimer().stop();
                     view.setFilter(viewFilter);
                  }
               } else {
                  self._itemsBeforeTranslate = null;
               }
            }

            function backOldSearchValue() {
               viewFilter[searchParam] = self._textBeforeTranslate;
               view.setFilter(viewFilter, true);
               self._itemsBeforeTranslate = null;
               self._textBeforeTranslate = null;
            }

            function showMissSpellValue(value) {
               self._showMissSpell(value);
            }

            function successSearch() {
               self._oldSearchValue = searchValue;
               /* 1) Вернём старые данные, если есть и выведем сообщение
                2) Если старых данных нет, то просто установим новые */
               if(self._textBeforeTranslate) {
                  /* Прошлый поиск был успешен -> вернём данные с прошлого поиска,
                   но отобразим сообщение */
                  if(self._options.newStandart) {
                     if (self._itemsBeforeTranslate && self._itemsBeforeTranslate.getCount()) {
                        data.setMetaData(self._itemsBeforeTranslate.getMetaData());
                        analyzeQueryResult.call(self, self._itemsBeforeTranslate, data);
                        backOldSearchValue();
                        showMissSpellValue(searchValue);
                        self._toggleItemsEventRaising(true);
                     } else {
                        /* Прошлый поиск был не успешен -> отображаем данные и выводим сообщение */
                        showMissSpellValue(searchValue);
                        if (useCustomQuery) {
                           analyzeQueryResult.call(self, data, view.getItems());
                        }
                        //Без анализа изменений, чтобы не вызвать преждевременную отрисовку и не портить очередёность срабатывания событий
                        self._toggleItemsEventRaising(true, false);
                        self._textBeforeTranslate = null;
                     }
                  } else {
                     /* Могут изменить введённый текст в промежуток между событием onSearch (500мс задержка) и прошлым вводом,
                      проверим это */
                     if(textBox.getText().length === searchValue.length) {
                        textBox.setText(searchValue);
                        view.setHighlightText(searchValue, false);
                     }
                     if (isMemorySource) {
                        analyzeQueryResult.call(self, data, self._itemsBeforeTranslate);
                     }
                     self._textBeforeTranslate = null;
                     self._toggleItemsEventRaising(true);
                  }
               } else {
                  if(self._options.newStandart) {
                     /* Данные есть, но в другой раскладке не искали -> запоминаем данные и ищем */
                     self._itemsBeforeTranslate = data;
                     reloadWithRevert();
                  }
               }
            }

            function failureSearch()  {
               /* Данных нет и не меняли раскладку -> меняем, ищем */
               if(self._textBeforeTranslate) {
                  if(self._options.newStandart) {
                     /* Раскладку меняли, но новых данных нет ->
                      возвращаем старые, сообщение не выводим */
                     if (self._itemsBeforeTranslate) {
                        data.assign(self._itemsBeforeTranslate);
                        data.setMetaData(self._itemsBeforeTranslate.getMetaData());
                     }
                     /* оптимизация, т.к. рекордсет при поиске меняется через assign, то там меняются всегда все записи.
                        Если делать анализ имзенений, то перерисовка будет просиходить по одной записи, что вызывает тормоза.
                        Сделано через !(self._itemsBeforeTranslate && self._itemsBeforeTranslate.getCount()),
                        т.к. если первая загрузка записей была неудачной (пришел пустой рекордсет),
                        то assign в пустой рекордсет не вызовет событие onCollectionChange у проекции,
                        если не будут анализироваться изменения, которые произошли в период заморозки проекции. */
                     self._toggleItemsEventRaising(true, !(self._itemsBeforeTranslate && self._itemsBeforeTranslate.getCount()));
                     backOldSearchValue();
                     self._hideMissSpell();
                  } else {
                     viewFilter[searchParam] = self._textBeforeTranslate;
                     view.setFilter(viewFilter, true);
                     self._textBeforeTranslate = null;
                     self._toggleItemsEventRaising(true);
                  }
               } else {
                  if (isMemorySource) {
                     self._itemsBeforeTranslate = data;
                  }
                  reloadWithRevert();
               }
            }

            if(!searchValue || this._missSpellUsed) {
               this._hideMissSpell();
               this._missSpellUsed = false;
               return;
            }

            if(data.getCount()) {
               successSearch();
            } else {
               failureSearch();
            }
         },


         /* Требуется отключать обработку событий проекции при поиске со сменой раскладки,
          чтобы избежать моргания данных, обработка событий включается,
          когда поиск точно закончен (уже была сменена раскладка, если требуется) */
         _toggleItemsEventRaising: function(enable, analyze) {
            var view = this._options.view,
                items = this._currentItems;
            
            if(!items) {
               /* Т.к. есть люди, которые просто поддерживают интерфейс listView,
                  проверим на это (может не быть метода _getItemsProjection). */
               if (cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS/Mixins/ItemsControlMixin')) {
                  items = view._getItemsProjection();
               } else {
                  items = view.getItems();
               }
            }
            analyze = analyze !== undefined ? analyze : true;

            if(items) {
               var isEqual = items.isEventRaising() === enable;

               if(!isEqual) {
                  items.setEventRaising(enable, analyze);
                  /* Запоминаем рекордсет, чтобы потом у него же и включить обработку событий */
                  this._currentItems = !enable ? items : null;
               }
            }
         },

         _showMissSpell: function(caption) {
            var missSpell = this._getMissSpell();
            missSpell.setCaption(caption);
            missSpell.show();
         },

         _hideMissSpell: function() {
            if(this._missSpell) {
               this._getMissSpell().hide();
            }
         },

         _getMissSpell: function() {
            if(!this._missSpell) {
               var self = this;
               this._missSpell = new MissSpell({
                  element: document.createElement('div'), //Делается через виртуальную ноду, чтобы была только одна вставка в DOM
                  parent: this._options.view,
                  handlers: {
                     onReady: function () {
                        this._container.insertBefore(self._options.view.getContainer())
                     },
                     onActivated: function (event, caption) {
                        self._missSpellUsed = true;
                        self._missSpell.hide();
                        self._options.textBox.setText(caption);
                        self._options.textBox.applySearch();
                     }
                  }
               });
            }

            return this._missSpell;
         },

         destroy: function() {
            if(this._timer) {
               this._timer.stop();
               this._timer = null;
            }
            if(this._missSpell) {
               this._missSpell.destroy();
               this._missSpell = null;
            }
            this._toggleViewEvents(false);
            this._onViewDataLoadHandler = null;
            this._onBeforeDataLoadHandler = null;
            KbLayoutRevertObserver.superclass.destroy.call(this);
         }
      });

      function changeStringLayout(searchValue, oldSearchValue) {
         var result, symbolsDifference;

         if(searchValue && oldSearchValue) {
            if (searchValue.length > oldSearchValue.length) {
               // ищем разницу между старым и текущим значением поискового запроса
               var pos = diffAt(searchValue, oldSearchValue);
               symbolsDifference = (pos === -1 ? false : [searchValue.substr(0, pos), searchValue.substr(pos), oldSearchValue.substr(pos)]);
            }
         }

         /* 1) Между запросами есть разница, тогда
          а) Если есть общая часть, то значит пользователь
          продолжил ввод запроса и нужно транслитизировать добавленную часть
          б) Общей части нет, значит запрос изменился и нужно транслитизировать новое значение

          2) Если пользователь захотел искать один и тот же запрос дважды, то транслитизируем текущее значение
          */
         if(symbolsDifference) {
            if (symbolsDifference[0].length) {
               // будем транслитизировать только добавленную часть
               result = oldSearchValue + KbLayoutRevertUtil.process(symbolsDifference[1]);
            } else {
               // если совпадений нет, то значит нужно транслитизировать новое значение
               result = KbLayoutRevertUtil.process(searchValue);
            }
         } else {
            // если новый запрос такой же как и старый, то транслитизируем и попытаемся найти данные
            result = KbLayoutRevertUtil.process(searchValue);
         }

         return result;
      }

      return KbLayoutRevertObserver;
   });