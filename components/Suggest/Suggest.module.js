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
            var self = this,
                parent = this.getParent();

            //this.subscribeTo(parent, 'onReady', function() {
            var controls = parent.getChildControls(true);
            $ws.helpers.forEach(controls, function(control) {
                if (control.getName() in this._filterBindings) {
                    this.subscribeTo(control, 'onFocusIn', function(eventObject) {
                        self._checkPickerState(this.getName(), false);
                    });
                }
            }, this);
            //});

            var context = this._getBindingContext();
            this.subscribeTo(context, 'onFieldChange', $.proxy(function(eventObject, fieldName, fieldValue, initiator) {
                if (initiator !== this) {
                    this._checkPickerState(fieldName, true);
                }
            }, this));
        },

        _disconnectBindings: function() {
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
            this.reload();
        },

        _setPickerContent: function() {
            var self = this;

            this._picker.getContainer()
                .addClass('controls-Suggest__picker')
                .delegate('.controls-Suggest__itemRow', 'mouseup', function() {
                    self.setSelectedIndex($(this).attr('data-id'));
                });
        },

        _buildFilter: function() {
            var prevFilter = this._filter || {};
            this._filter = {};
            this._filterChanged = false;

            var context = this._getBindingContext();
            for (var field in this._filterBindings) {
                if (this._filterBindings.hasOwnProperty(field)) {
                    var filterField = this._filterBindings[field],
                        filterValue = context.getValue(field);
                    if (filterValue && String(filterValue).length >= this._options.startChar) {
                        this._filter[filterField] = new RegExp('^.*' + filterValue + '.*$') ;
                    }

                    if (prevFilter[filterField] !== this._filter[filterField]) {
                        this._filterChanged = true;
                    }
                }
            }
        },

        _drawSelectedItem: function(key) {
            if (key !== undefined && key !== null) {
                var def = new $ws.proto.Deferred();
                if (this._dataSet) {
                    def.callback(this._dataSet.getRecordByKey(key));
                } else {
                    this._dataSource.read(key).addCallback(function(item) {
                        def.callback(item);
                    });
                }

                var self = this;
                def.addCallback(function(item) {
                    var context = self._getBindingContext();
                    for (var field in self._resultBindings) {
                        if (self._resultBindings.hasOwnProperty(field)) {
                            context.setValue(
                                field,
                                item.get(self._resultBindings[field]),
                                false,
                                self
                            );
                        }
                    }

                    if (self._picker) {
                        self._picker.getContainer()
                            .find('.controls-Suggest__itemRow__selected')
                                .removeClass('controls-Suggest__itemRow__selected')
                            .end()
                            .find('.controls-Suggest__itemRow[data-id="' + key + '"]')
                                .addClass('controls-Suggest__itemRow__selected');
                    }
                });
            } else {
                if (this._picker) {
                    this._picker.getContainer()
                        .find('.controls-Suggest__itemRow__selected')
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

        /**
         * Метод перезагрузки данных.
         * Можно задать фильтрацию, сортировку.
         * @param {String} filter Параметры фильтрации.
         * @param {String} sorting Параметры сортировки.
         * @param offset Элемент, с которого перезагружать данные.
         * @param {Number} limit Ограничение количества перезагружаемых элементов.
         */
        reload: function (filter, sorting, offset, limit) {
            this._options.selectedIndex = null;

            Suggest.superclass.reload.apply(this, arguments);
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
