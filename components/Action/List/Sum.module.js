/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.List.Sum', [
   "Core/Deferred",
   "js!SBIS3.CONTROLS.Action.Action",
   "js!SBIS3.CONTROLS.Action.List.ListMixin",
   "js!SBIS3.CONTROLS.Action.DialogMixin",
   "WS.Data/Source/SbisService",
   "WS.Data/Entity/Model",
   "Core/core-merge",
   "Core/core-clone",
   "Core/core-instance",
   "WS.Data/Adapter/Sbis"
],
    function ( Deferred,ActionBase, ListMixin, DialogMixin, SbisService, Model, cMerge, cClone, cInstance) {
        'use strict';
        /**
         * Класс, описывающий действие суммирования полей в списке.
         * @class SBIS3.CONTROLS.Action.List.Sum
         * @public
         * @extends SBIS3.CONTROLS.Action.Action
         * @author Сухоручкин Андрей Сергеевич
         *
         * @mixes SBIS3.CONTROLS.Action.List.ListMixin
         * @mixes SBIS3.CONTROLS.Action.DialogMixin
         *
         * @demo SBIS3.CONTROLS.Demo.SumAction
         *
         * @ignoreOptions validators independentContext contextRestriction extendedTooltip
         *
         * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
         * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
         * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
         * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
         * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
         * @ignoreMethods getReadyDeferred getStateKey getTabindex getUserData getValue hasActiveChildControl hasChildControlByName
         * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
         * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
         * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
         * @ignoreMethods setTabindex setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
         * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
         *
         * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
         * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
         */
        var Sum = ActionBase.extend([ListMixin, DialogMixin], /** @lends SBIS3.CONTROLS.Action.List.Sum.prototype */{
            $protected: {
                _options: {
                    /**
                     * @cfg {String} Шаблон диалога сохранения .
                     */
                    template : 'js!SBIS3.CONTROLS.SumDialogTemplate',
                    /**
                     * @cfg {Object} Поля для суммирования
                     * @remark
                     * Поля для суммирования - это те поля, по которым производится суммирование значений записей.
                     * Для суммирования подходят поля типов "Число целое", "Число вещественное" и "Деньги".
                     *
                     * Результат суммирования по полю выводится в отдельном диалоговом окне напротив названия поля.
                     * Отображаемое название можно изменить, задав альтернативное имя при конфигурации полей суммирования.
                     *
                     * Если в fields не задать столбец для суммирования, то посчитается количество выбранных записей.
                     * @example
                     * 1. Структура объекта, описывающего поля для суммирования.
                     * <pre>
                     *    <options name="fields">
                     *       //задаём поле суммирования в виде <option name="ИмяПоля">АльтернативноеИмя</option>
                     *       <option name="ИтогПр">Сумма</option>
                     *    </options>
                     * </pre>
                     * 2. Задать три поля для суммирования.
                     * <pre>
                     *    fields: {
                     *       //имя поля "ЗарПлат" хотим отображать в диалоговом окне как "Заработная плата"
                     *       'ЗарПлат': 'Заработная плата',
                     *       //имя поля "Число". Альтернативное имя не определено. В диалоговом окне имя поля отобразится как "Число"
                     *       'Число': undefined
                     *    }
                     * </pre>
                     * @see setFields
                     * @see getFields
                     */
                    fields: {},
                   /**
                    * @cfg {Object} Фильтр, применяемый для выборки суммируемых элементов.
                    * @example
                    * <pre>
                    * var filter = {};
                    * // Свойство ВидДерева устанавливают типы записей, по которым производится суммирование
                    * filter['ВидДерева'] = 'Только узлы'
                    * filter['ВидДерева'] = 'Только листья'
                    * </pre>
                    */
                    filter: {}
                }
            },
            _doExecute: function () {
                var self = this;
                return this._sum().addCallback(function(item) {
                    if (cInstance.instanceOfModule(item, 'WS.Data/Source/DataSet')) {
                        item = item.getRow();
                    }
                    return self._openComponent({
                        item: item
                    });
                });
            },
            /**
             * Установить поля для суммирования.
             * @param {Object} fields Объект с описанием полей для суммирования.
             * @see getFields
             */
            setFields: function(fields) {
                this._options.fields = fields;
            },
            /**
             * Получить поля для суммирования.
             * @returns {Object} Объект с описанием полей для суммирования.
             * @see setFields
             */
            getFields: function() {
                return this._options.fields;
            },
            _buildComponentConfig: function(params) {
                return {
                    item: params.item,
                    fields: this._options.fields
                };
            },
            _sum: function() {
                var
                    source,
                    filter,
                    object = this.getLinkedObject(),
                    selectedItems = object.getSelectedItems(),
                    isSelected = selectedItems && selectedItems.getCount();
                if (isSelected) {
                    //При суммировании выбранных элементов, не вызываем платформенный метод бизнес логики 'Сумма.ПоВыборке',
                    //из-за того, что могут выделить 1000 записей и нам эти 1000 записей придётся отправить на бл.
                    //1000 записей весят примерно 8 мегабайт. Получается не рационально перегонять 8 мб ради лёгкой операции,ъ
                    //которая на клиенте выполняется меньше секунды.
                    return this._sumField(selectedItems);
                } else {
                    source = this.getDataSource();
                    filter = cMerge(cClone(object.getFilter()), this._options.filter);
                    return this._getSumSource().call('ПоМетоду', {
                        'Поля': Object.keys(this._options.fields),
                        'ИмяМетода': source.getEndpoint().contract + '.' + source.getBinding().query,
                        'Фильтр': Model.fromObject(filter, 'adapter.sbis')
                    });
                }
            },

            _sumField: function(items) {
                var
                    i,
                    itemsCount = 0,
                    resultFields = {},
                    fields = Object.keys(this._options.fields),
                    linkedObject = this.getLinkedObject(),
                    format = linkedObject.getItems().getFormat(),
                    resultRecord = new Model({
                        adapter: 'adapter.sbis'
                    }),
                    nodeProperty = cInstance.instanceOfMixin(linkedObject, 'SBIS3.CONTROLS.TreeMixin') ? linkedObject.getNodeProperty() : undefined;
                for (i = 0; i < fields.length; i++) {
                    resultFields[fields[i]] = 0;
                }
                items.each(function(model) {
                    if (this._needToSum(model, nodeProperty)) {
                       for (i = 0; i < fields.length; i++) {
                          resultFields[fields[i]] += model.get(fields[i]);
                       }
                       itemsCount++;
                    }
                }, this);
                resultRecord.addField({name: rk('Число записей'), type: 'integer'}, 0, itemsCount);
                for (i = 0; i < fields.length; i++) {
                    resultRecord.addField(format.at(format.getFieldIndex(fields[i])), i + 1, resultFields[fields[i]]);
                }
                return Deferred.success(resultRecord);
            },

            //Методя является костылём, для проверки необходимости суммирования определённого типа записей НА КЛИЕНТЕ.
            //Когда переведём суммирование полностью на бизнес логику, этот метод не понадобится, как и суммирование на клиенте.
            _needToSum: function(model, nodeProperty) {
                var treeState = this._options.filter['ВидДерева'];
                return !treeState ||
                       (treeState === 'Только узлы' && model.get(nodeProperty) !== null) ||
                       (treeState === 'Только листья' && model.get(nodeProperty) === null);
            },

            _getSumSource: function() {
                if (!this._sumSource) {
                    this._sumSource = new SbisService({
                        endpoint: "Сумма"
                    });
                }
                return this._sumSource;
            }
        });
        return Sum;
    });