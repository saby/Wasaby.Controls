/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.List.Sum', [
        'js!SBIS3.CONTROLS.Action.Action',
        'js!SBIS3.CONTROLS.Action.List.ListMixin',
        'js!SBIS3.CONTROLS.Action.DialogMixin',
        'js!WS.Data/Source/SbisService',
        'js!WS.Data/Entity/Record',
        'js!WS.Data/Adapter/Sbis',
        'js!WS.Data/Collection/RecordSet'
    ],
    function (ActionBase, ListMixin, DialogMixin, SbisService, Record, SbisAdapter, RecordSet) {
        'use strict';
        /**
         * Класс суммирования полей в списке
         * @class SBIS3.CONTROLS.Action.List.Sum
         * @public
         * @extends SBIS3.CONTROLS.Action.Action
         * @author Крайнов Дмитрий Олегович
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
                    fields: {}
                }
            },
            _doExecute: function () {
                var self = this;
                return this._sum().addCallback(function(item) {
                    return self._opendEditComponent({
                        item: item.getRow()
                    }, self._options.template);
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
                    filter,
                    selectedRecordSet,
                    object = this.getLinkedObject(),
                    source = this.getDataSource(),
                    selectedItems = object.getSelectedItems(),
                    isSelected = selectedItems && selectedItems.getCount(),
                    args = {
                        'Поля': Object.keys(this._options.fields)
                    },
                    sumSource = new SbisService({
                        endpoint: "Сумма"
                    });
                if (isSelected) {
                    selectedRecordSet = new RecordSet({
                        adapter: 'adapter.sbis'
                    });
                    selectedRecordSet.assign(selectedItems);
                    args['Записи'] = selectedRecordSet;
                } else {
                    args['ИмяМетода'] = source.getEndpoint().contract + '.' + source.getBinding().query;
                    filter = object.getFilter();
                    args['Фильтр'] = new Record({
                        adapter: 'adapter.sbis',
                        rawData: filter,
                        //Если фильтр пустой, то нам нужно укзать пустой формат, чтобы при отпраке на бл пустой рекорд преобразовался в объект с полями d и s.
                        format: Object.isEmpty(filter) ? [] : null
                    });
                }

                return sumSource.call(isSelected ? 'ПоВыборке' : 'ПоМетоду', args);
            }
        });
        return Sum;
    });