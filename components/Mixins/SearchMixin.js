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
    * Миксин, добавляющий иконку
    * @mixin SBIS3.CONTROLS/Mixins/SearchMixin
    * @public
    * @author Крайнов Д.О.
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
             * @cfg {Number|null} Минимальное количество символов, с ввода которых отображается автодополнение.
             * @remark
             * Когда пользователь вводит необходимое количество символов, формируется запрос к бизнес-логике приложения для выборки релевантных записей и последующее построение результатов поиска в виде списка автодополнения.
             * Точность поиска определяется настройками <a href="/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/">списочного метода</a>, который установлен в настройках источника данных контрола.
             *
             * Каждый последующий ввод или удаление символа интерпретируется как формирование новой поисковой фразы и, как следствие, создание запроса к бизнес-логике приложения.
             * В целях оптимизации, по умолчанию между запросами установлена задержка в 500 мс, чтобы создавать запрос не на каждый ввод символа, а на законченную поисковую фразу.
             * Время задержки можно изменить в опции {@link searchDelay}.
             *
             * Установите в опции startCharacter значение null, чтобы автодополнение отображалось только при нажатии клавиши Enter или кнопки "Лупа", расположенной рядом с полем ввода.
             * @see searchDelay
             */
            startCharacter : 3,
            /**
             * @cfg {Number} Временная задержка между запросами к бизнес-логике. Используется функционалом автодополнения.
             * @remark
             * Значение устанавливается в миллисекундах.
             *
             * Временная задержка необходима для того, чтобы уменьшить частоту запросов автодополнения к бизнес-логике приложения.
             *
             * Отсутствие задержки может создавать повышенную нагрузку на сервер. Это происходит, когда автодополнение вызывается после каждого ввода или удаления символа, с учетом ограничения {@link startCharacter}.
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