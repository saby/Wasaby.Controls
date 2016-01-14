/* На основе SBIS3.CORE.SwitchableArea */
define('js!SBIS3.CONTROLS.SwitchableArea', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.SwitchableArea/SwitchableAreaItem',
   'html!SBIS3.CONTROLS.SwitchableArea',
   'html!SBIS3.CORE.SwitchableArea/SwitchableArea_area'
], function(CompoundControl, SwitchableAreaItem, dotTplFn, areaTplFn) {

   'use strict';

   /**
    * Контрол, содержащий несколько областей содержащих контент.
    * В каждый момент времени отображается только одна область.
    * Отображаемая область может переключаться при помощи команд.
    * @class SBIS3.CONTROLS.SwitchableArea
    * @extends $ws.proto.Control
    * @author Крайнов Дмитрий Олегович
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.Selectable
    */

   var SwitchableArea = CompoundControl.extend([], /** @lends SBIS3.CONTROLS.SwitchableArea.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         // HashMap вида id: SwitchableAreaItem
         _areaHashMap: {},
         _bindedHandlers: undefined,
         // Id текущей видимой области
         _currentAreaId: null,
         _options: {
            areaTemplate: areaTplFn,
            /**
             * @cfg {SwitchableAreaItem[]} Массив с областями
             * @example
             * <pre>
             *     <options name="items" type="array">
             *        <options>
             *           <option name="content">Вёрстка одной области</option>
             *           <option name="id">1</option>
             *        </options>
             *        <options>
             *           <option name="content">Вёрстка другой области</option>
             *           <option name="id">2</option>
             *           <option name="visible">true</option>
             *        </options>
             *     <options>
             * </pre>
             */
            items: [],

            /** @cfg {String} Id области по умолчанию
             * @example
             * <pre>
             *     <option name="defaultArea">1</option>
             * </pre>
             * @see items
             * @editor ArrayItemSelector
             * @editorConfig arrayOptionName items
             * @editorConfig keyFieldName id
             * @editorConfig displayFieldName name
             */
            defaultArea: '',
            /**
             * @cfg {String} Режим загрузки дочерних контролов
             * @example
             * <pre>
             *     <option name="loadType">all</option>
             * </pre>
             * @variant all инстанцировать все области сразу;
             * @variant cached инстанцировать только 1 область, при смене предыдущую не уничтожать (кэширование областей).
             */
            loadType: 'cached'
         }
      },

      $constructor: function () {
         this._bindedHandlers = {
            handleItemIdChanged: this._handleItemIdChanged.bind(this),
            handleItemContentChanged: this._handleItemContentChanged.bind(this)
         };

         //если в опциях были заданы, то построим
         this._createAreasByItems(this._options.items);
      },
      init: function(){
         SwitchableArea.superclass.init.call(this);
      },

      // Подмена метода из CompoundControl. Не инстанцируем детей, дети инстанцируются внутри SwitchableAreaItem
      _loadControls: function(pdResult){
         return pdResult.done([]);
      },

      /**
       * Создаёт из объекта, описывающего SwitchableAreaItem, экземпляр SwitchableAreaItem, подписывается на его события
       * @param {Object} itemObj - объект, описывающий SwitchableAreaItem
       * @returns {SwitchableAreaItem} - экземпляр SwitchableAreaItem
       * @private
       */
      _createSwitchableAreaItem: function(itemObj){
         var areaItem = new SwitchableAreaItem(
            $ws.core.merge(
               {
                  autoHeight: this._options.autoHeight,
                  parent: this,
                  element: $('<div class="ws-SwitchableArea__item" data-for="' + itemObj.id + '">').appendTo(this.getContainer())
               },
               itemObj));
         areaItem.subscribe('onIdChanged', this._bindedHandlers.handleItemIdChanged);
         areaItem.subscribe('onContentChanged', this._bindedHandlers.handleItemContentChanged);
         areaItem.getContext().setPrevious(this.getContext());
         return areaItem;
      },

      /**
       * Обработчик, подписанный на изменение Id элемента областей, изменяет Id в HashMap и в вёрстке
       * @param {Event} e - событие
       * @param {String} oldId - старый Id области
       * @param {String} newId - новый Id области
       * @private
       */
      _handleItemIdChanged: function(e, oldId, newId){
         if (this._areaHashMap[newId]){
            // если область с таким Id уже есть, то силой меняем обратно (если менять через сеттер, то событие зациклится)
            this._areaHashMap[oldId]._options.id = oldId;
         }
         else if (oldId && this._areaHashMap[oldId]) {
            this._areaHashMap[newId] = this._areaHashMap[oldId];
            delete this._areaHashMap[oldId];

            if (this._currentAreaId === oldId){
               this._currentAreaId = newId;
            }
            this._areaHashMap[newId].getContainer().attr('data-for', newId);
         }
      },
      /**
       * Обработчик, подписанный на изменение контента элемента областей, переинстанцирует область
       * @param {Event} e - событие
       * @param {String} areaId - Id области
       * @private
       */
      _handleItemContentChanged: function(e, areaId){
         if (this._areaHashMap[areaId]){
            var areaItem = this._areaHashMap[areaId],
               itemObj = {
                  id: areaItem.getId(),
                  content: areaItem.getContent()
               };
            $ws.helpers.replaceContainer(areaItem.getContainer(), this._buildMarkup(areaTplFn, { outer: this._options, item: itemObj, index: this._getItemIndexById(areaId) }));
            if (this._options.loadType === 'all' || areaId === this._currentAreaId){
               areaItem.loadChildControls();
            }
         }
      },
      _createAreasByItems: function(items) {
         this._options.items = [];
         // создаем элементы массива items в коллекцию SwitchableAreaItem-ов
         for (var i = 0, l = items.length; i < l; i++){
            var
               areaItem = this._createSwitchableAreaItem(items[i]),
               areaId = areaItem.getId(),
               isVisible = this._options.defaultArea === areaId;
            var itemObj = {
               id: areaItem.getId(),
               content: areaItem.getContent()
            };
            this._options.items[i] = areaItem;
            //построим разметку
            $ws.helpers.replaceContainer(areaItem.getContainer(), this._buildMarkup(areaTplFn, { outer: this._options, item: itemObj, index: this._getItemIndexById(areaId) }));
            // делаем видимой только дефолтную область
            if (isVisible || this._options.loadType === 'all') {
               areaItem.loadChildControls();
            }
            areaItem.setVisible(isVisible);
            if (isVisible && !this._currentAreaId){
               this._currentAreaId = areaId;
            }

            // заполняем _areaHashMap
            this._areaHashMap[areaId] = areaItem;
         }
      },
      setItems: function(items) {
         this._destroyAreas();
         this._createAreasByItems(items);
      },
      /**
       * Возвращает коллекцию областей
       * @return {$ws.helpers.collection} коллекция элементов SwitchableAreaItem, содержащих информацию о вкладке
       */
      getItems: function() {
         return this._options.items;
      },
      /**
       * Возвращает объект области по Id
       * @param {String} id - Id области
       * @return {SwitchableAreaItem} элемент SwitchableAreaItem
       */
      getItemById: function(id){
         return this._areaHashMap[id] || null;
      },
      /**
       * Возвращает индекс области в коллекции по её Id
       * @param {String} id - Id области
       * @return {Number} индекс области
       * @private
       */
      _getItemIndexById: function(id){
         var areaItem = this.getItemById(id);
         return areaItem ? Array.indexOf(this.getItems(), areaItem) : -1;
      },
      /**
       * Устанавливает новый контент для области
       * @param {String} areaId - Id области
       * @param {String} newContent - новый контент
       */
      setAreaContent: function(areaId, newContent){
         this.getItems()[this._getItemIndexById(areaId)].setContent(newContent);
      },

      /**
       * Возвращает Id текущей видимой области
       * @return {String} Id текущей видимой области
       */
      getCurrentAreaId: function(){
         return this._currentAreaId;
      },
      /**
       * Устанавливает текущую область по Id. В зависимости от режима работы компонента делает следующее:
       * Режим all    - Прячет предыдущую область и показывает область с переданным Id
       * Режим cached - Прячет предыдущую область. Если новая область уже была инстанцирована, то показывает её. Иначе инстанцирует
       * @param {String} id - Id области, которую делаем видимой
       * @returns {$ws.proto.Deferred} - Deferred готовности
       */
      setActiveArea: function(id) {
         var def;
         if (id && this._currentAreaId !== id && this._areaHashMap[id]){
            if (this._currentAreaId && this._areaHashMap[this._currentAreaId]){
               this._areaHashMap[this._currentAreaId].hide();
            }
            // если режим с кешированием и область ещё не инстанцирована, то инстанцируем её
            if (!this._areaHashMap[id].isLoaded()){
               def = this._areaHashMap[id].loadChildControls();
            }
            else {
               def = (new $ws.proto.Deferred()).callback();
            }
            this._areaHashMap[id].show();
            this._currentAreaId = id;
         }
         else {
            def = (new $ws.proto.Deferred()).callback();
         }
         return def;
      },
      /**
       * Скрывает все области
       */
      hideAll: function(){
         for (var i = 0, l = this.getItems().length; i < l; i++) {
            this.getItems()[i].hide();
         }
         this._currentAreaId = null;
      },
      /**
       * Добавляет новую область
       * @param {String} id - Id новой области
       * @param {String} content - вёрстка контента новой области
       * @returns {$ws.proto.Deferred} - Deferred готовности
       */
      addArea: function(id, content){
         var newIndex = this.getItems().length,
            newItemObj = {
               id: id,
               content: content || ''
            };
         this.getItems().push(newItemObj);
         return this._initAddedArea(newIndex);
      },
      /**
       * Инициализирует новую область
       * в режиме "инстанцирование всех областей сразу" инстанцирует новую область
       * @param {Number} newIndex - индекс области
       * @returns {$ws.proto.Deferred} - Deferred готовности
       * @private
       */
      _initAddedArea: function(newIndex){
         var areaCollection = this.getItems(),
            itemObj = areaCollection[newIndex];
         if (!(itemObj instanceof SwitchableAreaItem)){
            var newItem = this._createSwitchableAreaItem(itemObj);
            newItem.setVisible(false);
            $ws.helpers.replaceContainer(newItem.getContainer(), this._buildMarkup(areaTplFn, { outer: this._options, item: itemObj, index: newIndex }));
            // если у области не было Id, то он сгенерировался внутри шаблона doT-ом и надо его передать в newItem
            if (newItem.getId() !== itemObj.id){
               newItem.setId(itemObj.id);
            }
            if (newIndex < areaCollection.length - 1){
               var nextItem = areaCollection[newIndex + 1];
               $(newItem.getContainer()).insertBefore(nextItem.getContainer());
            }
            else {
               this.getContainer().append(newItem.getContainer());
            }

            this.getItems()[newIndex] = newItem;
            this._areaHashMap[newItem.getId()] = newItem;

            if (this._options.loadType === 'all'){
               return newItem.loadChildControls();
            }
         }
         if (!this._currentAreaId){
            this.setActiveArea(areaCollection[newIndex].getId());
         }

         return (new $ws.proto.Deferred()).callback();
      },
      /**
       * Удаляет область с указанным id
       * Если эта область была активна, то активизирует первую область в списке областей
       * @param {String} id - Id удаляемой области
       */
      removeArea: function(id){
         if (this._areaHashMap[id]){
            // если удаляем активную область - показываем другую
            if (this._currentAreaId === id){
               // удаляем последнюю область
               if (Object.keys(this._areaHashMap).length === 1){
                  this._areaHashMap[this._currentAreaId].hide();
                  this._currentAreaId = null;
               }
               else {
                  var newAreaIndex = this.getItems()[0].getId() !== id ? 0 : 1;
                  this.setActiveArea(this.getItems()[newAreaIndex].getId());
               }
            }
            this._areaHashMap[id].unsubscribe('onIdChanged', this._bindedHandlers.handleItemIdChanged);
            this._areaHashMap[id].unsubscribe('onContentChanged', this._bindedHandlers.handleItemContentChanged);
            var areaIndex = this._getItemIndexById(id);
            if (areaIndex >= 0){
               this.getItems().splice(areaIndex, 1);
            }

            // уничтожаем инстансы дочерних компонент области
            this._areaHashMap[id].destroy();

            delete this._areaHashMap[id];
         }
      },
      /**
       * Очищает кэш инстанцированных областей
       * Уничтожает все инстанцированные компоненты в областях и инстанцирует заново
       */
      clearAreaCache: function(){
         var areaCollection = this.getItems(),
            itemsLen = areaCollection.length,
            i;

         for (i = 0; i < itemsLen; i++){
            var areaItem = areaCollection[i];
            areaItem.destroyChildControls();
            areaItem.setLoaded(false);
            areaItem.getContainer().empty();
            var itemObj = {
               id: areaItem.getId(),
               content: areaItem.getContent()
            };
            $ws.helpers.replaceContainer(areaItem.getContainer(), this._buildMarkup(areaTplFn, { outer: this._options, item: itemObj, index: i }));
         }
         if (this._options.loadType === 'all'){
            for (i = 0; i < itemsLen; i++){
               areaCollection[i].loadChildControls();
            }
         }
         else if(this._currentAreaId) {
            this.getItemById(this._currentAreaId).loadChildControls();
         }
         if (this._currentAreaId){
            this.getItemById(this._currentAreaId).getContainer().removeClass('ws-hidden');
         }
      },

      /**
       * Валидирует дочерние контролы области
       * Возвращает Id невалидной области, либо undefined
       * @returns {Number|undefined} номер невалидной области, либо undefined
       */
      validateAreas: function(){
         var areaCollection = this.getItems(),
            invalidAreaId;
         for (var i = 0, l = areaCollection.length; i < l; i++){
            if (!areaCollection[i].validate(false, true)) {
               invalidAreaId = (invalidAreaId !== undefined) ? invalidAreaId : areaCollection[i].getId();
            }
         }
         return invalidAreaId;
      },
      _destroyAreas: function() {
         var
            items = this.getItems(),
            itemsLen = items.length,
            areaItem;
         for (var i = 0; i < itemsLen; i++){
            areaItem = items[i];
            areaItem.unsubscribe('onIdChanged', this._bindedHandlers.handleItemIdChanged);
            areaItem.unsubscribe('onContentChanged', this._bindedHandlers.handleItemContentChanged);
            areaItem.destroyChildControls();
            areaItem.setLoaded(false);
            areaItem.getContainer().empty();
            areaItem.destroy();
         }
      },
      destroy: function() {
         this._destroyAreas();
         $ws.proto.SwitchableArea.superclass.destroy.apply(this, arguments);
      },

      /* заглушка для DSMixin */
      _getItemTemplate: function (item) {
         return ''; //не используем шаблон, т.к. нам нужна загрузка по запросу
      }
   });

   return SwitchableArea;
});
