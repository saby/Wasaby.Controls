/**
 * Класс контрола "Редактор колонок"
 *
 * Редактор позволяет дать пользователю возможность выбрать необходимые ему колонки для отображения табличных данных, при операциях экспорта данных,
 * а также в других случаях. Редактор открывается методом {@link open} и возвращает обещание, которое будет разрешено после завершения редактирования
 * пользователем. В случае, если пользователь после редактирования нажал кнопку применения результата редактирования, то обещание будет разрешено
 * новыми параметрами конфигурации колонок. Если же пользователь просто закрыл редактор кнопкой "Закрыть", то обещание будет разрешено значением null.
 * Следует иметь ввиду, что в возвращённом списке выбранных пользователем колонок присутствуют все колонки, в том числе и те, что были помечены как
 * фиксированные(обязательные) в исходных данных.
 *
 * @example
 * Простой пример использования команды браузера "showColumnsEditor" для открытия редактора колонок:
 * <pre>
 *    this.sendCommand('showColumnsEditor', {
 *          editorOptions: {
 *             moveColumns:true
 *          }
 *       })
 *    .addCallbacks(
 *       function (columnsConfig) {
 *             // Если есть результат редактирования (то есть пользователь отредактировал колонки и нажал кнопку применить, а не закрыл редактор крестом)
 *             if (columnsConfig) {
 *                // Получена новая конфигурация колонок - сделать с нею то, что требуется
 *                var columns = columnsConfig.columns;
 *                var selected = columnsConfig.selectedColumns;
 *                ...
 *             }
 *          },
 *       function (err) {
 *             // Обработать ошибку
 *          }
 *    );
 * </pre>
 *
 * @example
 * Существует возможность использования предустановленных наборов колонок (пресетов). Для этого служат опции usePresets, staticPresets,
 * presetNamespace и selectedPresetId. При наличии статичечских пресетов пользователь может клонировать любой из них и сохранить его как
 * собственный. Простой пример использования:
 * <pre>
 *    require(['SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit'], function (PresetUnit) {
 *       var promise = this.sendCommand('showColumnsEditor', {
 *          editorOptions: {
 *             // Будем использовать предустановленные наборы колонок:
 *             usePresets: true,
 *             // Определим статически-заданные пресеты:
 *             staticPresets: [
 *                new PresetUnit({
 *                   id: 'preset-1',
 *                   title: 'Статический пресет 1',
 *                   selectedColumns: ['Номенклатура.НомНомер', 'ИНН/КПП']
 *                }), new PresetUnit({
 *                   id: 'preset-2',
 *                   title: 'Статический пресет 2',
 *                   selectedColumns: ['Номенклатура.НомНомер', 'ИНН/КПП']
 *                }), new PresetUnit({
 *                   id: 'preset-3',
 *                   title: 'Статический пресет 3',
 *                   selectedColumns: ['Номенклатура.НомНомер', 'ИНН/КПП']
 *                })
 *             ],
 *             // Пользователь будет сохранять свои пресеты в это пространство имён:
 *             presetNamespace: 'catalog-columns-presets',
 *             // Первоначально будет выбран пресет с таким идентификатором (опционально):
 *             selectedPresetId: 'preset-2',
 *             ...
 *             другие опции
 *             ...
 *          }
 *       })
 *    });
 * </pre>
 *
 * @see SBIS3.CONTROLS/Browser#showColumnsEditor
 * @see SBIS3.CONTROLS/Browser#_showColumnsEditor
 * @see SBIS3.CONTROLS/Browser#columnsConfig
 * @see SBIS3.CONTROLS/Browser#setColumnsConfig
 * @see SBIS3.CONTROLS/Browser#getColumnsConfig
 * @see SBIS3.CONTROLS/Browser#ColumnsConfigObject
 * @see SBIS3.CONTROLS/OperationsPanel/Print/PrintUnloadBase#_gatherColumnsInfo
 * @see SBIS3.CONTROLS/OperationsPanel/Print/PrintUnloadBase#useColumnsEditor
 *
 * @demo Examples/ColumnsEditor/BrowserAndEditorButton/BrowserAndEditorButton Пример браузера с кнопкой редактора колонок
 * @demo Examples/ColumnsEditor/BrowserAndCustomButton/BrowserAndCustomButton Пример браузера с собственной кнопкой, открывающией редактор колонок
 * @demo Examples/ColumnsEditor/AllCustom/AllCustom Пример с одиночной кнопкой, открывающией редактор колонок (без браузера)
 *
 * @class SBIS3.CONTROLS/Browser/ColumnsEditor/Editor
 * @extends SBIS3.CONTROLS/CompoundControl
 * @author Спирин В.А.
 * @public
 */
define('SBIS3.CONTROLS/Browser/ColumnsEditor/Editor',
   [
      'Core/Deferred',
      'SBIS3.CONTROLS/CompoundControl',
      'Lib/Control/FloatArea/FloatArea',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/Area'
   ],

   function (Deferred, CompoundControl, FloatArea) {
      'use strict';

      var Editor = CompoundControl.extend([], /**@lends SBIS3.CONTROLS/Browser/ColumnsEditor/Editor.prototype*/ {
         /**
          * @typedef {Object} ColumnsConfigObject
          * @property {WS.Data/Collection/RecordSet} columns Набор записей, каждая из которых описывает элемент панели редактирования колонок. <br/>
          * Поля записи:
          * <ol>
          *    <li><b>id (String)</b> - идентификатор элемента.</li>
          *    <li><b>title (String)</b> - отображаемый текст элемента.</li>
          *    <li><b>fixed (Boolean)</b> - признак "Фиксированный". На панели редактирования колонок элементы с таким признаком выбраны и недоступны для взаимодействия, а колонки элемента, описанные в опции **columnConfig**, всегда отображены в списке.</li>
          *    <li><b>group (string|number)</b> - идентификатор группы колонок, в которую входит данная колонка (если определён)</li>
          *    <li><b>columnConfig (object)</b> - объект с конфигурацией данныой колонки (см. {@link SBIS3.CONTROLS/DataGridVie#columns columns}).</li>
          * </ol>
          * @property {Array.<String|Number>} selectedColumns Список идентификаторов колонок, которые будут отмечены на панели редактирования колонок. Параметр актуален для элементов с опцией *fixed=false*.
          * @property {object} [groupTitles] Ассоциированый массив имён групп по их идентификаторам (используется редактором колонок) (опционально)
          * @property {boolean} [usePresets] Разрешает использовать пресеты (используется редактором колонок) (опционально)
          * @property {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit[]} [staticPresets] Список объектов статически задаваемых пресетов (используется редактором колонок) (опционально)
          * @property {string} [presetNamespace] Пространство имён для сохранения пользовательских пресетов (используется редактором колонок) (опционально)
          * @property {string|number} [selectedPresetId] Идентификатор первоначально выбранного пресета в дропдауне (используется редактором колонок) (опционально)
          * @property {string} [newPresetTitle] Начальное название нового пользовательского пресета (используется редактором колонок) (опционально)
          * @property {boolean} [useOriginPresetTitle] При клонировании новых пользовательских пресетов строить название из исходного с добавлением следующего порядкового номера (используется редактором колонок) (опционально)
          * @see SBIS3.CONTROLS/Browser#columnsConfig
          * @see SBIS3.CONTROLS/Browser#setColumnsConfig
          * @see SBIS3.CONTROLS/Browser#getColumnsConfig
          * @see SBIS3.CONTROLS/Browser#showColumnsEditor
          * @see SBIS3.CONTROLS/Browser#_showColumnsEditor
          * @see open
          */
         //_dotTplFn: null,
         $protected: {
            _options: {
               moveColumns: true,
               preserveOrder: false,
               usePresets: false,
               newPresetTitle: rk('Новый шаблон', 'РедакторКолонок'),
               useOriginPresetTitle: true
            },
            _result: null
         },

         /*$constructor: function () {
            this._publish('onOpen', 'onComplete');
         },*/

         /**
          * Открыть редактор колонок. Возвращает обещание, которое будет разрешено после завершения редактирования пользователем. В случае, если
          * пользователь после редактирования нажал кнопку применения результата редактирования, то обещание будет разрешено новыми параметрами
          * конфигурации колонок. Если же пользователь просто закрыл редактор кнопкой "Закрыть", то обещание будет разрешено значением null. Следует
          * иметь ввиду, что в возвращённом списке выбранных пользователем колонок присутствуют все колонки, в том числе и те, что были помечены как
          * фиксированные(обязательные) в исходных данных.
          *
          * @example
          * Существует возможность использования предустановленных наборов колонок (пресетов). Для этого служат опции usePresets, staticPresets,
          * presetNamespace и selectedPresetId. При наличии статичечских пресетов пользователь может клонировать любой из них и сохранить его как
          * собственный. Простой пример использования:
          * <pre>
          *    require(['SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit'], function (PresetUnit) {
          *       var promise = this.sendCommand('showColumnsEditor', {
          *          editorOptions: {
          *             // Будем использовать предустановленные наборы колонок:
          *             usePresets: true,
          *             // Определим статически-заданные пресеты:
          *             staticPresets: [
          *                new PresetUnit({
          *                   id: 'preset-1',
          *                   title: 'Статический пресет 1',
          *                   selectedColumns: ['Номенклатура.НомНомер', 'ИНН/КПП']
          *                }), new PresetUnit({
          *                   id: 'preset-2',
          *                   title: 'Статический пресет 2',
          *                   selectedColumns: ['Номенклатура.НомНомер', 'ИНН/КПП']
          *                }), new PresetUnit({
          *                   id: 'preset-3',
          *                   title: 'Статический пресет 3',
          *                   selectedColumns: ['Номенклатура.НомНомер', 'ИНН/КПП']
          *                })
          *             ],
          *             // Пользователь будет сохранять свои пресеты в это пространство имён:
          *             presetNamespace: 'catalog-columns-presets',
          *             // Первоначально будет выбран пресет с таким идентификатором (опционально):
          *             selectedPresetId: 'preset-2',
          *             ...
          *             другие опции
          *             ...
          *          }
          *       })
          *    });
          * </pre>
          *
          * @public
          * @param {object} columnsConfig Параметры конфигурации колонок
          * @param {object} [editorOptions] Дополнительные опции редактора, отличающиеся или не содержащиеся в columnsConfig. Имеют приоритет перед опциями из columnsConfig (опционально)
          * @param {string} [editorOptions.title] Заголовок редактора колонок (опционально)
          * @param {string} [editorOptions.applyButtonTitle] Название кнопки применения результата редактирования (опционально)
          * @param {string} [editorOptions.groupTitleTpl] Шаблон имён групп (опционально)
          * @param {object} [editorOptions.groupTitles] Ассоциированый массив имён групп по их идентификаторам (опционально)
          * @param {boolean} [editorOptions.usePresets] Разрешает использовать пресеты (опционально)
          * @param {string} [editorOptions.presetsTitle] Заголовок дропдауна пресетов (опционально)
          * @param {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit[]} [editorOptions.staticPresets] Список объектов статически задаваемых пресетов (опционально)
          * @param {string} [editorOptions.presetNamespace] Пространство имён для сохранения пользовательских пресетов (опционально)
          * @param {string|number} [editorOptions.selectedPresetId] Идентификатор первоначально выбранного пресета в дропдауне (опционально)
          * @param {string} [editorOptions.newPresetTitle] Начальное название нового пользовательского пресета (опционально)
          * @param {boolean} [editorOptions.useOriginPresetTitle] При клонировании новых пользовательских пресетов строить название из исходного с добавлением следующего порядкового номера (опционально)
          * @param {boolean} [editorOptions.moveColumns] Указывает на необходимость включить перемещнение пользователем пунктов списка колонок (опционально)
          * @param {boolean} [editorOptions.preserveOrder] Указывает на необходимость сохранять порядок следования колонок таким, каким он был передан в опции columnsConfig. В отстутствии этой опции выбранные колонки будут подняты вверх, не выбранные - уйдут вниз. Опция действует только при выключенном перемещнении пользователем пунктов списка колонок (moveolumns==false) (опционально)
          * @return {Deferred<object>}
          *
          * @see SBIS3.CONTROLS/Browser#showColumnsEditor
          * @see SBIS3.CONTROLS/Browser#_showColumnsEditor
          * @see SBIS3.CONTROLS/Browser#columnsConfig
          * @see SBIS3.CONTROLS/Browser#setColumnsConfig
          * @see SBIS3.CONTROLS/Browser#getColumnsConfig
          * @see SBIS3.CONTROLS/Browser#ColumnsConfigObject
          * @see SBIS3.CONTROLS/OperationsPanel/Print/PrintUnloadBase#_gatherColumnsInfo
          * @see SBIS3.CONTROLS/OperationsPanel/Print/PrintUnloadBase#useColumnsEditor
          *
          * @demo Examples/ColumnsEditor/BrowserAndEditorButton/BrowserAndEditorButton Пример браузера с кнопкой редактора колонок
          * @demo Examples/ColumnsEditor/BrowserAndEditorButtonWithPresets/BrowserAndEditorButtonWithPresets Пример браузера с кнопкой редактора колонок, с пресетами и группами колонок
          * @demo Examples/ColumnsEditor/BrowserAndCustomButton/BrowserAndCustomButton Пример браузера с собственной кнопкой, открывающией редактор колонок
          * @demo Examples/ColumnsEditor/AllCustom/AllCustom Пример с одиночной кнопкой, открывающией редактор колонок (без браузера)
          */
         open: function (columnsConfig, editorOptions) {
            if (this._result) {
               return Deferred.fail('Allready open');
            }
            var defaults = this._options;
            var hasEditorOptions = !!editorOptions && !!Object.keys(editorOptions).length;
            var allSources = hasEditorOptions ? [editorOptions, columnsConfig, defaults] : [columnsConfig, defaults];
            var edColfSources = hasEditorOptions ? [editorOptions, columnsConfig] : [columnsConfig];
            var edDefSources = hasEditorOptions ? [editorOptions, defaults] : [defaults];
            // TODO NEW FLOATAREA. Нужно action
            this._areaContainer = new FloatArea({
               opener: columnsConfig.opener || this,
               direction: 'left',
               animation: 'slide',
               isStack: true,
               autoCloseOnHide: true,

               //title: null,
               parent: this,
               template: 'SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/Area',
               className: 'ws-float-area__block-layout controls-Browser-ColumnsEditor-Editor__area',
               width: hasEditorOptions && 0 < editorOptions.width ? editorOptions.width : undefined,
               keepSize: !hasEditorOptions || !(0 < editorOptions.width),
               closeByExternalClick: true,
               closeButton: true,
               crossStyle: 'light',
               componentOptions: {
                  title: hasEditorOptions ? editorOptions.title : undefined,
                  applyButtonTitle: hasEditorOptions ? editorOptions.applyButtonTitle : undefined,
                  columns: columnsConfig.columns,
                  selectedColumns: columnsConfig.selectedColumns,
                  groupTitleTpl: _selectValue('groupTitleTpl', edColfSources),
                  groupTitles: _selectValue('groupTitles', edColfSources),
                  usePresets: _selectValue('usePresets', allSources, 'boolean'),
                  presetsTitle: _selectValue('presetsTitle', edColfSources),
                  staticPresets: _selectValue('staticPresets', edColfSources),
                  presetNamespace: _selectValue('presetNamespace', edColfSources),
                  selectedPresetId: _selectValue('selectedPresetId', edColfSources),
                  newPresetTitle: _selectValue('newPresetTitle', allSources),
                  useOriginPresetTitle: _selectValue('useOriginPresetTitle', allSources, 'boolean'),
                  moveColumns: _selectValue('moveColumns', edDefSources, 'boolean'),
                  preserveOrder: _selectValue('preserveOrder', edDefSources, 'boolean'),
                  multiselect: _selectValue('multiselect', edDefSources, 'boolean', true),
                  autoApply: _selectValue('autoApply', edDefSources, 'boolean'),
                  handlers: {
                     onComplete: this._onAreaComplete.bind(this)
                  }
               },
               handlers: {
                  onClose: this._onAreaClose.bind(this)
               }
            });
            this._notify('onSizeChange');
            this.subscribeOnceTo(this._areaContainer, 'onAfterClose', this._notify.bind(this, 'onSizeChange'));
            //this._notify('onOpen');
            return this._result = new Deferred();
         },

         _onAreaComplete: function (evtName, columns, selectedColumns) {
            var result = this._result;
            this._result = null;
            this._areaContainer.close();
            var resultColumns = selectedColumns.reduce(function (resultColumns, columnId) {
               var column = columns.getRecordById(columnId).get('columnConfig');
               if (Array.isArray(column)) {
                  resultColumns.push.apply(resultColumns, column);
               }
               else {
                  resultColumns.push(column);
               }
               return resultColumns;
            }, []);
            result.callback({
               columns: columns,
               selectedColumns: selectedColumns,
               resultColumns: resultColumns
            });
            //this._notify('onComplete');
         },

         _onAreaClose: function () {
            if (this._areaContainer) {
               this._areaContainer.destroy();
               this._areaContainer = null;
            }
            if (this._result) {
               this._result.callback(null);
               this._result = null;
            }
         }
      });



      // Приватные свойства

      var _selectValue = function (name, sources, type, defaultValue) {
         var noType = !type;
         for (var i = 0; i < sources.length; i++) {
            var src = sources[i];
            if (name in src) {
               var value = src[name];
               if (noType || typeof value === type) {
                  return value;
               }
            }
         }
         return defaultValue;
      };



      return Editor;
   }
);
