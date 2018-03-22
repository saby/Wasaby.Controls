/**
 * Created by cheremushkin iv on 19.01.2015.
 */
define('SBIS3.CONTROLS/Mixins/SearchMixin',
    [
       'Core/helpers/Function/forAliveOnly',
       'Core/CommandDispatcher',
       'SBIS3.CONTROLS/Mixins/SearchMixin/SearchMixinUtil'
    ], function(forAliveOnly, CommandDispatcher, SearchMixinUtil) {

        /**
         * Миксин, задающий любому полю ввода работу с поиском.
         *
         * Для работы поиска данных вам нужно задать контролу следующие настройки:
         *
         * * источник данных в опции {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#dataSource dataSource};
         * * <a href="/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/">списочный метод</a> в подопции {@link WS.Data/Source/SbisService#binding.query binding.query} источника данных;
         * * имя поискового параметра в опции {@link SBIS3.CONTROLS/Mixins/SuggestTextBoxMixin#searchParam searchParam}.
         *
         * Поиск данных происходит по следующему алгоритму:
         *
         * 1. Пользователь вводит поисковую фразу в поле ввода. Например, "Ярославль".
         * 2. Если длина фразы превышает значение {@link SBIS3.CONTROLS/Mixins/SearchMixin#startCharacter startCharacter}, спустя интервал {@link SBIS3.CONTROLS/Mixins/SearchMixin#searchDelay searchDelay} вызывается списочный метод из источника данных. Например, "Регионы.СписокГородов".
         * 3. Метод вызывается в аргументом "Фильтр", в составе которого передаётся параметр с именем {@link SBIS3.CONTROLS/Mixins/SuggestTextBoxMixin#searchParam} и поисковой фразой в качестве значения.
         * <pre>
         * // В следующем примере показано, как мог быть вызван списочный метод из исходного JS-кода.
         * requirejs(['WS.Data/Source/SbisService'], function(SbisService) {
         *
         *     // Аргумент "Фильтр".
         *    var filters = {
         *       // Здесь 'Поиск' - это имя поискового параметра (searchParam).
         *       'Поиск': 'Ярославль'
         *
         *       // Или через получение значения из поля ввода.
         *       // self - указатель на this родительского компонента.
         *       'Поиск': self.getValueFromSearchSring();
         *    },
         *
         *    // Объект БЛ, в котором определён списочный метод.
         *    bl = new SbisService({endpoint: 'Регионы'});
         *
         *    // Вызов списочного метода.
         *    bl.call('СписокГородов', filters, null, null).addCallbacks(...);
         * });
         * </pre>
         * 4. Метод обрабатывает поисковую фразу и формирует поисковый запрос.
         * Чтобы настроить обработку поисковой фразы, вам нужно в <a href="https://genie.sbis.ru">Genie</a> изменить настройки вызываемого списочного метода.
         * Например, выполните настройку:
         *     1. В параметре "Filter parameters" создайте новый текстовый параметр с именем "Поиск". **Важно**: имя должно совпадать со значением опции searchParam.
         *     2. В параметре "Filter condition" создайте "SQL expression" со значением "lower(Поле:Наименование) LIKE ('%' || lower(Фильтр:Поиск) || '%')".
         *     Этим выражением мы задали поиск любых совпадений поисковой фразы со значениями из полей "Наименование".
         * 5. В ответе на запрос в клиентскую часть приложения возвращается список записей для построения результатов поиска или автодополнения.
         *
         * @mixin SBIS3.CONTROLS/Mixins/SearchMixin
         * @public
         * @author Герасимов А.М.
         */

   var SearchMixin = /**@lends SBIS3.CONTROLS/Mixins/SearchMixin.prototype  */{
      /**
       * @event onSearch Происходит при поиске.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {String} text Поисковая фраза.
       * @param {String} forced Признак: поиск выполнен без задежрки (см. {@link searchDelay}).
       */
      /**
       * @event onReset При нажатии кнопки отмена (крестик).
       * @param {Core/EventObject} eventObject Дескриптор события.
       */
      $protected: {
         //Чтобы событие onReset не отправлялось непрерывно
         _onResetIsFired: true,
         /* Чтобы при вставке одного и того-же текста не отправлялись лишние запросы и не стреляли события */
         _searchText: '',
         _searchDelay: null,
         _options: {
             /**
              * @cfg {Number|null} Минимальное количество символов, после ввода которых контрол выполняет поиск данных.
              * @remark
              * Опция startCharacter определяет лишь условие, при котором контрол создаёт запрос к источнику данных.
              *
              * Ознакомьтесь с описанием к {@link SBIS3.CONTROLS/Mixins/SearchMixin миксину}, чтобы понять алгоритм вызова списочного метода.
              *
              * <h4>Автодополнение</h4>
              * Приведённая далее информация актуальна только для контролов, расширенных миксином {@link SBIS3.CONTROLS/Mixins/SuggestMixin} или {@link SBIS3.CONTROLS/Mixins/SuggestTextBoxMixin}.
              *
              * Чтобы автодополнение отображалось только при нажатии клавиши Enter или кнопки "Лупа" (находится рядом с полем ввода), установите в опции startCharacter значение null.
              *
              * @see searchDelay
              */
            startCharacter : 3,
             /**
              * @cfg {Number} Задержка между запросами к источнику данных.
              * @remark
              * Значение устанавливается в миллисекундах.
              *
              * Чтобы на каждый ввод символа не отправлять запрос к источнику данных, для контрола по умолчанию задана временная задержка в 500 мс между такими запросами.
              * Во-первых, любой ввод символа интерпретируется как формирование поисковой фразы, которая пользователем может расцениваться как незаконченная.
              * Лучше дождаться окончания пользовательского ввода, чтобы отдавать релевантные результаты поиска.
              * Во-вторых, с точки зрения оптимизации приложения лучше создать один запрос к источнику вместо множества, что позволит снизить нагрузку на сервер.
              *
              * @see startCharacter
              */
            searchDelay : 500
         }
      },

      $constructor: function() {
         this._publish('onSearch','onReset');
         CommandDispatcher.declareCommand(this, 'applySearch', this.applySearch);
      },

      before: {
         _setTextByKeyboard : function(text) {
            if(text !== this._searchText) {
               this._startSearch(text);
            }
         }
      },

      after : {
         setText : function(text) {
            /* Текст может меняться как кодом, так и напрямую пользователем.
               _searchText надо запоминать в обоих случаях. Зачем:
               например когда после поиска проваливаемся в папку, текст из строки поиска удаляется,
               но удаляется не кодом а пользователем, и если ввести тот же поисковой запрос,
               то он должен выполниться. А вот если пользователь сам вствляет один и тот же текст, то поиска происходить не должно. */
            this._searchText = text;
         },
         destroy : function() {
            this._clearSearchDelay();
         },
         init: function () {
            /* Чтобы была возможность сбросить поиск, если контрол создаётся с уже проставленной опцией text */
            var text = this.getText();
            if(text && text.length >= this._options.startCharacter) {
               this._onResetIsFired = false;
               this._searchText = text;
            }
         }
      },

      _startSearch: function(text) {
         this._clearSearchDelay();
         this._searchDelay = setTimeout(forAliveOnly(function () {
            this._applySearch(text);
         }, this), this._options.searchDelay);
      },

      _clearSearchDelay: function () {
        if(this._searchDelay) {
           clearTimeout(this._searchDelay);
           this._searchDelay = null;
        }
      },

      _applySearch : function(text, force) {
         var args = [text, this._options.startCharacter, force];
         /* Если поиск запущен, то надо отменить поиск с задержкой */
         this._clearSearchDelay();
         
         if (SearchMixinUtil.needSearch.apply(null, args)) {
            this._notify('onSearch', text, force);
            this._onResetIsFired = false;
         } else if (SearchMixinUtil.needReset.apply(null, args)) {
            this._notifyOnReset();
         }
      },

      _notifyOnReset: function() {
         if(!this._onResetIsFired) {
            this._notify('onReset');
            this._onResetIsFired = true;
         }
      },

      /**
       * Сбросить поиск
       * @see applySearch
       */
      resetSearch: function(){
         this.setText('');
         this.applySearch(true);
      },

      /**
       * Запустить поиск
       * @param {boolean} force Принудительный запуск поиска, даже если кол-во символов меньше чем {@link startCharacter}.
       * @see resetSearch
       */
      applySearch: function(force) {
         this._applySearch(this.getText(), force);
      }


   };

   return SearchMixin;

});