/**
 * Created with JetBrains PhpStorm.
 * User: aa.adilov
 * Date: 16.04.13
 * Time: 17:38
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.OperationsPanel',
      [
         'js!SBIS3.CORE.AreaAbstract',
         'js!SBIS3.CORE.LinkButton',
         'js!SBIS3.CORE.Menu',
         'html!SBIS3.CORE.OperationsPanel',
         'js!SBIS3.CORE.PrintPlugin',
         'css!SBIS3.CORE.OperationsPanel'
      ],
      function(AreaAbstract, Button, Menu, dotTplFn) {

   'use strict';

   $ws._const.OperationsPanel = {
       order: [
           'print',
           'save',
           'move',
           'merge',
           'sum',
           'delete'
       ],
       orderMark: [
           'selectCurrentPage',
           'removeSelection',
           'invertSelection',
           'showSelection'
       ],
       buttons: {
           'print': {
               img : 'sprite:icon-24 icon-Print icon-primary action-hover',
               tooltip: 'Распечатать',
               caption: 'Распечатать'
           },
           'save':{
               img: 'sprite:icon-24 icon-Save icon-primary action-hover',
               tooltip: 'Выгрузить',
               caption: 'Выгрузить'
           },
           'mass':{
               'delete': {
                   tooltip: 'Удалить все',
                   img: 'sprite:icon-24 action-hover icon-Erase icon-error'
               },
               'allRecords': {
                   caption: 'Все документы',
                   mainAction: 'print'
               },
               'list': {
                   caption: 'Список',
                   mainAction: 'print'
               },
               'sum' : {
                   tooltip: 'Просуммировать все',
                   img: 'sprite:icon-24 icon-Sum icon-primary action-hover'
               },
               'saveToPDF': {
                   caption: 'Список в PDF',
                   img: 'sprite:icon-24 icon-PDF2 icon-multicolor action-hover',
                   mainAction: 'save'
               },
               'saveToExcel': {
                   caption: 'Список в Excel',
                   img: 'sprite:icon-24 icon-Excel icon-multicolor action-hover',
                   mainAction: 'save'
               }
           },
           'selected':{
               'sum' : {
                   tooltip: 'Просуммировать отмеченные',
                   img: 'sprite:icon-24 icon-Sum icon-primary action-hover'
               },
               'merge' : {
                   tooltip: 'Объединить отмеченные',
                   caption: 'Объединить',
                   img: ''
               },
               'move' : {
                   tooltip: 'Переместить отмеченные',
                   caption: 'Перенести',
                   img: 'sprite:icon-24 icon-Move icon-primary action-hover'
               },
               'delete': {
                   tooltip: 'Удалить отмеченные',
                   img: 'sprite:icon-24 icon-Erase action-hover icon-error'
               },
               'allRecords': {
                   caption: 'Отмеченные',
                   mainAction: 'print'
               },
               'list': {
                   caption: 'Список отмеченных',
                   mainAction: 'print'
               },
               'saveToPDF': {
                   caption: 'Список отмеченных в PDF',
                   img: 'sprite:icon-24 icon-PDF2 icon-multicolor action-hover',
                   mainAction: 'save'
               },
               'saveToExcel': {
                   caption: 'Список отмеченных в Excel',
                   img: 'sprite:icon-24 icon-Excel icon-multicolor action-hover',
                   mainAction: 'save'
               },
               'mark': {
                   'selectCurrentPage': {
                       caption: 'Всю страницу'
                   },
                   'removeSelection': {
                       caption: 'Снять'
                   },
                   'invertSelection': {
                       caption: 'Инвертировать'
                   },
                   'showSelection': {
                       caption: 'Выбрать отмеченные'
                   }
               }
           }
       }
   };

   var PREFIX_NAME = 'ws-OperationsPanel-';

   /**
    * Панель массовых операций
    *
    * Данный компонент позволяет наиболее удобно работать пользователям приложения со всем реестром и несколькими
    * записями. Создание новых механизмов позволяет уменьшить время обработки операций с несколькими записями.
    * Панель операций поддерживает два режима работы:
    * <ol>
    *    <li>массовые операции над всем реестром.<li>
    *    <li>операции над отмеченными записями.</li>
    * <ol>
    * Доступны следующие стандартные операции:
    * <ol>
    *    <li>удаление записей;</li>
    *    <li>печать записей;</li>
    *    <li>сохранение записей в excel или pdf;</li>
    *    <li>суммирование записей;</li>
    *    <li>объединение записей;</li>
    *    <li>перемещение записей.</li>
    * </ol>
    *
    * А также:
    * <ol>
    *    <li>отметить всю страницу;</li>
    *    <li>снять отметку;</li>
    *    <li>инвертирование отметки;</li>
    *    <li>выбрать отмеченные.</li>
    * </ol>
    *
    * @class $ws.proto.OperationsPanel
    * @extends $ws.proto.AreaAbstract
    * @control
    */
   $ws.proto.OperationsPanel = AreaAbstract.extend(/** @lends $ws.proto.OperationsPanel.prototype */{
      /**
       * @event onBeforeShow Перед открытием панели
       * Событие происходит после нажатия на кнопку вызова панели массовых операций.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * Изменить видимость кнопок массовых операций в зависимости от фильтра.
       * Фильтр применён к связанному представлению данных (tableView).
       * <pre>
       *    panel.subscribe('onBeforeShow', function() {
       *       var linkedView = this.getCurrentView();
       *       if (linkedView && linkedView.getQuery()['ФильтрУдаленные']) {
       *          this.getChildControlByName('btnRestoreDocs').show();
       *          this.getChildControlByName('btnEraseDocs').show();
       *          this.getChildControlByName('btnDeleteDocs').hide();
       *       } else {
       *          this.getChildControlByName('btnRestoreDocs').hide();
       *          this.getChildControlByName('btnEraseDocs').hide();
       *          this.getChildControlByName('btnDeleteDocs').show();
       *       }
       *    });
       * </pre>
       * @see onAfterShow
       * @see onBeforeClose
       * @see onAfterClose
       */
      /**
       * @event onAfterShow После открытия панели
       * Событие происходит после открытия панели массовых операций.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * Закрывать панель массовых операций по истечении 3 минут.
       * <pre>
       *    panel.subscribe('onAfterShow', function() {
       *       setTimeout(this.close(), 18000);
       *    });
       * </pre>
       * @see onBeforeShow
       * @see onBeforeClose
       * @see onAfterClose
       */
      /**
       * @event onAfterClose После закрытия панели
       * Событие происходит после закрытия панели массовых операций.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * Открывать панель массовых операций по истечении 3 минут.
       * <pre>
       *    panel.subscribe('onAfterClose', function() {
       *       setTimeout(this.open(), 18000);
       *    });
       * </pre>
       * @see onBeforeClose
       * @see onBeforeShow
       * @see onAfterShow
       */
      /**
       * @event onBeforeClose Перед закрытием панели
       * Событие происходит после нажатия на кнопку скрытия панели массовых операций.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * Открывать панель массовых операций по истечении 3 минут.
       * <pre>
       *    panel.subscribe('onBeforeClose', function() {
       *       setTimeout(this.open(), 18000);
       *    });
       * </pre>
       * @see onAfterClose
       * @see onBeforeShow
       * @see onAfterShow
       */
      /**
       * @event onAfterLoad После установки связанного представления данных
       * Событие происходит после установки связанного предтавления данных (метод setLinkedView)
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      $protected : {
         _options : {
            /**
             * @cfg {String} Связанное представление данных
             * <wiTag group="Данные">
             * Передаётся в виде "ИмяКомпонентаСПредставлениемДанных/ИмяПредставленияДанных", если представление данных
             * находится не в том же компоненте, что и панель массовых операций. Если же оба контрола в одном компоненте, то в
             * виде "/ИмяПредставленияДанных".
             *
             * В качестве связанного представления данных могут выступать следующие контролы:
             * <ol>
             *    <li><a href='http://wi.sbis.ru/demo/TreeView'>дерево</a>;</li>
             *    <li><a href='http://wi.sbis.ru/demo/TableView'>табличное представление</a>;</li>
             *    <li><a href='http://wi.sbis.ru/demo/HierarchyView'>иерархическое представление</a>;</li>
             *    <li><a href='http://wi.sbis.ru/demo/CustomView'>произвольное представление</a>.</li>
             * </ol>
             * @example
             * <pre>
             *     <option name="browserId">js!SBIS3.DemoCode.ИмяКомпонентаСПредставлениемДанных/имяПредставленияДанных</option>
             * </pre>
             * @see setLinkedView
             * @see getCurrentView
             * @editor InternalComponentChooser
             */
            linkedView: '',
            /**
             * @typedef {Object} SaveButtons
             * @property {OperationElement} saveToPDF Сохранить в PDF
             * @property {OperationElement} saveToExcel Сохранить в Excel
             */
             /**
              * @typedef {Object} MenuForSave
              * @property {SaveButtons} menu Меню кнопок сохранения
              */
            /**
             * @typedef {Object} PrintButtons
             * @property {OperationElement} allRecords Все документы
             * @property {OperationElement} list Список
             */
             /**
              * @typedef {Object} MenuForPrint
              * @property {PrintButtons} menu Меню кнопок печати
              */
             /**
             * @typedef {Object} OperationElement
             * @property {String} caption Заголовок операции
             * @property {String} tooltip Текст всплывающей подсказки по наведении курсора
             * @property {String} img Путь к иконке кнопки. Стандартный размер иконки - 24x24px
             * @editor img ImageEditor
             * @editorConfig img spriteSize 24
             */
            /**
             * @typedef {Object} MassOperations
             * @property {MenuForPrint} print Распечатать, обладает выпадающим меню
             * @property {MenuForSave} save Сохранить, обладает выпадающим меню
             * @property {OperationElement} sum Просуммировать всё
             * @property {OperationElement} delete Удалить всё
             */
            /**
             * @cfg {MassOperations} Конфигурация кнопок массовых операций
             * <wiTag group="Данные">
             * Объект, описывающий кнопки массовых операций.
             * Порядок конфигурации кнопок массовых операций не важен.
             * Кнопки выводятся в следующей последовательности: print, save, sum, delete.
             * @example
             * 1. Структура кнопки "Сохранить в PDF".
             * <pre>
             *    'saveToPDF': {
             *       mainAction: 'save',
             *       caption: 'Список в PDF',
             *       img: 'sprite:icon-24 icon-PDF2 icon-multicolor action-hover'
             *    }
             * </pre>
             * 2. Добавить кнопки массовых операций. Их свойства не изменять, а использовать значения по умолчанию.
             * <pre>
             *    massOperations: {
             *       //добавляем кнопку печати
             *       'print': {
             *          //добавляем выпадающее меню
             *          menu: {
             *             //добавляем кнопку для предварительного просмотра перед печатью
             *             'list': {}
             *          }
             *       },
             *       //добавляем кнопку сохранения
             *       'save': {
             *         //добавляем выпадающее меню
             *          menu: {
             *             //добавляем кнопки сохранения данных в pdf и excel
             *             'saveToPDF': {},
             *             'saveToExcel': {}
             *          }
             *       },
             *       //добавляем кнопку удаления
             *       'delete': {}
             *    }
             * </pre>
             * 3. Добавить кнопки массовых операций. Для каждой кнопки изменить свойства.
             * <pre>
             *    massOperations: {
             *       //добавляем кнопку печати документа
             *       'print': {
             *          //добавляем выпадающее меню
             *          menu: {
             *             //добавляем кнопки выпадающего меню
             *             'list': {
             *                //добавляем текст всплывающей подсказки
             *                tooltip: 'Вывести список в окно предварительного просмотра',
             *                //меняем иконку
             *                img: 'sprite:myNewIcon-24'
             *             }
             *          }
             *       },
             *       'save': {
             *          menu: {
             *             'saveToPDF': {
             *                tooltip: 'Сохранить данные в PDF'
             *             },
             *             'saveToExcel': {
             *                tooltip: 'Сохранить данные в Excel'
             *             }
             *          }
             *       },
             *       'delete': {
             *          tooltip: 'Удалить все записи'
             *       }
             *    }
             * </pre>
             * @see linkedView
             * @see selectedOperations
             * @see markOperations
             * @see setMassOperations
             */
            massOperations: {},
            /**
             * @typedef {Object} SelectedOperations
             * @property {MenuForPrint} print Распечатать, обладает выпадающим меню
             * @property {MenuForSave} save Сохранить, обладает выпадающим меню
             * @property {OperationElement} move Переместить отмеченные
             * @property {OperationElement} merge Объединить отмеченные
             * @property {OperationElement} sum Просуммировать все
             * @property {OperationElement} delete Удалить все
             */
            /**
             * @cfg {SelectedOperations} Конфигурация кнопок операций над отмеченными записями
             * Объект, описывающий кнопки операций над отмеченными записями.
             * Используется в случае отсутствия возможности привязки связанного представления данных в Джинне.
             * Порядок конфигурации кнопок операций над отмеченными записями не важен.
             * Кнопки выводятся в следующей последовательности:
             * print, save, move, merge, sum, delete.
             * <wiTag group="Данные">
             * @example
             * 1. Структура кнопки "Сохранить в PDF".
             * <pre>
             *    'saveToPDF': {
             *       mainAction: 'save',
             *       caption: 'Список отмеченных в PDF',
             *       img: 'sprite:icon-24 icon-PDF2 icon-multicolor action-hover'
             *    }
             * </pre>
             * 2. Добавить кнопки операций над отмеченными записями. Их свойства не изменять, а использовать значения по умолчанию.
             * <pre>
             *    selectedOperations: {
             *       //добавляем кнопку сохранения
             *       'save': {
             *          menu: {
             *             //добавляем кнопку сохранения отмеченных в PDF
             *             'saveToPDF': {},
             *             //добавляем кнопку сохранения отмеченных в Excel
             *             'saveToExcel': {}
             *          }
             *       },
             *       //добавляем кнопку объединения отмеченных
             *       'merge': {},
             *       //добавляем кнопку перемещения отмеченных
             *       'move': {}
             *    }
             * </pre>
             * 3. Добавить кнопки операций над отмеченными записями. Для каждой кнопки изменить свойства.
             * <pre>
             *    selectedOperations: {
             *       //добавляем кнопку объединения отмеченных
             *       'merge': {
             *          caption: 'Объединить отмеченные записи'
             *       },
             *       //добавляем кнопку перемещения отмеченных
             *       'move': {
             *          tooltip: 'Переместить отмеченные записи',
             *          img: 'sprite:icon-24 icon-Bids icon-primary'
             *       }
             *    }
             * </pre>
             * @see linkedView
             * @see massOperations
             * @see markOperations
             * @see setSelectedOperations
             */
            selectedOperations: {},
            /**
             * @typedef {Object} CaptionOperation
             * @property {String} caption Заголовок пункта операций в отметке
             */
             /**
             * @typedef {Object} MarkOperations
             * @property {CaptionOperation} selectCurrentPage Всю страницу. Выбрать все записи на текущей странице представления данных
             * @property {CaptionOperation} removeSelection Снять. Снять выделение со всех записей представления данных
             * @property {CaptionOperation} invertSelection Инвертировать. Снять отметку с выбранных записей  и отметить оставшиеся
             * @property {CaptionOperation} showSelection Выбрать отмеченные. Показать только выбранные записи представления данных
             */
            /**
             * @cfg {MarkOperations} Конфигурация кнопок операций в отметке
             * При выборе хотя бы одной записи из связанного представления данных на панели массовых операций появляется дополнительная кнопка.
             * Она называется "Отметить" и обладает выпадающим меню.
             * Каждый пункт меню выполняет определённое действие (операцию), связанное с записями.
             * Например, выделить (выбрать) все записи из связанного представления данных.
             * По умолчанию все пункты обладают собственным заголовком (caption).
             * Порядок конфигурации пунктов операций в отметке не важен.
             * Пункты выводятся в следующей последовательности: selectCurrentPage, removeSelection, invertSelection, showSelection.
             * <wiTag group="Данные">
             * @example
             * 1. Структура пункта "Инвертировать".
             * <pre>
             *    'invertSelection': {
             *       caption: 'Инвертировать'
             *    }
             * </pre>
             * 2. Добавить кнопки операций в отметке. Их свойства не изменять, а использовать значения по умолчанию.
             * <pre>
             *    markOperations: {
             *       //добавляем кнопку снятия отметки со всех записей
             *       'removeSelection': {},
             *       //добавляем кнопку инвертирования выделения записей
             *       'invertSelection': {}
             *    }
             * </pre>
             * 3.Добавить кнопки операций в отметке. Для каждой кнопки изменить свойства.
             * <pre>
             *    markOperations: {
             *       //добавляем кнопку снятия отметки со всех записей
             *       'removeSelection': {
             *          caption: 'Снять отметку со всех записей'
             *       },
             *       //добавляем кнопку инвертирования выделения записей
             *       'invertSelection': {
             *          caption: 'Ивертировать выделение со всех записей'
             *       }
             *    }
             * </pre>
             * @see linkedView
             * @see massOperations
             * @see selectedOperations
             * @see setMarkOperations
             */
            markOperations: {},
             /**
              * @cfg {Object} Поля для суммирования
              * @deprecated Использовать sumFields из {@link $ws.proto.DataViewAbstract#sumFields DataViewAbstract}
              * @noShow
              */
            sumFields: {},
            /**
             * @cfg {Number} Максимальное число записей, с которыми возможно взаимодействие.
             * @deprecated Сообщение "Операция займет продолжительное время. Провести операцию?" выводится при печати или сохранении всех записей.
             * <wiTag group="Данные">
             */
            maxRecordsCount: 500,
            /**
             * @cfg {Boolean} Используется ли сохранение выбранных колонок в Excel
             * <wiTag group="Данные">
             * Используется ли сохранение выбранных колонок в Excel. В случае использования сохранения записей или реестра
             * в Excel есть возможность использования сохранения отдельно выбранных столбцов.
             * Возможные значения:
             * <ol>
             *    <li>true - используется сохранение выбранных колонок в Excel,</li>
             *    <li>false - не используется сохранение в Excel.</li>
             * </ol>
             * @example
             * Установка значения данной опции.
             * <pre>
             *    massPanel.useSaveSelectedColumns(false);
             * </pre>
             * @see useSaveSelectedColumns
             */
            isUseSaveSelectedColumns: true,
            /**
             * @cfg {Boolean} Используются ли отчеты записей для сохранения в Excel
             * <wiTag group="Данные">
             * Используются ли отчеты записей для сохранения в Excel. В случае использования отчетов записей для сохранения
             * в Excel данная операция предоставит выбор между отчетами записей и отчетами реестра.
             * Возможные значения:
             * <ol>
             *    <li>true - используются отчёты записей для сохранения в Excel,</li>
             *    <li>false - не используются отчёты записей сохранения в Excel.</li>
             * </ol>
             * @example
             * Установка значения данной опции.
             * <pre>
             *    massPanel.useRecordReportsForExcel(false);
             * </pre>
             * @see useRecordReportsForExcel
             */
            isUseRecordReportsForExcel: true
         },
         _handlersMap: undefined,
         _blocks: undefined,
         _currentView: undefined,
         _viewReady: undefined,
         _buttons: undefined,
         _menu: undefined,
         _actions: undefined,
         _state: false,
         _isOpen: false,
         _zIndex: undefined
      },
      _dotTplFn : dotTplFn,
      $constructor: function(cfg) {
         var container = this._container;

         this._publish('onBeforeShow', 'onAfterShow', 'onAfterLoad', 'onAfterClose', 'onBeforeClose');

         if (cfg.hasOwnProperty('sumFields')) {
            $ws.single.ioc.resolve('ILogger').log('OperationsPanel', 'Опция sumFields будет удалена из панели действий. Используйте sumFields в представлении данных.');
         }

         this._blocks = {
            inner: container.find('.ws-OperationsPanel__inner'),
            buttons: container.find('.ws-OperationsPanel__buttons'),
            operations: container.find('.ws-OperationsPanel__operations'),
            checkBox: container.find('.ws-OperationsPanel__selectBox'),
            mark: container.find('.ws-OperationsPanel__mark'),
            mass: container.find('.ws-OperationsPanel__operations-mass'),
            massSeparator: container.find('.ws-OperationsPanel__operations-mass .ws-OperationsPanel__separator'),
            selected: container.find('.ws-OperationsPanel__operations-selected'),
            selectedSeparator: container.find('.ws-OperationsPanel__operations-selected .ws-OperationsPanel__separator'),
            selection: container.find('.ws-OperationsPanel__selection'),
            wrapper: container.find('.ws-OperationsPanel__wrapper')
         };
         this._viewReady = new $ws.proto.Deferred();
         this._buttons = {};
         this._menu = {};

         this._initEvents();
         this._initActions();

         $ws._const.$doc.find('body').append(this._blocks.wrapper);
      },
      init: function() {
         this._traceParent();
         this.setLinkedView(this._options.linkedView);
      },
      _initEvents: function() {
         var self = this;

         this._container.find('.ws-OperationsPanel__action').bind({
            click: this._togglePanel.bind(this),
            mousedown: this._pushButton,
            mouseup: this._pullButton,
            mouseout: this._pullButton
         });
         this._blocks.selection.find('.ws-OperationsPanel__showAll').bind('click', this._showAllRecords.bind(this));
         this._blocks.checkBox.bind('click', function() {
            var cb = $(this),
                view = self._currentView;

            if (view && self._options.enabled) {
               if (cb.hasClass('ws-OperationsPanel__selectBox-someCheck') || cb.hasClass('ws-OperationsPanel__selectBox-allCheck')) {
                  view.removeSelection();
               } else {
                  view.selectCurrentPage();
               }
            }
         });

         this._handlersMap = {
            onChangeSelection: this._onChangeSelectionView.bind(this),
            onBeforeRender: this._toggleSelection.bind(this),
            onUpdateActions: this._onUpdateActionsView.bind(this),
            onConvert: this._onConvertView.bind(this),
            onDestroy: this._onDestroyView.bind(this)
         };
      },
      _onResizeHandler: function() {
         var type = this.getPanelState() ? 'selected' : 'mass',
             cont = this._blocks[type],
             hasDisplayed = !!cont.find('.ws-OperationsPanel__button:not(.ws-hidden)').length;

         $ws.proto.OperationsPanel.superclass._onResizeHandler.apply(this, arguments);
         cont.toggleClass('ws-hidden', !hasDisplayed);
      },
      _pushButton: function() {
         $(this).addClass('ws-mousedown');
      },
      _pullButton: function() {
         $(this).removeClass('ws-mousedown');
      },
      /**
       * Метод находит родителя, подписывается на изменение z-index
       * @private
       */
      _traceParent: function() {
         var self = this,
             parent = self.findParent(function(parent) {
                return ( $ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.Window') ) || ($ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.FloatArea'));
             }),
             setZIndex = function(parent) {
                this._blocks.wrapper.css('z-index', parent.getZIndex() + 1);
             },
             moveToTop;

         if (parent) {
            if (parent.hasEvent('onClose')) {
               parent.subscribe('onClose', function() {
                  if (self._isOpen) {
                     self._stopTrackWrapper();
                  }
               });
            }
            moveToTop = parent.moveToTop;
            this.subscribe('onDestroy', function() {
               parent.moveToTop = moveToTop;
            });
            setZIndex.call(this, parent);
            parent.moveToTop = parent.moveToTop.callNext(function() {
               setZIndex.call(self, this);
            });
         }
      },
      /**
       * Глушим функцию _childrenLoadCallback, поскольку вся инициализация дочерних контролов происходит в конструкторе
       * @private
       */
      _childrenLoadCallback: function() {
      },
      _needResizer: function() {
         return false;
      },
      _createActions: function() {
         this._createMark();
         this._createMassActions();
         this._createSelectedActions();
      },
      /**
       * Создание кнопки "Отметить"
       * @private
       */
      _createMark: function() {
         var actions = this._options.markOperations,
             view = this._currentView,
             name = 'mark',
             element,
             options,
             order,
             count,
             items,
             cfg;

         if (!Object.isEmpty(actions) && !this._buttons[name]) {
            cfg = $ws._const.OperationsPanel.buttons.selected.mark;
            order = $ws._const.OperationsPanel.orderMark;
            options = {
               name: name,
               id: $ws.helpers.randomId()
            };
            element = $('<div id="' + $ws.helpers.randomId() + '" class="ws-OperationsPanel__button" data-name="' + name + '" />');

            this._blocks[name].append(element).removeClass('ws-hidden');

            if (view) {
               count = view.getSelection(true).length;
            }

            if (!this._buttons[name]) {
               this._buttons[name] = new Button({
                  parent: this,
                  name: PREFIX_NAME + name,
                  caption: count ? 'Отмечено(' + count + ')' : 'Отметить',
                  tooltip: 'Отметить',
                  element: element,
                  menu: options.id,
                  renderStyle: 'asLink'
               });
               this._buttons[name].useCaptionInTitle(false);
            }

            items = this._createItems({
               actions: actions,
               cfg: cfg,
               handlers: this._actions.selected,
               type: name
            });
            options.data = this._sort(items, order);

            this._createMenu(options);
         }
      },
      _createMassActions: function() {
         this._buttons.mass = {};
         this._menu.mass = {};
         this._createButtons('mass');
      },
      _createSelectedActions: function() {
         this._buttons.selected = {};
         this._menu.selected = {};
         this._createButtons('selected');
      },
      _createButtons: function(type) {
         var actions = type === 'mass' ? this._options.massOperations : this._options.selectedOperations,
             self = this;

         this._prepareActions(actions);

         if (!Object.isEmpty(actions)) {
            actions = $ws.helpers.map(actions, function(value, key) {
                value.name = key;

               return value;
            });

            $ws.helpers.forEach(this._sort(actions, $ws._const.OperationsPanel.order), function(value) {
               self._buttons[type][value.name] = self._createButton(value, type);
            });
         }
      },
      _createButton: function(cfg, type, toSort) {
         var name = cfg.name,
             defaultCfg = $ws.core.clone($ws._const.OperationsPanel.buttons),
             isPrint = name === 'print' || name === 'save',
             handlers = this._actions[type],
             view = this._currentView,
             isUserAction = false,
             enabled = true,
             act = cfg,
             viewActions,
             button,
             element,
             btnCfg,
             menu;

         defaultCfg = isPrint ? defaultCfg[name] : defaultCfg[type][name];

         if ($.isPlainObject(defaultCfg)) {
            act = $ws.core.merge(defaultCfg, cfg);

            if (view && (viewActions = view.getActions()).hasOwnProperty(name)) {
               enabled = !!viewActions[name];
            }
         } else {
            isUserAction = true;
         }

         element = $('<div id="' + $ws.helpers.randomId() + '" class="ws-OperationsPanel__button" data-name="' + name + '" />');

         this._insertButton({
            name: name,
            type: type,
            element: element,
            toSort: toSort
         });

         btnCfg = {
            element: element,
            parent: this,
            renderStyle: 'asLink',
            imageAlign: 'left',
            name: isUserAction ? name : PREFIX_NAME + name,
            enable: enabled,
            caption: act.caption || act.title,
            tooltip: act.tooltip,
            image: act.img || ''
         };
         menu = act.menu;
         button = new Button(isPrint ? btnCfg : this._prepareButtonCfg(btnCfg, {
            menu: menu,
            isUserAction: isUserAction,
            name: name,
            type: type,
            handlers: handlers,
            act: act
         }));

         if (isPrint) {
            act.type = type;
            $ws.helpers.callbackWrapper(view ? undefined : this._viewReady,
                  this._initPrint.bind(this, button, act, handlers));
         }

         return button;
      },
      _insertButton: function(options) {
         var order = $ws._const.OperationsPanel.order,
             element = options.element,
             type = options.type,
             inStart = true,
             after,
             pos;

         if (options.toSort && (pos = Array.indexOf(order, options.name)) !== -1) {
            for (var i = pos; i >= 0; i--) {
               after = this._blocks[type].find('[data-name="' + order[i] + '"]');

               if (after.length) {
                  element.insertAfter(after);
                  inStart = false;
                  break;
               }
            }

            if (inStart) {
               this._blocks[type].prepend(element);
            }
         } else {
            this._blocks[type].append(element);
         }
      },
      _prepareButtonCfg: function(cfg, options) {
         var menu = options.menu,
             isUserAction = options.isUserAction,
             handlers = options.handlers,
             name = options.name,
             act = options.act;

         if (menu && (isUserAction || Object.keys(menu).length > 1)) {
            cfg.menu = $ws.helpers.randomId();
            this._createMenu({
               name: name,
               type: options.type,
               id: cfg.menu,
               data: this._createItems({
                  actions: menu,
                  cfg: act,
                  handlers: handlers,
                  type: options.type
               })
            });
         } else {
            cfg.handlers = {
               onActivated: this._prepareHandler(act.action || handlers[name], isUserAction)
            };
         }

         return cfg;
      },
      _prepareActions: function(actions) {
         var userActions;

         if (actions && actions.hasOwnProperty('userOperations')) {
            userActions = actions.userOperations;
            delete actions.userOperations;
            actions = $ws.core.merge(actions, userActions);
         }

         return actions;
      },
      _createItems: function(options) {
         var actions = options.actions,
             cfg = options.cfg,
             handlers = options.handlers,
             keys = Object.keys(actions),
             self = this,
             items = [];

         if (keys.length === 1 && keys[0] === 'menu') {
            actions = actions.menu;
         }

         this._prepareActions(actions);

         $ws.helpers.forEach(actions, function(value, key) {
            var act = $ws.core.merge($ws.core.clone(cfg[key] || {}), value || {});

            act.id = key;

            if (cfg.hasOwnProperty(key)) {
               act.action = cfg.action || handlers[key];
            } else {
               act.isUserAction = true;
            }

            if (!Object.isEmpty(options || {})) {
               if (!act.isUserAction) {
                  act.subMenuMethod = options.subMenuMethod;
               }

               act.type = options.type;
            }

            items.push(self._createItem(act));
         });

         return items;
      },
      _createItem: function(act) {
         var id = act.id,
             type = act.type,
             method = act.subMenuMethod,
             isUserAction = act.isUserAction,
             subMenu = method ? method.call(this, id, type) : this._createSubMenu(act),
             itemsCount = subMenu.length,
             item;

         item = {
            caption: act.caption || act.title,
            id: act.isUserAction ? id : PREFIX_NAME + id,
            addClass: 'ws-OperationsPanel__' + type + 'Operation',
            imgSrc: act.img,
            tooltip: act.tooltip,
            name: id
         };

         if ((isUserAction && itemsCount > 0) || (!isUserAction && itemsCount > 1)) {
            item.subMenu = subMenu;
         } else {
            if (itemsCount === 1) {
               act.action = subMenu[0].handlers.onActivated;
            }

            item.handlers = {
               'onActivated': this._prepareHandler(act.action, act.isUserAction)
            };
         }

         return item;
      },
      _createSubMenu: function(act) {
         var isUserAction = act.isUserAction,
             type = act.type,
             self = this,
             items = [];

         act = act.menu || act.subMenu;

         if (act) {
            $ws.helpers.forEach(act, function(value, key) {
               value.id = value.id || key;
               value.isUserAction = isUserAction;
               value.type = type;

               items.push(self._createItem(value));
            });

         }

         return items;
      },
      _prepareHandler: function(handler, isUserAction) {
         var self = this;

         return function() {
            self._beforeApply().addCallback(function(selected) {
               if (typeof handler === 'function') {
                  handler.call(self, isUserAction ? selected : undefined);
               }
            });
         };
      },
      _initPrint: function(btn, act, handlers) {
         var view = this._currentView,
             viewActions = view.getActions(),
             canPrintRecord = !!viewActions.printRecord,
             name = btn.getName().replace(PREFIX_NAME, ''),
             menuId = $ws.helpers.randomId(),
             type = act.type,
             menuCfg = {
                name: name,
                id: menuId,
                type: type
             },
             self = this,
             options,
             count,
             method,
             cfg;

         act = act.menu;

         if (act) {
            this._prepareActions(act);

            method = '_create' + name.charAt(0).toUpperCase() + name.slice(1) + 'Items';

            if (!canPrintRecord) {
               delete act.allRecords;
            }

            count = Object.keys(act).length;
            cfg = $ws._const.OperationsPanel.buttons[type];

            if (count > 1) {
               options = {
                  actions: act,
                  cfg: cfg,
                  handlers: handlers,
                  subMenuMethod: this[method],
                  type: type
               };
               menuCfg.data = this._createItems(options);
               self._createMenu(menuCfg);
               btn.setMenu(menuId);
            } else {
               $ws.helpers.forEach(act, function(value, key) {
                  var items = [],
                      itemsCount;

                  if (count === 1) {
                     items = self[method](key, type);
                     itemsCount = items.length;

                     if (itemsCount > 0) {
                        if (itemsCount === 1) {
                           btn.subscribe('onActivated', items[0].handlers.onActivated);
                        } else {
                           menuCfg.data = items;
                           self._createMenu(menuCfg);
                           btn.setMenu(menuId);
                        }
                     } else {
                        btn.subscribe('onActivated', value.action || handlers[key]);
                     }
                  }
               });
            }
         } else {
            this._buttons[type][name] = btn;
            throw new Error('OperationsPanel::configuration must contain a property "menu"');
         }
      },
      _createPrintItems: function(key, type) {
         var isReportForList = key === 'list',
             view = this._currentView,
             reports = view.getReports(isReportForList),
             self = this,
             items = [];

         $ws.helpers.forEach(reports, function(value) {
            items.push({
               caption: value,
               id: PREFIX_NAME + key + '-' + value,
               addClass: 'ws-OperationsPanel__' + type + 'Operation',
               handlers: {
                  'onActivated': self._prepareHandler(self._printReport.bind(self, value, isReportForList))
               }
            });
         });

         return items;
      },
      _createSaveItems: function(key, type) {
         var isReportsForList = type === 'mass',
             cssClass = 'ws-OperationsPanel__' + type + 'Operation',
             view = this._currentView,
             self = this,
             items = [],
             reports = {},
             recordReports;

         $ws.helpers.forEach(view.getReports(isReportsForList), function(value) {
            reports[value] = isReportsForList;
         });

         if (type === 'selected' && this._options.isUseRecordReportsForExcel) {
            recordReports = view.getReports(true);

            $ws.helpers.forEach(recordReports, function(value) {
               reports[value] = true;
            });
         }

         $ws.helpers.forEach(reports, function(isReportForList, idReport) {
            items.push({
               caption: idReport,
               id: PREFIX_NAME + key + '-' + idReport,
               addClass: cssClass,
               handlers: {
                  'onActivated': self._prepareHandler(self['_' + key].bind(self, idReport, isReportForList))
               }
            });
         });

         if (key === 'saveToExcel') {
            if (items.length === 0) {
               items.push({
                  caption: 'Как на экране',
                  id: PREFIX_NAME + key + '-screenView',
                  addClass: cssClass,
                  handlers: {
                     'onActivated': this._prepareHandler(this._actions[type][key])
                  }
               });
            }

            if (this._options.isUseSaveSelectedColumns) {
               items.push({
                  caption: 'Выбранные столбцы',
                  id: PREFIX_NAME + key + '-selectedColumns',
                  addClass: cssClass,
                  handlers: {
                     'onActivated': this._prepareHandler(this._saveColumnsToExcel.bind(this))
                  }
               });
            }
         }

         return items;
      },
      /**
       * <wiTag group="Управление">
       * Установить связанное представление данных.
       * Метод актуально использовать после события onReady у представления данных.
       * @param {String|$ws.proto.DataViewAbstract} linkedView Строка формата "ИмяШаблона/ИмяСвязанногоПредставленияДанных"
       * или экземпляр класса представления данных.
       * @example
       * При готовности табличного представления (tableView) связать его с панелью массовых операций (panel).
       * <pre>
       *    tableView.subscribe('onReady', function() {
       *       panel.setLinkedView(this);
       *    });
       * </pre>
       * @see linkedView
       */
      setLinkedView: function(linkedView) {
         var
            self,
            name,
            def,
            hideSeparator;

         if (linkedView) {
            def = new $ws.proto.Deferred();
            self = this;

            def.addCallback(function(view) {
               if (self._currentView) {
                  self._listenView(false);
                  self._options.linkedView = view.makeOwnerName();
                  self._destroyButtons();
                  self._createActions();
               }

               self._currentView = view;
               self._toggleState(self._currentView.getSelection(true).length);
               self._listenView();
               self._traceButtonSet(self._currentView.getActions());
               self._currentView.setUseDefaultPrint();

               //TODO: Выпилить, когда будет удалена опция
               if (!Object.isEmpty(self._options.sumFields)) {
                  self._currentView.setSumFields(self._options.sumFields);
               }
               //После установки setLinkedView - стреляем onAfterLoad
               self._viewReady.addCallback(function() {
                  if (!self.isReady()) {
                     self._createActions();
                     self._toggleMarkItems();
                     $ws.proto.OperationsPanel.superclass.init.call(self);
                  }
                  self._notify('onAfterLoad');
               });
               self._viewReady.callback();

               hideSeparator = !self._currentView.isMultiSelect() && Object.isEmpty(self._options.markOperations);
               self._blocks.checkBox.toggleClass('ws-hidden', !self._currentView.isMultiSelect());
               self._blocks.massSeparator.toggleClass('ws-hidden', hideSeparator);
               self._blocks.selectedSeparator.toggleClass('ws-hidden', hideSeparator);
               self._blocks.buttons.removeClass('ws-hidden');

               self._viewReady = new $ws.proto.Deferred();
            });

            if ($ws.helpers.instanceOfModule(linkedView, 'SBIS3.CORE.DataViewAbstract')) {
               def.callback(linkedView);
            } else {
               name = linkedView;

               if (name.indexOf('/') > -1) {
                  name = linkedView.split('/')[1];
               }

               this.getTopParent().waitChildControlByName(name).addCallback(function(instanse) {
                  def.callback(instanse);

                  return instanse;
               });
            }
         } else if (!this.isReady()) {
            this._createActions();
            $ws.proto.OperationsPanel.superclass.init.call(this);
            this._notify('onAfterLoad');
         }
      },
      _showControls: function(){
      },
      /**
       * <wiTag group="Управление">
       * Установить кнопки массовых операций над всеми записями.
       * Используется в случае отсутствия возможности привязки связанного представления данных в Джинне,
       * а также если необходимо заменить определенный набор операций.
       * @param {Object} actions Конфигурация кнопок массовых операций (@link massOperations).
       * @example
       * <pre>
       *    panel.setMassOperations({
       *       'print': {
       *          menu: {
       *             'list': {}
       *          }
       *       },
       *       'save': {
       *          menu: {
       *             'saveToPDF': {},
       *             'saveToExcel': {}
       *          }
       *       }
       *    });
       *    panel.setLinkedView('НовыйШаблон/СписокАбонентов');
       * </pre>
       * @see setLinkedView
       * @see massOperations
       */
      setMassOperations: function(actions) {
         this._setActions(actions, 'mass');
      },
      /**
       * <wiTag group="Управление">
       * Установить кнопки операций над выбранными записями.
       * Используется в случае отсутствия возможности привязки связанного представления данных в Джинне,
       * а также если необходимо заменить определенный набор операций.
       * @param {Object} actions Конфигурация кнопок операций над выбранными записями (@link selectedOperations).
       * @example
       * Сначала установить доступные кнопки операций над выбранными записями, а затем - связанное представление данных.
       * <pre>
       *    panel.setSelectedOperations({
       *       'move': {},
       *       'merge': {},
       *       'sum': {}
       *    });
       * </pre>
       * @see selectedOperations
       */
      setSelectedOperations: function(actions) {
         this._setActions(actions, 'selected');
      },
      /**
       * <wiTag group="Управление">
       * Установить кнопки операций в отметке.
       * Используется в случае отсутствия возможности привязки связанного представления данных в Джинне,
       * а также если необходимо заменить определенный набор операций.
       * @param {Object} actions Конфигурация кнопок операций в отметку (@link markOperations).
       * @example
       * Сначала установить доступные кнопки операций в отметке, а затем - связанное представление данных.
       * <pre>
       *    panel.setMarkOperations({
       *       'selectCurrentPage': {},
       *       'removeSelection': {},
       *       'showSelection': {}
       *    });
       * </pre>
       * @see markOperations
       */
      setMarkOperations: function(actions) {
         if ($.isPlainObject(actions) && !Object.isEmpty(actions)) {
            this._destroyButton('mark');
            this._options.markOperations = actions;
            this._createMark();
            this._toggleMarkItems();
         }
      },
      _setActions: function(actions, type) {
         if ($.isPlainObject(actions) && !Object.isEmpty(actions)) {
            this._destroyButtonsByType(type);
            this._options[type + 'Operations'] = actions;
            this['_create' + type.charAt(0).toUpperCase() + type.slice(1) + 'Actions']();
         }
      },
      /**
       * <wiTag group="Управление">
       * Добавить кнопки пользовательских операций.
       * @deprecated Использовать метод {@link addOperationsByType}
       * @see addOperationsByType
       */
      addUserOperations: function(actions, type){
         this.addOperationsByType(actions, type);
      },
      /**
       * <wiTag group="Управление">
       * Добавить кнопки операций.
       * Пользователь самостоятельно определяет функционал каждой кнопки, её внешний вид и доступность в зависимости
       * от режима панели массовых операций.
       * @param {Array} actions Массив объектов, описывающих конфигурацию каждой кнопки.
       * @param {Object} [actions.object] Объект с конфигурацией отдельной кнопки.
       * @param {Function} [actions.object.action] Функция (операция), выполняемая при клике на кнопку.
       * @param {String} [actions.object.tooltip] Текст всплывающей подсказки.
       * @param {String} [actions.object.caption] Подпись на кнопке.
       * @param {String} [actions.object.name] Имя кнопки как дочернего контрола панели массовых операций.
       * @param {String} [actions.object.img] Путь к иконке кнопки.
       * @param {String} type Режим панели массовых операций, при котором будут доступны добавляемые кнопки.
       * Возможные режимы:
       * <ol>
       *    <li>mass - операции над всеми записями.</li>
       *    <li>selected - операции только над отмеченными записями.</li>
       * </ol>
       * @example
       * При готовности панели массовых операций (panel) добавить новые пользовательские операции.
       * <pre>
       *    panel.subscribe('onReady', function() {
       *       this.addUserOperations([{
       *          action: function(records) {
       *            //код обработчика
       *          },
       *          tooltip: 'Выполнить переход',
       *          caption: '',
       *          name: 'btnAcceptDocs',
       *          img: 'sprite:icon-24 icon-Successful icon-primary'
       *       },{
       *          action: function(records) {
       *             //код обработчика
       *          },
       *          tooltip: 'Восстановить документы',
       *          name: 'btnRestoreDocs',
       *          img: 'sprite:icon-24 icon-Restore icon-done icon-restore-docs'
       *       }], 'selected');
       *    });
       * </pre>
       * @see massOperation
       * @see selectedOperation
       * @see setMassOperations
       * @see setSelectedOperations
       */
      addOperationsByType: function(actions, type) {
         var self = this,
             name;

         if (actions && this._buttons.hasOwnProperty(type)) {
            if ($.isPlainObject(actions)) {
               actions = [ actions ];
            }

            $ws.helpers.forEach(actions, function(act) {
               name = act.name;

               if (name) {
                  self._options[type + 'Operations'][name] = act;
                  self._buttons[type][name] = self._createButton(act, type, true);
               }
            });
         }
      },
      /**
       * <wiTag group="Управление">
       * Удалить кнопки операций из панели.
       * @param {Array} names Набор имен операций, которые необходимо удалить.
       * @param {String} type Режим панели массовых операций, при котором будут удалены кнопки.
       * Возможные режимы:
       * <ol>
       *    <li>mass - операции над всеми записями.</li>
       *    <li>selected - операции только над отмеченными записями.</li>
       * </ol>
       * @example
       * При готовности панели операций (panel) удалить кнопки "Суммировать" и "Удалить" в режиме массовых операций.
       * <pre>
       *    panel.subscribe('onReady', function() {
       *       panel.deleteOperationsByType(['sum', 'delete'], 'mass');
       *    });
       * </pre>
       */
      deleteOperationsByType: function(names, type) {
         if (names && this._buttons.hasOwnProperty(type)) {
            if(typeof names === 'string') {
               names = [ names ];
            }

            $ws.helpers.forEach(names, function(name) {
               var btnMap = this._buttons[type],
                   map = this._options[type + 'Operations'];

               this._destroyButton(name, btnMap, this._menu[type]);

               if (map.hasOwnProperty(name)) {
                  delete map[name];
               }
            }.bind(this));
         }
      },
      /**
       * <wiTag group="Управление">
       * Получить инстанс кнопки.
       * @param {String} name Имя операции.
       * @param {String} type Режим панели массовых операций, при котором будут удалены кнопки.
       * Возможные режимы:
       * <ol>
       *    <li>mass - операции над всеми записями.</li>
       *    <li>selected - операции только над отмеченными записями.</li>
       * </ol>
       * @example
       * При готовности панели операций (panel) получить кнопку "Суммировать" и установить ей заголовок.
       * <pre>
       *    panel.subscribe('onReady', function() {
       *       panel.getButtonByType('sum', 'mass').setCaption('someCaption');
       *    });
       * </pre>
       */
      getButtonByType: function(name, type) {
         var button;

         if (name && this._buttons.hasOwnProperty(type)) {
            button = this._buttons[type][name];
         }

         return button;
      },
      /**
       * <wiTag group="Управление">
       * Получить инстанс кнопки "Отметить".
       * @example
       * При готовности панели операций (panel) получить кнопку "Отметить" и добавить ей в меню новый пункт.
       * <pre>
       *    panel.subscribe('onReady', function() {
       *       panel.getMarkButton().getMenu().addItem(config);
       *    });
       * </pre>
       */
      getMarkButton: function() {
         return this._buttons.mark;
      },
      /**
       * <wiTag group="Управление">
       * Удалить кнопку "Отметить".
       * @example
       * При готовности панели операций (panel) удалить кнопку "Ометить".
       * <pre>
       *    panel.subscribe('onReady', function() {
       *       panel.deleteMarkButton();
       *    });
       * </pre>
       */
      deleteMarkButton: function() {
         this._destroyButton('mark');
         this._blocks.mark.addClass('ws-hidden');
      },
      /**
       * <wiTag group="Управление">
       * Добавить кнопку "Отметить".
       * @example
       * При готовности панели операций (panel) Добавить кнопку "Ометить".
       * <pre>
       *    panel.subscribe('onReady', function() {
       *       panel.deleteMarkButton();
       *    });
       * </pre>
       */
      addMarkButton: function() {
         this._createMark();
      },
      /**
       * <wiTag group="Отображение">
       * Открыта ли панель массовых операций.
       * @returns {Boolean} Состояние панели: открыта (true) или закрыта (false).
       * @example
       * Закрыть панель массовых операций (panel), если она открыта.
       * <pre>
       *     if (panel.isOpen()) {
       *        panel.close();
       *     }
       * </pre>
       * @see open
       * @see close
       */
      isOpen: function(){
         return this._isOpen;
      },
      _onDestroyView: function() {
         if (!this.isDestroyed()) {
            this.close();
            this._blocks.buttons.addClass('ws-hidden');
         }
      },
      _listenView: function(toListen) {
         var view = this._currentView,
             method;

         if ($ws.helpers.instanceOfModule(view, 'SBIS3.CORE.DataViewAbstract')) {
            if (typeof toListen === 'undefined') {
               toListen = true;
            }

            toListen = !!toListen;
            method = toListen ? 'subscribe' : 'unsubscribe';

            view[method]('onChangeSelection', this._handlersMap.onChangeSelection);
            view[method]('onBeforeRender', this._handlersMap.onBeforeRender);
            view[method]('onUpdateActions', this._handlersMap.onUpdateActions);
            if (view.hasEvent('onConvert')) {
               if (toListen) {
                  view.unsubscribe('onConvert', this._handlersMap.onConvert);
               }
               view[method]('onConvert', this._handlersMap.onConvert);
            }
            view[method]('onDestroy', this._handlersMap.onDestroy);
         }
      },
      _onConvertView: function(e, view){
         this.setLinkedView(view);
      },
      /**
       * Обработчик на перестроение списка действий у связанного представления данных
       * @param {$ws.proto.EventObject} e дескриптор события
       * @param {Object} actions объект с действиями
       * @private
       */
      _onUpdateActionsView: function(e, actions) {
         this._traceButtonSet(actions);
      },
      _traceButtonSet: function(actions) {
         var buttons = this._buttons,
             map = {
                'mass': buttons.mass,
                'selected': buttons.selected
             };

         $ws.helpers.forEach(map, function(value) {
            this._traceButtons(value, actions);
         }.bind(this));
      },
      /**
       * Метод проверяет доступность действия кнопки и делает ее доступной или недоступной
       * @param {Object} buttons объект с кнопками
       * @param {Object} actions объект с действиями
       * @private
       */
      _traceButtons: function(buttons, actions) {
         var isEnabled,
             btn;

         for (var i in buttons) {
            if (buttons.hasOwnProperty(i)) {
               btn = buttons[i];
               isEnabled = actions[i];
               if (actions.hasOwnProperty(i) && btn.isEnabled() !== isEnabled) {
                  btn.setEnabled(isEnabled);
               }
            }
         }
      },
      setEnabled: function(enabled) {
         enabled = !!enabled;

         if (!enabled) {
            this.close();
         }

         $ws.proto.OperationsPanel.superclass.setEnabled.apply(this, arguments);
      },
      _destroyButtons: function() {
         $ws.helpers.forEach(this._buttons, function(button, name) {

            if (name === 'mass' || name === 'selected') {
               this._destroyButtonsByType(name);
            } else {
               this._destroyButton(name);
            }
         }.bind(this));
      },
      _destroyButtonsByType: function(type) {
         if (type) {
            $ws.helpers.forEach(this._buttons[type], function(button, name, obj) {
               this._destroyButton(name, obj, this._menu[type]);
            }.bind(this));
         }
      },
      _destroyButton: function(key, buttonsMap, menuMap) {
         var button,
             menu;

         buttonsMap = buttonsMap || this._buttons;
         menuMap = menuMap || this._menu;
         button = buttonsMap[key];
         menu = menuMap[key];

         if (menu) {
            menu.destroy();
            delete menuMap[key];
         }

         if (button) {
            button.destroy();
            delete buttonsMap[key];
         }
      },
      _showAllRecords: function() {
         this._currentView.showSelection(false);
      },
      _toggleSelection: function() {
         var cont = this._blocks.selection,
             view = this._currentView;

         if (view.isMinimized()) {
            cont.find('.ws-OperationsPanel__selectionCount').text('Отобрано ' + view.getRecordSet().getRecords().length);
            cont.removeClass('ws-hidden');
         } else {
            cont.addClass('ws-hidden');
         }
         if(view.getRecordSet().getRecordCount() === 0){
            this.setEnabled(false);
         } else {
            this.setEnabled(true);
         }
      },
      _toggleState: function(count) {
         this['_show' + (count ? 'Selected' : 'Mass') + 'Block'](count);
         this._toggleCheckBox(count);
         this._toggleMarkCaption(count);
      },
      _toggleMarkCaption: function(count) {
         var mark = this._buttons.mark;

         if (mark) {
            mark.setCaption(count ? 'Отмечено(' + count + ')' : 'Отметить');
         }
      },
      _showMassBlock: function() {
         var mass = this._blocks.mass;

         if (mass.find('.ws-OperationsPanel__button:not(.ws-hidden)').length) {
            mass.removeClass('ws-hidden');
         }

         this._blocks.selected.addClass('ws-hidden');
         this._state = false;
      },
      _showSelectedBlock: function(count) {
         this._toggleButtons(['merge'], 'selected', count > 1);
         var selected = this._blocks.selected;

         this._blocks.mass.addClass('ws-hidden');

         if (selected.find('.ws-OperationsPanel__button:not(.ws-hidden)').length) {
            selected.removeClass('ws-hidden');
         }

         this._state = true;
      },
      _toggleCheckBox: function(count) {
         var cb = this._blocks.checkBox;

         cb.removeClass('ws-OperationsPanel__selectBox-someCheck ws-OperationsPanel__selectBox-allCheck');

         if (count) {
            cb.addClass(count === this._currentView.getRecordSet().getRecordCount() ? 'ws-OperationsPanel__selectBox-allCheck'
                  : 'ws-OperationsPanel__selectBox-someCheck').attr('title', 'Снять отметку');
         } else {
            cb.attr('title', 'Отметить всю страницу');
         }
      },
      _onChangeSelectionView: function() {
         var view = this._currentView,
             selectedCount = view.getSelection(true).length;

         this._toggleMarkItems();
         this._toggleDisplayButtons();
         this._toggleState(selectedCount);

         if (view.isShowSelection() || view.isMinimized()) {
            return;
         }

         this[selectedCount > 0 ? 'open' : 'close']();
      },
      /**
       * В этом методе отключаем/включаем отображаемые команды в зависимости от различных условий
       * @private
       */
      _toggleDisplayButtons: function() {
         var
            currentView = this._currentView,
            browserRecordset,
            displayMoveButton;
         //Если мы находимся в корне и там нет папок, то скрываем команду перемещения записей
         if (currentView.isHierarchyMode() && currentView.getRootNode() === currentView.getCurrentRootNode()) {
            browserRecordset = currentView.getRecordSet();
            displayMoveButton = false;
            browserRecordset.each(function(record) {
               if (record.isBranch()) {
                  displayMoveButton = true;
                  return false;
               }
            });
            this._toggleButtons('move', undefined, displayMoveButton);
         }
      },
      _toggleMarkItems: function() {
         var mark = this._menu.mark,
             view = this._currentView,
             useSelection,
             selected;

         if (view && mark) {
            selected = !!this._currentView.getSelection(true).length;
            useSelection = view.isUseSelection();

            mark.setEnabledById(PREFIX_NAME + 'selectCurrentPage', useSelection);
            mark.setEnabledById(PREFIX_NAME + 'removeSelection', useSelection && selected);
            mark.setEnabledById(PREFIX_NAME + 'invertSelection', useSelection);
            mark.setEnabledById(PREFIX_NAME + 'showSelection', useSelection && selected && !view.isShowSelection());
         }
      },
      _initActions: function() {
         this._actions = {
            mass: {
               'delete': this._deleteAll.bind(this),
               'sum': this._sumAll.bind(this),
               'list': this._printList.bind(this),
               'saveToPDF': this._saveAllToPDF.bind(this),
               'saveToExcel': this._saveAllToExcel.bind(this)
            },
            selected: {
               'selectCurrentPage': this._selectCurrentPage.bind(this),
               'removeSelection': this._removeSelection.bind(this),
               'invertSelection': this._invertSelection.bind(this),
               'showSelection': this._showSelection.bind(this),
               'merge': this._merge.bind(this),
               'move': this._move.bind(this),
               'delete': this._deleteSelected.bind(this),
               'sum': this._sumSelected.bind(this),
               'list': this._printList.bind(this),
               'saveToPDF': this._saveSelectedToPDF.bind(this),
               'saveToExcel': this._saveSelectedToExcel.bind(this)
            }
         };
      },
      _selectCurrentPage: function() {
         this._currentView.selectCurrentPage();
      },
      _removeSelection: function() {
         this._currentView.removeSelection();
      },
      _invertSelection: function() {
         this._currentView.invertSelection();
      },
      _showSelection: function() {
         this._currentView.showSelection();
      },
      _merge: function() {
         this._currentView.mergeSelectedRecords();
      },
      _move: function() {
         this._currentView.moveRecords();
      },
      _saveAllToExcel: function() {
         this._saveToExcel(undefined, true);
      },
      _saveSelectedToExcel: function() {
         this._saveToExcel(undefined, false);
      },
      _saveToExcel: function(idReport, isReportForList) {
         this._currentView.saveToExcel(idReport, isReportForList);
      },
      _saveAllToPDF: function() {
         this._saveToPDF(undefined, true);
      },
      _saveSelectedToPDF: function() {
         this._saveToPDF(undefined, false);
      },
      _saveToPDF: function(idReport, isReportForList) {
         this._currentView.saveToPDF(idReport, isReportForList);
      },
      _saveColumnsToExcel: function() {
         this._currentView.saveColumnsToExcel();
      },
      _deleteAll: function() {
         var view = this._currentView;

         if (view.isMinimized()) {
            this._deleteSelected();
         } else {
            view.deleteRecordsByFilter().addCallback(function(result) {
               if (result) {
                  this.close();
               }
            }.bind(this));
         }
      },
      _deleteSelected: function() {
         var view = this._currentView,
             selected = view.isMinimized() ? view.getRecordSet().getRecords() : view.getSelection();

         view.deleteSelectedRecords(selected).addCallback(function(result) {
            if (result) {
               this.close();
            }
         }.bind(this));
      },
      _sumAll: function() {
         this._currentView.sumRecords();
      },
      _sumSelected: function() {
         this._currentView.sumSelectedRecords();
      },
      _printList: function() {
         this._currentView.printReport(undefined, true);
      },
      _printReport: function(idReport, isReportForList) {
         var view = this._currentView,
             data;

         if (!view.getPagingMode() || (view.isHierarchy() && view.getTurn())) {
            data = view.getRecordSet();
         }

         view.printReport(idReport, isReportForList, data);
      },
      /**
       * <wiTag group="Отображение">
       * Получить состояние панели.
       * Состояние панели информирует о режиме работы с записями связанного представления данных.
       * @returns {Boolean} Состояние панели массовых операций.
       * Возможные значения:
       * <ol>
       *    <li>true - управление отмеченными записями,</li>
       *    <li>false - управление всеми записями.</li>
       * </ol>
       * @example
       * Дублировать в строке ввода (fieldSting) текущее состояние панели массовых операций (panel).
       * Связанным представлением данных является табличное представления (tableView).
       * <pre>
       *    tableView.subscribe('onClick', function() {
       *       var flag = panel.getPanelState();
       *       fieldString.setValue(flag ? 'Управление отмеченными записями' : 'Управление всеми записями');
       *    });
       * </pre>
       * @see linkedView
       * @see massOperations
       * @see selectedOperations
       */
      getPanelState: function() {
         return this._state;
      },
      /**
       * Метод начинает сопровождать контейнер панели, подписывается на тикер
       * @private
       */
      _startTrackWrapper: function() {
         var channel = $ws.helpers.trackElement(this._container);
         channel.subscribe('onMove', function (event, position) {
            this._blocks.wrapper.css(position);
         }, this);
         channel.subscribe('onVisible', function(event, visible) {
            if (visible) {
               this._blocks.wrapper.removeClass('ws-hidden');
            } else {
               this.close();
            }
         }, this);

      },
      /**
       * Метод перестает сопровождать контейнер панели, отписывается от тикера
       * @private
       */
      _stopTrackWrapper: function() {
         $ws.helpers.trackElement(this._container, false);
         if (this._blocks.wrapper) {
            this._blocks.wrapper.addClass('ws-hidden');
         }
      },
      /**
       * <wiTag group="Управление">
       * Закрыть/открыть панель массовых операций.
       * @deprecated Использовать метод {@link open} и {@link close}
       */
      panelKeyClickHandler: function() {
         this._togglePanel();
      },
      _togglePanel: function() {
         var self,
             isOpen;

         if (this._options.enabled) {
            self = this;
            isOpen = this._isOpen;

            if (!isOpen) {
               if (this._zIndex !== undefined) {
                  $ws.single.WindowManager.releaseZIndex(this._zIndex);
               }
               this._zIndex = $ws.single.WindowManager.acquireZIndex(false);
               this._notify('onBeforeShow');
               this._startTrackWrapper();
               this._blocks.wrapper
                  .css(this._container.offset())
                  .css('z-index', this._zIndex);
            } else {
               self._notify('onBeforeClose');
            }

            this._blocks.inner.animate({
               left: isOpen ? '-100%' : 0
            }, 150, undefined, function(){
               if (self._isOpen) {
                  self._notify('onAfterShow');
               } else {
                  self._stopTrackWrapper();
                  self._notify('onAfterClose');
               }
            });
            this._isOpen = !isOpen;
         }
      },
      _toggle: function(toggle) {
         var isOpen = this._isOpen;

         toggle = !!toggle;

         if (isOpen !== toggle) {
            this._togglePanel();
         }
      },
      /**
       * <wiTag group="Управление">
       * Открыть панель массовых операций.
       * @example
       * При переходе фокуса на табличное представление (tableView) открыть панель массовых операций (panel).
       * <pre>
       *    tableView.subscribe('onFocusIn', function() {
       *       panel.open();
       *    });
       * </pre>
       * @see close
       * @see isOpen
       */
      open: function() {
         this._toggle(true);
      },
      /**
       * <wiTag group="Управление">
       * Закрыть панель массовых операций.
       * @example
       * При потере фокуса табличным представлением (tableView) закрыть панель массовых операций (panel).
       * <pre>
       *    tableView.subscribe('onFocusOut', function() {
       *       panel.close();
       *    });
       * </pre>
       * @see open
       * @see isOpen
       */
      close: function() {
         this._toggle(false);
      },
      hide: function() {
         this.close();
         $ws.proto.OperationsPanel.superclass.hide.apply(this, arguments);
      },
      _createMenu: function(options) {
         var name = options.name,
             type = options.type,
             map = type ? this._menu[type] : this._menu;

         map[name] = new Menu({
            id: options.id,
            name: PREFIX_NAME + name + '-menu',
            parent: this,
            data: options.data
         });
      },
       /**
        * <wiTag group="Данные">
        * Получить экземпляр класса связанного представления данных.
        * @returns {undefined|$ws.proto.DataViewAbstract}
        * @example
        * При готовности панели массовых операций (panel) сбросить фильтр с представления данных, если он есть.
        * <pre>
        *    panel.subscribe('onReady', function() {
        *       this.getCurrentView().setQuery({'Название': ''});
        *    });
        * </pre>
        * @see linkedView
        * @see setLinkedView
        */
      getCurrentView: function() {
         return this._currentView;
      },
      _sort: function(btns, order) {
         var defaultActions = [],
             userActions = [];

         $ws.helpers.forEach(btns, function(action) {
            (Array.indexOf(order, action.name) === -1 ? userActions : defaultActions).push(action);

         });

         return defaultActions.sort(function(a, b) {
                   return Array.indexOf(order, a.name) > Array.indexOf(order, b.name) ? 1 : -1;
                }).concat(userActions);
      },
      /**
       * <wiTag group="Отображение">
       * Скрыть указанные кнопки панели массовых операций.
       * Кнопки будут скрыты как для массовых операций, так и для операций над отмеченными записями,
       * если вторым параметром ничего не передать, если же передать 'mass' или 'selected' кнопки
       * будут скрыты для соответствующего состояния.
       * @param {Array} names Массив имён кнопок.
       * @param {String|undefined} type Состояние, для которого скрываем операции.
       * @example
       * В зависимости от значения флага (fieldCheckbox) изменить число доступных операций.
       * <pre>
       *    fieldCheckbox.subscribe('onChange', function(eventObject, value) {
        *       if (value) {
        *          panel.hideOperations(['delete', 'print']);
        *       } else {
        *          panel.showOperations(['delete', 'print']);
        *       }
        *    });
       * </pre>
       * @see massOperations
       * @see selectedOperations
       * @see showOperations
       */
      hideOperations: function(names, type) {
         this._toggleButtons(names, type, false);
      },
      /**
       * <wiTag group="Отображение">
       * Показать указанные кнопки панели массовых операций.
       * Кнопки будут показаны как для массовых операций, так и для операций над отмеченными записями,
       * если вторым параметром ничего не передать, если же передать 'mass' или 'selected' кнопки
       * будут показаны для соответствующего состояния.
       * @param {Array} names Массив имён кнопок.
       * @param {String|undefined} type Состояние, для которого показываем операции.
       * @example
       * В зависимости от значения флага (fieldCheckbox) изменить число доступных операций.
       * <pre>
       *    fieldCheckbox.subscribe('onChange', function(eventObject, value) {
        *       if (value) {
        *          panel.hideOperations(['delete', 'print']);
        *       } else {
        *          panel.showOperations(['delete', 'print']);
        *       }
        *    });
       * </pre>
       * @see massOperations
       * @see selectedOperations
       * @see hideOperations
       */
      showOperations: function(names, type) {
         this._toggleButtons(names, type, true);
      },
       /**
        * <wiTag group="Данные">
        * Установить текст на кнопке панели массовых операций.
        * @deprecated Использовать метод {@link getButtonByType}
        * @param {String} name Имя кнопки.
        * @param {String} caption Текст на кнопке.
        * @param {String} [type = 'selected'] Состояние панели массовых операций.
        * Возможные значения:
        * <ol>
        *    <li>mass - управление всеми записями.</li>
        *    <li>selected - управление отмеченными записями.</li>
        * </ol>.
        * @example
        * При готовности панели массовых операций (panel) установить текст на кнопку print.
        * <pre>
        *    panel.subcribe('onReady', function() {
        *       this.setCaption('print', 'Отправить документ на печать', 'mass');
        *    });
        * </pre>
        * @see massOperations
        * @see selectedOperations
        */
      setCaption: function(name, caption, type) {
         var button;

         if (!this._buttons.hasOwnProperty(type)) {
            type = 'selected';
         }

         button = this._buttons[type][name];

         if (button) {
            button.setCaption(caption);
         }
      },
      _toggleButtons: function(names, type, toggle) {
         var self = this,
             toggleBtn = function(names, type) {
                $ws.helpers.forEach(names, function(name) {
                   button = self._buttons[type][name];

                   if (button) {
                      button.toggle(toggle);
                   }
                });

             },
             button;

         toggle = !!toggle;

         if (typeof names === 'string') {
            names = [ names ];
         }

         if (!this._buttons.hasOwnProperty(type)) {
            toggleBtn(names, 'mass');
            type = 'selected';
         }

         toggleBtn(names, type);
      },
      /**
       * <wiTag group="Управление">
       * Использовать сохранение из выбранных полей.
       * Сохранение из выбранных полей - это дополнительная функция, позволяющая выбирать поля записей.
       * Значения этих полей будут сохранены в Excel документ.
       * Выбор полей производится в отдельном окне, которое открывается при клике на кнопку saveToExcel.
       * @param {Boolean} value Признак: сохранять из выбранных полей (true) или нет (false).
       * @example
       * При готовности панели массовых операций (panel) запретить сохранение выбранных полей.
       * <pre>
       *    panel.subscribe('onReady', function() {
       *       this.useSaveSelectedColumns(false);
       *    });
       * </pre>
       */
      useSaveSelectedColumns: function(value) {
         this._options.isUseSaveSelectedColumns = !!value;
         this._reBuildSave();
      },
      /**
       * <wiTag group="Управление">
       * Использовать при сохранении в Excel отчеты записи
       * Сохранение в Excel, используя отчеты записи - это дополнительная функция, позволяющая использовать
       * в операциях над отмеченными записями отчеты записи.
       * Excel документ сформируется на основе отчета записи.
       * @param {Boolean} value Признак: использовать отчеты (true) или нет (false).
       * @example
       * При готовности панели массовых операций (panel) запретить использовать отчеты записи.
       * <pre>
       *    panel.subscribe('onReady', function() {
        *       this.useRecordReportsForExcel(false);
        *    });
       * </pre>
       */
      useRecordReportsForExcel: function(value) {
         this._options.isUseRecordReportsForExcel = !!value;
         this._reBuildSave('selected');
      },
      _reBuildSave: function(type) {
         $ws.helpers.forEach(this._buttons, function(value, key) {
            var cfg;

            if ($.isPlainObject(value) && (!type || type === key) && value.hasOwnProperty('save')) {
               cfg = this._options[key + 'Operations'].save;

               cfg.name = 'save';

               this.deleteOperationsByType(['save'], key);
               this.addOperationsByType(cfg, key);
            }
         }.bind(this));
      },
      _beforeApply: function() {
         var def = new $ws.proto.Deferred(),
             view = this._currentView,
             selected = view.getSelection(true);

         if (view && view.getRecordSet().getRecords().length > 0) {
            def.callback(selected);
         } else {
            def.errback();
         }

         return def;
      },

      destroy: function() {
         if (this._isOpen) {
            this._stopTrackWrapper();
         }

         if (this._zIndex !== undefined) {
            $ws.single.WindowManager.releaseZIndex(this._zIndex);
         }

         this._listenView(false);
         this._currentView = null;
         this._blocks.wrapper.remove();
         this._destroyButtons();

         $ws.proto.OperationsPanel.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.OperationsPanel;
});