/**
 * Created by am.gerasimov on 15.04.2015.
 */
define('js!SBIS3.CONTROLS.FastDataFilter',
   [
   "Core/constants",
   "js!SBIS3.CORE.CompoundControl",
   "js!SBIS3.CONTROLS.ItemsControlMixin",
   "js!SBIS3.CONTROLS.FilterMixin",
   'Core/Deferred',
   "js!SBIS3.CONTROLS.DropdownList",
   "html!SBIS3.CONTROLS.FastDataFilter",
   "html!SBIS3.CONTROLS.FastDataFilter/ItemTpl",
   "Core/helpers/collection-helpers"
],

   function( constants,CompoundControl, ItemsControlMixin, FilterMixin, cDeferred, DropdownList, dotTplFn, ItemTpl, colHelpers) {

      'use strict';
      /**
       * Контрол, отображающий набор выпадающих списков SBIS3.CONTROLS.DropdownList и работающий с фильтром в контексте
       * Подробнее конфигурирование контрола описано в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/filtering/list-filterfast/">Быстрые фильтры</a>.
       * @class SBIS3.CONTROLS.FastDataFilter
       * @extends $ws.proto.CompoundControl
       *
       * @author Герасимов Александр Максимович
       *
       * @mixes SBIS3.CONTROLS.ItemsControlMixin
       * @mixes SBIS3.CONTROLS.FilterMixin
       *
       * @demo SBIS3.CONTROLS.Demo.MyFastDataFilter Работа с статическими данными
       * @demo SBIS3.CONTROLS.Demo.MyFastDataFilterDataSource Работа с DataSource данными
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
      var FastDataFilter = CompoundControl.extend([FilterMixin, ItemsControlMixin],/** @lends SBIS3.CONTROLS.FastDataFilter.prototype */{
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
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
                * @example
                * <pre>
                *    items: [{
                *       idProperty : 'key',    //Имя поля с ключом из списка значений values
                *       displayProperty: 'title',//Имя поля, в котором хранится текстовое отображение ключа из списка значений values
                *       name: 'first',        //Имя фильтра
                *       multiselect : false,  //Режим выпадающего списка
                *       className: 'controls-DropdownList__withoutCross', //Строка с классами css-модификаторов для выпадающего списка
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
         init: function () {
            FastDataFilter.superclass.init.apply(this, arguments);
            this._container.removeClass('ws-area');
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
                         (this._options.multiselect ?  idArray : idArray[0]);
               //TODO Непонятно как это сделать в обратную сторону (когда из контекста кришло значение его нужно поставить в dropdownList)
               //В контексте текуший DropdownList, у него задавали поле с фильтром
               //Если не нашли, значит искать мне это надо как-то по-другому....
               if (idx >= 0) {
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
            });
         },
         _recalcDropdownWidth: function(){
            this._resetMaxWidth();
            if (constants.browser.isIE && constants.browser.IEVersion <= 10){
               var ddlText = $('.controls-DropdownList__textWrapper', this.getContainer()),
                   ieWidth = 2, //Отступ, чтобы ie правильно уместил содержимое в контейнер,
                   containerWidth = this.getContainer().width() + ieWidth;
               this._resizeDropdownContainersForIE(ddlText, containerWidth);
            }
            else{
               var dropdownLists = $('.controls-DropdownList', this.getContainer());
               dropdownLists.sort(function(el1, el2){
                  return $(el1).width() > $(el2).width();
               });
               for (var i = 0, l = dropdownLists.length; i < l; i++){
                  $(dropdownLists[i]).css('flex-shrink', i + 1);
               }
            }
         },

         _resetMaxWidth: function(){
            var dropdownContainer = $('.controls-DropdownList', this.getContainer()),
               dropdownLimitProperty = 'flex-shrink';
            if (constants.browser.isIE && constants.browser.IEVersion <= 10){
               dropdownContainer = $('.controls-DropdownList__textWrapper', this.getContainer());
               dropdownLimitProperty = 'max-width';
            }
            colHelpers.forEach(dropdownContainer, function(elem){
               $(elem).css(dropdownLimitProperty, '');
            });
         },

         _resizeDropdownContainersForIE: function(dropdownText, containerWidth){
            var ddlWidth = this._getDropdownListsWidth(),
               maxDdl;
            while (ddlWidth > containerWidth){
               maxDdl = this._getDropdownMaxWidth(dropdownText);
               maxDdl.css('max-width', (maxDdl.width() * 0.9)); //Уменьшаем ширину самого большого ddl на 10%
               ddlWidth = this._getDropdownListsWidth();
            }
         },
         _getDropdownMaxWidth: function(dropdownText){
            var maxElem = $(dropdownText[0]);
            for (var i = 1, l = dropdownText.length; i < l; i++){
               if ($(dropdownText[i]).width() > maxElem.width()){
                  maxElem = $(dropdownText[i]);
               }
            }
            return maxElem;
         },

         _getDropdownListsWidth: function(){
            var sumWidth = 0;
            var dropdownContainer = $('.controls-DropdownList', this.getContainer());

            for (var i = 0, l = dropdownContainer.length; i < l; i++){
               sumWidth += $(dropdownContainer[i]).width();
            }

            return sumWidth;
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
                  changed = colHelpers.reduce(this._filterStructure, function(result, element) {
                     return result || element.resetValue !== element.value;
                  }, false);

            this.getLinkedContext().setValueSelf({
               filterChanged: changed,
               filterStructure: this._filterStructure
            });
            this._setSelectionToItemsInstances();
         },
         _setSelectionToItemsInstances : function(){
            var instances = this.getItemsInstances();
               for (var i in instances) {
                  if (instances.hasOwnProperty(i)){
                     var fsObject = this._filterStructure[this._getFilterSctructureItemIndex(instances[i].getContainer().attr('data-id'))],
                           value = (fsObject.hasOwnProperty('value') && fsObject.value !== undefined) ?  instances[i]._options.multiselect ?  fsObject.value : [fsObject.value]: [instances[i].getDefaultId()];
                     this._prepareValue(instances[i], value).addCallback(function(instance, value){
                        if (!this._isSimilarArrays(instance.getSelectedKeys(), value) && !instance.isDestroyed()) {
                           if(instance.getItems()){
                              instance.setSelectedKeys(value);
                           }else {
                              instance.once('onItemsReady', function () {
                                 instance.setSelectedKeys(value);
                              });
                           }
                        }
                     }.bind(this, instances[i]));
                  }
               }
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
            if (instance.getDataSource() && newKeys[0] !== null){
               instance.getDataSource().read(newKeys[0]).addCallbacks(
                  function () {
                     def.callback(newKeys);
                  },
                  function() {
                     def.callback([instance._defaultId]);
                  }
               );
               return def;
            }
            return def.callback([instance._defaultId]);
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
         }
      });
      return FastDataFilter;
   });
