define('SBIS3.CONTROLS/Action/SelectorAction',
   [
      'SBIS3.CONTROLS/Action',
      'SBIS3.CONTROLS/Action/Mixin/DialogMixin',
      'SBIS3.CONTROLS/Action/Utils/OpenDialogUtil',
      'Core/core-merge',
      'Core/Deferred',
      'Core/Context',
      'Core/Indicator',
      'Core/helpers/Function/forAliveOnly'
   ],
    function (Action, DialogMixin, OpenDialogUtil, cMerge, Deferred, Context, Indicator, forAliveOnly) {
       'use strict';
       /**
        * Класс, который описывает действие открытия окна с заданным шаблоном. Из этого окна можно осуществлять выбор.
        * @class SBIS3.CONTROLS/Action/SelectorAction
        * @extends SBIS3.CONTROLS/Action
        *
        * @mixes SBIS3.CONTROLS/Action/Mixin/DialogMixin
        *
        * @demo Examples/Action/SelectorAction/SelectorAction
        *
        * @public
        * @author Герасимов А.М.
        *
        * @ignoreOptions allowChangeEnable alwaysShowExtendedTooltip className enabled tabindex tooltip visible
        *
        * @ignoreMethods addOwnedContext canAcceptFocus describe getAlignment getContainer getId getMinHeight getMinSize
        * @ignoreMethods getMinWidth getParent getParentByClass getParentByName getParentWindow getProperty getTooltip
        * @ignoreMethods getTopParent hasEvent hide init initializeProperty isAllowChangeEnable isCanExecute isEnabled
        * @ignoreMethods isInitialized isSubControl isVisible isVisibleWithParents runInPropertiesUpdate setAllowChangeEnable
        * @ignoreMethods setEnabled setProperties setProperty setVisible show subscribeOnceTo subscribeTo toggle unbind unsubscribeFrom
        *
        * @ignoreEvents onCommandCatch onDestroy onDragIn onDragMove onDragOut onDragStart onDragStop onPropertiesChanged onPropertyChanged
        */
       var SelectorAction = Action.extend([DialogMixin], /** @lends SBIS3.CONTROLS/Action/SelectorAction.prototype */{
           /**
            * @event onExecuted Происходит после выполнения действия.
            * @param {Core/EventObject} eventObject Дескриптор события.
            * @param {Object} meta Метаданные, с которыми было выполнено действие (см. {@link execute}).
            * @param {Boolean} [meta.multiselect] Признак: множественный выбор записей из списка.
            * @param {Array.<WS.Data/Entity/Record>} [meta.selectedItems] Записи, которые будут выбраны по умолчанию.
            * @param {String} [meta.selectionType] Тип доступных для выбора записей. Опция актуальна для использования, когда в <a href="/doc/platform/developmentapl/interface-development/forms-and-validation/windows/selector-action/">Окне выбора из справочника</a> используется иерархический список.
            * Возможные значения:
            * <ul>
            *     <li>all - для выбора доступны любые типы записей;<li>
            *     <li>allBySelectAction - для выбора доступны любые типы записей; выбор происходит при нажатии на кнопку "Выбрать".<li>
            *     <li>node - для выбора доступны только записи типа "Узел";<li>
            *     <li>leaf - для выбора доступны только записи типа "Лист" и "Скрытый узел".<li>
            * </ul>
            * Подробнее о каждом типе записей читайте в разделе <a href='/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy'>Иерархия</a>.
            * @param {Object} [meta.componentOptions] Объект с пользовательскими опциями, которые передаются в диалог в секцию _options.
            * @param {Object} [meta.dialogOptions] Объект с конфигурацией контрола, на основе которого создаётся диалог (см. {@link mode}). В числе опций также передают и {@link Lib/Control/Control#linkedContext}.
            * @param {Array.<WS.Data/Entity/Record>} result Массив, где каждый элемент - это выбранная на диалоге запись (см. {@Link WS.Data/Entity/Record}).
            * @see execute
            */
           /**
            * @event onError Происходит, когда выполнение действия было прервано в результате ошибки.
            * @param {Core/EventObject} eventObject Дескриптор события.
            * @param {Error} error Экземпляр класса Error.
            * @param {Object} meta Метаданные, с которыми выполнялось действие (см. {@link execute}).
            * @param {Boolean} [meta.multiselect] Признак: множественный выбор записей из списка.
            * @param {Array.<WS.Data/Entity/Record>} [meta.selectedItems] Записи, которые будут выбраны по умолчанию.
            * @param {String} [meta.selectionType] Тип доступных для выбора записей. Опция актуальна для использования, когда в <a href="/doc/platform/developmentapl/interface-development/forms-and-validation/windows/selector-action/">Окне выбора из справочника</a> используется иерархический список.
            * Возможные значения:
            * <ul>
            *     <li>all - для выбора доступны любые типы записей;<li>
            *     <li>allBySelectAction - для выбора доступны любые типы записей; выбор происходит при нажатии на кнопку "Выбрать".<li>
            *     <li>node - для выбора доступны только записи типа "Узел";<li>
            *     <li>leaf - для выбора доступны только записи типа "Лист" и "Скрытый узел".<li>
            * </ul>
            * Подробнее о каждом типе записей читайте в разделе <a href='/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy'>Иерархия</a>.
            * @param {Object} [meta.componentOptions] Объект с пользовательскими опциями, которые передаются в диалог в секцию _options.
            * @param {Object} [meta.dialogOptions] Объект с конфигурацией контрола, на основе которого создаётся диалог (см. {@link mode}). В числе опций также передают и {@link Lib/Control/Control#linkedContext}.
            * @see execute
            */
           /**
            * @event onExecute Происходит перед выполнением действия.
            * @remark
            * В обработчике события вы можете изменить метаданные, с которыми впоследствии будет выполнено действие, а также запретить его выполнение.
            * Обрабатываемые результаты:
            * <ul>
            *     <li>Если из обработчика возвращается *false* или строка *custom*, то выполнение действия прерывается.</li>
            *     <li>Если возвращается deferred, то действие выполнится в обработчике callback. Примечание: когда в результаты callback переданы *false* или строка *custom*, выполнение действия также прерывается.</li>
            * </ul>
            * @param {Core/EventObject} eventObject Дескриптор события.
            * @param {Object} meta Метаданные, переданные при вызове метода (см. {@link execute}).
            * @param {Boolean} [meta.multiselect] Признак: множественный выбор записей из списка.
            * @param {Array.<WS.Data/Entity/Record>} [meta.selectedItems] Записи, которые будут выбраны по умолчанию.
            * @param {String} [meta.selectionType] Тип доступных для выбора записей. Опция актуальна для использования, когда в <a href="/doc/platform/developmentapl/interface-development/forms-and-validation/windows/selector-action/">Окне выбора из справочника</a> используется иерархический список.
            * Возможные значения:
            * <ul>
            *     <li>all - для выбора доступны любые типы записей;<li>
            *     <li>allBySelectAction - для выбора доступны любые типы записей; выбор происходит при нажатии на кнопку "Выбрать".<li>
            *     <li>node - для выбора доступны только записи типа "Узел";<li>
            *     <li>leaf - для выбора доступны только записи типа "Лист" и "Скрытый узел".<li>
            * </ul>
            * Подробнее о каждом типе записей читайте в разделе <a href='/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy'>Иерархия</a>.
            * @param {Object} [meta.componentOptions] Объект с пользовательскими опциями, которые передаются в диалог в секцию _options.
            * @param {Object} [meta.dialogOptions] Объект с конфигурацией контрола, на основе которого создаётся диалог (см. {@link mode}). В числе опций также передают и {@link Lib/Control/Control#linkedContext}.
            * @see execute
            */
           /**
            * @name SBIS3.CONTROLS/Action/SelectorAction#execute
            * @function
            * @description
            * Запускает выполнение действия.
            * @remark
            * Действие может быть выполнено, когда это не запрещено в опции {@link _canExecute}.
            * Перед выполнением происходит событие {@link onExecute}, после выполнения - {@link onExecuted}, а в случае ошибки - {@link onError}.
            * @param {Object} meta Метаданные. Дополняют сведения о контексте выполнения действия, а также о свойствах сущностей, с которыми происходит взаимодействие. Для каждого класса существует собственный набор метаданных.
            * @param {Boolean} [meta.multiselect] Признак: множественный выбор записей из списка.
            * @param {Array.<WS.Data/Entity/Record>} [meta.selectedItems] Записи, которые будут выбраны по умолчанию.
            * @param {String} [meta.selectionType] Тип доступных для выбора записей. Опция актуальна для использования, когда в <a href="/doc/platform/developmentapl/interface-development/forms-and-validation/windows/selector-action/">Окне выбора из справочника</a> используется иерархический список.
            * Возможные значения:
            * <ul>
            *     <li>all - для выбора доступны любые типы записей;<li>
            *     <li>allBySelectAction - для выбора доступны любые типы записей; выбор происходит при нажатии на кнопку "Выбрать".<li>
            *     <li>node - для выбора доступны только записи типа "Узел";<li>
            *     <li>leaf - для выбора доступны только записи типа "Лист" и "Скрытый узел".<li>
            * </ul>
            * Подробнее о каждом типе записей читайте в разделе <a href='/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy'>Иерархия</a>.
            * @param {Object} [meta.componentOptions] Объект с пользовательскими опциями, которые передаются в диалог в секцию _options.
            * @param {Object} [meta.dialogOptions] Объект с конфигурацией контрола, на основе которого создаётся диалог (см. {@link mode}). В числе опций также передают и {@link Lib/Control/Control#linkedContext}.
            */
          _buildComponentConfig: function(metaConfig) {
             /* Необходимо клонировать metaConfig, чтобы не испортить оригинальный объект */
             var cfg = cMerge({}, SelectorAction.superclass._buildComponentConfig.call(this, metaConfig), {clone: true});

             function onSelectComplete(event, meta) {
                this.sendCommand('close', meta);
             }
             
             if(metaConfig.hasOwnProperty('multiselect')) {
                cfg.multiselect = metaConfig.multiselect;
             }
             
             if(metaConfig.selectedItems) {
                cfg.selectedItems = metaConfig.selectedItems.clone();
             }
             
             if(metaConfig.selectionType) {
                cfg.selectionType = metaConfig.selectionType;
             }

             if(cfg.handlers) {
                if (cfg.handlers.onSelectComplete) {
                   cfg.handlers.onSelectComplete = [cfg.handlers.onSelectComplete, onSelectComplete];
                } else {
                   cfg.handlers.onSelectComplete = onSelectComplete;
                }
             } else {
                cfg.handlers = {
                   onSelectComplete: onSelectComplete
                }
             }

             return cfg;
          },

          _createComponent: function(config, meta, mode) {
             var self = this,
                 compOptions = {},
                 initializingDeferred;

             function initializeComplete(items) {
                var componentContext = config.context || Context.createContext(self, null, Context.global);
                if(items) {
                   componentContext.setValue('items', items);
                   config.context = componentContext;
                }
                SelectorAction.superclass._createComponent.call(self, config, meta, mode);
             }

             function errorProcess(err) {
                OpenDialogUtil.errorProcess(err);
             }

             Indicator.setMessage(rk('Загрузка...'), true);
             require([config.template], function(component) {
                compOptions = OpenDialogUtil.getOptionsFromProto(component, config);

                /* dataSource - передан, делаем запрос, а потом открываем */
                if(compOptions.dataSource && component.prototype.getItemsFromSource) {
                   initializingDeferred = component.prototype.getItemsFromSource.call(component.prototype, config, meta)
                      .addCallback(function(dataSet) {
                         return dataSet.getAll();
                      })
                      .addErrback(function(err) {
                         errorProcess(err);
                         return err;
                      })
                      .addBoth(function(res) {
                         Indicator.hide();
                         return res;
                      });
                } else {
                   /* Если не передан - открываем сразу */
                   Indicator.hide();
                   initializingDeferred = Deferred.success(config.componentOptions.items || []);
                }

                initializingDeferred.addCallback(forAliveOnly(function(items) {
                   initializeComplete(items);
                   return items;
                }, self));
             });
          }
       });
       return SelectorAction;
    });