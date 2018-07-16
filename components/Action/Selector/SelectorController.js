/**
 * Created by am.gerasimov on 11.08.2016.
 */
define('SBIS3.CONTROLS/Action/Selector/SelectorController', [
   "Core/CommandDispatcher",
   "Lib/Control/CompoundControl/CompoundControl",
   "WS.Data/Di",
   "Core/core-instance",
   'Core/core-clone',
   "SBIS3.CONTROLS/Utils/SelectionUtil",
   "SBIS3.CONTROLS/Utils/QueryUtil",
   "SBIS3.CONTROLS/Action/Utils/OpenDialogUtil",
   "WS.Data/Collection/List",
   "SBIS3.CONTROLS/Action/Selector/SelectorWrapper"
],
    function (CommandDispatcher, CompoundControl, Di, cInstance, coreClone, SelectionUtil, Query, OpenDialogUtil, List) {

       'use strict';

       var MULTISELECT_CLASS = 'controls-SelectorController__multiselect';

       /**
        * Класс компонента, который описывает логику выбора из диалога/панели.
        * Пример использования класса описан в статье <a href='/doc/platform/developmentapl/interface-development/forms-and-validation/windows/selector-action/'>Окно выбора из справочника</a>.
        *
        * @class SBIS3.CONTROLS/Action/Selector/SelectorController
        * @extends Lib/Control/CompoundControl/CompoundControl
        * @public
        * @author Герасимов А.М.
        * @control
        */
       var SelectorController = CompoundControl.extend([], /**@lends SBIS3.CONTROLS/Action/Selector/SelectorController.prototype  */{
           /**
            * @event onSelectComplete Происходит при выборе элементов коллекции.
            * @param {Core/EventObject} eventObject Дескриптор события.
            * @param {Array.<String>} Набор выбранных элементов (см. {@link selectedItems}).
            */
          $protected: {
             _options: {
                /**
                 * @cfg {Array.<WS.Data/Entity/Record>} Устанавливает набор выбранных элементов.
                 */
                selectedItems: null,
                /**
                 * @cfg {Boolean} Устанавливает множественный выбор элементов.
                 */
                multiselect: false,
                /**
                 * @cfg {String} Устанавливает тип доступных для выбора элементов.
                 * @remark
                 * Опция актуальна для использования совместно с иерархическим списком.
                 * <br/>
                 * Возможные значения:
                 * <ul>
                 *     <li>all - для выбора доступны любые типы элементов;<li>
                 *     <li>allBySelectAction - для выбора доступны любые типы элементов; Выбор происходит при нажатии на кнопку "Выбрать".<li>
                 *     <li>node - для выбора доступны только элементы типа "Узел";<li>
                 *     <li>leaf - для выбора доступны только элементы типа "Лист" и "Скрытый узел".<li>
                 * </ul>
                 * Подробнее о каждом типе элементов читайте в разделе <a href='/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy'>Иерархия</a>.
                 */
                selectionType: 'all',
                /**
                 * @cfg {String} Устанавливает имя кнопки (см. {@link Lib/Control/Control#name}), клик по которой завершает выбор отмеченных элементов.
                 */
                selectButton: 'SelectorControllerButton',
                /**
                 * @cfg {WS.Data/Source/ISource|Function|Object} Источник данных. Требуется для предзапроса.
                 */
                dataSource: null,
                /**
                 * @cfg {Object} Устанавливает фильтр данных.
                 * @example
                 * Фильтрация будет произведена по полям creatingDate и documentType, значения для которых берутся из контекста из полей selectedDocumentDate и selectedDocumentType соответственно.
                 * <pre class="brush:xml">
                 *     <options name="filter">
                 *        <option name="creatingDate" bind="selectedDocumentDate"></option>
                 *        <option name="documentType" bind="selectedDocumentType"></option>
                 *     </options>
                 * </pre>
                 */
                filter: null,
                /**
                 * @cfg {Boolean} Разрешить всплытие комманд selectorWrapperSelectionChanged, selectComplete
                 */
                allowSelectionCommandBubbling: false,
             },
             _linkedObject: undefined,
             _selectButton: null
          },
          $constructor: function () {
             var commandDispatcher = CommandDispatcher;
             this._publish('onSelectComplete');

             commandDispatcher.declareCommand(this, 'selectorWrapperSelectionChanged', this._selectorWrapperSelectionChanged);
             commandDispatcher.declareCommand(this, 'selectorWrapperInitialized', this._selectorWrapperInitialized);
             commandDispatcher.declareCommand(this, 'selectComplete', this._selectComplete);

             if(this._options.selectedItems) {
                if(Array.isArray(this._options.selectedItems)) {
                   this._options.selectedItems = Di.resolve('collection.list', {items: this._options.selectedItems});
                }
             } else {
                this._options.selectedItems = Di.resolve('collection.list');
             }

             if(this._options.items) {
                this._setContextItems(this._options.items);
             }
          },

          init: function() {
             SelectorController.superclass.init.apply(this, arguments);
             if(this.hasChildControlByName(this._options.selectButton)) {
                this._selectButton = this.getChildControlByName(this._options.selectButton);
                this.subscribeTo(this._selectButton, 'onActivated', this.sendCommand.bind(this, 'selectComplete'));
             }
          },

          _modifyOptions: function() {
             var opts = SelectorController.superclass._modifyOptions.apply(this, arguments);
             opts.cssClassName += ' controls-SelectorController';
             if(opts.multiselect) {
                opts.cssClassName += ' ' + MULTISELECT_CLASS;
             }
             return opts;
          },

          /**
           * Обновляет конфигурацию уже инициализированного экземпляра класса SBIS3.CONTROLS.SelectorController.
           * @remark
           * При выполнении команды обновляется конфигурацию для опций {@link multiselect}, {@link selectedItems} и {@link selectionType}.
           * @param {SBIS3.CONTROLS/Action/Selector/SelectorController} chooserWrapper
           * @command selectorWrapperInitialized
           * @see selectorWrapperSelectionChanged
           * @see selectComplete
           */
          _selectorWrapperInitialized: function(chooserWrapper) {
             chooserWrapper.setProperties({
                multiselect: this._options.multiselect,
                selectedItems: this._options.selectedItems,
                selectionType: this._options.selectionType
             });
             this._linkedObject = chooserWrapper._getLinkedObject();
             
             if (!this._options.allowSelectionCommandBubbling) {
                return true;
             }
          },

          /**
           * Производит изменение списка выбранных элементов коллекции.
           * @remark
           * Массив выбранных элементов хранится в опции (см. {@link selectedItems}).
           * @param {Object} difference Объект с набором элементов, которые нужно добавить или убрать из списка выбранных.
           * @param {Array.<String>} difference.removed Массив с идентификаторами элементов, которые нужно убрать из списка выбранных.
           * @param {Array.<String>} difference.added Массив с идентификаторами элементов, которые нужно добавить в список выбранных.
           * @param {String} idProperty Поле с идентификатором элемента коллекции.
           * @command selectorWrapperSelectionChanged
           * @see selectorWrapperInitialized
           * @see selectComplete
           */
          _selectorWrapperSelectionChanged: function(difference, idProperty) {
             var currentItems = this._options.selectedItems,
                 multiselect = this.getProperty('multiselect'),
                 self = this;

             function onChangeSelection() {
                if(self._selectButton && multiselect) {
                   self._selectButton[currentItems.getCount() ? 'show' : 'hide']();
                }
             }

             if(difference.removed.length) {
                difference.removed.forEach(function(removedKey) {
                   var index = currentItems.getIndexByValue(idProperty, removedKey);
                   
                   /* Т.к. когда делаеют setSelectedKeys с каким-то ключём, записи в рекордсете с этим ключём может не быть,
                      так и при удалении ключа, записи с таким ключем среди currentSelectedItems может не быть */
                   if(index !== -1) {
                      currentItems.removeAt(index);
                   }
                });
                onChangeSelection();
             }

             if(difference.added.length) {
                difference.added.forEach(function(item) {
                   var index = currentItems.getIndexByValue(idProperty, item.get(idProperty));

                   if(currentItems.getCount() && !multiselect && index === -1) {
                      index = 0;
                   }
                   item = item.clone();//клонируем итем что бы у него не менялся владелец
                   if(index === -1) {
                      currentItems.add(item);
                   } else {
                      currentItems.replace(item, index);
                   }
                });
                onChangeSelection();
             }
             
             if (!this._options.allowSelectionCommandBubbling) {
                return true;
             }
          },
           /**
            * Производит подтверждение выбранных элементов коллекции.
            * @remark
            * Массив выбранных элементов хранится в опции (см. {@link selectedItems}).
            * При выполнении команды происходит событие {@link onSelectComplete}.
            * @command selectComplete
            * @see selectorWrapperInitialized
            * @see selectorWrapperSelectionChanged
            */
          _selectComplete: function(item) {
             var
                list,
                filter,
                selection,
                dataSource,
                self = this;
             if (this._linkedObject && this._linkedObject._options.useSelectAll && this._options.multiselect) {
                filter = coreClone(this._linkedObject.getFilter());
                dataSource = this._linkedObject.getDataSource();
                //Закончить выбор элементов можно двумя способами:
                //1) Нажать кнопку "Выбрать" в шапке диалога;
                //2) Нажать на кнопку "Выбрать" в опциях над записью у элемента таблицы, либо кликом по элементу таблицы.
                //В первом случае элементы выборки мы получим исходя из состояния выделения в таблице.
                //Во стором случае, элемент который был выбран, придёт аргументом в этот обработчик, и в выборку мы добавим только его.
                selection = cInstance.instanceOfModule(item, 'WS.Data/Entity/Model') ? {
                   marked: [item.get(this._linkedObject.getProperty('idProperty'))], excluded: []
                } : this._linkedObject.getSelection();
                filter['selection'] = SelectionUtil.selectionToRecord(selection, dataSource.getAdapter());
                Query(dataSource, [filter]).addCallback(function(recordSet) {
                   list = new List();
                   list.assign(recordSet.getAll());
                   self._notify('onSelectComplete', list);
                });
             } else {
                this._notify('onSelectComplete', this._options.selectedItems.clone());
             }
          },

          _setContextItems: function(items){
             this.getLinkedContext().setValue('items', items);
          }
       });

       SelectorController.prototype.getComponentOptions = function(opt){
          return OpenDialogUtil.getOptionsFromProto(this, opt);
       };

       SelectorController.prototype.getItemsFromSource = function (opt, metaOpts) {
          var options = this.getComponentOptions(opt),
              dataSource = options.dataSource;

          return Query(dataSource, [
             options.filter ? options.filter : metaOpts.filter || {}, // Фильтр может быть задан не на прототипе, а передан в мета информации для action'a, т.к. определяется динамически
             options.sorting ? options.sorting : {},
             0,
             options.pageSize ? options.pageSize : 25]);
       };

       return SelectorController;

    });
