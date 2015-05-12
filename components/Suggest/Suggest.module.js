define('js!SBIS3.CONTROLS.Suggest', [
    'js!SBIS3.CORE.Control',
    //'css!SBIS3.CONTROLS.Suggest',
    'js!SBIS3.CONTROLS.PickerMixin',
    'js!SBIS3.CONTROLS.DSMixin',
    'js!SBIS3.CONTROLS.Selectable',
    'js!SBIS3.CONTROLS.DataBindMixin'
], function (Control, /*dotTplFn, */PickerMixin, DSMixin, Selectable, DataBindMixin) {
    'use strict';

    /**
     * Автодополнение
     * @class SBIS3.CONTROLS.Suggest
     * @extends $ws.proto.Control
     * @control
     * @public
     * @initial
     * <component data-component='SBIS3.CONTROLS.Suggest'>
     *     <options name="items" type="array">
     *        <options>
     *            <option name="key">1</option>
     *            <option name="title">Пункт1</option>
     *         </options>
     *         <options>
     *            <option name="key">2</option>
     *            <option name="title">Пункт2</option>
     *         </options>
     *      </options>
     *      <option name="keyField">key</option>
     * </component>
     * @category Inputs
     * @demo SBIS3.Demo.Control.MySuggest
     * @demo SBIS3.Demo.Control.MySuggestDS Автодополнение с dataSource
     * @mixes SBIS3.CONTROLS.PickerMixin
     * @mixes SBIS3.CONTROLS.DSMixin
     * @mixes SBIS3.CONTROLS.Selectable
     * @mixes SBIS3.CONTROLS.DataBindMixin
     */

    var Suggest = Control.Control.extend([PickerMixin, DSMixin, Selectable, DataBindMixin], /** @lends SBIS3.CONTROLS.Suggest.prototype */{
        //_dotTplFn: dotTplFn,

        /**
         * @typedef {Object} BindingsSuggest
         * @property {String} contextField Поле контекста
         * @property {String} itemField Поле выбранной записи
         */

        /**
         * @cfg {BindingsSuggest[]} Соответствие полей контекста и полей выбранной записи
         * @name SBIS3.CONTROLS.Suggest#bindings
         * @example
         * <pre>
         *     <options name="bindings" type="array">
         *        <options>
         *            <option name="contextField">ФИО</option>
         *            <option name="itemField">Абонент</option>
         *         </options>
         *         <options>
         *            <option name="contextField">Телефон</option>
         *            <option name="itemField">РП.Телефон</option>
         *         </options>
         *      </options>
         * </pre>
         */
        $protected: {
            _options: {
                /**
                 * @cfg {Number} Задержка, мс
                 * <wiTag group="Отображение">
                 * Задержка перед началом поиска.
                 */
                delay: 500,

                /**
                 * @cfg {Number} Минимальная длина значения
                 * <wiTag group="Данные">
                 * Минимальная длина введённого значения, при которой следует начать поиск.
                 */
                startChar: 3,

                /**
                 * @cfg {BindingsSuggest[]} Соответствие полей для подстановки в фильтр
                 * <wiTag group="Данные">
                 * Соответствие полей контекста и полей фильтра
                 * <pre>
                 *    filterBindings: [{
                 *       contextField: 'ФИО',
                 *       itemField: 'РП.ФИО'
                 *    }, {
                 *       contextField: 'Должность',
                 *       itemField: 'Должность'
                 *    }]
                 * </pre>
                 * @group Data
                 * @editor InternalOptions?
                 */
                filterBindings: [],

                /**
                 * @cfg {BindingsSuggest[]} Соответствие полей для подстановки результата
                 * <wiTag group="Данные">
                 * Соответствие полей выбранной записи и полей контекста
                 * <pre>
                 *    resultBindings: [{
                 *       contextField: 'ФИО',
                 *       itemField: 'РП.ФИО'
                 *    }]
                 * </pre>
                 * @group Data
                 * @editor InternalOptions?
                 */
                resultBindings: [],

                /**
                 * @cfg {String} Шаблон отображения каждого элемента коллекции
                 * @example
                 * <pre>
                 *     <option name="itemTemplate">
                 *         <div data-key="{{=it.item.getKey()}}" class="controls-Suggest__itemRow js-controls-Suggest__itemRow">
                 *             <div class="genie-colorSuggest__itemTitle">
                 *                 {{=it.displayField}}
                 *             </div>
                 *         </div>
                 *     </option>
                 * </pre>
                 * @TextMultiline
                 */
                itemTemplate: ''
            },

            /**
             * @var {Boolean} Признак изменения какого-либо значения в фильтре
             */
            _filterChanged: false,

            /**
             * @var {Object} Соответствие полей для подстановки в фильтр
             */
            _filterBindings: {},

            /**
             * @var {Object} Соответствие полей для подстановки результата
             */
            _resultBindings: {},

            /**
             * @var {Object|null} Таймер задержки загрузки picker-а
             */
            _delayTimer: null
        },

        $constructor: function() {
            this.getContainer().addClass('controls-Suggest');

            this._initBindingRules();
        },

        after: {
            destroy: function() {
                this._disconnectBindings();
            }
        },

        init: function() {
            //[SBIS3.CORE.Control::getOwner() bug?]
            if (!this._owner && this._options.owner instanceof $ws.proto.Control) {
                this._owner = this._options.owner;
            }
            //[/SBIS3.CORE.Control::getOwner() bug?]

            Suggest.superclass.init.apply(this, arguments);

            this._connectBindings();
        },

        _initBindingRules: function() {
            var convertToObject = function(bindings) {
                var result = {};
                for (var i = 0, len = bindings.length; i < len; i++) {
                    var item = bindings[i];
                    result[item.contextField] = item.itemField;
                }

                return result;
            };

            this._filterBindings = convertToObject(this._options.filterBindings);
            this._resultBindings = convertToObject(this._options.resultBindings);
        },

        _connectBindings: function() {
            var owner = this.getOwner();
            if (!owner) {
                return;
            }

            var context = this.getLinkedContext();
            this.subscribeTo(context, 'onFieldChange', $.proxy(function(eventObject, fieldName) {
                    this._checkPickerState(fieldName, true);
                }, this))
                .subscribeTo(owner, 'onFocusIn', $.proxy(function() {
                    this._checkPickerState(owner.getName(), false);
                }, this));

            //owner && owner.subscribe('onKeyPressed', this._checkPickerState);
        },

        _disconnectBindings: function() {
            //var owner = this.getOwner();
            //owner && owner.unsubscribe('onKeyPressed', this._checkPickerState);
        },

        _checkPickerState: function(fieldName, delayed) {
            if (!(fieldName in this._filterBindings)) {
                return;
            }

            if (this._delayTimer) {
                clearTimeout(this._delayTimer);
                this._delayTimer = null;
            }

            this._buildFilter();

            var showPicker = !Object.isEmpty(this._filter);
            if (showPicker) {
                var self = this;
                this._delayTimer = setTimeout(function() {
                    if (showPicker) {
                        self.showPicker();
                        self.reloadPicker();
                    }
                }, delayed ? this._options.delay : 0);
            } else {
                this.hidePicker();
            }
        },

        reloadPicker: function() {
            if (!this._filterChanged) {
                return;
            }
            console.log(this._filter);
            this.reload();
        },

        _setPickerContent: function() {
            this._picker.getContainer().addClass('controls-Suggest__picker');
        },

        _buildFilter: function() {
            var prevFilter = this._filter || {};
            this._filter = {};
            this._filterChanged = false;

            var context = this.getLinkedContext();
            for (var field in this._filterBindings) {
                if (this._filterBindings.hasOwnProperty(field)) {
                    var filterField = this._filterBindings[field],
                        filterValue = context.getValue(field);
                    if (filterValue && String(filterValue).length >= this._options.startChar) {
                        this._filter[filterField] = filterValue;
                    }

                    if (prevFilter[filterField] !== this._filter[filterField]) {
                        this._filterChanged = true;
                    }
                }
            }
        },

        _drawSelectedItem: function(key) {
            if (key !== undefined && key !== null) {
                var item, def;
                def = new $ws.proto.Deferred();
                if (this._dataSet) {
                    item = this._dataSet.getRecordByKey(key);
                    def.callback(item);
                } else {
                    this._dataSource.read(key).addCallback(function(item) {
                        def.callback(item);
                    });
                }

                var self = this;
                def.addCallback(function(item) {
                    var context = self.getLinkedContext();
                    for (var field in this._resultBindings) {
                        if (this._resultBindings.hasOwnProperty(field)) {
                            context.setValue(field, item.get(this._resultBindings[field]));
                        }
                    }
                });
            } else {
                if (this._picker) {
                    $('.controls-Suggest__itemRow__selected', this._picker.getContainer().get(0))
                        .removeClass('controls-Suggest__itemRow__selected');
                }
            }

        },

        _drawItemsCallback : function() {
            this._drawSelectedItem(this._options.selectedIndex);
        },

        _addItemClasses : function(container, key) {
            Suggest.superclass._addItemClasses.apply(this, arguments);

            container
                .addClass('controls-Suggest__itemRow')
                .addClass('js-controls-Suggest__itemRow');
        },

        _getItemsContainer: function () {
            return this._picker.getContainer();
        },

        _getItemTemplate: function (item) {
            var filterValues = [];
            for (var field in this._filterBindings) {
                if (this._filterBindings.hasOwnProperty(field)) {
                    filterValues.push(item.get(this._filterBindings[field]));
                }
            }

            if (this._options.itemTemplate) {
                return doT.template(this._options.itemTemplate)({item: item, filter: filterValues});
            } else {
                return '<div>' + filterValues.join(', ') + '</div>';
            }
        },

        _clearItems : function() {
            if (this._picker) {
                Suggest.superclass._clearItems.call(this, this._picker.getContainer());
            }
        },

        _redraw: function () {
            if (this._picker) {
                Suggest.superclass._redraw.call(this);
                this._picker.recalcPosition();
            } else {
                this._drawSelectedItem(this._options.selectedIndex);
            }
        },

        //TODO заглушка
        /**
         * @noShow
         * @returns {$ws.proto.Deferred}
         */
        reviveComponents : function() {
            var def = new $ws.proto.Deferred();
            def.callback();
            return def;
        }
    });

    return Suggest;
});
