/**
 * Created by am.gerasimov on 15.04.2015.
 */
define('SBIS3.CONTROLS/Filter/FastData',
   [
   "Core/constants",
   "Lib/Control/CompoundControl/CompoundControl",
   "SBIS3.CONTROLS/Mixins/ItemsControlMixin",
   "SBIS3.CONTROLS/Mixins/FilterMixin",
   'Core/Deferred',
   "tmpl!SBIS3.CONTROLS/Filter/FastData/FastData",
   "tmpl!SBIS3.CONTROLS/Filter/FastData/ItemTpl",
   'Core/helpers/Object/isEqual',
   "SBIS3.CONTROLS/DropdownList",
   'css!SBIS3.CONTROLS/Filter/FastData/FastData'
],

   function(constants, CompoundControl, ItemsControlMixin, FilterMixin, cDeferred, dotTplFn, ItemTpl, isEqual) {

      'use strict';
      /**
       * Контрол, отображающий набор выпадающих списков SBIS3.CONTROLS/DropdownList и работающий с фильтром в контексте
       * Подробнее конфигурирование контрола описано в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterfast/">Быстрые фильтры</a>.
       * @class SBIS3.CONTROLS/Filter/FastData
       * @extends Lib/Control/CompoundControl/CompoundControl
       *
       * @author Красильников А.С.
       *
       * @mixes SBIS3.CONTROLS/Mixins/ItemsControlMixin
       * @mixes SBIS3.CONTROLS/Mixins/FilterMixin
       *
       * @demo Examples/Filter/FastDataFilterMultiselect/FastDataFilterMultiselect
       *
       * @cssModifier controls-FastDataFilter__resize Позволяет управлять шириной выпадающих списков, вписывая их по размеру в контейнер.
       *
       * @ignoreEvents onAfterLoad onChange onStateChange
       * @ignoreEvents onDragStop onDragIn onDragOut onDragStart
       *
       * @control
       * @public
       * @category Filtering
       */
      var FastDataFilter = CompoundControl.extend([FilterMixin, ItemsControlMixin],/** @lends SBIS3.CONTROLS/Filter/FastData.prototype */{
         /**
          * @event onClickMore Происходит при клике на кнопку "Ещё", которая отображается в выпадающем списке.
          * @param {Core/EventObject} eventObject Дескриптор события.
          */
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               _canServerRender: true,
               itemTpl: ItemTpl,
               displayProperty: '',
               /**
                * @cfg {String} Поле в контексте, где будет храниться внутренний фильтр компонента
                * @remark
                * !Важно: Если на одной форме, в одном контексте лежит несколько хлебных фильтров, то только в этом случае стоит менять стандартное имя
                */
               internalContextFilterName : 'sbis3-controls-fast-filter',
               /**
                * @cfg {Array.<Object.<String,String>>} Массив объектов. Набор исходных данных, по которому строятся выпадающие списки
                * @remark
                * !Важно: каждый item - это настройка для выпадающего списка
                * !Важно: данные для коллекции элементов можно задать либо в этой опции,
                * либо через источник данных методом {@link setDataSource}.
                * !Важно: name(имя фильтра) должен совпадать с internalValueField в FilterStructure, чтобы правильно заработала синхронизация
                * !Важно: На данный момент лучше описывать опции в Module (как это сделано в примере), а не в верстке xhtml, при описании в верстве нужно самостоятельно вызвать reload
                * !Важно: При установке historyId необходимо в завимости своего компонента прописать SBIS3.CONTROLS/SbisDropdownList для обеспечения работы механизма истории
                * @example
                * <pre>
                *    items: [{
                *       idProperty : 'key',    //Имя поля с ключом из списка значений values
                *       displayProperty: 'title',//Имя поля, в котором хранится текстовое отображение ключа из списка значений values
                *       name: 'first',        //Имя фильтра
                *       multiselect : false,  //Режим выпадающего списка
                *       className: 'controls-DropdownList__withoutCross', //Строка с классами css-модификаторов для выпадающего списка
                *       historyId: 'myOwnHistroyID',
                *       values:[                //Набор элементов выпадающего списка
                *       {
                *          key : 0,
                *          title : 'Заголовок'
                *       },
                *       {
                *          key : 1,
                *          title : 'Один'
                *       },
                *       {
                *          key : 2,
                *          title : 'Два'
                *       },
                *       {
                *           key : 3,
                *          title : 'Три'
                *       },
                *       {
                *           key : 4,
                *          title : 'Четыре'
                *       },
                *       {
                *           key : 5,
                *          title : 'Пять'
                *       }
                *    ]
                *  }]
                * </pre>
                * @see idProperty
                * @see displayProperty
                * @see setDataSource
                * @see getDataSet
                */
               items: []
            }
         },
         $constructor: function() {
            this._publish('onClickMore');
         },
         _drawItemsCallbackSync: function(){
            this._setSelectionToItemsInstances();
         },

         _drawItemsCallback: function(){
            var instances = this.getItemsInstances();
            for (var i in instances) {
               if (instances.hasOwnProperty(i)) {
                  this._subscribeItemToHandlers(instances[i])
               }
            }
            this._recalcDropdownWidth();
            this._setItemPositionForIE10();
         },
         //Очень рано обрадовался и удалил костыли под ie10, приходится возвращать :(
         _setItemPositionForIE10: function(){
            //Дичайший баг в ie - если установлено несколько выпадающий списков - 1 из них визуально пропадает
            //Не отдебагать, т.к. при любом взаимодействии с dom'ом идет перерисовка узлов и выпадающий список появляется
            //Добавил костыль: вызываю перерисовку узла, задавая min-width
            if (constants.browser.isIE10){
               setTimeout(function(){
                  this.getContainer().find('.controls-DropdownList').css('min-width', '10px');
               }.bind(this), 200);
            }
         },
         _getCurrentContext : function(){
            return this.getLinkedContext();
         },
         _subscribeItemToHandlers : function(item){
            var self = this;

            this.subscribeTo(item, 'onClickMore', function(){
               self._notify('onClickMore', item);
            });

            this.subscribeTo(item, 'onSelectedItemsChange', function(event, idArray){
               var idx = self._getFilterSctructureItemIndex(this.getContainer().data('id')),
                   text = [],
               //Если выбрали дефолтное значение, то нужно взять из resetValue
               //TODO может быть всегда отдавать массивом?
                   filterValue =  idArray.length === 1 && (idArray[0] === this.getDefaultId()) && self._filterStructure[idx] ? self._filterStructure[idx].resetValue :
                         (this._options.multiselect ?  idArray : idArray[0]),
                   currentValue = self._filterStructure[idx].value;
               //TODO Непонятно как это сделать в обратную сторону (когда из контекста кришло значение его нужно поставить в dropdownList)
               //В контексте текуший DropdownList, у него задавали поле с фильтром
               //Если не нашли, значит искать мне это надо как-то по-другому....
               if (idx >= 0 && !isEqual(currentValue, filterValue)) {
                  this.getSelectedItems(true).addCallback(function(list) {
                     self._filterStructure[idx].value = filterValue;

                     list.each(function (rec) {
                        text.push(rec.get(this._options.displayProperty));
                     }.bind(this));

                     self._filterStructure[idx].caption = self._filterStructure[idx].value === undefined
                         ? self._filterStructure[idx].resetCaption
                         : text.join(', ');
                     self.applyFilter();
                     return list;
                  }.bind(this));
               }
               self._setItemPositionForIE10();
            });
         },

         _modifyOptions: function() {
            var opts = FastDataFilter.superclass._modifyOptions.apply(this, arguments);
            if (opts.serverRender) {
               opts.filterStructure.forEach(function(structure) {
                  /* Проверка value !== resetValue не нужна, т.к. текстовое значение надо отрендерить в любом случае */
                  if (structure.caption && structure.value) {
                     opts.items.forEach(function(item) {
                        if (item[opts.idProperty] === structure.internalValueField) {
                           item.text = structure.caption;
                           item.selectedKeys = structure.value instanceof Array ? structure.value : [structure.value];
                           item.className = (item.className || '') + (isEqual(structure.value, structure.resetValue) ? ' controls-DropdownList__hideCross' : '');
                        }
                     });
                  }
               });
            }
            return opts;
         },

         _recalcDropdownWidth: function () {
            this._resetMaxWidth();
            var dropdownLists = $('.controls-DropdownList', this.getContainer());
            dropdownLists.sort(function (el1, el2) {
               return $(el1).width() - $(el2).width();
            });
            for (var i = 0, l = dropdownLists.length; i < l; i++) {
               $(dropdownLists[i]).addClass('ws-flex-shrink-' + (i + 1));
            }
         },

         _resetMaxWidth: function(){
            var dropdownContainer = $('.controls-DropdownList', this.getContainer());
            for (var i = 0; i < dropdownContainer.length; i++) {
               if (i in dropdownContainer) {
                  $(dropdownContainer[i]).removeClass(this._getFlexShrinkClasses());
               }
            }
         },

         _getFlexShrinkClasses: function () {
            var out = '';
            for (var i = 0; i < 13; i++) {
               out += 'ws-flex-shrink-' + i + ' ';
            }
            return out;
         },

         _onResizeHandler: function(){
            clearTimeout(this._resizeTimeout);
            var self = this;
            this._resizeTimeout = setTimeout(function () {
                  self._recalcDropdownWidth();
            }, 100);
         },

         _recalcInternalContext: function() {
            var
               changed = this._filterStructure.reduce(function(result, element) {
                  return result || element.resetValue !== element.value;
               }, false);

            this.getLinkedContext().setValueSelf({
               filterChanged: changed,
               filterStructure: this._filterStructure
            });
            this._setSelectionToItemsInstances();
         },
         _setSelectionToItemsInstances: function () {
            var instances = this.getItemsInstances();
            for (var i in instances) {
               if (instances.hasOwnProperty(i)) {
                  var value = this._getValueFromStructure(instances[i]);
                  if (instances[i].getItems()) {
                     this._setSelectedKeyByFilterStructure(instances[i], value);
                  }
                  else {
                     instances[i].once('onItemsReady', function (instance) {
                        this._setSelectedKeyByFilterStructure(instance, this._getValueFromStructure(instance));
                     }.bind(this, instances[i]));
                  }
               }
            }
         },

         _getValueFromStructure: function (instance) {
            var fsObject = this._filterStructure[this._getFilterSctructureItemIndex(instance.getContainer().attr('data-id'))],
               hasValue = fsObject.hasOwnProperty('value') && fsObject.value !== undefined;
            return hasValue ? (instance._options.multiselect && fsObject.value instanceof Array ? fsObject.value : [fsObject.value]) : [instance.getDefaultId()];
         },

         _setSelectedKeyByFilterStructure: function (instance, value) {
            this._prepareValue(instance, value).addCallback(function (value) {
               if (!this._isSimilarArrays(instance.getSelectedKeys(), value) && !instance.isDestroyed()) {
                  instance.setSelectedKeys(value);
               }
            }.bind(this));
         },

         _prepareValue: function(instance, newKeys){
            //В структуре resetValue может содержать ключ, которого нет в выпадающем списке
            //В этом случае мы должны выставить первую запись, которая содержится в наборе данных
            var def = new cDeferred();
            var items = instance.getItems();
            if (items && items.getRecordById(newKeys[0])){
               return def.callback(newKeys);
            }
            //Проверки на текущем наборе данных недостаточно, multiSelectable может пойти на БЛ за записью с указанным ключом.
            //todo Нужно рассмотреть возможность отказаться от этого поведения, выписал задачу в 230 https://inside.tensor.ru/opendoc.html?guid=a40189c0-f472-46cf-bd3c-44e641d3ebb9&des=
            if (instance.getDataSource() && newKeys.length && newKeys[0] !== null){
               instance.getDataSource().read(newKeys[0]).addCallbacks(
                  function () {
                     def.callback(newKeys);
                  },
                  function() {
                     def.callback([instance.getDefaultId()]);
                  }
               );
               return def;
            }
            return def.callback([instance.getDefaultId()]);
         },
         //TODO это дублЬ! нужно вынести в хелпер!!!
         _isSimilarArrays : function(arr1, arr2){
            if (arr1.length === arr2.length) {
               for (var i = 0; i < arr1.length; i ++) {
                  if (arr1[i] != arr2[i]) {
                     return false;
                  }
               }
               return true;
            }
            return false;
         },

         setFilter: function() {
            //Избавляюсь от гонки миксинов, на ItemsControlM и FilterM есть методы setFilter. На компоненте должен вызываться метод с ICM
            ItemsControlMixin.setFilter.apply(this, arguments);
         }
      });
      return FastDataFilter;
   });
