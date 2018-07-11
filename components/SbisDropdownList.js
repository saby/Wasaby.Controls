/**
 * Created by am.gerasimov on 10.04.2015.
 */
define('SBIS3.CONTROLS/SbisDropdownList',
   [
      'SBIS3.CONTROLS/DropdownList',
      'WS.Data/Entity/Model',
      'SBIS3.CONTROLS/Utils/DropdownUtil',
      'tmpl!SBIS3.CONTROLS/SbisDropdownList/SbisDropdownListItem',
      'tmpl!SBIS3.CONTROLS/DropdownList/DropdownListItem',
      'Core/Deferred',
      'css!SBIS3.CONTROLS/SbisDropdownList/SbisDropdownList'
   ],

   function(DropdownList, Model, DropdownUtil, SbisDropdownListItem, DropdownListItem, Deferred) {

      'use strict';

      /**
       *
       * @class SBIS3.CONTROLS/SbisDropdownList
       * @extends SBIS3.CONTROLS/DropdownList
       *
       * @author Герасимов А.М.
       *
       * @control
       * @public
       * @category Input
       */
      
      var _private = {
         addToHistory: function(self, id) {
            var def = new Deferred();
            DropdownUtil.initHistory(self, function() {
               var items = self.getItems();
   
               if (!items.getRecordById(id)) {
                  self._historyDeferred = null;
                  self._historyController.addToRecent(id, new Model({
                     rawData: {},
                     adapter: items.getAdapter(),
                     format: items.getFormat().clone()
                  }));
               }
               self._historyController.addToHistory(self._historyController.getCastId(id));
               def.callback();
            });
            
            return def;
         }
      };


      var SbisDropdownList = DropdownList.extend(/** @lends SBIS3.CONTROLS/SbisDropdownList.prototype */{
         $protected: {
            _options: {
               itemTpl: SbisDropdownListItem,

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

         showPicker: function(event) {
            /* При клике на крестик не грузим записи и историю, пикер тоже открывать не надо */ 
            if (!event || !$(event.target).hasClass('controls-DropdownList__crossIcon')) {
               DropdownUtil.initHistory(this, SbisDropdownList.superclass.showPicker, event);
            }
         },

         _clickItemHandler: function(e) {
            var row = $(e.target).closest('.' + this._getItemClass()),
               itemId = this._getIdByRow(row),
               item = this.getItems().getRecordById(itemId),
               newItem;

            if (row.length && (e.button === 0)) {
               if (this._historyController.getRecent()) {
                  newItem = new Model({
                     rawData: item.getRawData(),
                     adapter: item.getAdapter()
                  });

                  this._historyController.addToRecent(itemId, newItem);
                  this._needToRedrawHistory = true;
               }
            }

            SbisDropdownList.superclass._clickItemHandler.apply(this, arguments);
         },

         setSelectedKeys: function(idArray) {
            var id = idArray && idArray[0];
            var self = this;
            var args = arguments;
      
            if (!this._options.multiselect && id && self.getItems()) {
               _private.addToHistory(this, id).addCallback(function() {
                  SbisDropdownList.superclass.setSelectedKeys.apply(self, args);
               });
            } else {
               SbisDropdownList.superclass.setSelectedKeys.apply(self, args);
            }
         },

         setPinned: function(items) {
            if (!this._historyController) {
               this._options.pinned = items;
            } else {
               this._historyController.setPinned(items);
               this.setItems(this._historyController.prepareHistory());
            }
         },

         getPinned: function() {
            this._historyController.getPinned();
         },

         _getIdByRow: function() {
            var id =  SbisDropdownList.superclass._getIdByRow.apply(this, arguments);
            return this._historyController.getOriginId(id);
         },

         getDefaultId: function() {
            var id = SbisDropdownList.superclass.getDefaultId.call(this, (this._historyController && this._historyController.getOldItems()));
            return (this._historyController && this._historyController.getOriginId(id)) || id;
         },

         destroy: function() {
            SbisDropdownList.superclass.destroy.apply(this, arguments);
            this._historyController && this._historyController.destroy();
         }
      });

      return SbisDropdownList;
   });
