/**
 * Created by ia.solovev on 05.08.2015.
 */
define('js!SBIS3.ENGINE.RecordsMarkPlugin', ["js!SBIS3.CORE.DataViewAbstract"], function(DataViewAbstract){
    /**
     * Плагин для пометки записей.
     * Предоставляет возможность выделения строк цветом и добавления пользовательских пометок.
     * @class   $ws.proto.DataViewAbstract.RecordsMarkPlugin
     * @extends $ws.proto.DataViewAbstract
     * @plugin
     * @public
     * @author Соловьев Иван
     */

    var BOLD = 0x8000000,
       ITALIC = 0x4000000,
       UNDERLINE = 0x2000000,
       STRIKE = 0x1000000,
       specs = {},
       definedColors = [ '#000000', '#EF463A', '#72BE44', '#0055BB', '#A426D9', '#999999'],
       definedColorsName = [ 'Черный', 'Красный', 'Зеленый', 'Синий', 'Фиолетовый', 'Серый', 'Жирный', 'Курсив', 'Подчеркнутый', 'Перечеркнутый'];

    /**
     * Добавляет слева нулей до 3 байт в хексе
     * @param {String} s
     * @returns {string}
     */
    function lPad3b(s) {
        var pad = '000000';
        return pad.substr(0, 6 - s.length) + s;
    }

    /**
     * Нормализует спецификацию расцветки. Если передано в виде строки - разбирает в число
     *
     * @param {String|Number|Object} spec
     * @returns {Number}
     */
    function specToNumber(spec) {
        if(!spec) {
            return 0;
        } else if(typeof spec == 'string') {
            spec = Number(spec);
            if(isNaN(spec)) {
                spec = 0;
            }
        } else if(typeof spec == 'object') {
            var rSpec = Number((spec.color || '0').replace('#', '0x'));
            rSpec |= spec.isBold ? BOLD : 0;
            rSpec |= spec.isItalic ? ITALIC : 0;
            rSpec |= spec.isUnderline ? UNDERLINE : 0;
            rSpec |= spec.isStrike ? STRIKE : 0;

            return rSpec;
        }
        return spec;
    }

    /**
     * Превращает спецификацию в объект
     * @param {String|Number|Object} spec
     * @returns {{color: string, isBold: boolean, isItalic: boolean, isUnderline: boolean, isStrike: boolean}}
     */
    function specToObject(spec) {
        spec = specToNumber(spec);
        return {
            color: '#' + lPad3b((spec & 0xFFFFFF).toString(16)).toUpperCase(),
            isBold: !!(spec & BOLD),
            isItalic: !!(spec & ITALIC),
            isUnderline: !!(spec & UNDERLINE),
            isStrike: !!(spec & STRIKE)
        };
    }

    /**
     * Превращает спецификацию расцветки в CSS-поравило
     *
     * @param spec
     * @returns {String}
     */
    function specToStyle(spec) {

        var
           oSpec = specToObject(spec),
           rules;

        rules = [
            'color: ' + oSpec.color + ' !important'
        ];
        if(oSpec.isBold) {
            rules.push('font-weight: bold !important');
        }
        else{
            rules.push('font-weight: normal !important');
        }
        if(oSpec.isItalic) {
            rules.push('font-style: italic !important');
        }
        else{
            rules.push('font-style: normal !important');
        }
        if(oSpec.isUnderline || oSpec.isStrike) {
            rules.push('text-decoration: ' + [ oSpec.isUnderline ? 'underline' : '', oSpec.isStrike ? 'line-through' : '' ].join(' ') + ' !important');
        }
        else{
            rules.push('text-decoration: none !important');
        }

        return '.ws-colorize-' + spec + '{' + rules.join(';') + '}';

    }

    /**
     * Добавляет стиль по переданной спецификации в документ, возвращает имя класса
     *
     * @param {String|Number|Object} spec
     * @param {Boolean} [noinsert = false]
     * @returns {String} Имя класса для данной спецификации
     */
    function appendSpec(spec) {
        spec = specToNumber(spec);
        if(!isNaN(spec)) {
            var specClassName = 'ws-colorize-' + spec;
            if(!specs[specClassName]) {
                specs[specClassName] = specToStyle(spec);
                $ws.helpers.insertCss(specs[specClassName]);
            }
            return specClassName;
        } else {
            return '';
        }
    }

    function hasSpec(spec) {
        spec = specToNumber(spec);
        if(!isNaN(spec)) {
            var specClassName = 'ws-colorize-' + spec;
            if(specs[specClassName]) {
                return specClassName;
            }
            else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Добавляет класс к переданному элементу, кодировка берется из record
     *
     * @param {Record} record
     * @param {JQuery object} element
     */
    function colorizeElement(record, element){
        var
           currentSpecClassName = element.data('current-colorize-class'),
           spec = specToNumber(record.get('Code')),
           className = appendSpec(spec);
        element.data({
            'current-colorize-spec': spec,
            'current-colorize-class': className
        });
        if(currentSpecClassName) {
            element.removeClass(currentSpecClassName);
        }
        element.addClass(className);
    }

    /**
     * Функция открытия диалога выбора пометки из памели массовых операций
     *
     * @param {Record} record
     * @param {JQuery object} element
     */
    function openFromPMO(records){
        var
           row = this.getContainer(),
           pos = row.offset(),
           existMarkedRecords = false,
           opener = this.getCurrentView(),
           options = opener.getRecordsMarkOptions();
        $ws.helpers.forEach(records, function(record){
            if (record.hasColumn('ColorMark') && record.get('ColorMark')) {existMarkedRecords = true;}
        });
        $ws.core.attachInstance('Control/Area:Dialog', {
            opener: opener,
            template: 'js!SBIS3.ENGINE.RecordsMarkPlugin.DialogSelector',
            top: pos.top,
            left: pos.left + 200,
            componentOptions: {
                massOperation: true,
                existMarkedRecords: existMarkedRecords,
                records: records,
                handlers: {
                    onApply: function (event, colorLink) {
                       if(opener._notify('onBeforeApplyMark', records, colorLink, this) === false) {
                          return;
                       }

                        $ws.single.Indicator.show();
                        var
                           flag = opener._options.reloadAfterChange,
                           parallelDeferred = new $ws.proto.ParallelDeferred();

                        if (flag) {
                            opener._options.reloadAfterChange = false;
                        }

                        $ws.helpers.forEach(records, function(record){
                            parallelDeferred.push(
                               opener._readRecord(record.getKey()).addCallback(function (result) {
                                   result.set(options.colorMarkLinkName, colorLink);
                                   return opener.getRecordSet().updateRecord(result, [false]);
                               })
                            )
                        });

                        parallelDeferred.done().getResult().addCallback(function(){
                            opener._options.reloadAfterChange = flag;
                            opener.reload();
                            $ws.single.Indicator.hide();
                        });
                    }
                }
            }
        });
    }
    DataViewAbstract.extendPlugin(/** @lends $ws.proto.DataViewAbstract.RecordsMarkPlugin.prototype */{
        $protected: {
            _options: {
               /**
                * @typedef {Object} UserMarks
                * @property {String} titleApply Текст опции в случае, если опция ещё не применена.
                * @property {String} iconApply Иконка опции в случае, если опция ещё не применена.
                * @property {String} titleReset Текст опции в случае, если опция уже применена.
                * @property {String} iconReset Иконка опции в случае, если опция уже применена.
                * @property {Function} stateHandler Функция, которая должна возвращать состояние опции.
                * Возможные значения:
                * <ul>
                *    <li>true - опция не применена, рисуем titleApply и iconApply;</li>
                *    <li>false - опция применена, рисуем titleReset и iconReset;</li>
                *    <li>если функция вернула не false, то считаем, что опция не применена.</li>
                * </ul>
                * @property {Function} setHandler Функция применения опции, возвращает:
                * <ul>
                *    <li>record - запись, к которой применяется опция;</li>
                *    <li>флаг состояния (true - опция применяется, false - опция сбрасывается).</li>
                * </ul>
                * @editor iconApply ImageEditor
                * @editor iconReset ImageEditor
                */
               /**
                * @typedef {Object} RecordsMark
                * @property {Boolean} [visible=false] Видимость опции.
                * @property {String} [colorMarkLineName="ColorMark"] Имя поля, хранящее пометку цветом ( связь с таблицей "ColorMark").
                * Поле должно содержаться в формате метода, определяющего формат записи при чтении.
                * @property {String} object Название объекта, идентифицирующее набор пометок для текущего браузера.
                * @property {Boolean} [isMainOption=false] Отображать ли кнопку на строке или только в выпадающем меню.
                * @property {String} [icon="sprite:icon-16 icon-Unfavourite icon-primary"] Иконка для кнопки в браузере.
                * @property {String} [title="Пометить"] Подсказка для кнопки в браузере.
                * @property {UserMarks[]} userMarks Массив пользовательских пометок.
                * Пример задания опции:
                * <pre class="brush:xml">
                *    <options name="userMarks" type="array">
                *       <options>
                *            <option name="titleApply">Добавить в избранное</option>
                *            <option name="iconApply">sprite:icon-24 icon-Unfavourite icon-disabled</option>
                *            <option name="titleReset">Убрать из избранного</option>
                *            <option name="iconReset">sprite:icon-24 icon-ThumbUp2 icon-disabled</option>
                *            <option name="stateHandler" type="function">js!SBIS3.Staff.HierarchyListEmployeesHdl:function1</option>
                *            <option name="setHandler" type="function">js!SBIS3.Staff.HierarchyListEmployeesHdl:function2</option>
                *        </options>
                *     </options>
                * </pre>
                * @property {String} renderClasses Класс элемента в пользовательском рендере, к которому будет применена пометка цветом.
                * @property {String} defaultColorClass Класс для строки "Цвет и шрифт по умолчанию".
                * @editor icon ImageEditor
                */
               /**
                * @cfg {RecordsMark} Объект с настройками пометки записей
                * @see getRecordsMarkOptions
                */
                recordsMark: {
                    visible: false,
                    colorMarkLinkName: 'ColorMark',
                    object: '',
                    isMainOption: false,
                    icon: 'sprite:icon-16 icon-Unfavourite icon-primary',
                    title: 'Пометить',
                    userMarks: [],
                    renderClasses: '',
                    defaultColorClass: ''
                }
            }
        },
        $condition: function () {
            return this._options.recordsMark && this._options.recordsMark.visible;
        },
        $constructor: function () {
            var
               self = this,
               options = this.getRecordsMarkOptions();
            if (this._options.recordsMark && this._options.recordsMark.visible) {
                this._publish(
                    'onBeforeAppendUserMarks',
                    'onBeforeApplyMark',
                    'onBeforeEditMark'
                );
                this._convertClasses(options.renderClasses, options);
                this._wrapRowRenderColor();
                // Помечать записи могут те, у кого есть права на запись браузера
                if (this.isEnabled() && !this.isReadOnly()) {
                    // Добавляем пометку записей в опции строки
                    this.addRowOption({
                        title: options.title,
                        icon: options.icon,
                        name: 'RecordsMark',
                        callback: function (record, row) {
                            var pos = row.offset();
                            $ws.core.attachInstance('Control/Area:Dialog', {
                                opener: self,
                                template: 'js!SBIS3.ENGINE.RecordsMarkPlugin.DialogSelector',
                                top: pos.top + 20,
                                left: pos.left + row.width() - 300,
                                componentOptions: {
                                    handlers: {
                                        onApply: function (event, colorLink) {
                              
                                            //Можно переопределить поведение, при выделении записи
                                            /*ToDo this - это диалог выбора, он используется для получения класса
                                               пока нет метода получения по colorLink*/
                                            if( self._notify('onBeforeApplyMark', [record], colorLink, this) === false ) {
                                                return;
                                            }
                              
                                            $ws.single.Indicator.show();
                                            self._readRecord(record.getKey()).addCallback(function (result) {
                                                result.set(options.colorMarkLinkName, colorLink);
                                                self.getRecordSet().updateRecord(result).addCallback(function(){
                                                    $ws.single.Indicator.hide();
                                                }).addErrback(function(){
                                                    $ws.single.Indicator.hide();
                                                    $ws.core.alert('Ошибка записи.', '', "error");
                                                });
                                            }).addErrback(function(){
                                                $ws.single.Indicator.hide();
                                                $ws.core.alert('Ошибка чтения.', '', "error");
                                            });
                                        }
                                    }
                                }
                            });
                        },
                        isMainOption: options.isMainOption,
                        weight: 0
                    });
                }
            }
        },
       /**
        * Метод получения набора опций {@link recordsMark}.
        * @returns {*} Набор опций, заданных в {@link recordsMark}.
        * @see recordsMark
        */
        getRecordsMarkOptions: function () {
            return this._options.recordsMark;
        },

        _convertClasses: function(classes, options){
            options.massClasses = [];
            if (!classes){ return;}
            $ws.helpers.forEach(classes.split(','), function(oneClass){
                if (oneClass) {options.massClasses.push(oneClass);}
            });
        },
        /**
         * Расцвечивает строку.
         * Убирает старую расцветку, ставит новую
         *
         * @param {jQuery} row строка таблицы
         * @param spec описание расцветки
         * @param {String} className имя класса который надо повесить на строку
         * @private
         */
        _colorizeNew: function(row, spec, className) {
            var
               self = this,
               currentSpecClassName = row.data('current-colorize-class'),
               options = this.getRecordsMarkOptions(),
               classes = options.massClasses;
            row.data({
                'current-colorize-spec': spec,
                'current-colorize-class': className
            });
            $ws.helpers.forEach(classes, function(oneClass){
                var cell = row.find('.'+oneClass);
                if(currentSpecClassName) {
                    cell.removeClass(currentSpecClassName);
                }
                cell.addClass(className);
            });
        },
        /**
         * Применяте на строку стиль по спецификации
         *
         * @param {$ws.proto.Record} record Запись, по которой нарисована строка
         * @param {jQuery} tr Строка
         * @private
         */
        _rowRenderColorizeNew: function(record, tr) {
            if(record.hasColumn('ColorMarkCode') && (record.get('ColorMarkCode') || (record.get('ColorMarkCode') === 0))) {
                var spec = specToNumber(record.get('ColorMarkCode'));
                this._colorizeNew(tr, spec, appendSpec(spec));
            }
        },
        /**
         * Оборачивает имеющуюся функцию рендеринга строки для применения расцветки к каждой отрисованной строке
         *
         * @private
         */
        _wrapRowRenderColor: function() {
            var self = this;
            if(!this._options.display.rowRender) {
                this._options.display.rowRender = this._rowRenderColorizeNew.bind(this);
            } else {
                (function(original) {
                    self._options.display.rowRender = function(record, tr) {
                        original.apply(self, arguments);
                        self._rowRenderColorizeNew(record, tr);
                    };
                })(this._options.display.rowRender);
            }
        },
       /**
        * Установка рендера строки
        * @deprecated Метод будет удалён в 3.7.3.100
        */
        setRowRender: function() {
            this._wrapRowRenderColor();
        }
    });
    return {
        specToObject: specToObject,
        specToNumber: specToNumber,
        specToStyle: specToStyle,        
        appendSpec: appendSpec,
        colorizeElement: colorizeElement,
        openFromPMO: openFromPMO,
        definedColors: definedColors,
        definedColorsName: definedColorsName
    }
});
