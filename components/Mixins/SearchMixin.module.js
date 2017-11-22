/**
 * Created by cheremushkin iv on 19.01.2015.
 */
define('js!SBIS3.CONTROLS.SearchMixin',
    [
       'Core/helpers/Function/forAliveOnly',
       'Core/CommandDispatcher',
       'js!SBIS3.CONTROLS.Utils.SearchMixin'
    ], function(forAliveOnly, CommandDispatcher, SearchMixinUtil) {

   /**
    * Миксин, добавляющий иконку
    * @mixin SBIS3.CONTROLS.SearchMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var SearchMixin = /**@lends SBIS3.CONTROLS.SearchMixin.prototype  */{
      /**
       * @event onSearch При поиске
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {String} text Текст введенный в поле поиска
       * @param {String} forced Срабатывание события было без задержки (searchDelay)
       */
      /**
       * @event onReset При нажатии кнопки отмена (крестик)
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
             * @cfg {Number|null} Устанавливает минимальное количество символов для отображения автодополнения.
             * @remark
             * Это минимальное число символов, после ввода которых начинает работать автодополнение: формируется запрос к БД, производится выборка записей и построение в пользовательском интерфейсе результатов поиска.
             * С помощью опции Вы можете варьировать требуемую длину ключевого слова, по которому происходит поиск совпадений.
             *
             * Как правило, автодополнение отображает более релевантные результаты, когда поиск производится бо большему числу введенных символов. Однако результаты поиска зависят от списочного метода, установленно в источнике данных для автодополнения.
             *
             * Когда для опции *startCharacter* установлено значение null, автоматическое отображение автодополнения отключено. Чтобы автодополнение отобразилось, после ввода символов нажимают клавишу Enter или кнопку "Лупа" (если есть).
             *
             * Перед отображением автодополнения по умолчанию существует задержка в 500 мс, которую можно изменить в опции {@link searchDelay}.
             *
             * <b>Внимание:</b> для контрола {@link SBIS3.CONTROLS.FieldLink} использование опции *startCharacter* актуально, когда установлена опция {@link SBIS3.CONTROLS.SuggestTextBoxMixin#searchParam}.
             * @see searchDelay
             */
            startCharacter : 3,
            /**
             * @cfg {Number} Устанавливает временную задержки перед отображением автодополнения.
             * @remark
             * Значение опции устанавливается в миллисекундах.
             *
             * Временная задержка необходима для того, чтобы уменьшить частоту появления автодополнения.
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