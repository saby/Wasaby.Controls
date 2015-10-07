/* global define, $ws */
define('js!SBIS3.CONTROLS.CollectionControl.CollectionPresenter', [
   'js!SBIS3.CONTROLS.Data.Bind.ICollection'
], function (IBindCollection) {
   'use strict';

   /**
    * Презентер коллекции элементов - реализует ее поведеческий аспект.
    * @class SBIS3.CONTROLS.CollectionControl.CollectionPresenter
    * @extends $ws.proto.Abstract
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var CollectionPresenter = $ws.proto.Abstract.extend(/** @lends SBIS3.CONTROLS.CollectionControl.CollectionPresenter.prototype */{
      _moduleName: 'SBIS3.CONTROLS.CollectionControl.CollectionPresenter',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.CollectionControl.ICollectionView} Управляемое представление
             */
            view: undefined,

            /**
            * @cfg {Boolean} Выполнять действие по умолчанию по одинарному клику
            */
            oneClickAction: true,

            /**
             * @cfg {Boolean} Изменять позицию при нажатии клавиш со стрелками
             */
            moveCurrentByKeyPress: true
         },

         /**
          * @var {Function} Действие по умолчанию для выбранного элемента
          */
         _itemAction: undefined,

         /**
          * @var {Function} Метод, "оживляющий" компоненты
          */
         _reviver: undefined,

         /**
          * @var {Function[]} Обработчики, вызываемые при добавлении дочерних контролов
          */
         _addComponentsCallbacks: [],

         /**
          * @var {Function[]} Обработчики, вызываемые при удалении дочерних контролов
          */
         _removeComponentsCallbacks: [],

         /**
          * @var {Function} Обработчик события изменения коллекции
          */
         _onItemsChange: undefined,

         /**
          * @var {Function} Обработчик события изменения текущего элемента коллекции
          */
         _onCurrentChange: undefined
      },

      $constructor: function () {
         if (!this._options.view) {
            throw new Error('View is not defined');
         }
         if (!$ws.helpers.instanceOfMixin(this._options.view, 'SBIS3.CONTROLS.CollectionControl.ICollectionView')) {
            throw new Error('View should implement SBIS3.CONTROLS.CollectionControl.ICollectionView');
         }

         this.subscribeTo(this._options.view, 'onKeyPressed', this._onKeyPressed.bind(this));
      },

      destroy: function () {
         CollectionPresenter.superclass.destroy.call(this);

         this._removeComponentsCallbacks = [];
      },

      //region Public methods

      /**
       * Возвращает управляемое представление
       * @returns {SBIS3.CONTROLS.CollectionControl.ICollectionView}
       */
      getView: function () {
         return this._options.view;
      },

      /**
       * Возвращает метод "оживления" компонентов
       * @returns {Function}
       */
      getReviver: function () {
         return this._reviver;
      },

      /**
       * Устанавливает метод "оживления" компонентов
       * @param {Function} items
       */
      setReviver: function (reviver) {
         this._reviver = reviver;
      },

      /**
       * Возвращает признак, что действие по умолчанию выполняется по одинарному клику
       * @returns {Boolean}
       */
      isOneClickAction: function () {
         return this._options.oneClickAction;
      },

      /**
       * Устанавливает признак, что действие по умолчанию выполняется по одинарному клику
       * @param {Boolean} oneClickAction
       */
      setOneClickAction: function (oneClickAction) {
         this._options.oneClickAction = oneClickAction;
      },

      /**
       * Возвращает признак, что позиция изменяется при нажатии клавиш со стрелками
       * @returns {Boolean}
       */
      isMoveCurrentByKeyPress: function () {
         return this._options.moveCurrentByKeyPress;
      },

      /**
       * Устанавливает признак, что позиция изменяется при нажатии клавиш со стрелками
       * @param {Boolean} moveCurrentByKeyPress
       */
      setMoveCurrentByKeyPress: function (moveCurrentByKeyPress) {
         this._options.moveCurrentByKeyPress = moveCurrentByKeyPress;
      },

      /**
       * Устанавливает функцию обратного вызова при добавлении дочерних контролов
       * @param {Function} callback
       * @param {Object} context
       * @returns {SBIS3.CONTROLS.CollectionControl.CollectionPresenter}
       */
      onAddComponents: function (callback, context) {
         this._addComponentsCallbacks.push(
            callback.bind(context || this)
         );
         return this;
      },

      /**
       * Устанавливает функцию обратного вызова при удалении дочерних контролов
       * @param {Function} items
       * @param {Object} context
       * @returns {SBIS3.CONTROLS.CollectionControl.CollectionPresenter}
       */
      onRemoveComponents: function (callback, context) {
         this._removeComponentsCallbacks.push(
            callback.bind(context || this)
         );
         return this;
      },

      //region Collection

      /**
       * Возвращает проекцию
       * @returns {SBIS3.CONTROLS.Data.Projection}
       */
      getItems: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает проекцию
       * @param {SBIS3.CONTROLS.Data.Projection} items
       */
      setItems: function (items) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает действие по умолчанию для выбранного элемента
       * @returns {Function}
       */
      getItemAction: function () {
         return this._itemAction;
      },

      /**
       * Устанавливает действие по умолчанию для выбранного элемента
       * @param {Function} action
       */
      setItemAction: function (action) {
         this._itemAction = action;
      },

      //endregion Collection

      //region Behavior

      /**
       * Обрабатывает событие о смене выбранного элемента
       */
      itemSelected: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Обрабатывает событие о вызове перерисовки
       */
      redrawCalled: function () {
         this._redraw();
      },

      /**
       * Обрабатывает событие о начале загрузки коллекции
       * @param {Number} target Коллекция, содержимое которой загружается
       */
      itemsLoading: function (target) {
         this._options.view.showLoadingIndicator(target);
      },

      /**
       * Обрабатывает событие о завершении загрузки коллекции
       * @param {Number} target Коллекция, содержимое которой загрузилось
       */
      itemsLoaded: function (target) {
         this._options.view.hideLoadingIndicator(target);
      },

      //endregion Behavior

      //endregion Public methods

      //region Protected methods

      //region Behavior

      /**
       * Обрабатывает событие о нахождении указателя над элементом коллекции
       */
      _onItemHovered: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Обрабатывает событие о клике по элементу коллекции
       */
      _onItemClicked: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Обрабатывает событие о двойном клике по элементу коллекции
       */
      _onItemDblClicked: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Обрабатывает событие о нажатии клавиши
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {Number} code Код нажатой клавиши
       */
      _onKeyPressed: function (event, code) {
         throw new Error('Method must be implemented');
      },

      //endregion Behavior

      /**
       * Возвращает коллекцию для отрисовки в представлении
       * @returns {*}
       */
      _getItemsForRedraw: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Вызывает перерисовку представления
       * @private
       */
      _redraw: function () {
         this._options.view.render(this._getItemsForRedraw());
         this._revive();
      },

      /**
       * "Оживляет" дочерние компоненты
       * @private
       */
      _revive: function () {
         if (!this._reviver) {
            return;
         }
         var removeComponents = this._options.view.getComponents();
         this._reviver().addCallback((function() {
            var addComponents = this._options.view.getComponents().filter(function(item) {
               var index = Array.indexOf(removeComponents, item);
               if(index === -1) {
                  return true;
               } else {
                  removeComponents.splice(index, 1);
                  return false;
               }
            });
            if (addComponents.length) {
               $ws.helpers.forEach(this._addComponentsCallbacks, function(callback) {
                  callback(addComponents);
               });
            }
            if (removeComponents.length) {
               $ws.helpers.forEach(this._removeComponentsCallbacks, function(callback) {
                  callback(removeComponents);
               });
            }
         }).bind(this));
      }

      //endregion Protected methods
   });

   return CollectionPresenter;
});
