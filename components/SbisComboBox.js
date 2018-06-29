define('SBIS3.CONTROLS/SbisComboBox', [
    'SBIS3.CONTROLS/ComboBox',
    'WS.Data/Entity/Model',
    'SBIS3.CONTROLS/Utils/DropdownUtil',
    'Core/core-clone'
], function (ComboBox, Model, DropdownUtil) {
   'use strict';
   /**
    *
    * @class SBIS3.CONTROLS/SbisComboBox
    * @extends SBIS3.CONTROLS/ComboBox
    *
    * @author Герасимов А.М.
    *
    * @public
    * @control
    * @category Input
    */


   var SbisComboBox = ComboBox.extend(/** @lends SBIS3.CONTROLS/SbisComboBox.prototype */{
      $protected: {
         _options: {
             /**
              * @cfg {String} Идентификатор истории ввода.
              * @remark
              * Используется <a href="/doc/platform/developmentapl/middleware/input-history-service/">Сервисом истории выбора</a> для сохранения данных о выборе пользователя.
              * Благодаря этой настройке в кнопке "Меню с историей" будут отображены последние выбранные пункты меню, количество которых единовременно не может быть более 3.
              * Идентификатор должен быть уникальным в рамках всего приложения. Он должен описывать ту функциональную область, в которой применяется.
              * Пример: ИсходящийПлатеж, КоррИсх, Веха, Смета, Проекта
              */
             historyId: null,
             /**
              * @cfg {Boolean} Отображать ли закреплённые пункты меню в блоке истории.
              * @remark
              * Для каждого пользователя отображается собственный набор закреплённых пунктов меню.
              * Данные о таких пунктах хранятся в БД <a href="/doc/platform/developmentapl/middleware/input-history-service/">Сервиса истории выбора</a>.
              * При закреплении ещё одного пункта он добавляется ниже ранее закреплённых пунктов.
              * Пункты стилизованы в полужирном начертании.
              * Количество таких пунктов не ограничено.
              */
             pinned: false,
             /**
              * @cfg {Boolean} Отображать ли популярные (часто выбираемые) пункты меню в блоке истории.
              * @remark
              * Для каждого пользователя отображается собственный набор популярных пунктов меню.
              * Оценка популярности формируется на основе количества раз, когда пункт был выбран.
              * Собираемая статистика хранится в БД <a href="/doc/platform/developmentapl/middleware/input-history-service/">Сервиса истории выбора</a>.
              * Популярные пункты меню сортируются в алфавитном порядке.
              * Единовременно может быть отображено не более 7 пунктов меню.
              */
             frequent: false
         },
         _historyDeferred: null,
         _needToRedrawHistory: false,
         _historyController: null
      },

      showPicker: function () {
          DropdownUtil.showPicker(this, SbisComboBox);
      },

      setPinned: function(items) {
          this._historyController.setPinned(items);
      },

      getPinned: function() {
          this._historyController.getPinned();
      },

      _onItemClickHandler: function (item) {
          var origId = this._historyController.getOriginId(item.getId()),
              newItem;

              if (this._historyController.getRecent()) {
                  newItem = new Model({
                      rawData: item.getRawData(),
                      adapter: item.getAdapter()
                  });

                  this._historyController.addToRecent(origId, newItem);
                  this._needToRedrawHistory = true;
              }
              this._historyController.addToHistory(origId);

          SbisComboBox.superclass._onItemClickHandler.call(this, origId);
      }
   });

   return SbisComboBox;
});
