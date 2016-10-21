/**
 * Created by iv.cheremushkin on 23.01.2015.
 */
define('js!SBIS3.CONTROLS.InfiniteScrollMixin', ['js!SBIS3.CONTROLS.InfiniteScrollController'], function(InfiniteScrollController) {
   /**
    * Миксин, добавляющий поведение работы с выподающим меню
    * @mixin SBIS3.CONTROLS.MenuButtonMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   'use strict';

   var MenuButtonMixin = /**@lends SBIS3.CONTROLS.MenuButtonMixin.prototype  */ {
      /**
       * @event onMenuItemActivate При активации пункта меню
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор пункта меню.
       * @example
       * <pre>
       *     MenuIcon.subscribe('onMenuItemActivate', function(e, id) {
       *        alert('Вы нажали на ' + this._items.getItem(id).title)
       *     })
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {String|null} Устанавливает режим подгрузки данных по скроллу.
             * @remark
             * По умолчанию, подгрузка осуществляется "вниз". Мы поскроллили и записи подгрузились вниз.
             * Но можно настроить скролл так, что записи будут загружаться по скроллу к верхней границе контейнера.
             * Важно. Запросы к БЛ все так же будут уходить с увеличением номера страницы. V
             * Может использоваться для загрузки истории сообщений, например.
             * @variant down Подгружать данные при достижении дна контейнера (подгрузка "вниз").
             * @variant up Подгружать данные при достижении верха контейнера (подгрузка "вверх").
             * @variant demand Подгружать данные при нажатии на кнопку "Еще...".
             * @variant null Не загружать данные по скроллу.
             *
             * @example
             * <pre>
             *    <option name="infiniteScroll">down</option>
             * </pre>
             * @see isInfiniteScroll
             * @see setInfiniteScroll
             */
            infiniteScroll: null,
            /**
             * @cfg {jQuery | String} Контейнер в котором будет скролл, если представление данных ограничено по высоте.
             * Можно передать Jquery-селектор, но поиск будет произведен от контейнера вверх.
             * @see isInfiniteScroll
             * @see setInfiniteScroll
             */
            infiniteScrollContainer: undefined
         }
      },


   };

   return MenuButtonMixin;
});