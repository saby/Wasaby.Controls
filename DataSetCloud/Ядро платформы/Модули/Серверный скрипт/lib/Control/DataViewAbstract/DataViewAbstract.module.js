/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 1:12
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.DataViewAbstract',
      [
         'js!SBIS3.CORE.Control',
         'js!SBIS3.CORE.TDataSource',
         'js!SBIS3.CORE.FieldDropdown',
         'js!SBIS3.CORE.Paging',
         'js!SBIS3.CORE.Dialog',
         'js!SBIS3.CORE.LoadingIndicator',
         'is!browser?Core/jquery-dblclick',
         'css!SBIS3.CORE.DataViewAbstract'
      ],
   function( Control, TDataSource, FieldDropdown, Paging, Dialog, LoadingIndicator) {

   'use strict';

   var PRELOAD_ENABLED_MODES = { 'newDialog': 1, 'thisPage': 1, 'newFloatArea': 1 };

   var reDisablePreload = /\bdisablepreload\b/i;

   $ws._const.Browser = $ws._const.Browser || {};
   $ws._const.Browser.pageSizes = [
         10,
         20,
         25,
         50,
         100,
         200,
         500,
         1000
      ];
   $ws._const.Browser.minHeight = 24;
   $ws._const.Browser.loadingIndicatorDelay = 1000;
   $ws._const.Browser.loadingIndicatorForReadDelay = 3000;
   $ws._const.Browser.rowOptionsActions = {
      'addItem': true,
      'edit': true,
      'delete': true
   };
   $ws._const.Browser.rowOptionsShowDelay = 350;
   $ws._const.Browser.rowOptionsHideDelay = 1000;
   $ws._const.Browser.rowOptionsMenuOffset = {'left': 5, 'top': -5};
   $ws._const.Browser.rowOptionsElementsOffset = {'right': 1, 'top': 0};
   $ws._const.Browser.rowOptionsOverflow = 3;
   $ws._const.Browser.rowOptionsButtonWidth = 34;
   $ws._const.Browser.rowOptionBeforeAll = -1;
   $ws._const.Browser.imgPath = $ws._const.wsRoot + ($ws._const.theme ? 'img/themes/' + $ws._const.theme + '/browser/' : 'img/browser/');


   $ws.single.DependencyResolver.register('SBIS3.CORE.DataViewAbstract', function(config){
      var deps = {};

      if(config){
         deps['js!SBIS3.CORE.PrintPlugin'] = 1;

         if(config.display.showPaging) {
            deps['js!SBIS3.CORE.Paging'] = 1;
         }

         if(config.allowMove || !('allowMove' in config) || config.display.sequenceNumberColumn){  //TODO allowMove must be false as default, remove second check
            deps['js!SBIS3.CORE.MovePlugin'] = 1;
         }

         if(config.rowOptions) {
            deps['js!SBIS3.CORE.Menu'] = 1;
         }

         if(config.useCopyRecords) {
            deps['js!SBIS3.CORE.CopyPlugin'] = 1;
         }

         if(config.useMergeRecords) {
            deps['js!SBIS3.CORE.MergePlugin'] = 1;
         }

         if(config.display.showHistory) {
            deps['js!SBIS3.CORE.HistoryPlugin'] = 1;
         }

         if(config.display.showToolbar) {
            deps['js!SBIS3.CORE.ToolbarPlugin'] = 1;
            deps['js!SBIS3.CORE.ToolBar'] = 1;
            deps['js!SBIS3.CORE.Button'] = 1;
            deps['js!SBIS3.CORE.Menu'] = 1;
         }
         if(config.display.scrollPaging) {
            deps['js!SBIS3.CORE.Paging'] = 0;
            deps['js!SBIS3.CORE.ScrollPaging'] = 1;
         }
         if(config.markedRowOptions && !Object.isEmpty(config.markedRowOptions)) {
            deps['js!SBIS3.CORE.MarkedRowOptionsPlugin'] = 1;
         }
         if(config.display.usePartScroll) {
            deps['js!SBIS3.CORE.PartScrollPlugin'] = 1;
         }
      }

      return Object.keys(deps);
   });

   /**
    * @class $ws.proto.DataViewAbstract
    * @extends $ws.proto.DataBoundControl
    * @ignoreOptions value
    */

   $ws.proto.DataViewAbstract = Control.DataBoundControl.extend(/** @lends $ws.proto.DataViewAbstract.prototype */{
       /**
        * @cfg {Boolean} Сохранять состояние
        * @name $ws.proto.DataViewAbstract#saveState
        * @description
        * Будет ли контрол сохранять состояние.
        */
      /**
       * @event onRowActivated При активации строки
       * Происходит при клике на строку или нажатии на ней Enter.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {jQuery} row Текущий выделенный элемент.
       * @param {$ws.proto.Record} dataRow Текущая выделенная запись (соответствующая текущему выделенному элементу).
       * @example
       * <pre>
       *    dataView.subscribe('onRowActivated', function(event, row, record){
       *       $ws.single.GlobalContext.setValue('Тип', record.get('Документ.Тип'));
       *    });
       * </pre>
       */
      /**
       * @event onBeforeLoad До начала загрузки
       * Событие, происходящее перед тем, как начнётся загрузка данных.
       * Данное событие является информационным. В момент этого события все параметры фильтрации уже сформированы и
       * поменять их нельзя.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    dataView.subscribe('onBeforeLoad', function(event){
       *       $ws.core.alert('Загрузка началась.');
       *    });
       * </pre>
       */
      /**
       * @event onAfterLoad После окончания загрузки
       * Возникает после окончания загрузки данных, т.е. когда данные уже загружены, но отрисовка еще не началась.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    dataView.subscribe('onAfterLoad', function(event){
       *       $ws.core.alert("Загрузка завершена.");
       *    });
       * </pre>
       */
      /**
       * @event onDataReady После окончания загрузки и отрисовки
       * Возникает после окончания загрузки данных, т.е. когда данные уже загружены, но отрисованы.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    dataView.subscribe('onDataReady', function(event){
       *       $ws.core.alert("Загрузка завершена.");
       *    });
       * </pre>
       */
      /**
       * @event onAfterRender После окончания рендеринга
       * Происходит после отображения в таблице пришедших данных.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    dataView.subscribe('onAfterRender', function(event){
       *       // на каждую вторую строку повесим свой класс
       *       this.getContainer().find('tr[rowkey]:odd').addClass('my-zebra-class');
       *    });
       * </pre>
       */
      /**
       * @event onBeforeInsert Перед добавлением записи
       * <wiTag class=TableView page=5>
       * <wiTag page=2>
       * Происходит после создания записи на БЛ, но перед отображением пользователю диалога редактирования созданной
       * записи.
       * !Важно для {@link editMode режимов редактирования} newWindow и thisWindow:
       * обработчики событий передаются в окно редактирования записи, которое находится на отдельной вкладке.
       * На этой вкладке уже нет представления данных. Поэтому переменная this в теле обработчика события не будет
       * ссылаться на представление данных.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record} record Полученная запись от метода Создать.
       * @return {Boolean|String|*} Если передать:
       * <ol>
       * <li>false - отказ от создания записи, диалог не отображается, запись будет удалена,</li>
       * <li>true - отказ от отображения диалога, запись не удаляется,</li>
       * <li>строку -  изменение диалога редактирования, в качестве диалога редактирования будет показан диалог с
       * переданным именем,</li>
       * <li>любой другой тип - созданная запись редактируется стандартным образом диалогом, указанным в конфигурации
       * табличного браузера.</li>
       * </ol>
       * @example
       * <pre>
       *    dataView.subscribe('onBeforeInsert', function(event, record){
       *       var date = record.get('Дата'),
       *          day = date.getDay();
       *       // Не даем создавать записи по чётным числам =)
       *       if(date.getDate()%2 === 0)
       *          event.setResult(false);
       *       else if(day >= 6){
       *          // а для созданных в выходные покажем другой диалог
       *          event.setResult('НоваяЗаписьВВыходные');
       *       }
       *    });
       * </pre>
       * @see editDialogTemplate
       * @see editFullScreenTemplate
       * @see allowEdit
       */
      /**
       * @event onBeforeCreate Перед созданием записи
       * <wiTag class=TableView page=5>
       * Происходит перед вызовом метода БЛ создания записи. Событие необходимо указывать в Джинне или прописывать в xhtml.
       * <wiTag page=2>
       * <wiTag class=TableView page=5>
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} ident Идентификатор записи-родителя.
       * @param {Boolean} node Признак узла создаваемой записи.
       * @param {Object} filter Текущий фильтр табличного браузера, по которому будут проинициализированы поля
       * создаваемой записи.
       * @return {$ws.proto.Deferred|$ws.proto.Record|Object|Boolean|*} Если передать:
       * <ol>
       * <li>Асинхронное событие - считаем, что из него вернут либо запись, созданную самостоятельно, либо фильтр, по
       * которому будет необходимо проинициализировать создаваемую запись.</li>
       * <li>$ws.proto.Record - считаем, что пришедшая запись и есть созданная.</li>
       * <li>Object - считаем пришедший объект фильтром, по которому следует создавать новую запись.</li>
       * <li>Boolean - если передать false, то новая запись не будет создана.</li>
       * <li>Любой другой тип - создаем запись стандартным образом.</li>
       * </ol>
       * @example
       * $ws.proto.Deferred:
       * <pre>
       *    onBeforeCreate: function(event, ident, node, filter){
       *       event.setResult(
       *          $ws.helpers.newRecordSet('Сотрудник', 'Список', {}, undefined, false)
       *             .addCallback(function(rs){
       *                return rs.createRecord({
       *                   "Подразделение": this.getLinkedContext().getValue('Документ.НашаОрганизация')
       *                });
       *          })
       *       );
       *    };
       * </pre>
       * $ws.proto.Record:
       * <pre>
       *    onBeforeCreate: function(event, ident, node, filter){
       *       event.setResult(
       *          new $ws.proto.Record({
       *             row: [],
       *             colDef: [],
       *             parentRecordSet: this.getRecordSet(),
       *             pkValue: null
       *          });
       *       );
       *    };
       * </pre>
       * Object:
       * <pre>
       *    onBeforeCreate: function(event, ident, node, filter){
       *       filter["Фамилия"] = "Иванов";
       *       event.setResult(filter);
       *    };
       * </pre>
       * Boolean:
       * <pre>
       *    onBeforeCreate: function(event, ident, node, filter){
       *       if (this.getLinkedContext().getValue('СозданиеЗапрещено')){
       *          // Отменяем создание записи
       *          event.setResult(false);
       *       }
       *    };
       * </pre>
       */
      /**
       * @event onBeforeRead Перед чтением записи
       * <wiTag class=TableView page=5>
       * Происходит перед вызовом метода БЛ чтения записи.
       * <wiTag page=2>
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Number|String} key Идентификатор вычитываемой записи.
       * @return {$ws.proto.Deferred|$ws.proto.Record|*} Если передать:
       * <ol>
       * <li>асинхронное событие - считаем, что из него вернут запись, прочитанную самостоятельно.</li>
       * <li>$ws.proto.Record - считаем, что пришедшая запись и есть прочитанная.</li>
       * <li>Любой другой тип - вычитываем запись стандартным образом.</li>
       * </ol>
       * @example
       * $ws.proto.Deferred:
       * <pre>
       *    dataView.subscribe('onBeforeRead', function(event, key){
       *       var self = this;
       *       event.setResult(
       *          $ws.helpers.newRecordSet('Сотрудник', 'Список', {}, undefined, false)
       *             .addCallback(function(rs){
       *                var record = self.getRecordSet().getRecordByPrimaryKey(key);
       *                return rs.readRecord(record.get('Сотрудник.@Лицо'));
       *          })
       *       );
       *    });
       * </pre>
       * $ws.proto.Record:
       * <pre>
       *    dataView.subscribe('onBeforeRead', function(event, key){
       *       event.setResult(this.getRecordSet().getRecordByPrimaryKey(key));
       *    });
       * </pre>
       */
      /**
       * @event onBeforeUpdate Перед редактированием записи
       * <wiTag page=2>
       * <wiTag class=TableView page=5>
       * <wiTag class=TableView page=6>
       * Происходит после чтения записи на БЛ, но перед отображением пользователю диалога редактирования.
       * !Важно для {@link editMode режимов редактирования} newWindow и thisWindow:
       * обработчики событий передаются в окно редактирования записи, которое находится на отдельной вкладке.
       * На этой вкладке уже нет представления данных. Поэтому переменная this в теле обработчика события не будет
       * ссылаться на представление данных.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record} record Полученная запись от метода Прочитать.
       * @param {Boolean} atPlaceEdit Признак, что событие инициировано при редактировании по месту.
       * @return {Boolean|String|*} Если передать:
       * <ol>
       * <li>Boolean - отказ от редактирования записи, диалог не отображается.</li>
       * <li>String - изменение диалога редактирования, в качестве диалога редактирования будет показан диалог с
       * переданным именем.</li>
       * <li>Deferred - поддерживается только при ипользовании редактирования по месту; означает, что разработчик сам сохраняет запись</li>
       * <li>Любой другой тип данных - запись редактируется стандартным образом диалогом, указанным в конфигурации
       * табличного браузера.</li>
       * </ol>
       * @example
       * <pre>
       *    dataView.subscribe('onBeforeUpdate', function(event, record){
       *       var date = record.get('Дата'),
       *           day = date.getDay();
       *       // Не даем редактировать записи по нечетным числам =)
       *       if(date.getDate()%2 === 1)
       *          event.setResult(false);
       *       else if(day < 6){
       *          // а для созданных в будни покажем другой диалог
       *          event.setResult('ДругойДиалогРедактирования');
       *       }
       *    });
       * </pre>
       * @see editDialogTemplate
       * @see editFullScreenTemplate
       * @see allowEdit
       */
      /**
       * @event onDeleteStart Перед началом удаления записей
       * Событие происходит перед началом удаления выделенных записей.
       * <wiTag page=2>
       * <wiTag class=TableView page=5>
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record[]} data Массив записей, предполагаемых к удалению.
       * @return {Boolean|String|$ws.proto.Deferred|*} Если передать:
       * <ol>
       * <li>false - отказ от удаления записей, для пользователя ничего не произойдет.</li>
       * <li>String - воспринимаем как новый текст подтверждения удаления.</li>
       * <li>$ws.proto.Deferred - ждем, когда закончится асинхронное событие, и только после его успешного завершения
       * продолжаем удаление.</li>
       * <li>Любой другой тип данных - запись удаляется стандартным образом.</li>
       * </ol>
       * @example
       * Boolean:
       * <pre>
       *    dataView.subscribe('onDeleteStart', function(event, data){
       *       if(new Date().getDay() >= 6){
       *          event.setResult(false);
       *          $ws.core.alert("Вы не можете удалять записи по выходным.");
       *       }
       *    });
       * </pre>
       * String:
       * <pre>
       *    dataView.subscribe('onDeleteStart', function(event, data){
       *       event.setResult("Вы уверены, что хотите удалить эти документы?");
       *    });
       * </pre>
       * $ws.proto.Deferred:
       * <pre>
       *    dataView.subscribe('onDeleteStart', function(event, data){
       *       var object = new $ws.proto.BLObject("Документ"),
       *           requestData = [];
       *       for(var i = 0, l = data.length; i < l; i++)
       *          requestData.push(data.toJSON());
       *       event.setResult(object.call('ПередУдалить', {
       *          'Записи': requestData
       *       }, $ws.proto.BLObject.RETURN_TYPE_ASIS));
       *    });
       * </pre>
       */
      /**
       * @event onBeforeDelete Перед удалением записи
       * Событие происходит перед удалением каждой записи.
       * Если удаляются несколько записей, то это событие будет поднято для каждой из удаляемых записей.
       * <wiTag page=2>
       * <wiTag class=TableView page=5>
       * Происходит перед удалением всех отмеченных записей, либо активной записи.
       * Даже если отмечено несколько записей, то событие поднимется один раз.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array}  records Массив удаляемых записей
       * @return {Boolean|*} Если передать:
       * <ol>
       * <li>false - отказ от удаления записи.</li>
       * <li>Array - массив ключей записей, которые удалять не нужно.</li>
       * <li>Любой другой тип - запись удаляется стандартным образом.</li>
       * </ol>
       * @example
       * <pre>
       *    dataView.subscribe('onBeforeDelete', function(event, record){
       *       if(record.get('Документ.Запущен') === true){
       *          // не даем удалять запущенные в обработку документы
       *          event.setResult(false);
       *       }
       *    });
       * </pre>
       */
      /**
       * @event onRowDoubleClick При двойном клике на строке
       * @deprecated Не использовать. Событие будет удалено с 3.8.0.
       * Событие происходит при двойном клике на строке.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {jQuery} row Текущий выделенный элемент.
       * @param {$ws.proto.Record} dataRow Текущая выделенная запись (соответствующая текущему выделенному элементу).
       * @param {String} tableHeadName Заголовок колонки, на которую кликнули.
       * @param {String} rowColumnName Столбец записи, данные из которого отображает колонка, на которую кликнули.
       * @return {Boolean} False - дальнейшая активация записи (обработка выбора или редактирование) не последует.
       * @example
       * <pre>
       *    dataView.subscribe('onRowDoubleClick', function(event, row, record, title, field){
       *       if(title == 'Дата'){
       *          event.setResult(false);
       *       }
       *    });
       * </pre>
       * @see mode
       */
      /**
       * @event onRowClick При клике на строке
       * Событие происходит при одинарном клике на строке.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {jQuery} row Текущий выделенный элемент.
       * @param {$ws.proto.Record} dataRow Текущая выделенная запись (соответствующая текущему выделенному элементу).
       * @param {String} tableHeadName Заголовок колонки, на которую кликнули.
       * @param {String} rowColumnName Столбец записи, данные из которого отображает колонка, на которую кликнули.
       * @return {Boolean} False - дальнейшая активация записи (обработка выбора или редактирование) не последует.
       * @example
       * <pre>
       *    dataView.subscribe('onRowClick', function(event, row, record, title, field){
       *       if(title == 'Дата'){
       *          event.setResult(false);
       *       }
       *    });
       * </pre>
       */
      /**
       * @event onSetCursor При установке курсора на строку
       * Событие происходит при установке курсора на строку.
       * Если строк нет, то событие тоже произойдет, но в качестве второго и третьего аргументов получит undefined.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {jQuery} row Текущий выделенный элемент.
       * @param {$ws.proto.Record} dataRow Текущая выделенная запись (соответствующая текущему выделенному элементу).
       * @example
       * <pre>
       *    dataView.subscribe('onSetCursor', function(event, row, record){
       *       $ws.single.ControlStorage.getByName("ТелефоныПоСотруднику").setQuery({
       *          'Сотрудник': record.getKey()
       *       });
       *    });
       * </pre>
       */
      /**
       * @event onFilterChange При изменении фильтров
       * <wiTag class=TableView page=2>
       * Событие происходит при смене фильтров браузера.
       * Происходит при любом изменении параметров фильтрации табличного браузера как из кода, так и пользователем.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} filter Новое значение фильтров.
       * @example
       * <pre>
       *    dataView.subscribe('onFilterChange', function(event, filter){
       *       // синхронизация
       *       $ws.single.ControlStorage.geByName('Сотрудники').setQuery(filter);
       *    });
       * </pre>
       * @see filterParams
       * @see filterDialogTemplate
       */
      /**
       * @event onChangeSelection При смене выбранных строк
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record | Array} record Запись или массив записей, которую/ые выделили/сняли отметку.
       * @param {Boolean} isMarked Сняли выделение или поставили.
       * @example
       * <pre>
       *    dataView.subscribe('', function(event, record, isMarked){
       *       if(this.getSelection(true).length > 0)
       *          $ws.single.ControlStorage.getByName("Выбрать").show();
       *    });
       * </pre>
       */
      /**
       * @event onSelectionConfirm При подтверждении выбора
       * Событие происходит при подтвержденнии выбора (нажатии Enter в браузере, находящемся в режиме выбора или
       * нажатии сочетания клавиш Ctrl+Enter).
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} selectedRecords Массив выбранных записей.
       * @example
       * <pre>
       *    dataView.subscribe('onSelectionConfirm', function(event, records){
       *       addToFavourite(records);
       *    });
       * </pre>
       * @see setSelectionMode
       */
      /**
       * @event onAfterInsert При сохранении новой записи
       * Событие происходит при сохранении новой(созданной) записи.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record} record Новая запись.
       * @return {Object} Можем заменить запись в браузере (без перезагрузки записи).
       * {
       *       position : {Integer},
       *       record: $ws.proto.Record
       *    } - позиция в которую вставить запись и сама запись.
       *    Строка - рассматривается как ключ новой записи, на которую нужно спозиционироваться в списке
       *    Используется для случая работы со сложными идентификаторами
       * Если передать:
       * <ol>
       * <li>true - заменить последнюю запись;</li>
       * <li>position - номер строки, на которую вставить (отсчет с 1).</li>
       * </ol>
       * Если передать номер строки, которой нет, то вставит новую запись вместо последней. Таким образом, общее
       * количество записей не изменяется.
       * @example
       * <pre>
       *    var browser = $ws.single.ControlStorage.getByName('BrowserName');
       *    browser.subscribe('onAfterInsert', function(event){event.setResult(1)}) //- вставить на первую позицию
       * </pre>
       *
       */
      /**
       * @event onRecordsChanged При изменении записей
       * <wiTag page=2>
       * <wiTag class=TableView page=5>
       * Событие происходит при изменении данных в рекордсете перед перерисовкой браузера.
       * Происходит при любом изменении набора записей: удаление, редактирование, создание, объединение или копирование.
       * !Важно для {@link editMode режимов редактирования} newWindow и thisWindow:
       * обработчики событий передаются в окно редактирования записи, которое находится на отдельной вкладке.
       * На этой вкладке уже нет представления данных. Поэтому переменная this в теле обработчика события не будет
       * ссылаться на представление данных.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    dataView.subscribe('onRecordsChanged', function(event){
       *       this.reload();
       *    });
       * </pre>
       * @see allowAdd
       * @see allowDelete
       * @see allowEdit
       * @see editFullScreenTemplate
       * @see editDialogTemplate
       */
      /**
       * @event onReady При готовности
       * Событие происходит при готовности браузера, в частности, когда готов recordSet.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    dataView.subscribe('onReady', function(event){
       *       this.setPage(2);
       *    });
       * </pre>
       */
      /**
       * @event onBeforeOpenEditWindow Перед открытием страницы редактирования
       * <wiTag class="TableView" page="5" >
       * <wiTag page="4" >
       * Событие происходит при редактировании в новой вкладке до изменения url.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} pageURL Сгенерированный адрес страницы.
       * @return {String} Если вернули строку, то считаем ее новым адресом страницы редактирования записи.
       * @example
       * <pre>
       *    dataView.subscribe('onBeforeOpenEditWindow', function(event, url){
       *       event.setResult(url + '?type=1');
       *    });
       * </pre>
       * @see editDialogTemplate
       * @see editFullScreenTemplate
       * @see allowEdit
       */
      /**
       * @event onLoadError При ошибке загрузки данных
       * Событие сработает при получении ошибки от любого метода БЛ, вызванного стандартным способом.
       * То есть при получении списка, при чтении, при создании или при удалении записи.
       * !Важно для {@link editMode режимов редактирования} newWindow и thisWindow:
       * обработчики событий передаются в окно редактирования записи, которое находится на отдельной вкладке.
       * На этой вкладке уже нет представления данных. Поэтому переменная this в теле обработчика события не будет
       * ссылаться на представление данных.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {HTTPError} error Произошедшая ошибка.
       * @param {String} methodName Имя метода, при вызове которого произошла ошибка.
       * @return {Boolean} Если вернуть:
       * <ol>
       * <li>true, то будет считаться, что ошибка обработана, и браузер ничего делать не будет.</li>
       * <li>Однако, если код ошибки - 403, вернуть true и не поставить флаг processed у ошибки, то ошибку обработает
       * транспорт и покажет alert.</li>
       * <li>Если не возвращать true, то дальше будет проверка на тип ошибки. Если её код - 403, то будет показан блок с
       * текстом "Недостаточно прав для просмотра информации". Иначе - alert с описанием ошибки.</li>
       * </ol>
       * @example
       * <pre>
       *    dataView.subscribe('onLoadError', function(event, error, methodName){
       *       event.setResult(true);
       *       if(error.httpError == 403){
       *          error.processed = true;
       *       }
       *    });
       * </pre>
       */
      /**
       * @event onChange
       * <wiTag noShow>
       */
      /**
       * @event onValueChange
       * <wiTag noShow>
       */
      /**
       * @event onSelectEditMode Перед запуском редактирования/добавления записи
       * Событие происходит перед началом редактирования/добавления записи и позволяет для конкретной записи изменить
       * режим редактирования, установленный в опции {@link editMode}. Значение же опции при этом не изменится.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} recordId Ключ записи.
       * @param {String} isBranch Какого типа запись собираемся редактировать.
       * @param {String} parentId В каком разделе редактируемая/создаваемая запись.
       * @param {String} editMode Текущий режим редактирования.
       * @param {String} editTemplate Имя используемого диалога.
       * @return {String} Если одну из следующих строк:
       * <ul>
       *   <li>newDialog: редактировать с помощью диалога;</li>
       *   <li>newWindow: редактировать в новой вкладке;</li>
       *   <li>thisWindow: редактировать в этой же вкладке;</li>
       *   <li>thisPage: редактировать в этой же области;</li>
       *   <li>newFloatArea: редактировать в выезжающей панели,</li>
       * </ul>
       * то будет считаться, что это новый режим редактирования для текущей записи.
       * @see editDialogTemplate
       * @see editFullScreenTemplate
       * @see editMode
       * @see allowEdit
       * @see allowAdd
       */
      /**
       * @event onSelectFormat Происходит перед вызовом чтения/создания записи
       * Предназначено для подмены метода, определяющего формат объекта.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} recordId Ключ записи.
       * @param {String} format Текущий формат.
       * @return Можно изменить метод, определяющий формат - вернуть строкой имя нужного метода.
       */
      /**
       * @event onUpdateActions Происходит при перестроении списка действий
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} actions Объект с действиями вида ключ-значение, где ключ - название дейстия, значение - признак доступности.
       * @example
       * При перестроении списка действий у представления данных (dataView) сделать доступной или недоступной кнопку (btn)
       * в зависимости от значения признака "Только для чтения" у представления данных.
       * <pre>
       *    dataView.subscribe('onUpdateActions', function(eventObject, actions) {
       *       btn.setEnabled(this.isReadOnly());
       *    });
       * </pre>
       * @see allowDelete
       * @see allowAdd
       * @see allowEdit
       */
      /**
       * @event onCalculateSum Срабатывает при суммировании записей
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} [records] Массив записей {@link $ws.proto.Record}. Передаётся для суммирования конкретных записей,
       * без задания этого параметра будет суммирование всех записей.
       * @return Для отображения в диалоге суммирования не всех результатов нужно вернуть Deferred с колонками, по которым
       * построится диалог суммирования.
       * Для отмены показа диалога суммирования в Deferred нужно вернуть false. При этом платформенное суммирование не вызывается.
       * @see sumFields
       */
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} preprocessQuery
             * Получать данные на стороне сервера
             * <wiTag group="Данные">
             * Данные списочного метода будут получены на стороне сервера, на стороне клиента будет только отрисовка
             * Такое поведение распространяется только на первый запрос данных
             * @group Data
             */
            preprocessQuery : false,
            /**
             * @cfg {Boolean} Разрешить выбор нескольких строк
             * <wiTag group="Управление">
             * Позволяет выбрать несколько строк для одновременного взаимодействия с ними.
             * Опция работает только при разрешении {@link useSelection выбора или отметки записей} и отображения {@link $ws.proto.TableView#showSelectionCheckbox флагов у записей}.
             * При значении данной опции false у связанной панели массовых операций не будет флага "Отметить все".
             * @example
             * <pre>
             *    <option name="multiSelect">false</option>
             * </pre>
             * @see useSelection
             * @see showSelectionCheckbox
             * @see setMultiSelect
             * @see isMultiSelect
             * @group Edit
             */
            multiSelect: true,
            /**
             * @cfg {Boolean} Использовать выбор и выделение записей
             * <wiTag group="Отображение">
             * Данная опция отвечает за возможность выбора и выделения записей.
             * @example
             * <pre>
             *    //убираем флаг "Выделить все" в заголовке представления данных
             *    <option name="useSelection">false</option>
             * </pre>
             * @see multiSelect
             */
            useSelection: true,
            /**
             * @cfg {Boolean} Разрешено добавление записей
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag group="Данные" page=2>
             * Возможно ли в данном представлении данных добавление записей.
             * @example
             * <pre>
             *    <option name="allowAdd">false</option>
             * </pre>
             * @see setAllowAdd
             * @see useSelection
             * @group Record Actions
             */
            allowAdd: true,
            /**
             * @cfg {Boolean} Разрешено редактирование записей
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag group="Данные" page=2>
             * Возможно ли в данном представлении данных редактирование записей.
             * @example
             * <pre>
             *    <option name="allowEdit">false</option>
             * </pre>
             * @see setAllowEdit
             * @see useSelection
             * @see editDialogTemplate
             * @see editMode
             * @see editFullScreenTemplate
             * @group Record Actions
             */
            allowEdit: true,
            /**
             * @cfg {Boolean} Разрешено удаление записей
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag group="Данные" page=2>
             * Возможно ли в данном представлении данных удаление записей.
             * @example
             * <pre>
             *    <option name="allowDelete">false</option>
             * </pre>
             * @see setAllowDelete
             * @see useSelection
             * @group Record Actions
             */
            allowDelete: true,
            /**
             * @cfg {Object} Источник данных
             * <wiTag group="Данные">
             * Параметры этой опции передаются непосредственно в TDataSource.
             * Пример использования смотри в описании {@link TDataSource}.
             * @example
             * <pre>
             *    dataView.setSource({
             *       readerType: "ReaderUnifiedSBIS",
             *        readerParams: {
             *          linkedObject: "Справочник",
             *          queryName: 'Список'
             *        },
             *        filterParams: {
             *           'param' : 'val1',
             *           'param2' : 'val2'
             *        }
             *    });
             * </pre>
             * @editor TDataSourceEditor
             * @see recordSetReady
             * @see setSource
             * @see setData
             * @see getRecordSet
             * @group Data
             */
            dataSource: TDataSource,
            /**
             * @cfg {String} Режим перемещения записей
             * <wiTag class=TableView group="Отображение" page=5>
             * <wiTag group="Отображение" page=2>
             * @variant newDialog В новом диалоге фреймворка
             * @variant newFloatArea В новой выезжающей панели
             */
            moveMode: 'newDialog',
            /**
             * @cfg {String} Режим редактирования записей
             * <wiTag class=TableView group="Отображение" page=5>
             * <wiTag group="Отображение" page=2>
             * !Важно для режимов редактирования newWindow и thisWindow:
             * обработчики событий передаются в окно редактирования записи, которое находится на отдельной вкладке.
             * На этой вкладке уже нет представления данных. Поэтому переменная this в теле обработчика события не будет
             * ссылаться на представление данных.             
             * @example
             * <pre>
             *     <option name="editMode">newFloatArea</option>
             * </pre>
             * @see onSelectEditMode
             * @variant newDialog В новом диалоге фреймворка
             * @variant newWindow В новой вкладке интернет-браузера
             * @variant thisWindow В той же вкладке интернет-браузера
             * @variant thisPage В той же области
             * @variant newFloatArea В новой выезжающей панели
             * @group Edit
             */
            editMode: 'newDialog',
            /**
             * @cfg {String} Диалог редактирования записи
             * <wiTag class=TableView group="Отображение" page=5>
             * <wiTag group="Отображение" page=2>
             * @example
             * <pre>
             *     <option name="editDialogTemplate">js!SBIS3.DemoCode.NewItem</option>
             * </pre>
             * Имя шаблона диалога редактирования элемента или листа
             * @see onBeforeInsert
             * @see onBeforeUpdate
             * @see allowEdit
             * @see editMode
             * @see onBeforeOpenEditWindow
             * @editor ExternalComponentChooser
             * @group Edit
             */
            editDialogTemplate: '',
            /**
             * @cfg {String} Шаблон, открываемый кликом на ссылку в заголовке выезжающей панели редактирования
             * <wiTag class=TableView group="Отображение" page=5>
             * <wiTag group="Отображение" page=2>
             * Этот шаблон откроется в новой вкладке web-браузера по клику на ссылку в заголовке выезжающей панели редактирования.
             * Опция актуальна только для {@link editMode режима редактирования} newFloatArea.
             * Значение данной опции передастся в опцию RecordFloatArea {@link $ws.proto.RecordFloatArea#editFullScreenTemplate}.
             * Если не задан, то считается, что переход к полноэкранному просмотру записи невозможен.
             * @see allowEdit
             * @see editMode
             * @see onBeforeOpenEditWindow
             * @see onBeforeUpdate
             * @editor ExternalComponentChooser
             * @group Edit
             */
            editFullScreenTemplate: undefined,
            /**
             * @cfg {String} Имя шаблона диалога фильтрации браузера
             * <wiTag group="Данные">
             * <wiTag class=TableView page=2>
             * Показать диалог фильтрации представления данных можно методом createFiltersDialog.
             * Через этот же метод шаблон фильтрации можно подменить на текущий показ.
             * Получить основное имя шаблона диалога редактирования можно методом getFiltersDialogName.
             * @example
             * <pre>
             *     <option name="filterDialogTemplate">js!SBIS3.DemoCode.FilterDialogTemplate</option>
             * </pre>
             * @see onFilterChange
             * @see createFiltersDialog
             * @see getFiltersDialogName
             * @editor ExternalComponentChooser
             * @group Edit
             */
            filterDialogTemplate: '',
            /**
             * @typedef {Object} FilterParam
             * @property {String} fieldName Имя поля
             * @property {boolean} [autoreload=true] Перезагружать данные при изменении поля в контексте
             */
            /**
             * @cfg {Object.<String, Boolean|Number|String|FilterParam>} Параметры метода бизнес-логики
             * <wiTag group="Данные">
             * Параметры фильтрации данных метода БЛ.
             * @example
             * <pre>
             *    filterParams: {
             *       // Параметр1 задается постоянным значением
             *       "Параметр1": "Значение1",
             *       // Параметр2 задается функцией
             *       "Параметр2": function(){
             *          return "Значение2";
             *       },
             *       // а Параметр3 берется из поля контектса ИмяПоля
             *       "Параметр3":{
             *          fieldName: "ИмяПоля"[, autoreload: true]
             *       }
             *    }
             * </pre>
             * @see getQuery
             * @see setQuery
             * @group Data
             * @noShow
             */
            filterParams: {},
            /**
             * @cfg {Boolean} Устанавливать ли курсор на первую строку при загрузке
             * <wiTag group="Управление">
             * Устанавливает курсор на первую строку при отображении таблицы после загрузки данных.
             * Если этот флаг снят, то выделение активной записи появится только при выборе записи пользователем.
             */
            setCursorOnLoad: true,
            /**
             * @cfg {String} Режим управления браузером
             * <wiTag class=TableView page=9 group="Управление">
             * <wiTag group="Управление">
             * @deprecated Не использовать. Опция будет удалена с 3.8.0
             * Режим управления браузером:
             * @variant oneClickMode одинарным щелчком
             * @variant dblClickMode двойным щелчком             
             * @see navigationMode
             * @group Edit
             */
            mode: 'oneClickMode',
            /**
             * @cfg {Boolean} Устанавливать активную запись мышью
             * <wiTag group="Управление">
             * При таком режиме использования активной считается та запись, на которую наведена мышь.
             * Важно: активная запись никак не маркируется.
             * @group Edit
             */
            useHoverRowAsActive: false,
            /**
             * @cfg {Boolean} Ставить ли новый dataSource при создании контрола, даже если есть _parent, мы его
             * <wiTag noShow>
             * onReady дожидаться не будем (используется только(!) для кнопки переключения из иерархии в дерево)
             */
            setNewDataSourceWithParent : false,
            /**
             * @cfg {Object} Поля для суммирования
             * <wiTag group="Данные">
             * Поля для суммирования - это те поля, по которым производится суммирование значений записей.
             * Для суммирования подходят поля типов "Число целое", "Число вещественное" и "Деньги".
             *
             * Результат суммирования по полю выводится в отдельном диалоговом окне напротив названия поля.
             * Отображаемое название можно изменить, задав альтернативное имя при конфигурации полей суммирования.
             *
             * Если в sumFields не задать столбец для суммирования, то посчитается количество выбранных записей.
             * @example
             * 1. Структура объекта, описывающего поля для суммирования.
             * <pre>
             *    <options name="sumFields">
             *       //задаём поле суммирования в виде <option name="ИмяПоля">АльтернативноеИмя</option>
             *       <option name="ИтогПр">Сумма</option>
             *    </options>
             * </pre>
             * 2. Задать три поля для суммирования.
             * <pre>
             *    sumFields: {
             *       //имя поля "ЗарПлат" хотим отображать в диалоговом окне как "Заработная плата"
             *       'ЗарПлат': 'Заработная плата',
             *       //имя поля "Число". Альтернативное имя не определено. В диалоговом окне имя поля отобразится как "Число"
             *       'Число': undefined,
             *       //имя поля "УРВ" хотим отображать в диалоговом окне как "Учёт рабочего времени"
             *       'УРВ': 'Учёт рабочего времени'
             *    }
             * </pre>
             * @see onCalculateSum
             * @see getSumFields
             * @see setSumFields
             * @editor SumFieldsEditor
             */
            sumFields: {},
            /**
             * @cfg {Boolean} Перезагрузка данных после выполнения операции
             * <wiTag class=TableView group="Данные" page=5>
             * <wiTag group="Данные" page=2>
             * Будут ли данные перезапрошены при добавлении, удалении или редактировании записей.
             * @see reload
             * @see setReload
             * @see getReload
             * @group Display
             */
            reloadAfterChange: undefined,
            /**
             * @cfg {Object} Параметры отображения данных на экране
             * <wiTag noShow>
             * @group
             */
            display: {
               /**
                * @typedef {String} VerticalAlign
                * @variant top сверху
                * @variant bottom снизу
                * @variant center по центру
                */
               /**
                * @typedef {String} AlignEnum
                * @variant left слева
                * @variant right справа
                * @variant center по центру
                * @variant auto авто
                */
               /**
                * @typedef {Object} Columns
                * @property {String} title имя колонки, как его нужно вывести на экран
                * @property {String} field имя колонки, как оно пришло в наборе данных
                * @property {String} type тип данных в столбце, как правило не указывается и проставляется по данным пришедшей выборки
                * @property {String} width ширина столбца в px
                * @property {AlignEnum} textAlign выравнивание текста в ячейке
                * @property {VerticalAlign} textVerticalAlign выравнивание текста в ячейке по вертикали
                * @property {VerticalAlign} titleVerticalAlign выравнивание текста в заголовке столбца по вертикали
                * @property {AlignEnum} titleAlign выравнивание текста в заголовке столбца
                * @property {String} className имя класса, который будет указан у каждой ячейки столбца
                * @property {String} formatValue шаблон вывода данных в столбце - см. описание формата в {@link $ws.helpers#format}
                * @property {Boolean} fixedSize меняется ли ширина колонки при изменении размеров окна
                * @property {Boolean} isSortable разрешена ли сортировка по данной колонке
                * @property {String} minWidth минимальная ширина столбца
                * @property {Function} visualFilterFunction функция отображения установленного фильтра, в качестве аргументов принимает устанавливаемый фильтр
                * @property {String} filterName параметра фильтрации, связанного с этим столбцом
                * @property {String} filterDialog диалог фильтрации по данному столбцу
                * @property {Function} captionRender функция рендеринга заголовка столбца, в качестве аргументов получает имя колонки, отображение которой строим
                * @property {Function} render имя обработчика отрисовки столбца
                * @property {Boolean} isResultField необходим ли подсчет итогов по этой колонке
                * @property {Boolean} useForFolder отображать для папки. Актуальна для HierarchyView
                * @property {String|Boolean} extendedTooltip расширенная подсказка
                * @translatable title extendedTooltip
                * @editor field BLUniqueFieldsChooser
                * @initial
                * <options>
                *    <option name="title"></option>
                * </options>
                */
               /**
                * @cfg {Columns[]} Описание отображаемых в табличном браузере колонок выборки
                * <wiTag group="Отображение">
                * См. описание в {@link $ws.proto.TableView#columns}.
                * @group Display
                */
               columns : [],
               /**
                * @cfg {Boolean} Только для чтения
                * <wiTag group="Управление">
                * При установленном флаге представление данных не позволяет изменять записи - копировать, добавлять,
                * редактировать, удалять.
                * Возможен только просмотр.
                * @example
                * <pre>
                *    <option name="readOnly">true</option>
                * </pre>
                * @see isReadOnly
                * @see setReadOnly
                * @group Display
                */
               readOnly: false,
               /**
                * @cfg {Boolean} Отображать количество записей
                * <wiTag group="Отображение">
                * Задает необходимость отображения количества записей в таблице.
                * @group Display
                */
               showRecordsCount: true,
               /**
                * @cfg {Boolean} Постраничная навигация
                * <wiTag group="Управление" page=1>
                * Параметр, отвечающий за отображение навигации.
                * @example
                * <pre>
                *     <option name="showPaging">false</option>
                * </pre>
                * @see usePaging
                * @group Paging
                */
               showPaging: true,
               /**
                * @cfg {String} Настройка режима постраничной навигации
                * <wiTag class=TableView page=1 group="Управление">
                * <wiTag group="Управление" page=1>
                * @example
                * <pre>
                *     <option name="usePaging">parts</option>
                * </pre>
                * @see recordsPerPage
                * @see pagesLeftRight
                * @see showPaging
                * @see setPage
                * @see getPagingMode
                * @variant "" постраничная навигация не используется
                * @variant parts частичная постраничная навигация - по результатам загрузки узнаёт, есть ли следующая страница
                * @variant full полная постраничная навигация - загружает информацию об общем количестве страниц
                * @group Paging
                */
               usePaging: '',
               /**
                * @cfg {Number} Количество записей на странице
                * <wiTag group="Управление" page=1>
                * Параметр указывает сколько отображать строк на одной странице в браузере.
                * @example
                * <pre>
                *    <option name="recordsPerPage">5</option>
                * </pre>
                * @see usePaging
                * @see showPaging
                * @see setPageSize
                * @see getPageSize
                * @see usePageSizeSelect
                * @see setPage
                * @group Paging
                */
               recordsPerPage: 20,
               /**
                * @cfg {Number} Диапазон соседних с текущей страниц
                * <wiTag group="Отображение">
                * Количество страниц, которые показываются слева/справа от текущей.
                * @example
                * <pre>
                *    <option name="pagesLeftRight">2</option>
                * </pre>
                * @see usePaging
                * @see recordsPerPage
                * @see setPage
                * @group Paging
                */
               pagesLeftRight: 3,
               /**
                * @cfg {Function} Функция рендеринга записи в произвольном представлении данных
                * <wiTag group="Отображение">
                * @group Display
                */
               displayValue: '',                //TODO  ПЕРЕИМЕНОВАТЬ
               /**
                * @cfg {String} Текст, отображаемый при отсутствии записей
                * <wiTag group="Отображение">
                * В случае, если метод БЛ не вернул ни одной записи, то html-текст, указанный в качестве этого значения
                * будет отображён вместо данных таблицы.
                * @example
                * <pre>
                *    <option name="emptyHtml">Нет данных</option>
                * </pre>
                * @translatable
                * @see setEmptyHtml
                * @group Display
                * @editor TextMultiline
                */
               emptyHtml: '',
               /**
                * @cfg {String} Текст, отображаемый при отсутствии записей в таблице на БЛ
                * <wiTag group="Отображение">
                * Содержит HTML-код, который будет показываться в браузере при отсутствии данных в таблице
                * @translatable
                * @group Display
                * @editor TextMultiline
                */
               emptyTableHtml: '',
               ///Это никак не Display дальше
               /**
                * @cfg {Boolean} Перезагрузка данных после выполнения операции
                * <wiTag class=TableView group="Данные" page=5>
                * <wiTag group="Данные" page=2>
                * @Depracated не использовать с 3.7.1. Использовать {@link reloadAfterChange}
                * @see setReload
                * @see getReload
                * @group Display
                */
               reload: true,
               /**
                * @cfg {Boolean} Горизонтальная прокрутка при нехватке места
                * <wiTag group="Отображение">
                * Будет ли использована горизонтальная прокрутка при недостатке места
                * @group Display
                */
               allowHorizontalScroll: true,
               /**
                * @cfg {Boolean} Отображать флаг выделения записи
                * <wiTag group="Отображение">
                * При установленном флаге при отображении слева от каждой записи будет отображен флаг выбора (чекбокс)
                * для отметки записи.
                * @group Display
                */
               showSelectionCheckbox: true,
               /**
                * @cfg {Boolean} Отображать выбор количества записей на странице
                * <wiTag group="Отображение" page=1>
                * Давать ли пользователю возможность выбора количества записей на странице
                * @see usePaging
                * @see recordsPerPage
                * @see setPageSize
                * @see getPageSize
                * @group Paging
                */
               usePageSizeSelect: true,
               /**
                * @cfg {Boolean} Используется ли отображение опций записи
                * <wiTag group="Управление" page=10>
                */
               rowOptions: false,
               /**
                * @typedef {Object} MainRowOptions
                * @property {Boolean}[delete=true] Удалить запись
                * @property {Boolean}[edit=true] Открыть запись для просмотра/редактирования
                * @property {Boolean}[recordUp=true] Переместить запись вверх
                * @property {Boolean}[recordDown=true] Переместить запись вниз
                */
               /**
                * @cfg {MainRowOptions} Набор часто используемых опций для записи
                * <wiTag group="Отображение">
                * Часто используемые опции записи будут показаны сразу при наведении.
                * Другие (дополнительные) будут показаны в меню
                * <pre>
                *    mainRowOptions: {
                *       'delete': true,
                *       'edit': false
                *    }
                * </pre>
                */
               mainRowOptions: {
                  /**
                   * @cfg {Boolean} Переместить запись вверх
                   */
                  'recordUp': true,
                  /**
                   * @cfg {Boolean} Переместить запись вниз
                   */
                  'recordDown': true,
                  /**
                   * @cfg {Boolean} Открыть запись для просмотра/редактирования
                   */
                  'edit': true,
                  /**
                   * @cfg {Boolean} Удалить запись
                   */
                  'delete' : true
               },
               /**
                * @typedef {Array} UserRowOptionsConfig
                * @property {String} name Имя кнопки.
                * @property {String} title Текст на кнопке.
                * @property {String} linkText Текст в виде ссылки на кнопке.
                * @property {String} icon Путь до иконки кнопки.
                * @property {Number} weight Вес - нужен для позиционирования в наборе. Если не задать, то кнопка встанет в конец набора после платформенных (recordUp = 10, recordDown = 20, edit = 30, delete = 40).
                * @property {Boolean} isMainOption Отображать ли кнопку на строке или только выпадающем в меню.
                * @property {Function} callback Действие клика по кнопке - указать заранее созданную функцию.
                * @editor icon ImageEditor
                * @translatable title linkText
                */
               /**
                * @cfg {UserRowOptionsConfig[]} Набор пользовательских опций для записи.
                * <wiTag group="Управление">
                * <pre>
                *    userRowOptions: [
                *       {
                *          title: 'Опция2',
                *          name: 'addToFavourite',
                *          callback: function(row, record){
                *             record.set("Избранное", true);
                *             record.update();
                *          },
                *          icon: 'sprite:icon-16 icon-Alert icon-attention'
                *       }
                *    ]
                * </pre>
                */
               userRowOptions: [],
               /**
                * @cfg {String} Колонка со значениями порядковых номеров
                * <wiTag group="Отображение" page=11>
                * Определяет колонку, значения которой будут использоваться как порядковые номера.
                * @editor BLSequenceNumberChooser
                * @group Data
                */
               sequenceNumberColumn: '',
               /**
                * @cfg {String} Позиция опций строки
                * <wiTag group="Отображение" page=1>
                * @variant top опции отображаются сверху
                * @variant bottom опции отображаются снизу
                * @variant '' Любой другой вариант - опции отображаются снизу
                */
               rowOptionsPosition: 'bottom',
               /**
                * @cfg {rowOptionsOffset} Отступ опций от нижнего края/правого края
                * Позволяет задавать пользовательские отступы для опций строк
                */
               rowOptionsOffset: {
                  /**
                   * @cfg {Boolean} отступ от правого края
                   */
                  right: 0,
                  /**
                   * @cfg {Boolean} отступ от нижнего края
                   */
                  bottom: 0
               }
            }
         },
         //Селекторы контейнеров
         _rootElement : '',
         _headContainer: undefined,       //Контейнер, в котором находится table шапки браузера
         _resizer: undefined,
         _head : '',
         _body : '',
         _foot : '',
         _data : '',
         _browserContainer: undefined,        //Контейнер, в котором находится таблица с данными
         _browserContainerWrapper: undefined, //Контейнер, в котором находится _browserContainer, а также блок "нет данных"
         _activeElement: false,
         _lastActiveElement : false,          //Для сохранения активной строки, если переходили по вслывашке и нажали отмену
         //Параметры, задаваемые в конструкторе
         _bodyHeight : 0,
         _bodyRealHeight: 0,
         _wsBrowserContainer: false,
         _currentRecordSet : null,
         //Изменяемые параметры, обычно в ходе перезагрузки
         _initialSource: {},              //Исходный конфиг рекордсета
         _initialFilter: {},              //Исходный фильтр
         _currentFilter: {},              //Текущий фильтр
         _count: 0,                       //Число видимых строк данных
         _hovered: 0,                     //переменная для сохранения строки на которою наведен курсор при перезагрузке
         _loadedForPathSelector: false,   //Флаг выбора папки из PathSelector'а (используется для установки активной строки на предыдущем уровне)
         _sortingStack: [],               //Массив с информацией о сортировке - по убыванию важности сортировки
         _sortingMarkers: {},             //Хэш-мэп с описанием как какое поле нужно сортировать
         _paging: undefined,              //Контрол paging
         _pagingFilter: {},               //Последний фильтр, по которому строилась постраничная навигация
         _selected: {},                   //Хранилище отмеченных строк
         _selectedRecords: [],            //Массив отмеченных записей
         _selectMode : false,             //Режим выбора. В режиме выбора Enter работает по другому. Есть ctrl + Enter
         _dReady: undefined,              //Deferred с колбеком после готовности рекордсета
         _isUpdatingRecords: false,       //Обновляются ли в данный момент записи массово: при этом не нужно обрабатывать кажду запись в отдельности
         _actions: {},                    //Набор флагов, можно ли делать какие-либо действия: редактировать, добавлять и т. д.
         _emptyDataBlock: undefined,      //Блок, содержащий в себе глубокомысленный набор слов, отобращающийся при отсутствии данных
         _emptyDataTextSet: true,         //Установлен ли корректный текст
         _emptyDataText: null,            //Текущий текст в блоке пустых данных
         _isFakeDelete: false,            //Признак действительно ли удалили запись, т.к. возможен слуйчай чистки х
         _fakeFocusDiv: null,             //Див, создаваемый и фокусируемый тогда,
                                          //когда области некому отдать фокус, а себе нельзя - Хром и IE могут прокрутить
                                          //родительский блок вниз, если места в видимой области экрана не хватает для всей области.
         _loadingIndicator: undefined,    //Таймер задержки показа индикатора загрузки
         _footerDrawed: false,            //Создали ли мы все элементы в футере
         _applyingState: false,           //Устанавливаем ли мы сейчас какое-то состояние
         _scrollGapPlaceholder: false,    //Кэшируем TD-плейсхолдер с помощью которого выравниваем контейнер данных если есть скролл
         _ajaxLoader: false,
         _menuButtons: {},                //Описание кнопок для тулбара  плагины, у которых есть кнопки, будут дописывать свои параметры - Массив кнопочек. [Тултип, иконка, обработчик на нажатие]
         _initialColumns: [],             //Начальные колонки пришедшие в display.columns из джина. Нужны чтобы сохранить колонки, ибо setColumns их меняет
         _dropped: false,                 //Если мы перетаскивали записи, то в момент клика (сразу после перетаскивания) этот флаг будет равен true
         _keysActions: {},                //Объект с обработкой нажатия клавиш
         _sumFieldsArray: [],             //Массив колонок для суммирования
         _loadingTimer: undefined,
         _loadingReadTimer: undefined,
         _needHide: false,
         _blockEdit: false,               //Показывает состояние, что мы ждем открытия диалога/панели редактирования и больше пока редактирования запускать не надо
         _systemParams: {
         },
         //КЛАВИШИ обрабатываемые данным классом
         _keysWeHandle: [
            $ws._const.key.enter,
            $ws._const.key.down,
            $ws._const.key.up,
            $ws._const.key.del,
            $ws._const.key.insert,
            $ws._const.key.f3,
            $ws._const.key.esc,
            $ws._const.key.pageUp,
            $ws._const.key.minus,
            $ws._const.key.pageDown,
            $ws._const.key.space,
            $ws._const.key.q,
            $ws._const.key.n
         ],
         _rowOptionsInitialized: false,    //Инициализированы опции строки
         _rowOptionsElement: undefined,        //Элементы с опциями строки - удаление, редактирование, меню
         _hasRowOptions: false,            //Имеет ли эти самые опции - при некоторых настройках может оказаться, что вообще нечего отображать
         _rowOptionsMenu: undefined,       //Набор меню для опций строки, [для не папки, для папки]
         _rowOptionsMenuDeferred: null,
         _rowOptionsHoverRow: undefined,   //Строка, для которой сейчас показываются опции
         _rowOptionsHoverRecord: undefined,//Запись, для который показываем опции строки
         _rowOptionsTargetRow: undefined,  //Строка, меню для которой необходимо будет показать после закрытия меню
         _rowOptionsMenuVisible: false,    //Показывается ли сейчас меню с опциями строки. Если показывается, то не показываем опции для других строк
         _rowOptionsCurrentMenu: undefined,//Меню, которое отображалось последним. Возможно, его захочется закрыть
         _rowOptionsButtons: {},           //Действия, которые могут выполнять опции строки
         _rowOptionsMenuButtons: [],       //Кнопки для показа меню опций строки
         _rowOptionsDisableStandart: false,//Опция выключения стандартных кнопок
         _rowOptionsDefault: [],          //Опции, которые будут созданы при первом наведении мыши
         _rowOptionsLeaveTimer: 0,        //Таймер ухода курсора мыши с меню
         _rowOptionsShowTimer: 0,         //Таймер показа меню опций строки
         _rowOptions: {},
         _rowOptionsIsInit: false,
         _hiddenRowOptions: {},           //Объект, в котором содержатся имена скрытых опции строки
         _rowOptionsShift: {},
         _allowChangePorNomer: true,
         _sequenceNumberObject: undefined,//Объект бизнес-логики для вызова методов изменения порядка записей
         _filterFromState: null,          //Фильтры браузера восстановленные из состояния
         _prevFilterFromState: null,
         _dataBindHandler: null,
         _setDataHandler: null,           //Обработчик готовности контрола, который установит рекордсет
         _clickEventsQueue: [],
         _rowSelectionSetted: false,      //Флаг того, что текущая строка уже установлена
         _methodName: 'static',           //имя метода, по которому строится представление данных (необходимо для сбора статистики)
         _minimized: false,               //признак отображения выбора отмеченных записей в текущий момент
         _isShowSelection: false,         //признак, что был инициирован выбор отмеченных записей
         _selectedBeforeChoice: undefined,//объект содержащий хранилище отмеченных строк и массив отмеченных записей до выбора отмеченных записей
         _initialRecordSet: false,        //начальный рекордсет (необходим для реализации Ctrl+Space)
         _pageOptions: [],                //опции для выбора размера страницы в постраничной навигации
         _pageOptionsContainer: undefined,//блок, содержащий в себе селект и информационный текст
         _pageOptionsDropdown: false,     //деферред готовности выпадающего списка с вариантами количества записей на странице
         _useKeyboard: false,
         _recordsOpened: [],
         _scrollWidth: undefined,
         _isGroupDelete: false,           //Удаляем ли мы в данный момент пачку записей
         _inBeforeRenderActionCnt: 0,
         _oldAdditionalHeight: null,
         _updateRecordMethodName: false,  //проверка на редактирование\создание записи
         _isRecordFloatAreaOpen: false,
         _filterContextChangeHandlerBound: null,
         _reloadDebounced: null,
         _boundFields: {},
         _hasBoundFields: false,
         _lastLoadDeferred: null,         //Deferred последней загрузки браузера
         // Поля, изменения которых временно не должны приводить к перезагрузке браузера
         _preventReloadForField: {},
         _isLoading: false, //проверка на загрузку, будет true в оnDataLoadStarted (onBeforeLoad)
         _headerContentFlags: {}, //набор флагов, показывающей, сколько значимых блоков лежит в блоке
                                 //код, который так или иначе добавляет содержимое в блок заголовка, должен устанавливать соотв. флаг, и вызывать функцию
                                 //_updateHeaderContentStyles
         _functionValues: {},
         _editDeferred: undefined,
         _isReady: false
      },
      $constructor : function(cfg){
         var self = this;
         if (cfg.display && cfg.display.hasOwnProperty('useSequenceNumbers')) {
            $ws.single.ioc.resolve('ILogger').log('DataViewAbstract', 'Опция useSequenceNumbers удалена с 3.6.3. Используйте только sequenceNumberColumn.');
         }
         this._filterContextChangeHandlerBound = this._filterContextChangeHandler.bind(this);
         this._reloadDebounced = this.reload.debounce(42);

         this._emptyDataText = this._options.display.emptyHtml;
         this._scrollWidth = $ws.helpers.getScrollWidth();
         this._dReady = new $ws.proto.Deferred();
         this._firstLoadDeferred = new $ws.proto.Deferred();
         this._configChecking();
         this._publishEvents();

         $ws.single.CommandDispatcher.declareCommand(this, 'newItem', this._insertRecordItem);
         $ws.single.CommandDispatcher.declareCommand(this, 'edit', this._editRecord);
         $ws.single.CommandDispatcher.declareCommand(this, 'delete', this.deleteSelectedRecords);
         $ws.single.CommandDispatcher.declareCommand(this, 'confirmSelection', this.confirmSelection);
         $ws.single.CommandDispatcher.declareCommand(this, 'selectAll', this.selectAll);
         $ws.single.CommandDispatcher.declareCommand(this, 'removeSelection', this.removeSelection);
         $ws.single.CommandDispatcher.declareCommand(this, 'reload', this.reload);
         $ws.single.CommandDispatcher.declareCommand(this, 'showSelection', this.showSelection);

         this._mapColumns();
         this._initialColumns =  this._options.display.columns;
         this._createContainer();

         if (this.setUseDefaultPrint) {
            this.setUseDefaultPrint();
         }
         this._initActionsFlags();
         if (this._resetContext())  {
            this._context = new $ws.proto.Context().setPrevious(this._context);
         }

         this.getLinkedContext()
            .subscribe('onFieldChange', this._filterContextChangeHandlerBound)
            .subscribe('onDataBind', this._filterContextChangeHandlerBound);

         this._setSumFieldsArray(this._options.sumFields);

         if (this._options.reloadAfterChange === undefined)
            this._options.reloadAfterChange = this._options.display.reload;

         if (this._options.saveState){
            this.once('onInit', function(){
               self.once('onStateChanged', function(){
                  //готовим data source с подмененными фильтрами
                  self._initDataSource();
               });

               //обеспечиваем поднятие события строго после подписки на него NavigationController'ом
               self._notify('onStateChanged');
            });
         }
         else {
            self._initDataSource();
         }

         this._initEvents();
         this._initKeys();
         this._dataBindHandler = $.proxy(this._dataBind, this);

         if(!this._options.setNewDataSourceWithParent && this._parent) {
            this._parent.subscribe('onReady', this._dataBindHandler);
         }
         else {
            this._dataBind();
         }
         this._options.dataSource.readerType = this._options.dataSource.readerType || 'ReaderUnifiedSBIS';
         if(!this._options.display.rowOptions){
            if (this._options.display.readOnly) {
               this._menuButtons.view = ['Просмотреть (F3)', 'sprite:icon-16 icon-Edit icon-primary','edit'];
            }
            else {
               this._menuButtons.edit = ['Редактировать (F3)', 'sprite:icon-16 icon-Edit icon-primary','edit'];
            }
         } else {
            this._initRowOptionsDefaults();
            this._resetRowOptionsShift();
         }
         if (this._options.display.sequenceNumberColumn) {
            //Инициализация объекта бизнес-логики для отправки запросов на изменение порядка записей
            this._sequenceNumberObject = new $ws.proto.BLObject('ПорядковыйНомер');
         }
         if (!this._fakeFocusDiv) {
            this._fakeFocusDiv = $('<div />', {
               style: 'position: fixed; top: 0; left: 0; width: 1px; height: 1px;',
               tabindex: -1
            });
            this._container.prepend(this._fakeFocusDiv);
         }
      },
      _publishEvents : function(){
         this._publish(
            'onAfterInsert',
            'onAfterLoad',
            'onAfterRender',
            'onBeforeCreate',
            'onBeforeDelete',
            'onBeforeInsert',
            'onBeforeLoad',
            'onBeforeOpenEditWindow',
            'onBeforeRead',
            'onBeforeRender',
            'onBeforeUpdate',
            'onCalculateSum',
            'onChangeSelection',
            'onDataReady',
            'onDeleteStart',
            'onFilterChange',
            'onLoadError',
            'onNewAction',
            'onRecordsChanged',
            'onRowActivated',
            'onRowClick',
            'onRowDoubleClick',
            'onSelectEditMode',
            'onSelectFormat',
            'onSelectionConfirm',
            'onSetCursor',
            'onUpdateActions',
            'onRowOptions'
         );
      },
      /**
       * Возвращает признак использования выделения записи в представлении данных
       * @example
       * Скрываем или показываем кнопку на панели массовых операций (panel) исходя из признака использования выделения
       * записи в представлении данных (dataView).
       * <pre>
       *    panel.getChildControlByName('someName').toggle(dataView.isUseSelection());
       * </pre>
       * @return {boolean}
       */
      isUseSelection: function() {
         return this._options.useSelection;
      },
      /**
       * Обновляет сдиг сверху/справа для опций строки по ховеру
       */
      _resetRowOptionsShift: function() {
         this._rowOptionsShift = {
            top: $ws._const.Browser.rowOptionsElementsOffset.top - this._options.display.rowOptionsOffset.bottom,
            right: $ws._const.Browser.rowOptionsElementsOffset.right + (this._getVerticalScrollShowed() ? this._scrollWidth : 0) +
            this._options.display.rowOptionsOffset.right
         };
      },
      /**
       * Переопределяется в HierarchyViewAbstract, при переключении из иерархию в дерево, не нужно менять контекст
       * @returns {boolean}
       * @private
       */
      _resetContext: function(){
         return true;
      },
      _initComplete: function() {
         if (typeof window !== 'undefined' && !reDisablePreload.test(window.location.hash)) {
            var templates = this._collectTemplatesToPreload();
            $ws.helpers.forEach(templates, function (template) {
               if (template) {
                  setTimeout(function () {
                     $ws.core.attachTemplate(template, {
                        fast: $ws._const.fasttemplate,
                        preloadControls: true
                     });
                  }, 100);
               }
            });
         }
         $ws.proto.DataViewAbstract.superclass._initComplete.apply(this, arguments);
         this._heightChangedIfVisible();
      },

      _collectTemplatesToPreload: function() {
         if (this._options.editMode in PRELOAD_ENABLED_MODES) {
            return [ this._options.editDialogTemplate, this._options.editFullScreenTemplate ];
         } else {
            return [ ];
         }
      },

      _haveAutoWidth: function() {
         return this._options.autoWidth && this._horizontalAlignment !== 'Stretch';
      },

      _isHeightGrowable: function() {
         return this._options.autoHeight && this._verticalAlignment !== 'Stretch';
      },

      _isInBeforeRenderAction: function() {
         return this._inBeforeRenderActionCnt > 0;
      },

      markControl : function(s){
         var result = $ws.proto.DataViewAbstract.superclass.markControl.apply(this, arguments);
         this._onResizeHandler();
         return result;
      },

      clearMark : function(){
         var result = $ws.proto.DataViewAbstract.superclass.clearMark.apply(this, arguments);
         this._onResizeHandler();
         return result;
      },

      /**
       * <wiTag group="Данные">
       * Возвращает значение признака находится ли браузер в режиме "только для чтения".
       * @return {Boolean}
       */
      isReadOnly : function(){
         return this._options.display.readOnly;
      },
      /**
       * Возвращаем тот элемент, на который можно поскроллиться
       * @return {jQuery | Boolean}
       */
      _getElementToFocus: function() {
         return this._fakeFocusDiv;
      },
      _getComplexKey: function(key){
         if(typeof(key) === 'string' && key.indexOf($ws._const.IDENTITY_SPLITTER) !== -1){
            var newKey = key.split($ws._const.IDENTITY_SPLITTER);
            newKey[0] = parseInt(newKey[0], 10);
            return newKey;
         }
         return key;
      },
      /**
       * Показать контрол
       * <wiTag group="Отображение">
       * <pre>
       *    if(!control.isVisible())
       *       control.show();
       * </pre>
       */
      show: function(){
         this._runInBatchUpdate('DataViewAbstract.show', function() {
            this._setVisibility(true);
            this._heightChangedIfVisible();
         });
      },

      _updateHeaderContentStyles: function() {
         //Ставим блоку зебровый класс, если включена зебра, есть что-то в заголовке, или есть данные.
         var needBrowserContainerZebraClass = !!this._options.display.hasZebra;
         if (needBrowserContainerZebraClass) {
            var haveHead = this._options.display.showHead &&
                           this._headContainer.size() > 0 &&
                           $ws.helpers.reduce(this._headerContentFlags, function(memo, val) { return memo || !!val; }, false);

            needBrowserContainerZebraClass = haveHead || this._count > 0;
         }
         this._browserContainerWrapper.toggleClass('ws-browser-container-wrapper-zebra', needBrowserContainerZebraClass);
      },

      /**
       * <wiTag group="Отображение" noShow>
       * Этот метод вызывает пересчёт браузера (и его родителей, если он авторазмерный) при ручном изменении содержимого какой-нибудь его ячейки или строки
       */
      recalcBrowserOnDOMChange: function() {
         this._heightChangedIfVisible(false);
      },

      _onSizeChangedBatch: function() {
         this._contentHeightChanged();
         return true;
      },

      /**
       * Пересчитывает высоту, если контрол видим, и не находится в обработчике onBeforeRender
       * (из него могут какие-то методы вызваться, которые вызовут _heightChangedIfVisible. пересчитывать в этом состоянии нельзя,
       * потому что drawBody и т.п. ещё не прошёл, структура старая).
       * @param {Boolean} [withTimeoutedRecalcHacks] Нужно ли применять хаки с пересчётом по таймауту (может быть актуально для некоторых багов в IE - он дурит и отдаёт неправильную высоту до пересчёта через setTimeout)
       * @protected
       */
      _heightChangedIfVisible: function(withTimeoutedRecalcHacks){
         var recalcNow = this._isVisibleWithParents() && !this._isInBeforeRenderAction();
         if(recalcNow) {
            this._contentHeightChanged();
         }

         this._notifyOnSizeChanged(this, this, !recalcNow);

         if (withTimeoutedRecalcHacks && $ws._const.browser.isIE) {
            setTimeout(function() { this._heightChangedIfVisible(false); }.bind(this), 0);
         }
      },

      _isVisibleWithParents: function() {
         return $ws.helpers.isElementVisible(this._container);
      },

      _notifyOnSizeChangedWithVisible: function(isVisible) {
         if (isVisible === undefined) {
            isVisible = this._isVisibleWithParents();
         }

         this._notifyOnSizeChanged(this, this, !isVisible);
      },

      //Перед расчётом авторазмеров надо запоминать высоту браузера (может понадобиться в setHeight для запуска повторного пересчёта авторазмеров)
      _notifyOnSizeChanged: function() {
         this._setContainerHeightForRecalk();
         return $ws.proto.DataViewAbstract.superclass._notifyOnSizeChanged.apply(this, arguments);
      },

      //Запоминаем высоту браузера (может понадобиться в setHeight для запуска повторного пересчёта авторазмеров)
      _setContainerHeightForRecalk: function() {
         if (this._isHeightGrowable() && this._horizontalAlignment === 'Stretch') {
            //Здесь можно брать высоту самым быстрым способом, потому что нужна будет не сама высота, а разница с предыдущей
            this._containerHeightForRecalk = this._container.get(0).offsetHeight;
         }
      },

      //Если в результате внешнего изменения размеров контейнера (например, при ресайзе окна)
      //меняется ширина браузера (это верно только для браузера с растягом по горизонтали),
      //то может поменяться и высота (из-за переносов в строчках).
      //Этот момент надо отследить, и запустить пересчёт авторазмеров, чтоб браузер не обрезался.
      _checkContainerHeightForRecalk: function() {
         if (this._isHeightGrowable() && this._horizontalAlignment === 'Stretch') {
            var oldHeight = this._containerHeightForRecalk;
            this._setContainerHeightForRecalk();

            if(this._containerHeightForRecalk !== oldHeight) {
               this._notifyOnSizeChanged(this, this);
            }
         }
      },

      _needShowSelectionCheckbox: function() {
         return this._options.display.showSelectionCheckbox && this._options.useSelection !== false;
      },

      /**
       * <wiTag group="Управление">
       * Включает/выключает возможность выбора нескольких записей.
       * @param {Boolean} multiSelect true - включить возможность набора нескольких записей, false - выключить.
       * @example
       * <pre>
       *    if(!dataView.isMultiSelect(){
       *       dataView.setMultiSelect(true);
       *    }
       * <pre>
       * @see multiSelect
       * @see isMultiSelect
       */
      setMultiSelect: function(multiSelect){
         this._options.multiSelect = !!multiSelect;
         this._options.display.showSelectionCheckbox = !!multiSelect;
         if (!multiSelect) {
            this.removeSelection();
         }
         this._colgroupCache = undefined;
         // скинем информацию о колонках, чтобы полностью перерисовать таблицу
         this._columnMap = [];
         this.refresh(true);
      },
      /**
       * <wiTag group="Управление">
       * Разрешен ли в представлении выбор нескольких записей
       * @returns {Boolean}
       * @example
       * <pre>
       *    if(!dataView.isMultiSelect()){
       *       dataView.setMultiSelect(true);
       *    }
       * </pre>
       * @see multiSelect
       * @see setMultiSelect
       */
      isMultiSelect: function(){
         return this._options.multiSelect;
      },
      _getBodyElement: function(){
         return this._container.find('.ws-browser tbody');
      },
      /**
       * Создает основную структуру html браузера
       */
      _createContainer:function(){
         // tabindex равный -1 поставлен в данном блоке для фикса бага - FF3.6 Показывает лишний аутлайн + лишняя позиция табуляции при переходе с первого датавью-
         // Pevent click from bubbling up to parent window container
         this._container.click(function(event){
            event.stopImmediatePropagation();
         });

         this._resizer = this._container.find('.ws-browser-resizer');
         if (this._resizer.size() === 0) {
            this._resizer = null;
         }

         this._rootElement = this._container.find('.ws-browser-data-container');
         this._body = this._getBodyElement();
         this._head = this._rootElement.find('thead');
         this._foot = this._rootElement.find('tfoot');
         this._headContainer = this._rootElement.find('.ws-browser-head-container');
         this._data = this._rootElement.find('.ws-browser');
         this._browserContainer = this._rootElement.find('.ws-browser-container');
         this._browserContainerWrapper = this._rootElement.find('.ws-browser-container-wrapper');
         this._pageOptionsContainer = this._container.find('.ws-browser-page-selector');
         this._emptyDataScroller = this._container.find('.ws-browser-empty-scroller');
         this._emptyDataBlock = this._container.find('.ws-browser-empty');

         //При автовысоте прокрутка точно никогда не нужна. Выключим её здесь, а то она иногда появляется вместе с горизонтальной, и не может пропасть,
         //хотя размеры считаются правильно. Это из-за глюков IE и Хрома
         if (this._isHeightGrowable()) {
            this._browserContainer.css('overflow-y', 'hidden');
         }

         if (!this._options.display.allowHorizontalScroll) {
            this._data.parent().css('overflow-x', 'hidden');
         }
         if (this._options.autoHeight) {
            this._container.height('auto');
            this._data.parent().height('auto');
         }
         if(this._options.display.width > 0){
            this._browserContainer.width(this._options.display.width + 'px');
            this._rootElement.width(this._options.display.width + 'px');
         }

         this._updateHeaderContentStyles();
      },
      /**
       * Метод проверяет конфиг и проставляет нужные переменные
       */
      _configChecking: function(){
         if(this._options.display.useDrawingLines){ //При включенной отрисовки рамок выключаем отрисовку сепараторов
            this._options.display.useSeparating = false;
            this._options.display.hasZebra = false;
         }

         //При включенном пейджинге всегда включаем загрузку по частям
         //При отключенном отображение навиигации отключаем
         if (this._options.display.usePaging) {
            this._options.display.partiallyLoad = true;
            if (!this._container.hasClass('ws-browser-ignore-local-page-size')) {
               $ws.helpers.setLocalStorageValue('ws-page-size', $ws.helpers.getLocalStorageValue('ws-page-size') || this._options.display.recordsPerPage);
               this._options.display.recordsPerPage = $ws.helpers.getLocalStorageValue('ws-page-size') || this._options.display.recordsPerPage;
            }
         } else {
            this._options.display.showPaging = false;
         }

         if (this._options.multiSelect === false) { // не показываем чекбоксы выбора при выключенном режиме многострочного выбора
            this._options.display.showSelectionCheckbox = false;
         }
         this._initSystemParams();

         //имя метода, по которому строится браузер (необходимо для сбора статистики)
         var r = this._options.dataSource ? this._options.dataSource.readerParams || {} : {};
         if (!r.adapterType) {
            r.adapterType = 'TransportAdapterRPCJSON';
         }
         if (!$.isEmptyObject(r)) {
            if(!r.linkedObject && r.adapterType === 'TransportAdapterRPCJSON'){
               this._options.dataSource.firstRequest = false;
            }
            this._methodName = [
               r.linkedObject,
               r.queryName
            ].join('.');
         }
      },
      /**
       * Нужна для переопределения в HierarchyViewAbstract
       * @private
       */
      _initSystemParams: function(){
         if (this._options.display.sequenceNumberColumn) {
            this._systemParams['__ПорНомер__'] = this._options.display.sequenceNumberColumn;
         }
      },
      _getMenuButtons: function(){
         return [['Очистить сортировку', 'sprite:icon-16 icon-Close icon-primary', 'clearSorting']];
      },
      /**
       * Операция редактирования
       * @param {jQuery} row Строка
       * @protected
       */
      _actionEdit: function(row){
         var activeElement = row instanceof Object && 'jquery' in row ? row : this.getActiveElement();
         if(activeElement && activeElement.attr('rowkey') !== 'null'){
            this._showDialogForRecord(this.getActiveRecord(activeElement));
         }
      },
      _initActionsFlags: function(){
         var isEdit = this._options.editDialogTemplate,
             isReadOnly = this._options.display.readOnly,
             self = this;
         this._actions = {'addItem': isEdit && this._options.allowAdd !== false && !isReadOnly && function() {
                            self._showRecordDialog({});
                         },
                         'edit': this._options.allowEdit !== false && isEdit && this._actionEdit.bind(this),
                         'delete': !isReadOnly && this._options.allowDelete !== false && function(record, row){
                            var correctRow = row instanceof Object && 'jquery' in row,
                                records;
                            if (correctRow) {
                               if( !self._activeElement || self._activeElement.attr('rowkey') !== row.attr('rowkey') ){
                                  self.setActiveRow(row);
                               }
                               records = [self.getActiveRecord()];
                            }
                            self.deleteSelectedRecords(records, correctRow).addBoth(function() {
                               self._toggleIndicator(true, false);
                            });
                         },
                         'recordUp': this._options.display.sequenceNumberColumn && this._onRecordUpHandler.bind(this),
                         'recordDown': this._options.display.sequenceNumberColumn && this._onRecordDownHandler.bind(this),
                         'filterParams': this._options.filterDialogTemplate && function(){
                            self.createFiltersDialog.apply(self, []);
                         },
                         'clearFilter': this._options.filterDialogTemplate && function(){
                            self.resetFilter();
                         },
                         'refresh': $.proxy(self.reload, self)};
      },
      /**
       * <wiTag group="Управление" noShow>
       * Получить список доступных действий.
       */
      getActions: function(){
         return $ws.core.clone(this._actions);
      },
      /**
       * <wiTag group="Данные">
       * Получить признак используется ли объединение записей.
       * @returns {Boolean} Возвращает признак использования объединения записей.
       * Возможные значения:
       * <ol>
       *    <li>true - используется объединение записей;</li>
       *    <li>false - не исполльзуется.</li>
       * </ol>
       */
      isUseMergeRecords: function(){
         return this._options.useMergeRecords;
      },
       /**
        * <wiTag group="Данные">
        * Получить признак разрешено ли перемещение.
        * @returns {jQuery.Jcrop.defaults.allowMove|*|$ws.proto.DataViewAbstract.MovePlugin.$protected._options.allowMove|$ws.proto.DataView.$protected._options.allowMove}
        */

      isAllowMove: function(){
         return this._options.allowMove;
      },
      /**
       * Простановка событий рекордсету
       * @param {$ws.proto.RecordSet} recordSet
       */
      _changeRecordSetHandlers: function(recordSet){
         if (recordSet instanceof $ws.proto.RecordSet) {
            var self = this;
            this._currentRecordSet = recordSet;
            recordSet.subscribe('onRecordUpdated', this._onRecordUpdated.bind(this));
            recordSet.subscribe('onRecordDeleted', this._onRecordDeleted.bind(this));
            recordSet.subscribe('onBeforeLoad', function(){
               self._minimized = false;
               self._isShowSelection = false;
            });
            if(this._paging){
               this._paging.setRecordSet(recordSet);
            }
            if (this._pathSelector instanceof Object) {
               this._pathSelector.setBrowserRecordSet(recordSet);
            }
         }
      },

      //Функция, запускающая _onDataLoaded, обёрнутую в пакет. Нужна, чтобы обернут был вызов всей цепочки _onDataLoaded -
      //и _onDataLoaded основного класса, и _onDataLoaded, определённых в плагинах.
      _onDataLoadedBatchUpdateWrapper: $ws.single.ControlBatchUpdater.createBatchUpdateWrapper('_onDataLoaded wrap', '_onDataLoaded'),

      /**
       * <wiTag group="Данные">
       * Заменить набор данных, управляемых с помощью табличного представления.
       * @param {$ws.proto.RecordSet} data Новый набор данных.
       * @example
       * <pre>
       *    $ws.helpers.newRecordSet("Сотрудник", "Список").addCallback(function(recordSet){
       *       dataView.setData(recordSet);
       *    });
       * </pre>
       */
      setData: function(data){
         if(data instanceof $ws.proto.RecordSet){
            var self = this,
               setting = function(){
                  if(self._setDataHandler){
                     self._parent.unsubscribe('onReady', self._setDataHandler);
                  }
                  data.subscribe('onBeforeLoad', self._onDataLoadStarted.bind(self));
                  data.subscribe('onAfterLoad', self._onDataLoadedBatchUpdateWrapper.bind(self));
                  self._changeRecordSetHandlers(data);
                  if (self._container.hasClass('ws-browser-ignore-local-page-size')) {
                     self.setPageSize(data.getPageSize(), true);
                  } else {
                     self.setPageSize($ws.helpers.getLocalStorageValue('ws-page-size') || data.getPageSize(), true);
                  }
                  self.removeSelection();
                  if(!self._dReady.isReady()){
                     self._dReady.callback();
                  }
                  if(self._pathSelector instanceof Object){
                     self._pathSelector.setSource(data.getSource());
                  }
                  if(self._options.display.usePaging && self._currentRecordSet.getPageNumber() !== 0){
                     self.setPage(0, true);
                  }
                  else{
                     self._onDataLoaded({}, data, true);
                  }
               };
            if (data.getContext().isGlobal()) {
               data.setContext(new $ws.proto.Context().setPrevious(self.getLinkedContext()));
            }
            this._unbindParentHandlers();
            if(this._parent && !this._parent.isReady()){
               this._parent.subscribe('onReady', this._setDataHandler = setting);
            }
            else{
               setting();
            }
         }
      },
      /**
       * <wiTag group="Данные" >
       * Возвращает деферред готовности рекордсета
       * @return {$ws.proto.Deferred}
       * @example
       * <pre>
       *    dataView.recordSetReady().addCallback(function(){
       *       dataView.setData(newRecordSet);
       *    });
       * </pre>
       */
      recordSetReady: function(){
         return this._dReady;
      },
      /**
       * <wiTag group="Данные">
       * Замена конфигурации набора данных табличного представления.
       * Подстановка нового источника данных.
       * Инициирует замену рекордсета.
       * @param {Object} dataSource Новый источник данных.
       * @example
       * <pre>
       *     handlers:{
       *        onReady: function(event){
       *           dataView.setSource({
       *              readerType:"ReaderUnifiedSBIS",
       *              readerParams: {
       *                 linkedObject: "Контрагент",
       *                 queryName: method
       *              }
       *              filterParams: params
       *           }),
       *        }}
       * </pre>
       */
      setSource : function(dataSource){
         if(dataSource instanceof Object) {
            this._unbindParentHandlers();
            this._isReloadStage = false;
            if(this._pathSelector instanceof Object){
               this._pathSelector.setSource($ws.core.merge({}, dataSource));
            }
            this._options.dataSource = dataSource;
            this.removeSelection();
            this._dReady = new $ws.proto.Deferred();
            this._initDataSource();
            this._dataBind();
         }
      },
      /**
       * <wiTag group="Данные" noShow>
       * Возвращает объект с параметрами получения данных
       * @returns {Object}
       */
      getDataSource: function(){
         return this._options.dataSource;
      },
      /**
       * <wiTag class=TableView page=1 group="Управление">
       * <wiTag group="Управление">
       * Устанавливает текущей страницу с указанным номером (pageNumber) и при необходимости загружает её.
       * @param {Number}   pageNumber  Номер страницы.
       * @param {Boolean}  load        Загружать или нет страницу.
       * @example
       * <pre>
       *     dataView.setPage(1);
       * </pre>
       * @see usePaging
       * @see recordsPerPage
       * @see pagesLeftRight
       */
      setPage: function(pageNumber, load){
         pageNumber = parseInt(pageNumber, 10);
         if(this._options.display.usePaging){
            var self = this;
            this._dReady.addCallback(function(){
               self._currentRecordSet.setPage(pageNumber, !load);
            });
         }
      },
      /**
       * <wiTag group="Управление" page=1>
       * Возвращает номер текущей страницы.
       * Если не используется постраничная навигация или рекордсет не готов (а при готовности он будет с нулевой
       * страницей), то возвращает 0. Нумерация с нуля.
       * @return {Number} Номер текущей страницы.
       * @example
       * <pre>
       *    if(dataView.getPageNumber() > 0)
       *       dataView.setPage(0);
       * </pre>
       */
      getPageNumber: function(){
         if(this._options.display.usePaging && this._currentRecordSet){
            return this._currentRecordSet.getPageNumber();
         }
         return 0;
      },
      /**
       * Устанавливает размер страницы
       * @param {Number} pageCount Количество записей
       * @param {Boolean} [noLoad] Не загружать данные
       * @param {Boolean} [noSave] Не запоминать размер страницы
       */
      _setPageSize: function(pageCount, noLoad, noSave){
         if(this._options.display.recordsPerPage !== pageCount){
            this._options.display.recordsPerPage = this._options.dataSource.rowsPerPage = pageCount;
            if (!noSave && !this._container.hasClass('ws-browser-ignore-local-page-size')) {
               $ws.helpers.setLocalStorageValue('ws-page-size', pageCount);
            }
            var self = this;
            this._dReady.addCallback(function(){
               self._currentRecordSet.setPageSize(pageCount, noLoad);
            });
            if(this._paging) {
               this._paging.setPageSize(pageCount);
               this._paging.update(1);
            }
         }
      },
      /**
       * Добавляет новое количество страниц в select, или просто находит его в существующем select'е
       * @param {Number} pageCount Количество записей
       */
      _insertPageCount: function(pageCount){
         var current = -1;
         for(var i = 0; i < this._pageOptions.length; ++i){
            if(this._pageOptions[i] >= pageCount){
               if(this._pageOptions[i] > pageCount){
                  this._pageOptions.splice(i, 0, pageCount);
               }
               current = i;
               break;
            }
         }
         if(current === -1){
            this._pageOptions.push(pageCount);
         }
         if(this._pageOptionsDropdown){
            var map = {};
            for(var o in this._pageOptions){
               if(this._pageOptions.hasOwnProperty(o)){
                  map[this._pageOptions[o]] = this._pageOptions[o];
               }
            }
            this._pageOptionsDropdown.setData(map);
            this._pageOptionsDropdown.setValue(pageCount);
         }
      },
      /**
       * <wiTag group="Управление" page=1 >
       * Установить количество записей на каждой странице.
       * @param {Number} pageCount Количество записей.
       * @param {Boolean} [noLoad] Не загружать данные.
       * @example
       * <pre>
       *    dataView.setPageSize(2000);
       * </pre>
       * @see getPageSize
       * @see recordsPerPage
       */
      setPageSize: function(pageCount, noLoad){
         if (this._options.display.usePaging && pageCount !== this._options.display.recordsPerPage) {
            this._drawFooter(); // нарисуем его если вдруг не было
            this._setPageSize(pageCount, noLoad, true);
            if (this._options.display.usePageSizeSelect) {
               this._insertPageCount(pageCount);
            }
         }
      },
      /**
       * <wiTag group="Управление" page=1 >
       * Получить количество записей на каждой странице.
       * @example
       * <pre>
       *   pageSize = dataView.getPageSize();
       * </pre>
       * @see setPageSize
       * @see recordsPerPage
       */
      getPageSize: function(){
         return this._options.display.recordsPerPage;
      },
      _prepareQueryFilter: function(filter){
         var queryFilter = this._prepareFilter($ws.core.merge({}, filter), true);
         for(var i in queryFilter){
            if(queryFilter.hasOwnProperty(i)){
               if (queryFilter[i] === undefined) {
                     delete queryFilter[i];
               }
            }
         }
         return queryFilter;
      },
      /**
       * <wiTag group="Управление">
       * Перезагрузить данные в соответствии с новыми параметрами фильтрации (filter) и обновить отображение
       * табличного представления.
       * При этом может очистить текущий набор данных (doClear).
       * Так же можно перейти на первую или нужную страницу, либо остаться на текущей, в случае использования постраничной
       * навигации (keepPage).
       * @param {Object} filter Параметры фильтрации.
       * @param {Boolean} [doClear=true] Очищать текущие данные перед загрузкой?
       * <ol>
       *    <li>true - новые данные придут на замену старых.</li>
       *    <li>false - новые данные будут добавлены к старым. Данный режим может применяться для динамической подгрузки
       *    иерархических данных.</li>
       * </ol>
       * @param {Boolean|Number} [keepPage=false] Оставлять ли страницу.
       * @param {Array} [sorting] Массив, где каждый элемент имеет вид: {field: '...', order: 'asc' / 'desc'}.
       * Чем раньше встретится элемент с полем field, тем важнее field будет для сортировки.
       * @param {Boolean} [noLoad=false] Не перезагружать данные.
       * @returns {$ws.proto.Deferred} Асинхронное событие. Результатом работы является количество записей, пришедших для текущей страницы представления.
       * @example
       * <pre>
       *    myTableView.setQuery({'ГодРождения' : 1965})
       *       .addCallback(function(records_count){
       *          alert('Пришло ' + records_count + ' записей');
       *          return records_count;
       *       });
       * </pre>
       */
      setQuery : function(filter, doClear, keepPage, sorting, noLoad){
         var self = this,
            result = new $ws.proto.Deferred();
         this._dReady.addCallback(function(){
            var queryFilter = self._prepareQueryFilter($ws.core.merge({}, filter));
            if (!keepPage) {
               self._currentRecordSet.setPage(0, true);
            } else if (typeof(keepPage) === 'number') {
               self._currentRecordSet.setPage(keepPage, true);
            }
            if (sorting !== undefined) {
               self.setSorting(sorting, true);
            }

            for (var i in self._prevFilterFromState) {
               if (self._prevFilterFromState.hasOwnProperty(i) && !queryFilter.hasOwnProperty(i)) {
                  delete self._options.filterParams[i];
               }
            }

            self._prevFilterFromState = null;

            result.dependOn(self._runQuery(queryFilter, doClear, noLoad));
         });
         return result;
      },
      /**
       * Контекст для фильтров по умолчанию
       * Возвращает контекст, в который будут записываться фильтры, для которых не найден контекст.
       * @returns {$ws.proto.Context|$ws.single.GlobalContext}
       * @private
       */
      _getDefaultFilterContext: function() {
         var
            parent = this.getParent(),
            context = parent ? parent.getLinkedContext() : null;
         return context || $ws.single.GlobalContext;
      },
      /**
       * Внутренний метод для вызова загрузки с параметрами
       * Для фильтров, для которых настроено автообновление значение переданного фильтра пишется в контекст
       * Предотвращается срабатывание автообновления через запись поля в _preventReloadForField
       * Далее в обработчике смены данных в контексте из _preventReloadForField поле удаляется (когда по нему срабатывает onFieldChange)
       * @param filter
       * @param doClear
       * @param noLoad
       */
      _runQuery: function(filter, doClear, noLoad){
         var
            self = this,
            result = new $ws.proto.Deferred(),
            origin;
         this._lastLoadDeferred = result;
         this._dReady.addCallback(function(){
            doClear = doClear === undefined ? true : doClear;
            if (self._hasBoundFields) {
               // При запуске обновления фильтров дождемся когда они применятся
               result.addCallback(function(){
                  var filter = self.getRecordSet().getQuery();
                  // Проверим все поля, которые делаю автообновление
                  $ws.helpers.forEach(self._boundFields, function(filterName, fieldName){
                     // Найдем контекст, в котором сидит отслеживаемое поле (или должно сидеть)
                     origin = self._currentRecordSet.getContext().getFieldOrigin2(fieldName);

                     // Сохраним, что по смене данного поля не нужно обновляться (т.е. сейчас мы получим onFieldChange с ним)
                     self._preventReloadForField[fieldName] = 1;

                     // Если меняли фильтр, для которого есть автообновление по контексту и для него передали какое-либо значение
                     if (filterName in filter && filter[filterName] !== undefined) {
                        origin = origin || self._getDefaultFilterContext();
                        // поменяем его значение на то, что передано в фильтре
                        origin.setValue(fieldName, filter[filterName]);
                     } else {
                        // Отслеживаемое поле есть, а в запросе не передали
                        if (origin) {
                           origin.setValue(fieldName, undefined);
                        }
                     }
                  });
                  // По-окончании применения измений - сбросим все блокирующие поля
                  self._preventReloadForField = {};
               });
            }
            result.dependOn(self._currentRecordSet.setQuery(filter, doClear, undefined, noLoad));
         });
         return result;
      },
      /**
       * <wiTag group="Данные">
       * Возвращает deferred последней загрузки браузера.
       * @returns {$ws.proto.Deferred} Асинхронное событие.
       * @example
       * <pre>
       *    myTableView.getLastDeferred().addCallback(function(records_count){
       *          $ws.proto.alert('Пришло ' + records_count + ' записей');
       *          return records_count;
       *       });
       * </pre>
       */
      getLastLoadDeferred: function() {
         return this._lastLoadDeferred ? this._lastLoadDeferred : this._firstLoadDeferred;
      },
      /**
       * <wiTag group="Управление">
       * Сбросить фильтрацию табличного представления к начальной, т.е. к той, с которой оно построилось в первый раз.
       * Может не перегружать данные и, как следствие, не обновлять отображение браузера (noLoad).
       * @param {Boolean} [noLoad=false] Не инициировать загрузку данных.
       * @example
       * <pre>
       *     dataView.resetFilter();
       * </pre>
       */
      resetFilter: function(noLoad){
         this._currentFilter = $ws.core.merge({}, this._initialFilter);
         this._currentRecordSet.resetFilter(this._currentFilter, noLoad);
      },
      /**
       * <wiTag group="Управление">
       * Получить текущие параметры фильтрации представления данных.
       * Может перенабрать их, если значения каких-либо параметров были указаны не как константы (updateFromContext).
       * @param {Boolean} [updateFromContext=false] Нужно ли перезагружать поля из контекста.
       * @return {Object} Текущий фильтр браузера.
       * @example
       * <pre>
       *    //эмулирует перезагрузку представления данных
       *    dataView.setQuery(dataView.getQuery(true));
       * <pre>
       */
      getQuery : function(updateFromContext){
         var recordSetFilter = {},
             browserFilter = $ws.core.merge({}, this._currentFilter);
         if (updateFromContext) {
            //если у нас есть массивы в фильтре, то вычистим их, чтобы значение было взято новое, а не превратилось в непойми что после $ws.core.merge
            $ws.helpers.forEach(browserFilter, function(value, name){
               if($ws.helpers.type(value) === 'array'){
                  delete browserFilter[name];
               }
            });
            $ws.core.merge(browserFilter, this._prepareFilter(this._options.filterParams));
         } else {
            this._prepareSystemParams(browserFilter);
         }
         for(var i in browserFilter) {
            if (browserFilter.hasOwnProperty(i) && browserFilter[i] === undefined) {
               delete browserFilter[i];
            }
         }
         if (updateFromContext) {
            if (this._currentRecordSet) {
               recordSetFilter = $ws.core.merge({}, this._initialSource.filterParams);
               //Нужно сделать более правильно
               $ws.core.merge(recordSetFilter, this._functionValues);
               recordSetFilter = this._currentRecordSet.getUpdatedQuery(recordSetFilter);
               recordSetFilter = this._prepareSystemParams(recordSetFilter);
               //допишем в фильтр рекордсета текущие значения, если они статические, так как их не нужно сбрасывать к начальным,
               //а нужно лишь перечитать сложные фильтры - из контекста или функции
               for(var j in this._initialSource.filterParams){
                  if(this._initialSource.filterParams.hasOwnProperty(j) && !($ws.helpers.type(this._initialSource.filterParams[j]) in {'object':0, 'function':0} )){
                     if(this._currentFilter[j] !== undefined){
                        recordSetFilter[j] = this._currentFilter[j];
                     }
                  }
               }
            }
            return $ws.core.merge(browserFilter, recordSetFilter , {rec : true});
         } else {
            if (this._currentRecordSet) {
               recordSetFilter = this._currentRecordSet.getQuery();
            }
            return $ws.core.merge(browserFilter, recordSetFilter);
         }
      },
      /**
       * Дописывает в фильтр системные параметры
       * @param {Object} filter Фильтр
       * @param {Boolean} [preferSource] брать системные параметры из переданного фильтра
       * @return {Object}
       * @protected
       */
      _prepareSystemParams: function(filter, preferSource){
         var retval = $ws.core.merge({}, filter) || {};
         for(var i in this._systemParams){
            //возьмем системные параметры из текущего фильтра, если они не смотрят на контекст
            if(this._systemParams.hasOwnProperty(i) && $ws.helpers.type(i) !== 'object' && (!filter.hasOwnProperty(i) || preferSource !== true) ){
               retval[i] = this._currentFilter[i] !== undefined ? this._currentFilter[i] : this._systemParams[i];
            }
         }
         return retval;
      },
      /**
       * Подготавливает фильтр.
       * @param {Object} filter
       * @param {Boolean} [preferSource] брать системные фильтры из переданного
       * @returns {Object} новый фильтр
       */
      _prepareFilter: function(filter, preferSource, noKillFunction){
         //TODO переработать всю систему фильтрации в представлениях данных
         var retval = this._prepareSystemParams(filter, preferSource);
         for(var i in retval){
            if(retval.hasOwnProperty(i)){
               if (retval[i] instanceof Object && retval[i].fieldName !== undefined) {
                  retval[i] = this._context.getValue(retval[i].fieldName);
               } else if (typeof retval[i] === 'function' && !noKillFunction) {
                  retval[i] = retval[i].apply(this, [this._context, i]);
                  this._functionValues[i] = retval[i];
               }
            }
         }
         return retval;
      },
      /**
       * Подготавливает источник данных
       * @private
       */
      _prepareDataSource: function(){
         var dataSource = this._options.dataSource;

         if (!(dataSource instanceof Object)) {
            return;
         }

         if (this._filterFromState){

            // Переберем все возможные наборы фильтров
            $ws.helpers.forEach([
               this._options.filterParams || {},
               this._options.dataSource && this._options.dataSource.filterParams || {}
            ], function(filterStore){
               // для каждого набора ищем фильтры, которые завязаны на контекст
               $ws.helpers.forEach(filterStore, function(desc, filterName){
                  var originContext;

                  // Сохраним, что по смене данного поля не нужно обновляться (т.е. сейчас мы получим onFieldChange с ним)
                  this._preventReloadForField[filterName] = 1;

                  // нашли фильтр, который берется из контекста и пришел из состояния
                  if (filterName in this._filterFromState && desc && typeof desc === 'object' && 'fieldName' in desc) {
                     // найдем конекст куда писать, или выберем глобальный
                     originContext = this.getLinkedContext().getFieldOrigin(desc.fieldName) || this._getDefaultFilterContext();
                     originContext.setValue(desc.fieldName, this._filterFromState[filterName]);
                     // удалим фильтр в состоянии
                     delete this._filterFromState[filterName];
                  }
                  // По-окончании применения измений - сбросим все блокирующие поля
                  this._preventReloadForField = {};
               }, this);
            }, this);

            this._options.filterParams = $ws.core.merge(this._options.filterParams, this._filterFromState);
            this._prevFilterFromState = this._filterFromState;
            this._filterFromState = null;
         }

         var toMerge = {
            filterParams: {},
            hierarchyField: this._options.display.hierColumn ? this._options.display.hierColumn : '',
            rowsPerPage: this._options.display.recordsPerPage,
            usePages: this._options.display.usePaging,
            handlers: {
               onBeforeLoad: this._onDataLoadStarted.bind(this),
               onAfterLoad: this._onDataLoadedBatchUpdateWrapper.bind(this)
            }
         };

         this._options.dataSource.filterParams = $ws.core.merge(this._options.dataSource.filterParams || {}, this._options.filterParams, {preferSource : true});
         this._options.dataSource.filterParams = this._prepareSystemParams(this._options.dataSource.filterParams); // Допишем системные параметры
         $ws.core.merge(dataSource, toMerge);
      },
      /**
       * Конфигурирует источник данных
       * @private
       */
      _initDataSource: function(){
         var dataSource = this._options.dataSource;
         this._enumFiltersToListen(this._options.filterParams, this._options.dataSource.filterParams);
         this._prepareDataSource();
         this._initialSource = $ws.core.merge({}, dataSource, {clone:true});
         this._initialSource.context = this._context;
      },
      _filterContextChangeHandler: function(event, field) {
         var context, currentQuery, doReload = false;
         //если рекордсет еще не готов, то нам тут делать нечего...
         //все поля из контекста подтянутся при первой установке фильтра
         if(this._hasBoundFields && this._currentRecordSet !== null) {
            if(field) {
               // onFieldChange
               if(field in this._boundFields) {
                  // Если обновление данного поля не должно приводить к перезагрузке - ничего не делаем
                  if(!(field in this._preventReloadForField)) {
                     // Если текущий фильтр совпадает со значением текущего контекста - ничего не делаем
                     if (this._currentFilter[field] !== this.getLinkedContext().getValue(field)) {
                        // Запросим перезагрузку браузера
                        this._reloadDebounced();
                     }
                  }
               }
            } else {
               // onDataBind
               currentQuery = this.getQuery();
               context = this.getLinkedContext();
               $ws.helpers.forEach(this._boundFields, function(fakeVal, filterName){
                  //в fakeVal лежит имя фильтра, а не имя поля в контексте. ведь именно имя фильтра живет в currentQuery
                  if(currentQuery[fakeVal] !== context.getValue(filterName)) {
                     doReload = true;
                  }
               });
               if(doReload) {
                  this._reloadDebounced();
               }
            }
         }
      },
      _enumFiltersToListen: function() {
         this._boundFields = {};
         $ws.helpers.forEach(arguments, function(filterStorage){
            $ws.helpers.forEach(filterStorage, function(desc, filterName){
               if(desc && desc.fieldName && desc.autoreload) {
                  this._boundFields[desc.fieldName] = filterName;
               }
            }, this);
         }, this);
         this._hasBoundFields = !Object.isEmpty(this._boundFields);
      },
      /**
       * Инстанцирует RecordSet, подписывается на его события , записывает его в переменную
       * @return {Boolean} результат выполнения операции
       */
      _dataBind: function(){
         var self = this,
             dataSource = self._options.dataSource;

         // Отпишемся от onReady у родителя
         if (this._parent) {
            this._parent.unsubscribe('onReady', this._dataBindHandler);
         }

         // Источник данных не задан
         if (!(dataSource instanceof Object)) {
            return false;
         }

         var dataSourceCopy = $ws.core.merge({}, dataSource);
         dataSourceCopy.context = this._context;
         if (this._savedPageNum) {
            dataSourceCopy.pageNum = this._savedPageNum;
         }
         var initialFilterParams = this._options.filterParams ? $ws.core.merge({}, this._options.filterParams) : {};
         //добавим параметры фильтрации, определенные в рекордсете, потому что в фильтре таблицы их может не быть
         initialFilterParams = $ws.core.merge(initialFilterParams, dataSource.filterParams);

         this._initialFilter = this._options.filterParams ? this._prepareFilter(initialFilterParams) : {};
         this._currentFilter = $ws.core.merge({}, this._initialFilter);
         $ws.core.merge(dataSourceCopy.filterParams, this._functionValues);

         $ws.core.attachInstance('Source:RecordSet', dataSourceCopy).addCallback(function(instance){
            self._changeRecordSetHandlers(instance);
            self._dReady.callback();
            //событие готовности должно подниматься единожды, однако метод создания рекордсета вызывается еще и из setSource
            if(!self._isReady){
               self._notify('onReady');
               self._isReady = true;
            }
         });
         return true;
      },
      /**
       * Проверяет, изменилось ли в фильтре что-нибудь, кроме страницы
       * @param {Object} filter Новый фильтр
       * @return {Boolean}
       * @private
       */
      _hasFilterChanges: function(filter){
         for(var i in filter){
            if(filter.hasOwnProperty(i)){
               if(i !== 'pageNum' && this._pagingFilter[i] !== filter[i]){
                  return true;
               }
            }
         }
         return false;
      },
      /**
       * Событие, поджигаемое при начале загрзузки данных.
       * Рисует иконку загрузки в теле вместо данных.
       * Поджигается $ws.proto.RecordSet
       * @param {Event} event Событие
       * @param {Object}  filter Параметры фильтрации
       */
      _onDataLoadStarted: function(event, filter){
         var self = this;
         if (!this._ajaxLoader) {
            this._ajaxLoader = this._container.find('.ws-browser-ajax-loader');
         }
         this._clearTimeOutLoadingIndicator();
         this._loadingTimer = setTimeout( this._showLoadingIndicatorInTime.bind(self), $ws._const.Browser.loadingIndicatorDelay);
         this._notify('onFilterChange', filter);
         if(this._paging && this._hasFilterChanges(filter)){
            this._paging.clearMaxPage();
         }
         this._pagingFilter = filter;
         //откатываю изменения Алены по поводу сохранения функции в параметрах фильтрации
         this._currentFilter = filter;
         //this._currentFilter = this._prepareFilter(filter, undefined, true);
         this._isLoading = true;
         this.getContainer().removeClass('ws-DataViewAbstract__dataLoaded');
         this._notify('onBeforeLoad');
      },
      /**
       * <wiTag group="Управление">
       * Началась ли загрузка. Будет true в оnDataLoadStarted {@link onBeforeLoad}
       * @returns {Boolean} true - загрузка началась, false - нет.
       * @see оnDataLoadStarted
       * @see onBeforeLoad
       */
      isLoading: function(){
         return this._isLoading;
      },
      /**
       * Пересобирает массив _selectedRecords, правит индексы в _selected
       * @protected
       */
      _resetSelectedRecords: function() {
         var selectedRecords = [],
             curSelectedKeys = this._storeKeysFromSelectedRecords();
         $ws.helpers.forEach(this._selected, function(value, key) {
            if (this._currentRecordSet.contains(key)) {
               this._selected[key] = selectedRecords.length;
               selectedRecords.push(this._currentRecordSet.getRecordByPrimaryKey(key));
            } else if(this._options.display.usePaging || this.isHierarchyMode()){
             //Возможно имеет смысл вместо проверки на isHierarchyMode проверить, что открыли в
             //селекторе с помощью $ws.helpers.instanceOfMixin(this, то_что_подмешивали) (работает в 3.7.1)
               this._selected[key] = -1;
               if (curSelectedKeys.hasOwnProperty(key)) {
                  selectedRecords.push(curSelectedKeys[key]);
               }
            }
         }, this);
         this._selectedRecords = selectedRecords;
      },
      _storeKeysFromSelectedRecords: function(){
         var keys = {};
         for (var i = 0, len = this._selectedRecords.length; i < len; i++) {
            keys[this._selectedRecords[i].getKey()] = this._selectedRecords[i];
         }
         return keys;
      },
      /**
       * Событие, поджигаемое при загрзузке данных.
       * Поджигается $ws.proto.RecordSet
       *
       * @param {Event} eventState
       * @param {$ws.proto.RecordSet} recordSet
       * @param {Boolean} isSuccess Успешность запроса. Если не успешен - значит произошел Abort Ajax запроса
       * @param {Error} [error] Ошибка в случае неуспешного запроса
       */
      _onDataLoaded: function(eventState, recordSet, isSuccess, error){
         var self = this;
         function doUpdate() {
            var result,
                colgroup;

            if(isSuccess){
               self._currentRecordSet = recordSet;
               self._notify('onAfterLoad');

               if(self._onBeforeRenderActions() && !self._isDestroyed) {//Могут существовать случаи, когда загрузка рекордсета произошла после смерти браузера
                  self._processPaging();
                  self._resetSelectedRecords();
                  //Если колонки есть, то нам просто нужно их перечитать
                  if(self._columnMap && self._columnMap.length > 0){
                     self._mapColumns();
                  }
                  //Иначе ещё и шапку рисуем
                  else{
                     // Нужно в том случае, если браузер был сконфигурирован без колонок вообще
                     self._refreshHead();
                  }
                  //Если папка сменилась, то в зависимости от режима загрузки по частям по разному открываем пути.
                  if (self._turn === '' && self._pathSelector) {
                     self._findWay(self._currentRootId);
                  }
                  var activeElement = self.getActiveElement();
                  //Если инициатор загрузки данных PathSelector, то не меняем ключ активной строки (используем установленный в _onPathSelectorChange)
                  if (self._loadedForPathSelector) {
                     self._loadedForPathSelector = false;
                  //Если папка сменилась, то в зависимости от режима загрузки по частям по разному открываем пути.
                  } else if (activeElement) { // если в браузере были записи, запоминаем активную
                     self._hovered = activeElement.attr('rowkey');
                  }
                  self._drawFooter();
                  self._drawBody();
                  self._updatePager();

                  self._notifyOnSizeChangedWithVisible();
                  self.getContainer().addClass('ws-DataViewAbstract__dataLoaded');
                  self._notifyBatchDelayed('onDataReady');
                  if(!self._firstLoadDeferred.isReady()){
                     self._firstLoadDeferred.callback();
                  }
                  self._changeState();
               }
            }
            else{
               var readerParams = self._options.dataSource.readerParams,
                   methodName = readerParams.linkedObject + '.' + (readerParams.queryName || 'Список'),
                   isError403 = false,
                   isUserProcessed = false,
                   isHttpError = false;
               if(error instanceof HTTPError && error.httpError !== 0){
                  isError403 = error.httpError === 403;
                  isUserProcessed = self._notify('onLoadError', error, methodName) === true;
                  isHttpError = true;
               }
               if(!isUserProcessed){
                  self._body.empty();
                  self._rootElement.find('.ws-browser-pager-text').empty();
                  if (isError403) {
                     self._emptyDataBlock.html('<span class="ws-browser-deny">Недостаточно прав для просмотра информации</span>');
                     self._emptyDataTextSet = false;
                  }
                  if (self._emptyDataText) {
                     self._emptyDataBlock.removeClass('ws-hidden');
                  }
                  self._foot.addClass('ws-hidden');
                  self._heightChangedIfVisible();
                  if (isHttpError && !isError403) {
                     $ws.helpers.alert(error, { checkAlreadyProcessed: true }, self);
                  }
                  error.processed = true;
               }
            }
            return result;
         }

         return this._runInBatchUpdate('_onDataLoaded', function() {
            try {
               doUpdate.call(self);
            } finally {
               self._hideLoadingIndicator();
            }
         });
      },
      /**
       * Фильтрует то, что должно попасть в состояние
       * @param {Object} filter Фильтр браузера
       * @protected
       */
      _filterState: function(filter){
         for (var i in filter){
            if (filter.hasOwnProperty(i)) {
               var filterConfig = this._options.dataSource.filterParams[i];
               if (filterConfig && Object.prototype.toString.call(filterConfig) === '[object Object]' && filterConfig.saveToState === false) {
                  delete filter[i];
               } else if (filter[i] instanceof Date) {
                  filter[i] = filter[i].toSQL(true);
               }
            }
         }
      },
      /**
       * Возвращает текущее состояние контрола
       * @returns {*}
       * @private
       */
      _getState: function(){
         var state;
         if (this._isNavigation()){
            var record = this.getActiveRecord();
            state = record ? record.getKey() : null;
         }
         else{
            var f = this.getQuery();
            this._filterState(f);
            state = JSON.stringify(f);
         }
         return state;
      },
      /**
       * Сохраняем состояние
       * @private
       */
      _changeState : function(replace){
         if(!this._applyingState){
            var state = this._getState();
            if(state){
               this._notify('onStateChanged', state, this._isNavigation() ? !replace : false);
            }
         }
      },
      _isNavigation: function(){
         return this._options.mode === 'navigationMode';
      },
      /**
       * <wiTag group="Управление" >
       * Применяет указанное состояние
       * @param {String | int} state - состояние
       * @example
       * <pre>
       *    dataView.applyState('"Пользователь":"123"');
       * </pre>
       */
      applyState : function(state){
         var self = this;
         if (this._isNavigation()){
            var
                  curRec = this.getActiveRecord(),
                  curState =  curRec ? curRec.getKey() : null;

            if(state !== 'null' && state != curState){
               this._applyingState = true;
               this._firstLoadDeferred.addCallback(function(){
                  $ws.helpers.callbackWrapper(
                        typeof self.showBranch === 'function' ?
                              self.showBranch(state) :
                              self.setActiveElement(self._body.find('[rowkey="' + state + '"]'), undefined, undefined, true),
                        function(){
                           self._applyingState = false;
                  });
               });
            }
            else{
               this.setActiveElement(this._body.find('[rowkey="' + (this._rootNode === null ? 'null' : this._rootNode.toString()) + '"]'));
            }
         }
         else{
            var q;

            //Если применяемое состояние соответсвует текущему, то ничего не делаем
            if (state === this._getState()){
               return;
            }

            try {
               q = $.parseJSON(state);
            }
            catch(e){
               q = {};
            }

            q = typeof q == 'object' ? q : {};

            if ($.isEmptyObject(this._initialSource)){
               self._filterFromState = q;
            }
            else{
               this._dReady.addCallback(function(){
                  self.setQuery(q);
               });
            }


            var findControl = function(parent, name){
               if (!parent) {
                  return false;
               }

               if (parent.hasChildControlByName(name)) {
                  return parent.getChildControlByName(name);
               } else {
                  return findControl(parent.getParent(), name);
               }
            };

            for (var i in q){
               if (q.hasOwnProperty(i) && !(i in {'pageCount':0,'usePages':0})){
                  if(i !== 'pageNum'){
                     var
                           field = this._initialFilter[i],
                           name = field ? field.fieldName : undefined,
                           filterControl = name !== undefined ? findControl(this.getParent(), name) : undefined;
                     if (filterControl instanceof $ws.proto.DataBoundControl) {
                        filterControl.setValue(q[i]);
                     } else if (name !== undefined) {
                        this.getLinkedContext().setValue(name, q[i]);
                     }
                  }
                  else if(q[i]) {
                     this._savedPageNum = q[i];
                  }
               }
            }
         }
      },
      /**
       * Дейтсвия перед отрисовкой. Если вернём false, то отрисовка остановится
       * @returns {Boolean}
       */
      _onBeforeRenderActions: function(){
         return true;
      },
      /**
       * Скрывает индикатор загрузки и останавливает таймер
       */
      _hideLoadingIndicator: function(){
         if(!this._ajaxLoader) {
            this._ajaxLoader = this._container.find('.ws-browser-ajax-loader');
         }
         this._clearTimeOutLoadingIndicator();
         this._ajaxLoader.addClass('ws-hidden');
      },
      _showLoadingIndicatorInTime: function(){
         this._ajaxLoader.removeClass('ws-hidden');
      },
      _clearTimeOutLoadingIndicator: function(){
         if(this._loadingTimer !== undefined){
            clearTimeout(this._loadingTimer);
            this._loadingTimer = undefined;
         }
      },
      /**
       * Метод обработки интеграции с пейджингом
       */
      _processPaging : function(){
         var nextPage = this._currentRecordSet.hasNextPage();
         if (this._pageChangeDeferred) { // только когда меняли страницу
            this._pageChangeDeferred.callback([this._currentRecordSet.getPageNumber() + 1, nextPage, nextPage]);
            this._pageChangeDeferred = undefined;
         }
         if (this._paging) {
            var pageNum = this._paging.getPage();
            //Если на странице больше нет записей - то устанавливаем предыдущую (если это возможно)
            if (this.getRecordSet().getRecordCount() === 0 && pageNum > 1) {
               this._paging.setPage(pageNum - 1);
            }
            this._paging.update(undefined, nextPage, nextPage);
         }
      },
      /**
       * Перезагружает данные после обновления записей
       * @param {Array} records Удалённые записи
       * @protected
       */
      _reloadAfterRecordsChange: function(records){
         this._currentRecordSet.updatePages();
         this._currentRecordSet.reload();
      },
      /**
       * Действия после удаления записей
       * @param {Array} records Удалённые записи
       * @private
       */
      _updateAfterRecordsDelete: function(records){
         this._notify('onRecordsChanged');
         if( this._options.reloadAfterChange ){
            this._reloadAfterRecordsChange(records);
         }
      },
      /**
       * Обработчик на удаление записи в рекордсете
       * @param {Object} event
       * @param {String} key Идентификатор удалённой записи
       * @param {String} record Удалённая запись
       * @protected
       */
      _onRecordDeleted: function(event, key, record) {
         if (this._isFakeDelete === true) {
            this._isFakeDelete = false;
         } else {
            if (this._selected[key] >= 0) {
               if(!this._isGroupDelete){
                  delete this._selectedRecords[this._selected[key]];
                  this._recalcSelected(this._selected[key]);
                  this._selectedRecords = this._getSelectedRecords();//Удалили undefined
                  delete this._selected[key];
               }
               //если удалили одну из отмеченных записей, то поднимем событие об изменении выделения
               this._notifyBatchDelayed('onChangeSelection', record, false);
            }
            this._notify('onRecordsDeleted');
            this._updateAfterRecordsDelete(record ? [record] : []);
         }
      },
      /**
       * Сравнивает два id, возвращает true, если они значат одно и тоже
       * @param {String|Object|Number} [id0] Первый идентификатор
       * @param {String|Object|Number} [id1] Второй идентификатор
       * @returns {Boolean}
       */
      _isIdEqual: function(id0, id1){
         if(id0 === undefined || id1 === undefined){
            return false;
         }
         if(id0 == 'null'){
            id0 = null;
         }
         if(id1 == 'null'){
            id1 = null;
         }
         return id0 == id1;
      },
      /**
       * Обработчик на добавление записи в рекордсете
       */
      _onRecordUpdated: function(event, record){
         this._minimized = false;
         this._isShowSelection = false;
         this._initialRecordSet = false;
         this._notify('onRecordsChanged');
         if(this._isUpdatingRecords || this._notifyOnAfterInsert(record)){
            return;
         }
         if(this._options.reloadAfterChange){ // Если нужно перегружаться - попросим рекордсет
            this.reload();
         } else {// иначе просто вызовем отрисовку на текущем наборе данных
            this._drawBody();
         }
      },
      _notifyOnAfterInsert: function(record){
         var self = this;
         if (this._updateRecordMethodName == 'Insert'){
            var recordSet = self.getRecordSet(),
                flag;
            flag = self._notify('onAfterInsert', record);
            if(typeof flag === 'string'){
               this.once('onAfterRender', function(){
                  var newActiveRow = self._body.find('[rowkey="' + flag + '"]');
                  if(newActiveRow.length !== 0) {
                     this.setActiveElement(newActiveRow);
                  }
               });
            } else if (flag){
               self._isUpdatingRecords = true;
               self._updateRecordMethodName = false;
               var numRecords = recordSet.getRecordCount(),
                  position = flag === true ? numRecords : (flag.position ? flag.position : flag),
                  recordToInsert = flag.record ? flag.record : record;
               if (numRecords >= position){
                  recordSet.clearRecord(recordSet.getRecords()[numRecords - 1].getKey());
                  recordSet.insertAfter(recordSet.getRecords()[position - 1 - (numRecords === position ? 1 : 0)].getKey(), recordToInsert);
               }
               self.refresh();
               self._isUpdatingRecords = false;
               return true;
            }
         }
         return false;
      },
      /**
       * возвращает узел, в котором добавили/отредактировали запись
       */
      _getNodeForRecordUpdate: function(){
         return null;
      },
      /**
       * Метод сортировки.
       * Пока не работает. только содержит общий механизм.
       */
      _applySorting: function(){
         if(this._currentRecordSet && this._currentRecordSet instanceof $ws.proto.RecordSet){
            var sorting = [];
            for(var c = 0, len = this._sortingStack.length; c < len; ++c){
               sorting.push();
            }
            this._currentRecordSet.setPage(0, true);
            this._currentRecordSet.setSorting(sorting, false);
         }
      },

      /**
       * <wiTag group="Управление">
       * Проверка записи - для модуля TreeViewAbstract (обработка клика по корневой записи)
       */
      checkRecord: function(record, row, event){
         return true;
      },
      /**
       * Инициализирует события, которые нужно инициализировать один раз
       */
      _initEvents: function(){
         var self = this,
             rowkey;
         var clickHandler = this._createBatchUpdateWrapper('DataViewAbstract.clickHandler', function(event) {
            if(self._dropped){
               event.stopPropagation();
               return true;
            }
            var cell = $(this),
                row = cell.closest('[rowkey]'),
                rowkey = row.attr("rowkey"),
                editMode = row.hasClass("ws-browser-folder") ? self._options.editBranchMode : self._options.editMode,
                record = rowkey && self._currentRecordSet.contains(rowkey) ?
                         self._currentRecordSet.getRecordByPrimaryKey(rowkey) : undefined,
                  target = event.target;
            self._onClickHandler(event);
            if(self.isEnabled()){
               var cellIndex = cell.attr("coldefindex") ? parseInt(cell.attr("coldefindex"), 10) : undefined,
                   tableHeadName = undefined,
                   rowColumnName = undefined,
                   isBadHref = (target.tagName === 'A' &&
                           !($(target).hasClass('ws-browser-edit-link') || $(target).hasClass('ws-browser-link')) &&
                           (target.href !== '' || target.href !== '#'));
               if(cellIndex !== undefined && self._columnMap && cellIndex >= 0){
                  tableHeadName = self._columnMap[cellIndex].title;
                  rowColumnName = self._columnMap[cellIndex].field;
               }

               if (self.checkRecord(record, row, event)) {
                  if(event.type === 'dblclick'){
                     self._dblClickHandler.apply(self, [row, record, tableHeadName, rowColumnName, isBadHref]);
                  }
                  else{
                     self._oneClickHandler.apply(self, [row, record, tableHeadName, rowColumnName, isBadHref, event]);
                  }
               }
            }
            return isBadHref || editMode == 'thisWindow';
         }, true);
         this._rootElement.find('.ws-browser-container').bind('scroll', function() {
            if(self._hasRowOptions) {
               self._hideRowOptions();
            }
         });

         /**
          * Что мы фиксим здесь...
          * Кейс:
          *  Барузер, данных больше чем вмещается (есть верт. скроллинг)
          *  - Активируем браузер
          *  - Ставим курсор куда-то в первые ряды
          *  - Деактивируем браузер
          *  - Сроллим контейнер так чтобы строки было не видно
          *  - Кликаем на строку --> браузер прыгает.
          *
          * Происходило из-за того, что сперва клик доходил до контейнера и браузер делался активным
          * и фокус вставал на текущую активную строку.
          * А уже потом активной делалась строка, на которую кликали
          */
         var rows = $('[rowkey] > .ws-browser-cell', self._body.parent()[0])
               .live('click', this._rowSelect = function (event) {
               if (self.isEnabled() && event.button === 0 && !event._rowSelect) {
                  var tableRow = $(this).closest('.ws-browser-table-row', self._body);
                  // могли вызвать извне с левым селектором, проверяем, что есть строка.
                  if (tableRow.length) {
                     self.setActiveElement(tableRow, false, true, true);
                  }
               }
            });
         rows.wsFixedLiveClick2(clickHandler, clickHandler);
         this._checkRowOptions();
      },
      /**
       * Обработчик скролла в теле браузера
       */
      _onScrollActions: function(){
         if(this._hasRowOptions) {
            this._hideRowOptions();
         }
      },
      /**
       * <wiTag group="Управление" >
       * Метод, возвращающий имя основного диалога фильтрации представления данных.
       * @returns {String} Имя диалога фильтрации.
       * @example
       * <pre>
       *    if(dataView.getFiltersDialogName() !== 'Фильтрация')
       *       dataView.createFiltersDialog('Фильтрация');
       * </pre>
       * @see filterDialogTemplate
       * @see createFiltersDialog
       */
      getFiltersDialogName: function(){
         return this._options.filterDialogTemplate;
      },
      /**
       * <wiTag class=TableView page=2 group="Управление">
       * <wiTag group="Управление">
       * Метод создания диалога фильтров.
       * Может отобразить диалог по указанному шаблону (filterDialog).
       * Если же не указали, то покажет стандартный диалог, указанный в конфигурации представления данных.
       * @param {String} [filterDialog] Имя диалога фильтров.
       * @param {Number} [id]
       * @example
       * <pre>
       *    if(dataView.getFiltersDialogName() !== 'Фильтрация')
       *       dataView.createFiltersDialog('Фильтрация');
       * </pre>
       * @see filterDialogTemplate
       * @see getFiltersDialogName
       */
      createFiltersDialog:function(filterDialog, id){
         var self = this,
             hdl = {
                onAfterClose : self._mouseMonitor.bind(self)
             },
             colDef = {};
         if(id)
            colDef = self._columnMap[id];
         if(!filterDialog)
            filterDialog = this._options.filterDialogTemplate;
         else
            hdl['onBeforeApplyFilter'] = function(event, filter){
               var newFilter = {},
                     currentFilter = self.getQuery(),
                     title = colDef.title;
               if(!Object.isEmpty(colDef)){
                  if(!Object.isEmpty(filter)){
                     for(var key in filter){
                        if(filter.hasOwnProperty(key)){
                           if(key === title){
                              newFilter[key] = filter[key];
                              break;
                           }
                        }
                     }
                     newFilter = $ws.core.merge(currentFilter, newFilter);
                  }else if(currentFilter[title]){
                     delete currentFilter[title];
                     newFilter = currentFilter;
                  }
               }
               event.setResult(newFilter);
            };
         this._useKeyboard = true;
         $ws.core.attachInstance('SBIS3.CORE.FiltersWindow', {
            template: filterDialog,
            context: new $ws.proto.Context().setPrevious(self.getLinkedContext()),
            linkedBrowsers: [ this.makeOwnerName() ],
            handlers: hdl
         });
      },
      /**
       * Рисует тело таблицы и заполняет его данными
       */
      _drawBody: function(){
         var block = BOOMR.plugins.WS.startBlock(["DataViewAbstract._drawBody", this._methodName].join("?"));
         // Всегда скрываем опции строки. Если перерисуется браузер, скорее всего что-то поменялось. Нужны новые опции строки, а не старые - с обновлёнными данными, возможно, старые кнопки будут не нужны
         this._hideRowOptions();
         this._beforeDrawActions();
         this._drawBodyCycle();
         // TODO сделать при рисовании body!
         if(this._options.useSelection === false) {
            this._data.addClass('ws-browser-selection-none');
         }
         if(this._options.mode === 'oneClickMode') {
            this._data.addClass('ws-one-click-browser');
         }
         this._data.toggleClass('ws-browser-hasZebra', !!this._options.display.hasZebra);
         this._data.toggleClass('ws-browser-hasToolbar', !!this._options.display.showToolbar && !this._options.display.showHead);
         // ^^^

         if(this._currentRecordSet.isInit()){
            var headHidden = false;
            this._head.removeClass("ws-hidden");

            if(!this._emptyDataTextSet){
               this._emptyDataTextSet = true;
               if( this._currentRecordSet.isEmptyTable() ){
                  this._emptyDataText = this._options.display.emptyTableHtml;

                  headHidden = this._count === 0;
                  this._head.toggleClass("ws-hidden", headHidden);
               }
               else {
                  this._emptyDataText = this._options.display.emptyHtml;
               }

               this._emptyDataBlock.html(this._emptyDataText);
            } else if( this._currentRecordSet.isEmptyTable() ){
               this._emptyDataTextSet = false;//На следующем вызове _drawBody isEmptyTable() может быть другим, и может понадобиться переустановить содержимое блока _emptyDataBlock
               this._emptyDataText = this._options.display.emptyTableHtml;
               this._emptyDataBlock.html(this._emptyDataText);

               headHidden = this._count === 0;
               this._head.toggleClass("ws-hidden", headHidden);
            }

            if (headHidden) {
               this._headerContentFlags['headerRows'] = false;
            }

            this._emptyDataBlock.toggleClass('ws-hidden', this._count !== 0 || !this._emptyDataText);

            // Если у нас нет записей, не пустой текст отсутствия записей, не первая страница, то скрываем футер
            this._foot.toggleClass('ws-hidden', this._count === 0 && !!this._emptyDataText && this.getPageNumber() === 0);
         }
         // TODO зачем это?
         this._rootElement.height('auto');

         //Нужно обновить стили, относящиеся к содержимому блока заголовка (включить полосочку, если в заголовке что-то есть, или данные есть)
         this._updateHeaderContentStyles();

         this._heightChangedIfVisible();
         this._updateSelection();
         this._body.find('.ws-browser-table-row:last').addClass('ws-browser-no-table-row-last');
         block.close();
         this._runBatchDelayedFunc('drawBody.onAfterRender', function() {
            if(this._notify('onAfterRender') === true){
               this.recalcBrowserOnDOMChange();
            }
         });
         this._lastActiveElement = this._activeElement;
      },
      /**
       * Действия, которые необходмо выполнить перед отрисовкой
       * @private
       */
      _beforeDrawActions: function(){
         if(this._options.display.rowOptions){
            this._hideRowOptions();
         }
      },
      _contentHeightChanged: function(){
         this._setHeight();
      },
      /**
       * Проходит по строкам рекордсета, рисует нужные
       */
      _drawBodyCycle: function(){
         throw new Error("DataViewAbstract::_drawBodyCycle must be implemented in child classes");
      },
      /**
       * Выполняет действия, необходимые для сохранения открытых элементов отрисовки
       */
      _reloadBody: function(){
         this._drawBody();
      },
      /**
       * Обновляет отображение текущего элемента после перерисовки
       */
      _updateSelection: function(noNotify){
         if(this._hovered || !this._hovered && !this._options.useHoverRowAsActive && this._options.setCursorOnLoad){
            // Попробуем найти текущий выделенный элемент
            var selectedRow = this._body.find(this._hovered ? '[rowkey="' + this._hovered + '"]' : ':first');
            // Если не получилось
            if(selectedRow.length != 1 || selectedRow.hasClass('ws-hidden'))
               selectedRow = this._body.find(':first'); // Выберем первый элемент
            if(selectedRow.length === 0){// не обрабатываем в случае, если в браузере по какой-то причине нет элементов
               this._activeElement = undefined;
               this._hovered = undefined;
               if (!noNotify) {
                  this._notifySetCursor(undefined);
               }
               this.getContainer().focus();
            }
            else {
               this.setActiveElement(selectedRow, undefined, noNotify);
            }
         }
      },
      /**
       * Ивещает о смене текущей строки. При этом сохраняет последнюю строку, чтобы одно событие не срабатывало дважды подряд (как в случае при открытии дерева)
       * @param {$ws.proto.Record} record Запись, которая относится к данной строке
       */
      _notifySetCursor: function(record){
         if(!this._rowSelectionSetted) {
            this._runBatchDelayedFunc('onSetCursor', function() {
               var row = record ? this._body.find('[rowkey="' + record.getKey() + '"]') : $();
               this._notify('onSetCursor', row, record);
            });
         }
         else {
            this._rowSelectionSetted = false;
         }
      },
      /**
       * Рисует футер таблицы
       */
      _drawFooter: function(){
         // растягиваем строку состояния на всю ширину таблицы
         if(!this._footerDrawed){
            this._footerDrawed = true;
            if(this._options.display.showRecordsCount){
               if(this._options.display.usePaging && this._options.display.usePageSizeSelect){
                  this._pageOptions = this._pageOptions.concat($ws._const.Browser.pageSizes);
                  var self = this;
                  this._insertPageCount(this._options.display.recordsPerPage);
                  //здесь раньше если не было в хранилище размера страницы, то он проставлялся, но не должен
                  this._pageOptionsDropdown = new FieldDropdown({
                     enabled: true,
                     element: this._container.find('.ws-browser-pager-select'),
                     width: '100%',
                     renderStyle: 'simple',
                     showSelectedInList: false,
                     data: {
                        keys: this._pageOptions,
                        values: this._pageOptions
                     },
                     wordWrap: false,
                     allowChangeEnable: false, //Запрещаем менять состояние, т.к. он нужен активный всегда
                     context: new $ws.proto.Context().setPrevious(this.getLinkedContext()).setValue("page-select-dropdown" + this._id, this._options.display.recordsPerPage),
                     name: 'page-select-dropdown' + this._id,
                     value: this._options.display.recordsPerPage,
                     handlers: {
                        onChange: function(){
                           self._dropPageSave();
                           self._setPageSize(this.getValue());
                        }
                     }
                  });
                  this._foot.find('.ws-browser-pager')
                     .removeClass('ws-hidden')
                     .bind('click', function(event){
                        var selectArrow =  self._foot.find('.custom-select-arrow');
                        if (selectArrow.is(':visible'))
                           selectArrow.click();
                        event.stopImmediatePropagation();
                        return true;
                     });

               }
            }
         }
      },
      /**
       * <wiTag group="Данные" >
       * Возвращает признак, отображается ли браузер в "иерархическом" режиме
       * @returns {Boolean}
       * @example
       * <pre>
       *    if(dataView.isHierarchyMode())
       *       dataView.showBranch("11");
       *    else
       *       dataView.reload();
       * </pre>
       */
      isHierarchyMode: function(){
         return false;
      },
      /**
       * Вызывает события onRowActivated для активной строки
       * @param {jQuery} activeRow активная строка
       * @param {Boolean} [ignoreSelection]
       */
      _elementActivated: function(activeRow, ignoreSelection) {
         var currentRecord = this.getActiveRecord(activeRow);

         if (currentRecord instanceof $ws.proto.Record){
            ignoreSelection = ignoreSelection ? ignoreSelection : false;
            if(this._selectMode && !ignoreSelection){
               this.confirmSelection([currentRecord]);
               return;
            }
            var eventResult = this._notify('onRowActivated', activeRow, currentRecord);
            if(eventResult !== false){
               this._showDialogForRecord(currentRecord);
            }
         }
      },
      /**
       * Показывает диалог редактирования для указанной записи
       * @param {$ws.proto.Record} record Запись
       * @private
       */
      _showDialogForRecord: function(record){
         this._showRecordDialog({recordId: record.getKey()});
      },
      /**
       * Обработчик двойного клика по строке
       * @param {jQuery} row Строка
       * @param {$ws.proto.Record} record Запись
       * @param {String} tableHeadName Название колонки
       * @param {String} rowColumnName Поле колонки
       * @param {Boolean} isBadHref  - если был клик по правильной ссылке пользователя, то не вызываем диалог редактирования
       * @protected
       */
      _dblClickHandler: function(row, record, tableHeadName, rowColumnName, isBadHref){
         var flag = this._handlersNotifier('onRowDoubleClick', row, record, tableHeadName, rowColumnName);
         if(!isBadHref && flag !== false && this._options.mode !== 'oneClickMode')
            this._elementActivated(row);
         return flag;
      },
      /**
       * Обработчик одиночного клика по строке
       * @param {jQuery} row Строка
       * @param {$ws.proto.Record} record Запись
       * @param {String} tableHeadName Название колонки
       * @param {String} rowColumnName Поле колонки
       * @param {Boolean} isBadHref  - если был клик по правильной ссылке пользователя, то не вызываем диалог редактирования
       * @param {Event} [event] - событие js
       * @protected
       */
      _oneClickHandler: function(row, record, tableHeadName, rowColumnName, isBadHref, event){
         var flag = this._handlersNotifier('onRowClick', row, record, tableHeadName, rowColumnName, event);
         if(!isBadHref && flag !== false && this._options.mode === 'oneClickMode')
            this._elementActivated(row);
         return flag;
      },
      _handlersNotifier: function (eventName, row, record, tableHeadName, rowColumnName, event){
         if (eventName === 'onRowDoubleClick'){
            $ws.helpers.clearSelection();
         }
         this._notifySetCursor(record);
         return this._notify(eventName, row, record, tableHeadName, rowColumnName, event);
      },
      /**
       * Обработка клика на элементе
       * @param {String} rowkey Идентификатор записи
       * @param {$ws.proto.Record} record Запись
       */
      _processElementClick: function(rowkey, record){
         this._notifySetCursor(record);
      },
      /**
       * Создаёт новую запись
       * @param {Object} [filter] фильтр для создания записи
       * @command newItem
       */
      _insertRecordItem: function(filter){
         return this._showRecordDialog({parentId: null}, filter);
      },
      /**
       * Редактирует текущую запись
       * @command edit
       */
      _editRecord: function(editKey, editDeferred){
         if(editKey){
            this.setActiveRow(this._body.find('.ws-browser-table-row[rowkey="' + editKey + '"]'))
         }
         if(editDeferred){
            this._editDeferred = editDeferred;
         }
         this._elementActivated(this.getActiveElement(), true);
         return true;
      },
      /**
       * удаление записей по фильтру
       * @param {Object} [filter] фильтр по которому удалять
       * @param {String} [methodName] имя списочного метода
       * @return {$ws.proto.Deferred}
       */
      deleteRecordsByFilter: function(filter, methodName){
         var dResult = new $ws.proto.Deferred();
         if(!this.isReadOnly() && this._options.allowDelete !== false){
            var self = this,
               deleteFilter = filter ? filter : this.getQuery(),
               showDialog = function(message){
                  self.getRecordsCount().addCallback(function(recordsCount){
                     if(recordsCount !== 0){
                        $ws.core.attachInstance('SBIS3.CORE.DialogConfirm', {
                           resizable: false,
                           opener: self,
                           message: message ? message : "Удалить " + (recordsCount ? recordsCount : '') + " запис" +
                              (recordsCount ? $ws.helpers.wordCaseByNumber(recordsCount, 'ей', 'ь', 'и') : 'и') + '?',
                           detail: "Внимание: данные удаляются окончательно без возможности восстановления",
                           handlers: {
                              onConfirm: function(event, result){
                                 if(result){
                                    self.getRecordSet().deleteRecordsByFilter(deleteFilter, methodName).addCallback(function(){
                                       dResult.callback(true);
                                    });
                                 }else
                                    dResult.callback();
                              }
                           }
                        });
                     }
                  });
               };
            this._onDeleteStartHandler(showDialog, deleteFilter);
         }
         return dResult;
      },
      /**
       * <wiTag group="Управление">
       * Функция для удаления отмеченных записей
       * @param {Array} [records] Удаляемые записи
       * @param {Boolean} [ignoreSelection] нужно ли учитывать выделение, используется при переданном массиве удаляемых записей.
       * Например, при вызове удаления через кнопки быстрого доступа к операциям над записью
       * @command delete
       * @return {$ws.proto.Deferred}
       */
      deleteSelectedRecords: function(records, ignoreSelection){
         if(this._options.display.readOnly || this._options.allowDelete === false){
            return;
         }
         var keys = [],
             correctRecords = records && records[0] instanceof $ws.proto.Record,
             selectedRecords = correctRecords ? records : this.getSelection(),
             l = selectedRecords.length,
             dResult = new $ws.proto.Deferred,
             self = this,
             showQuestion,
             activeElement = self.getActiveElement();
         showQuestion = function(message){
            $ws.core.setCursor(false);
            self._useKeyboard = true;
            var selection = self.getSelection(true);
            if(correctRecords){
               selection = ignoreSelection ? [] : records;
            }
            var countRecords = selection.length,
                detail = countRecords ? ((countRecords > 1 ? "отмечено " : "отмечена ")  + countRecords +
                      " запис" + $ws.helpers.wordCaseByNumber(countRecords, 'ей', 'ь', 'и')) : "";
            if(!message){
               message = countRecords ? ("Удалить " +
                   (countRecords === 1 ? " отмеченную запись" : " отмеченные записи") +
                   "?") : "Удалить текущую запись?";
            }
            $ws.helpers.question(message ? message : "Удалить отмеченные записи?", {
               'detail': detail
            }, self).addCallback(function(res){
               if(res){
                  self._toggleIndicator(true, true);
                  var i = 0;
                  for(i = 0; i < l; i++){
                     keys.push(selectedRecords[i].getKey());
                  }
                  var onBeforeDeleteResult = self._notify("onBeforeDelete", selectedRecords);
                  if(onBeforeDeleteResult !== false){
                     if(onBeforeDeleteResult instanceof Array)
                        keys = onBeforeDeleteResult;
                     var openedRecords = {},
                         errors = [];
                     for(var j=self._recordsOpened.length-1; j >= 0; --j){ // проверяем состояние открытых вкладок с запсяпи
                        var okay = false,
                            strUrl,
                            recordWindow = self._recordsOpened[j];
                        try {
                           strUrl = recordWindow.win.location.href;
                           strUrl = strUrl.substr(0,strUrl.search(/\?/));
                           strUrl = strUrl.substr(strUrl.search(/[^\/]\/[^\/]/)+2);
                           okay = strUrl === recordWindow.url;
                        } catch(e) {}
                        if (!okay) {
                           self._recordsOpened.splice(j,1);
                        } else {
                           openedRecords[recordWindow.rec]=true;
                        }
                     }
                     if(!Object.isEmpty(openedRecords)){
                        var newKeys = [];
                        for(i = 0, l = keys.length; i < l; i++){
                           if(openedRecords[keys[i]]) {
                              errors.push("Запись уже открыта в другой вкладке");
                           } else {
                              newKeys.push(keys[i]);
                           }
                        }
                        keys = newKeys;
                     }
                     self.getRecordSet().deleteRecord(keys).addCallback(function(){
                        if(activeElement) {
                           var newActiveElem = activeElement.next();
                           newActiveElem = !newActiveElem.hasClass('ws-browser-add-at-place-link-row') && newActiveElem.length ? newActiveElem : activeElement.prev();
                           if (newActiveElem && newActiveElem.length > 0) {
                              self.setActiveElement(newActiveElem, false);
                           }
                        }
                        dResult.callback(true);
                     }).addErrback(function(error){
                        var readerParams = self._options.dataSource.readerParams,
                            methodName = readerParams.linkedObject + ".";
                        methodName += (readerParams.destroyMethodName || "Удалить");
                        if(error instanceof HTTPError && error.httpError !== 0 && self._notify('onLoadError', error, methodName) !== true){
                           errors.push(error);
                           error.processed = true;
                        }
                        keys = [];
                        return error;
                     }).addBoth(function(){
                        self._toggleIndicator(true, false);
                        if(errors.length){
                           if (errors.length > 1) {
                              $ws.helpers.openErrorsReportDialog({
                                 title: 'Итоги операции: "Удалить"',
                                 numSelected: records.length,
                                 numSuccess: keys.length,
                                 errors : errors
                              });
                           }
                           else {
                              $ws.helpers.alert(errors[0], {}, self);
                           }
                        }
                     });
                  } else {
                     self._toggleIndicator(true, false);
                     dResult.callback();
                  }
                  self.removeSelection();
               }
               self.setActive(true);
               $ws.core.setCursor(true);
               self._useKeyboard = false;
               var row = self.getActiveElement();
               if (row) {
                  row.focus();
               }
            });
         };
         this._onDeleteStartHandler(showQuestion, selectedRecords);
         return dResult;
      },
      _onDeleteStartHandler: function(callback, records){
         var oDSres = this._notify('onDeleteStart', records);
         if (typeof oDSres === 'string') { // строка - свое сообщение в диалоге, вся логика штатная
            callback.apply(this, [oDSres]);
         } else if (oDSres instanceof $ws.proto.Deferred) { // Deferred - дождались success, пошли дальше
            oDSres.addCallback(callback);
         } else if (oDSres !== false) { // false - отмена штатной логики, все свое
            callback.apply(this);  // все остальное - штатная логика без изменений.
         }
      },
      /**
       * <wiTag group="Данные">
       * Возвращает режим постраничной навигации
       * @returns {string}
       * @see usePaging
       * @see showPaging
       */
      getPagingMode: function(){
         return this._options.display.usePaging;
      },
      /**
       * <wiTag group="Данные">
       * возвращает в колбэке количество всех(!) записей(без учета пейджинга)
       * @return {$ws.proto.Deferred}
       * @example
       * <pre>
       *    dataView.getRecordsCount().addCallback(function(count){
       *       $ws.core.alert("У вас " + count + " записей.");
       *    });
       * </pre>
       */
      getRecordsCount: function(){
         var result = new $ws.proto.Deferred(),
               filter = this.getQuery(),
               readerParams = this.getDataSource().readerParams,
               currentRecordSet = this.getRecordSet();
         if(this.getPagingMode() === 'parts' && !(currentRecordSet.getPageNumber() === 0 && !currentRecordSet.hasNextPage())){
            var obj = new $ws.proto.BLObject(readerParams.linkedObject);
            obj.query(readerParams.queryName || "Список", filter, {"type": 'full', "page": 0, "pageSize": 0}).addCallbacks(
                  function(recordSet){
                     result.callback(recordSet.getRecordCount() !== 0 ? recordSet.hasNextPage() : undefined);
                  },
                  function(error){
                     result.errback(error.message);
                  }
            );
         }else if(this.getPagingMode() === 'full')
            result.callback(currentRecordSet.hasNextPage());
         else
            result.callback(currentRecordSet.getRecordCount());
         return result;
      },
      /**
       * <wiTag group="Управление" page=2>
       * Очищает всю установленную на текущий момент сортировку табличного браузера и перезагружает его данные.
       */
      clearSorting: function(){
         if(!this._sortingStack.length){
            return;
         }
         this._head.find('.ws-browser-sortable').removeClass('asc').removeClass('desc').addClass('none');
         this._sortingStack = [];
         this._currentRecordSet.setPage(0, true);
         this._currentRecordSet.setSorting([], this.getQuery(), false);
      },
      /**
       * удерживается ли зажатым Ctrl
       * @param {Object} e переданное событие
       * @return {Boolean}
       */
      _isCtrl: function(e){
         return e.ctrlKey && !e.altKey && !e.shiftKey;
      },
      /**
       * к событию не применяются модификаторы Ctrl, Alt, Shift
       * @param {Object} e переданное событие
       * @return {Boolean}
       */
      _isNotModified: function(e){
         return !e.ctrlKey && !e.altKey && !e.shiftKey;
      },
      _mouseMonitor: function(){
         var self = this,
             waitMouseMove = function(){
                self._useKeyboard = false;
                $('[rowkey]', self._body.parent()[0]).die('mousemove', waitMouseMove);
             };
         $('[rowkey]', self._body.parent()[0]).live('mousemove', waitMouseMove);
      },
      /**
       * Обрабатывает нажатия клавиш
       * @param {Object} e переданное событие
       * @return {Boolean}
       */
      _keyboardHover: function(e){
         var res = this._keyboardShortcut(e) || false,
             self = this;
         if(!this._currentRecordSet || !this._currentRecordSet.isLoaded()){
            return res;
         }
         if(this.isActive()){
            var activeRow = this.getActiveElement(),
                nextAll = activeRow ? activeRow.next(".ws-visible:first") : [],
                prevAll = activeRow ? activeRow.prev(".ws-visible:first") : [],
                next = nextAll.length > 0 ? nextAll : null,
                prev = prevAll.length > 0 ? prevAll : null;
            if(e.ctrlKey && e.which === $ws._const.key.space){
               if(!this._isShowSelection)
                  this.showSelection(true);
               else
                  this.showSelection(false);
            } else if(this._isNotModified(e) && ( e.which === $ws._const.key.f5 || e.which === $ws._const.key.pageUp || e.which === $ws._const.key.pageDown)){
               res = true;
            }
            else if(this._isCtrl(e) && e.which === $ws._const.key.n){
               this.reload();
            } else if(this._isNotModified(e) && e.which === $ws._const.key.minus){
               this.removeSelection();
            } else if(this._isCtrl(e) && e.which === $ws._const.key.q){
               if(this._options.filterDialogTemplate)
                  this.createFiltersDialog();
            } else if(e.which === $ws._const.key.enter && (this._selectMode || e.ctrlKey) && !e.altKey && !e.shiftKey){
               if (this._options.multiSelect === false) {
                  var actRow = this.getActiveRow();
                  if (actRow !== false) {
                     this._selectedRecords = [];
                        this._selectActiveElement();
                     }
               }
               this.confirmSelection();
               e.stopPropagation();
               e.preventDefault();
            } else if(this._isCtrl(e) && (e.which === $ws._const.key.pageDown || e.which === $ws._const.key.pageUp)){
               this.setActiveElement(this._body.find(".ws-visible:" + ((e.which === $ws._const.key.pageDown) ? 'last' : 'first')));
               e.stopPropagation();
               e.preventDefault();
            } else if(this._isNotModified(e) && (e.which === $ws._const.key.down || e.which === $ws._const.key.up)){
               if(this._options.useHoverRowAsActive && !this._useKeyboard){
                  this._useKeyboard = true;
                  this._mouseMonitor();
               }
               var active = (e.which === $ws._const.key.down) ? next : prev;
               if(active && !active.hasClass('ws-browser-add-at-place-link-row')){
                  this.setActiveElement(active);
                  if(this._options.useHoverRowAsActive)
                     self._showRowOptions.apply(self, [active[0]]);
               }
            } else if(this._isNotModified(e) && e.which === $ws._const.key.space){
               /*
                  Костыль, который уйдет с рефакторингом DataViewAbstract.
                  Нужен для того, чтобы в таблице с включенным useSelection и содержащей строку ввода пробел доходил
                  до строки ввода, а выделение записи не делалось.
                */
               if ($(e.target).hasClass('input-string-field')) {
                  res = true;
               } else if (this._options.useSelection !== false) {
                  if(!(this._options.multiSelect === false && this.hasSelectedRecords() ) || (this._activeElement && this._activeElement.hasClass('ws-browser-selected'))) {
                     this._selectActiveElement();
                  }
                  this.setActiveElement(next);
               }
            } else if(this._isNotModified(e) && e.which === $ws._const.key.esc){
               res = true;
            } else {
               res = true;
            }
         } else{
            res = true;
         }
         return res;
      },
      /**
       * Инициализирует клавиатурные сокращения
       * @private
       */
      _initKeys: function(){
         this._registerShortcut($ws._const.key.del, $ws._const.modifiers.nothing, this.deleteSelectedRecords);
         this._registerShortcut($ws._const.key.insert, $ws._const.modifiers.nothing, this._insertRecordKey);
         this._registerShortcut($ws._const.key.f3, $ws._const.modifiers.nothing, this._editCurrentRow);
         this._registerShortcut($ws._const.key.enter, $ws._const.modifiers.nothing, this._enterKey);
      },
      /**
       * Обрабатывает клавишу добавления записи
       * @protected
       */
      _insertRecordKey: function(){
         var editFunction = this._actions["addItem"];
         if(this.isEnabled() && editFunction && !this.isReadOnly()){
            editFunction(this.getActiveElement(), false);
         }
      },
      /**
       * Редактирует выбранную запись
       * @protected
       */
      _editCurrentRow: function(){
         var activeRow = this.getActiveRow();
         if(this.isEnabled() && activeRow){
            this._elementActivated(activeRow, true);
            return false;
         }
         return true;
      },
      /**
       * <wiTag group="Данные">
       * Изменяет текущую активную строку
       * То же, что и setActiveElement()
       * @param {jQuery} row Выделенная строка
       * @example
       * <pre>
       *    var row = dataView.getContainer().find('[rowkey="123"]');
       *    dataView.setActiveRow(row);
       * </pre>
       */
      setActiveRow:function(row){
         this.setActiveElement(row);
      },
      /**
       * <wiTag group="Данные">
       * Получение текущей выделенной строки
       * @return {jQuery | Boolean} Возвращает текущую активную строку табличного браузера или false, если в браузере нет активной записи.
       * @example
       * <pre>
       *    dataView.getActiveRow().addClass("my-active-row");
       * </pre>
       */
      getActiveRow: function(){
         // ToDo: давайте сделаем что-то deprecated и потом удалим
         return this.getActiveElement();
      },
      /**
       * Обрабатывает нажатие клавиши enter
       * @return {Boolean}
       * @protected
       */
      _enterKey: function(){
         if (!this._selectMode)
            return this._editCurrentRow();
         return true;
      },
      _prepareCreateFilter: function(){
         return $ws.core.merge({}, this.getQuery());
      },
      /**
       * Вычитывает или создаёт запись с указанными параметрами
       * @param {String | undefined} recordId Идентфикатор записи. Если undefined - создаём запись
       * @param {Object} createRecordFilter фильтр для создания записи
       * @return {$ws.proto.Deferred} Деферред готовности записи, он передаёт первым параметром запись
       */
      _readRecord: function(recordId, createRecordFilter){
         var self = this,
             format;
         if(recordId === undefined){
            var filter = self._prepareCreateFilter.apply(self, arguments),
                newRecord,
                additionalCreateFilter = createRecordFilter || {};
            filter = $ws.core.merge(filter, additionalCreateFilter);
            newRecord = self._notify('onBeforeCreate', null, null, filter);
            if (newRecord === false) {
               return false;
            }
            if(newRecord instanceof $ws.proto.Deferred){
               var waitRecord = new $ws.proto.Deferred();
               newRecord.addCallbacks(function(result){
                  if(result instanceof $ws.proto.Record)
                     waitRecord.callback(result);
                  else {
                     if(result && Object.prototype.toString.call(result) == "[object Object]")
                        filter = $ws.core.merge(filter, result);
                     filter["ВызовИзБраузера"] = true;
                     self._currentRecordSet.createRecord(filter).addCallbacks(function(record){
                        waitRecord.callback(record);
                     }, function(error){
                        waitRecord.errback(error);
                        return error;
                     });
                  }
               }, function(error){
                  waitRecord.errback(error);
                  return error;
               });
               return waitRecord;
            } else if(newRecord instanceof $ws.proto.Record){
               return new $ws.proto.Deferred().callback(newRecord);
            } else {
               if(newRecord && Object.prototype.toString.call(newRecord) === "[object Object]") {
                  filter = $ws.core.merge(filter, newRecord);
               }
               filter["ВызовИзБраузера"] = true;
               format = self._notify('onSelectFormat', undefined, this._options.dataSource.readerParams.format);
               return self._currentRecordSet.createRecord(filter, format);
            }
         }
         else{
            var editableRecord = self._notify('onBeforeRead', recordId);
            if(editableRecord instanceof $ws.proto.Deferred) {
               return editableRecord;
            } else if(editableRecord instanceof $ws.proto.Record) {
               return new $ws.proto.Deferred().callback(editableRecord);
            } else {
               format = self._notify('onSelectFormat', recordId, this._options.dataSource.readerParams.format);
               return self._currentRecordSet.readRecord(recordId, format);
            }
         }
      },
      _recordErrorHandler: function(error, recordId){
         var readerParams = this._options.dataSource.readerParams,
             methodName = readerParams.linkedObject + ".";
         if(recordId === undefined)
            methodName += (readerParams.createMethodName || "Создать");
         else
            methodName += (readerParams.readMethodName || "Прочитать");
         if(error instanceof HTTPError && error.httpError !== 0 && this._notify('onLoadError', error, methodName) !== true){
            $ws.helpers.alert(error, { checkAlreadyProcessed: true }, this);
         }
         error.processed = true;
         return error;
      },
      /**
       * Возвращает признак доступности редактирования
       * @param {String} [recordId] Идентификатор запись
       * @param {Object} [filter]
       */
      _checkShowDialog: function(recordId, filter){
         return (this._options.display.readOnly && !recordId) ||
               (recordId === undefined && this._options.allowAdd === false);
      },
      /**
       * Отображает диалог редактирования записи. Сам
       * @param {Object} recordConfig Конфигурация редактируемой/создаваемой записи. Может содержать recordId, в отнаследованных классах - дополнительные параметры
       * @param {Object} createRecordFilter фильтр для создания записи
       */
      _showRecordDialog: function(recordConfig, createRecordFilter) {
         if(this.isEnabled() && this._checkShowDialog(recordConfig.recordId, createRecordFilter))
            return false;
         var editMode = this._options.editMode,
             editTemplate = this._options.editDialogTemplate;
         if(editTemplate !== ''){
            this._editRecordWithMode(recordConfig, editMode, editTemplate, this._options.editFullScreenTemplate, createRecordFilter);
            return true;
         }
         return false;
      },
      /**
       * Редактирует указанную запись, учитывая выбранный для неё режим редактирования
       * @param {Object} recordConfig Конфигурация редактируемой/создаваемой записи
       * @param {String} editMode Режим редактирования ['newWindow', 'thisWindow', 'thisPage', ...]
       * @param {String} editTemplate Шаблон, в котором должна редактироваться запись
       * @param {String} editFullTemplate Шаблон для редактирования в новой вкладке
       * @param {Object} createRecordFilter фильтр для создания записи
       * @protected
       */
      _editRecordWithMode: function(recordConfig, editMode, editTemplate, editFullTemplate, createRecordFilter){
         var eventResult = this._notify('onSelectEditMode', recordConfig.recordId, recordConfig.isBranch || false, recordConfig.parentId || null, editMode, editTemplate);
         if(typeof(eventResult) == 'string' && eventResult in {'newDialog': 0, 'newWindow': 0, 'thisWindow': 0, 'thisPage': 0, 'newFloatArea': 0})
            editMode = eventResult;
         if(editMode == 'newWindow' || editMode == 'thisWindow'){
            this._openEditWindow(recordConfig, undefined, editMode);
         }
         else if(editMode == 'thisPage'){
            this._editRecordInThisPage(recordConfig, editTemplate);
         }
         else{ //Dialog or FloatArea
            if (!this._blockEdit) {
               this._showDialogForRecordId(recordConfig, editTemplate, editMode == 'newFloatArea' ? 'RecordFloatArea' : 'DialogRecord', editFullTemplate, createRecordFilter);
            }
         }
      },
      /**
       * Редактирует запись с указанным идентификатором в текущей вкладке
       * @param {Object} recordConfig Параметры записи
       * @param {String} editTemplate Шаблон для редактирования
       * @protected
       */
      _editRecordInThisPage: function(recordConfig, editTemplate){
         var topParent = this.getTopParent();
         $ws.single.GlobalContext.setValue('editParams', this._generateEditPageURL(recordConfig));
         if($ws.helpers.instanceOfModule(topParent, 'SBIS3.CORE.AreaAbstract')){
            $ws.core.bootup(editTemplate, undefined, undefined, topParent.getTemplateName());
         }
      },
      /**
       * Возвращает деферред, в котором получаем запись по указанным параметрам (может создавать запись)
       * @param {Object} recordConfig Параметры записи, содержит recordId
       * @param {Object} createRecordFilter фильтр для создания записи
       * @return {$ws.proto.Deferred}
       * @protected
       */
      _getRecordFromConfig: function(recordConfig, createRecordFilter){
         return this._readRecord(recordConfig.recordId, createRecordFilter);
      },
      /**
       * Показывает диалог для записи по её идентификатору и режиму редактирования
       * @param {Object} recordConfig Параметры записи
       * @param {String} editTemplate Шаблон для редактирования записи
       * @param {Object} createRecordFilter фильтр для создания записи
       * @protected
       */
      _showDialogForRecordId: function(recordConfig, editTemplate, attachComponent, editFullScreenTemplate, createRecordFilter){
         var self = this,
            flag;
         $ws.core.setCursor(false);
         this._blockEdit = true;
         // Поставим индикатор, чтобы два раза клик не обработался
         this._showIndicator(attachComponent === 'RecordFloatArea');
         var prepareRecord = (function(){
            var wait = new $ws.proto.Deferred(),
                parent = self.getTopParent();
            wait.addCallback(function(){
               return self._getRecordFromConfig.apply(self, [recordConfig, createRecordFilter]);
            });
            if(parent instanceof $ws.proto.AreaAbstract)
               parent.waitAllPendingOperations(wait);
            else
               wait.callback();
            return wait;
         })();
         prepareRecord.addBoth(function(record){
            $ws.core.setCursor(true);
            return record;
         }).addCallback(function(record){
               if (record === false) {
                  self._blockEdit = false;
                  self._hideIndicator(attachComponent === 'RecordFloatArea');
                  return;
               }
               // Убран фиксинг записи под родителя т.к. он теперь выполняется на бизнес-логике в методе Создать
               self._updateRecordMethodName = (recordConfig.recordId === undefined ? 'Insert' : 'Update');
               flag = self._notify('onBefore' + self._updateRecordMethodName, record);
               if(typeof(flag) !== 'boolean'){
                  if(typeof(flag) == 'string')
                     editTemplate = flag;
                  else if(typeof(flag) == 'object' && flag !== null){
                     editTemplate = flag.editTemplate;
                     editFullScreenTemplate = flag.editFullScreenTemplate ? flag.editFullScreenTemplate : editFullScreenTemplate;
                  }
                  self._showDialog(editTemplate, record, recordConfig.recordId, attachComponent, editFullScreenTemplate);
               } else {
                  self._blockEdit = false;
                  self._useKeyboard = false;
                  self._hideIndicator(attachComponent === 'RecordFloatArea');
                  if (recordConfig.recordId === undefined && flag === false && record.getKey() !== null){
                     /**
                      * удаляем запись только если
                      * - она была добавлена
                      * - и пользователь в onBeforeInsert вернул false (т.е. совсем отказался от вставки)
                      * - и запись была добавлена в базу
                      *
                      * Здесь можно было вернуть true, что значит "Диалог мне не надо, но запись пожалуйста оставьте"
                      */
                     self._isFakeDelete = true;
                     record.destroy();
                  }
               }
            }).addErrback(function(error){
               self._blockEdit = false;
               self._useKeyboard = false;
               self._hideIndicator(attachComponent === 'RecordFloatArea');
               return self._recordErrorHandler(error, recordConfig.recordId);
            });
      },
      _toggleIndicator: function(isAjaxLoader, doShow){
         if (isAjaxLoader === true)
            this._ajaxLoader.toggleClass('ws-hidden', !doShow);
         else
            $ws.helpers.toggleIndicator(doShow);
      },
      _showIndicator: function(isAjaxLoader){
         var self = this;
         self._needHide = false;
         this._loadingReadTimer = setTimeout(function(){
            self._toggleIndicator(isAjaxLoader, true);
            self._needHide = true;
         }, $ws._const.Browser.loadingIndicatorForReadDelay);
      },
      _hideIndicator: function(isAjaxLoader){
         if(this._loadingReadTimer){
            clearTimeout(this._loadingReadTimer);
            this._loadingReadTimer = undefined;
         }
         if(this._needHide)
            this._toggleIndicator(isAjaxLoader, false);
      },
      /**
       * Обработчик закрытия диалога редактирования записи
       * @param {Boolean} recordSaved Были ли сохранена запись
       * @param {String | undefined} recordId Изначальный идентификатор записи
       * @param {$ws.proto.Record} record Сама запись
       * @param {String} newRecordKey Новый идентификатор записи
       * @protected
       */
      _onAfterCloseRecordDialog: function(recordSaved, recordId, record, newRecordKey){
         this._useKeyboard = false;
         this._hideIndicator(true);
         if(!recordSaved && recordId === undefined && record.getKey() !== null){
            this._isFakeDelete = true;
            record.destroy();
         } else{
            if(newRecordKey !== null){
               var self = this,
                  afterRenderSetActiveRow = function(){
                     var newActiveRow = self._body.find('[rowkey="' + newRecordKey + '"]');
                     if(newActiveRow.length !== 0) {
                        this.setActiveElement(newActiveRow);
                     }
                  },
                  row = this.getActiveElement(),
                  rowkey;

               // убедимся что у нас в реестре используются сложные идентификаторы
               if(self._currentRecordSet.getPkColumnType() === 'Идентификатор' && (!row || (rowkey = row.attr('rowkey')) && rowkey.indexOf(',') !== -1)){
                  newRecordKey = [newRecordKey, self._currentRecordSet.getLinkedObjectName()].join(',');
               }
               if(this._body.find('[rowkey="' + newRecordKey + '"]').length !== 0)
                  afterRenderSetActiveRow.call(this);
               else
                  this.once('onAfterRender', afterRenderSetActiveRow);
            }
         }
      },
      /**
       * Обработчик перед сохранением записи. Нужно для дерева - в нём мы раскрываем папку, в которую сохранили запись
       * @param {Object} event Событие
       * @param {$ws.proto.Record} record Запись
       * @protected
       */
      _onBeforeSaveRecordDialog: function(event, record){
      },
      /**
       * Показывает диалог для редактирования записи
       * @param {String} editTemplate Шаблон диалога
       * @param {$ws.proto.Record} record Запись, которую редактируют (или создают)
       * @param {String | undefined} recordId Идентфиикатор записи
       * @param {String} attachComponent диалог или всплывающая панель
       * @param {Object | undefined} editFullScreenTemplate шаблон редактирования в новой вкладке для всплываюшей панели
       * @protected
       */
      _showDialog: function(editTemplate, record, recordId, attachComponent, editFullScreenTemplate){
         var self = this,
            recordSaved = false,
            newRecordKey = null,
            context = new $ws.proto.Context().setPrevious(self.getLinkedContext()),
            hdl = {
               onAfterClose: function(){
                  if (attachComponent === 'RecordFloatArea'){
                     //Если старая панель закрылась позже, чем открылась новая, то не меняем значение
                     if (this === self._isRecordFloatAreaOpen)
                        self._isRecordFloatAreaOpen = false;
                  }
                  self._onAfterCloseRecordDialog(recordSaved, recordId, record, newRecordKey);
               },
               onRecordUpdate: function(event, Id){
                  recordSaved = true;
                  if (recordId === undefined)
                     newRecordKey = Id;
                  self._onBeforeSaveRecordDialog(event, record);
               },
               onReady: function(){
                  if (attachComponent === 'RecordFloatArea'){
                     self._isRecordFloatAreaOpen = this;
                  } else {
                     self._blockEdit = false;
                     self._hideIndicator(attachComponent === 'RecordFloatArea');
                  }
               },
               onAfterShow: function(){
                  if(self._editDeferred instanceof $ws.proto.Deferred){
                     self._editDeferred.callback(this);
                  }
               },
               onDestroy: function(){
                  context.destroy();
                  context = null;
               }
            },
            attachOptions = {
               opener: self,
               template: editTemplate,
               record: record,
               context: context,
               readOnly: self._options.display.readOnly,
               isNewRecord: recordId === undefined,
               handlers: hdl
            };
         if (attachComponent === 'RecordFloatArea') {
            this._showRecordFloatArea(attachOptions, editTemplate, record, editFullScreenTemplate);
         }
         else {
            $ws.core.attachInstance('SBIS3.CORE.DialogRecord', attachOptions);
         }
      },
      _showRecordFloatArea: function (attachOptions, editTemplate, record, editFullScreenTemplate){
         var self = this,
             attachOnDestroy = (self._isRecordFloatAreaOpen && self._isRecordFloatAreaOpen.getTemplateName() !== editTemplate),
             attachArea = function() {
                self._lastActiveElement = self._activeElement;
                $ws.core.attachInstance('SBIS3.CORE.RecordFloatArea', attachOptions);
             };
         attachOptions.name = this.getName() + '-area';
         attachOptions.target = this.getParent() === null ? this.getContainer() : this.getParent().getContainer();//this._container
         attachOptions.side = 'right';
         attachOptions.autoHide = false;
         attachOptions.doNotLossFocus = true;
         attachOptions.showDelay = 300;
         attachOptions.animationLength = 300;
         attachOptions.parent = null;
         attachOptions.isModal = false;
         attachOptions.isStack = true;
         attachOptions.overlay = this._selectMode;
         attachOptions.handlers['onAfterShow'] = [attachOptions.handlers['onAfterShow']];
         attachOptions.handlers['onAfterShow'].push(function(){
            self._blockEdit = false;
            self._hideIndicator(true);
         });
         attachOptions.offset = {
            x: 1,
            y: 0
         };
         if (editFullScreenTemplate){
            attachOptions.editFullScreenTemplate = editFullScreenTemplate;
         }

         if (this._isRecordFloatAreaOpen){
            self._blockEdit = false;
            self._hideIndicator(true);
            this._isRecordFloatAreaOpen.openConfirmDialog(true).addCallback(function(result){
               if (result){
                  if (attachOnDestroy){
                     self._blockEdit = true;
                     self._isRecordFloatAreaOpen.subscribe('onDestroy', attachArea);
                     self._isRecordFloatAreaOpen.close();
                  } else if (record.getKey() !== self._isRecordFloatAreaOpen.getRecord().getKey()){
                     self._isRecordFloatAreaOpen.setRecord(record, true);
                     self._lastActiveElement = self._activeElement;
                     //вернем фокус на панель редактирования, так как при клике он у нас встал на реестр
                     self._isRecordFloatAreaOpen.setActive(true);
                  }
               } else if (self._lastActiveElement){
                  self.setActiveElement(self._lastActiveElement);
               }
            });
         } else if (!attachOnDestroy) {
            attachArea();
         }
      },
      /**
       * <wiTag class=TableView page=5 group="Управление">
       * <wiTag group="Управление">
       * Открыть новую вкладку браузера, в которой будет редактироваться запись.
       * @param {Number} recordId Идентификатор записи.
       * @param {String} [url] Адрес, по которому будет редактироваться запись.
       * @example
       * <pre>
       *     dataView.openWindowRecord("11");
       * </pre>
       */
      openWindowRecord : function(recordId, url){
         this._openEditWindow({ recordId: recordId }, url);
      },
      _prepareEditParams: function(params){
         var readerParams = this._options.dataSource.readerParams,
             dS = params.dataSource,
             readerSettings = dS.readerParams,
             value = readerParams.format;
         if(value !== undefined)
            dS.readerParams["format"] = value;
         value = this._options.dataSource.readerType;
         if(value && value !== 'ReaderUnifiedSBIS')
            dS["readerType"] = value;
         value = readerParams.otherURL;
         if(value && value !== $ws._const.defaultServiceUrl)
            readerSettings["otherURL"] = value;
         value = readerParams.dbScheme;
         if(value)
            readerSettings["dbScheme"] = value;
         value = readerParams.queryName;
         if(value && value !== 'Список')
            readerSettings["queryName"] = value;
         value = readerParams.readMethodName;
         if(value && value !== 'Прочитать')
            readerSettings["readMethodName"] = value;
         value = readerParams.createMethodName;
         if(value && value !== 'Создать')
            readerSettings["createMethodName"] = value;
         value = readerParams.updateMethodName;
         if(value && value !== 'Записать')
            readerSettings["updateMethodName"] = value;
         value = readerParams.destroyMethodName;
         if(value && value !== 'Удалить')
            readerSettings["destroyMethodName"] = value;
         params.handlers["onBeforeRead"] = this._handlersPath("onBeforeRead");
         params.handlers["onBeforeUpdate"] = this._handlersPath("onBeforeUpdate");
         if(this._options.reports && !(Object.isEmpty(this._options.reports))){
             params["reports"] = this._options.reports;
             params.handlers["onBeforeShowPrintReports"] = this._handlersPath("onBeforeShowPrintReports");
             params.handlers["onPrepareReportData"] = this._handlersPath("onPrepareReportData");
             params.handlers["onSelectReportTransform"] = this._handlersPath("onSelectReportTransform");
         }
         return params;
      },
      /**
       * Составляет адрес страницы для редактирования по объекту - информации о записи
       * @param {Object} recordConfig Информация о записи
       * @param {String} url страница, которую надо открыть
       * @return {String | Boolean}
       * @protected
       */
      _generateEditPageURL: function(recordConfig, url){
         return this.generateEditPageURL(recordConfig.recordId, url);
      },
      /**
       * <wiTag class=TableView page=9 group="Данные" >
       * <wiTag group="Данные" page=4>
       * Собрать параметры для редактирования записи в строку.
       * Возвращает false, если нельзя редактировать.
       * @param {String} [recordId] Идентификатор записи.
       * @param {String} [url] Опциональный путь, если он есть, то к нему только прибавляются параметры.
       * @param {String} [changedRecordValues] Хэш-меп значений, которые уже изменены в записи и которые нужно перенести
       * на страницу редактирования.
       * @param {String} [fullTemplate] Полный путь к шаблону диалога редактирования.
       * @return {String | Boolean} true - можно редактировать, false - нельзя редактировать.
       * @example
       * <pre>
       *    var url = dataView.generateEditPageURL("11", document.location.host + "/Edit.html");
       * </pre>
       */
      generateEditPageURL: function(recordId, url, changedRecordValues, fullTemplate){
         if(this._options.editDialogTemplate || this._options.editFullScreenTemplate){
            var editMode = this._options.editMode,
               editFullScreenTemplate = this._options.editFullScreenTemplate,
               handlers = {
                  onBeforeRead :  this._handlersPath("onBeforeRead"),
                  onBeforeUpdate : this._handlersPath("onBeforeUpdate"),
                  onBeforeShowPrintReports : this._handlersPath("onBeforeShowPrintReports"),
                  onPrepareReportData : this._handlersPath("onPrepareReportData"),
                  onSelectReportTransform : this._handlersPath("onSelectReportTransform"),
                  onLoadError : this._handlersPath("onLoadError")
               },
               params = {
                  recordId: recordId,
                  editDialogTemplate: fullTemplate ? fullTemplate : (( editFullScreenTemplate && editMode == 'newFloatArea') ? editFullScreenTemplate : this._options.editDialogTemplate),
                  id : this.getId(),
                  readOnly : this._options.display.readOnly || false,
                  dataSource : {
                     readerParams: {
                        linkedObject: this._options.dataSource.readerParams.linkedObject
                     }
                  },
                  reports : this._options.reports,
                  handlers : handlers,
                  changedRecordValues : changedRecordValues,
                  history: editMode === 'thisWindow'
               };
            if(recordId === undefined){
               params["filter"] = this.getQuery();
               params.handlers["onBeforeCreate"] = this._handlersPath("onBeforeCreate");
               params.handlers["onBeforeInsert"] = this._handlersPath("onBeforeInsert");
            }
            params = this._prepareEditParams(params);
            return $ws.helpers.generatePageURL(params, editMode === "thisPage", url);
         } else
            return false;
      },

      /**
       * Открывает новую вкладку браузера, в которой будет редактироваться запись
       * @param {Object} recordConfig Идентификатор запись
       * @param {String} [url] Адрес, по которому будет редактироваться запись
       * @param {String} [anotherEditMode] использовать чуть другой режим редактирования для этой записи
       */
      _openEditWindow: function(recordConfig, url, anotherEditMode){
         var pageURL = url ? url : this._generateEditPageURL(recordConfig, url),
             editMode = anotherEditMode || this._options.editMode;
         this._openEditWindowByUrl(pageURL, editMode, recordConfig.recordId);
      },
      _openEditWindowByUrl: function(windowUrl, editMode, recordId){
         var eventResult = this._notify('onBeforeOpenEditWindow', windowUrl),
             editWindow;
         if(typeof(eventResult) === 'string'){
            windowUrl = eventResult;
         }
         if(eventResult !== false){
            if(editMode == 'thisWindow'){
               //запомним в микросессию адрес текущей страницы, иначе он может стереться
               $ws.single.MicroSession.set("previousUrl", window.location.href);
               window.open(windowUrl, '_self');
            } else{
               editWindow = window.open(windowUrl, "_blank");
               this._recordsOpened.push({
                  rec: recordId,
                  url: windowUrl.substr(0,windowUrl.search(/\?/)),
                  win: editWindow
               });
               if(editWindow)
                  editWindow.focus();
            }
         }
      },
      /**
       * <wiTag class=TableView group="Отображение">
       * Позиционирует прокрутку страницы относительно указанной записи.
       * Если запись не указана, то позиционирует относительно текущей.
       * @param {jQuery} [activeRow] Текущая выделенная строка.
       * @example
       * <pre>
       *    dataView.scrollToActive(dataView.getContainer().find('[rowkey]:last'));
       * </pre>
       */
      scrollToActive: function(activeRow){//TODO А может быть листвью надо еще и по горизонтали скроллить?
         this._updateBodyHeight();
         if(this._bodyHeight < this._bodyRealHeight && activeRow && "jquery" in activeRow){
            var   top = this._wsBrowserContainer.position().top,
                  pHeight = this._wsBrowserContainer[0].clientHeight,
                  arHeight = activeRow.height(),
                  cur = this._wsBrowserContainer.scrollTop(),
                  to = cur + activeRow.position().top - top;

            if(to + arHeight > cur + pHeight)
               this._wsBrowserContainer.scrollTop(to + arHeight - pHeight);
            else if(to < cur)
               this._wsBrowserContainer.scrollTop(to);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Обновить отображение данных в представлении данных.
       * Обновляет отображение данных в браузере без перезагрузки данных, т.е. по текущему состоянию.
       * @example
       * <pre>
       *     dataview.refresh();
       * </pre>
       */
      refresh: function(){
         if(this._dReady.isReady() && this._currentRecordSet){
            this._rowSelectionSetted = false;
            if(this._onBeforeRenderActions()){
               this._drawBody();
            }
         }
      },
      /**
       * <wiTag group="Данные">       
       * Перезагружает набор записей представления данных с последующим обновлением отображения.
       * @returns {$ws.proto.Deferred} Результат перезагрузки представления данных.
       * @example
       * <pre>
       *    dataView.reload().addCallback(function(){
       *       // Перезагрузка данных завершена
       *    });
       * </pre>
       * @command
       * @see setReload
       * @see getReload
       */
      reload: function(){
         if (this.isDestroyed()) {
            return;
         }
         this._useKeyboard = false;
         var filter = this.getQuery(true);
         return this._runQuery(filter, true);
      },
      /**
       * <wiTag group="Отображение">
       * Очистить содержимое набора данных таблицы и обновить отображение.
       * @example
       * <pre>
       *    dataView.clear();
       * </pre>
       */
      clear: function(){
         var curRecordSet = this.getRecordSet();
         if(curRecordSet.getRecordCount() !== 0){
            curRecordSet.clear();
            this.refresh();
            if(this._paging) {
               this._paging.update(undefined, 0);
            }
            this._updatePager();
            this.removeSelection();
         }
      },
      /**
       * <wiTag group="Данные">
       * Выполнить пользовательскую функцию (func) для выделенных строк.
       * После чего вызывает перезагрузку браузера и обновление отображения.
       * Пользовательская функция должна возвращать абстрактное асинхронное событие ($ws.proto.Deferred).
       * @param {Function} func Анонимная функция, которая возвращает $ws.proto.Deferred.
       * @example
       * <pre>
       *    var myKeysArray = [];
       *    this.performFunction(function(record){
       *       myKeysArray.push(record.getKey());
       *       return new $ws.proto.Deferred().callback();
       *    });
       * </pre>
       */
      performFunction: function(func){
         var selectedRows = this.getSelection(),
             dResult = new $ws.proto.ParallelDeferred(),
             self = this;
         self._isUpdatingRecords = true;
         for(var i = 0, l = selectedRows.length; i < l; i++){
            dResult.push( func(selectedRows[i]) );
         }
         dResult.done();
         dResult.getResult().addCallback(function(){
            self._isUpdatingRecords = false;
            self.reload();
         });
      },
      /**
       * <wiTag group="Данные">
       * Получить текущую выделенную строку.
       * @return {jQuery | Boolean} Возвращает текущую активную строку табличного браузера или false, если в браузере
       * нет активной записи.
       * @example
       * <pre>
       *    dataView.getActiveElement().addClass("my-active-row");
       * </pre>
       */
      getActiveElement: function(){
         if(this._options.useHoverRowAsActive === true){
            var hoverRow = this._body.find('[rowkey].ws-browser-row-selected');
            return hoverRow.length > 0 ? hoverRow : false;
         } else if(this._activeElement)
            return this._activeElement;
         else
            return false;
      },
      /**
       * Проверка на задизабленность
       * @param {jQuery} newActiveRow
       * @returns {Boolean}
       * @private
       */
      _isDisabledRow: function(newActiveRow) {
         if(newActiveRow && "jquery" in newActiveRow) {
         return newActiveRow.hasClass('ws-browser-disabled-item');
         }
         return false;
      },
      /**
       * Возвращает текущий текст в блоке пустых данных
       * @return {String} Текущий текст в блоке пустых данных
       */
      getEmptyDataText: function() {
         return this._emptyDataText;
      },
      /**
       * Смена текущего выделенного элемента
       * Устанавливает текущей активной указанную строку (newActiveRow).
       * По умолчанию позиционирует относительно неё страницу интернет-браузера (needScroll).
       * @param {jQuery} newActiveRow Элемент, который хотим выделить.
       * @param {Boolean} [needScroll=true] Нужно ли доскроллить браузер до указанной строки.
       * @param {Boolean} [noNotify=false] Если будет установлено true, то извещения о событии onSetCursor не произойдёт
       * @example
       * <pre>
       *    var row = dataView.getContainer().find('[rowkey="123"]');
       *    dataView.setActiveElement(row, true, true, true);
       * </pre>
       * @see onSetCursor
       */
      setActiveElement: function(newActiveRow, needScroll, noNotify, changeState){
         if( (newActiveRow === null || newActiveRow === undefined) && this._activeElement && !this._options.setCursorOnLoad){
            this._activeElement.removeClass('ws-browser-item-over');
            this._activeElement = undefined;
            this._hovered = undefined;
         } else if (this._isDisabledRow(newActiveRow)) {
            return;
         }
         if(this._options.useSelection !== false && newActiveRow && "jquery" in newActiveRow && newActiveRow.length > 0 &&
            (this._activeElement && this._activeElement[0] !== newActiveRow || !this._activeElement) &&
            newActiveRow.closest('.ws-browser')[0] == this._data[0]){
            if(this._activeElement){
               this._activeElement.removeClass('ws-browser-item-over');
            }
            newActiveRow.addClass('ws-browser-item-over');
            this._setSelection(newActiveRow, false);
            newActiveRow.attr('tabindex', '-1');
            if(needScroll !== false && this._checkScrollPaging()){
               if(!this._wsBrowserContainer){
                  this._wsBrowserContainer = this._data.parent();
               }
               //Запоминаем текущее значение scrollTop
               var curScrollTop = this._wsBrowserContainer.scrollTop();
               if(this.isActive()){
                  //ХАК: Если строка уже сфокусирована, снимем фокус, чтоб было изменение, и браузер (FF, Хром, и т.п.) бы прокрутился к этой записи
                  //Иначе он не прокручивается к уже сфокусированному элементу
                  if (newActiveRow.is(':focus')) {
                     newActiveRow.blur();
                  }
                  newActiveRow.focus();
               }
               this.scrollToActive(newActiveRow);
               //Устанавливаем флаг, если произошло изменение величины scrollTop (используется при отображении меню опций записи)
               this._scrolledToActive = curScrollTop !== this._wsBrowserContainer.scrollTop();
            }
            this._activeElement = newActiveRow;

            this._hovered = newActiveRow.attr('rowKey') !== 'null' ? newActiveRow.attr('rowKey') : null;
            if(!noNotify){
               this._notifySetCursor(this._hovered ? this.getActiveRecord() : null);
            }
            if (this._isNavigation()){
               this._changeState(changeState);
            }
         }
      },
      /**
       * Проверка перед скроллом к активной строке браузера (setActiveElement)
       * Используется в Scroll-Plugin
       * @returns {boolean}
       * @private
       */
      _checkScrollPaging: function(){
         return true;
      },
      /**
       * Обновляет позицию выделения в строке
       * @param {jQuery} activeRow Новая выделенная строка
       * @param {Boolean} refresh Нужно ли переносить выделение на новое место
       * @protected
       */
      _setSelection: function(activeRow, refresh){
         // TODO Почему выделение строки нельзя сделать бэкграундом на TR? Картинка с align влево
         this._findSelectedElement().removeClass('ws-browser-row-selected');
         activeRow.addClass('ws-browser-row-selected');
      },
      _findSelectedElement: function(){
         //Вынесено специально в отдельный метод, переопределяется в CustomView
         return this._container.find('.ws-browser-row-selected');
      },
      /**
       * Разрушает экземпляр класса
       * <wiTag group="Управление">
       * <pre>
       *    control.destroy();
       * </pre>
       */
      destroy: function() {
         if(this._paging) {
            this._paging.destroy();
         }

         if(this._pageOptionsDropdown){
            this._pageOptionsDropdown.destroy();
         }

         if(this._sequenceNumberObject) {
            this._sequenceNumberObject = undefined;
         }

         if($ws.proto.RecordFloatArea && this._isRecordFloatAreaOpen instanceof $ws.proto.RecordFloatArea){
            this._isRecordFloatAreaOpen.destroy();
         }

         this._unbindParentHandlers();

         if (this._currentRecordSet !== null)
            this._currentRecordSet.abort();

         if(this._scrollGapPlaceholder)
            this._scrollGapPlaceholder = null;

         // Уничтожаем меню, которые могли создать в процессе работы
         if(this._rowOptionsMenu)
            this._rowOptionsMenu.destroy();

         if(this._ajaxLoader)
            this._ajaxLoader = null;

		 //Контекст может быть уже уничтожен
         var context = this.getLinkedContext();
         if (context) {
            context.unsubscribe('onFieldChange', this._filterContextChangeHandlerBound)
                   .unsubscribe('onDataBind', this._filterContextChangeHandlerBound);
         }

         $ws.proto.DataViewAbstract.superclass.destroy.apply(this, arguments);
      },
      /**
       * Выделяет строку
       * @param {String} key Ключ записи
       * @return {Boolean} isSelected
       */
      _selectRow: function(key) {
         var row = this._body.find('[rowkey="' + key + '"]'),
            rows = this._body.find('.ws-browser-table-row'),
            isSelected = true;
         row.addClass('ws-browser-selected');
         // ie7 checkbox fix. force re-render it
         row.find('.ws-browser-checkbox').css('border', 'none');
         if (this._selected[key] === undefined && this._currentRecordSet.contains(key)) {
            var record = this._currentRecordSet.getRecordByPrimaryKey(key);
            this._selected[key] = this._selectedRecords.length;
            this._selectedRecords.push(record);
            this._notifyBatchDelayed('onChangeSelection', record, true);
         }
         for (var i = 0, l = rows.length - 1; i <= l; i++) {
            if (!$(rows[i]).hasClass('ws-browser-selected')) {
               isSelected = false;
               break;
            }
         }
         return isSelected;
      },
      /**
       * Убирает выделение со строки
       * @param {String} key Ключ записи
       */
      _unselectRow: function(key) {
         var row = this._body.find('[rowkey="' + key + '"]'),
            index;
         row.removeClass('ws-browser-selected');
         if (this._selected[key] !== undefined) {
            index = this._selected[key];
            delete this._selected[key];
            if (index >= 0) {
               var record = this._currentRecordSet.contains(key) ? this._currentRecordSet.getRecordByPrimaryKey(key) : undefined;
               delete this._selectedRecords[index];
               this._recalcSelected(index);
               this._selectedRecords = this._getSelectedRecords();//Удалили undefined
            }
            this._notifyBatchDelayed('onChangeSelection', record, false);
         }
      },
      /**
       * Меняет выделение на строке. Если было - убирает, если не было - добавляет
       * @param {String} key Ключ записи
       */
      _toggleRowSelection: function(key) {
         if (this._selected[key] === undefined) {
            this._selectRow(key);
         } else {
            this._unselectRow(key);
         }
      },
      /**
       * Обрабатывает выбор текущий или переданной в параметрах строки
       * @param {jQuery} [element] Элемент, который хотим выделить/снять выделение
       */
      _selectActiveElement: function(element){
         var row = element || this.getActiveElement(),
             key = row.attr('rowkey');
         key = key === "null" ? null : key;
         this._toggleRowSelection(key);
         this._updatePager();
      },
      /**
       * <wiTag group="Данные">
       * Получить записи, выделенные в браузере.
       * Если ни одна не отмечена, то вернёт текущую активную запись.
       * Если передали параметр onlyMarked = true, то вернёт только отмеченные.
       * @param {Boolean} [onlyMarked=false] Вернуть ли только отмеченные записи.
       * @return {Array} Массив записей.
       * @example
       * <pre>
       *    if(dataView.getSelection(true).length === 0)
       *       $ws.core.alert("Не отмечено ни одной записи!");
       * </pre>
       */
      getSelection : function(onlyMarked){
         var res = [];
         onlyMarked = onlyMarked === undefined ? false : onlyMarked;
         if(!this.hasSelectedRecords() && onlyMarked !== true || (this.getSelectionMode() && !this._options.multiSelect)){
            var record = this.getActiveRecord();
            if(record)
               res.push(record);
         }
         else{
            res = this._getSelectedRecords(); //Возвращаем копию массива
         }
         return res;
      },
      _getSelectedRecords: function(){
         var res = [];
         for (var i = 0, len = this._selectedRecords.length; i < len; i++){
            if (this._selectedRecords[i] !== undefined)
               res.push(this._selectedRecords[i]);
         }
         return res;
      },
      /**
       * <wiTag group="Данные">
       * Есть ли выделенные записи
       * @returns {Boolean}
       * @see setSelection
       * @see removeSelection
       * @see clearSelection
       */
      hasSelectedRecords: function() {
         return !Object.isEmpty(this._selected);
      },
      /**
       * Делает из переданного массив. Отбрасывает НЕ числа, НЕ строки, НЕ массивы
       * @param args
       * @returns {Array}
       * @protected
       */
      _normalizeArgs: function(args) {
         var keys = [];
         if(args instanceof Array)
            keys = args;
         else if(typeof(args) === 'string' || typeof(args) == 'number')
            keys.push(args);
         return keys;
      },
      /**
       * <wiTag group="Управление">
       * Отметить записи с указанными ключами (keys).
       * Если передали только один ключ, то строка с этим ключом станет активной.
       * Если записей много, то они помечаются, а курсор ставится на первую.
       * @param {Array} args Массив ключей записей, которые необходимо пометить.
       * @example
       * <pre>
       *    dataView.setSelection(["21", "22", "23" ]);
       * </pre>
       */
      setSelection: function(args) {
         var keys = this._normalizeArgs(args),
            record;
         if (keys.length >= 1) {
            var records = [];
            for (var i = 0, l = keys.length; i < l; i++) {
               if (this._currentRecordSet && this._currentRecordSet.contains(keys[i])) {
                  record = this._currentRecordSet.getRecordByPrimaryKey(keys[i]);
                  this._selected[keys[i]] = this._selectedRecords.length;
                  this._selectedRecords.push(record);
                  records.push(record);
               } else {
                  this._selected[keys[i]] = -1;
               }
               this._body.find('[rowkey="' + keys[i] + '"]').addClass('ws-browser-selected');
            }
            this._notifyBatchDelayed('onChangeSelection', records, true);
         }
         if (keys[0] !== undefined) {
            this.setActiveElement(this._body.find('[rowkey="' + keys[0] + '"]'), false);
         } else if (this._activeElement && !this._options.setCursorOnLoad) {
            this._activeElement.removeClass('ws-browser-item-over');
            this._hovered = undefined;
         }
         this._updatePager();
      },
      _recalcSelected: function(num){
         for (var i in this._selected){
            if (this._selected.hasOwnProperty(i)){
               if (this._selected[i] >= num)
                  this._selected[i]--;
            }
         }
      },
      /**
       * <wiTag group="Управление" >
       * Снять выделение с записей с указанными ключами.
       * @param {Array} args Массив ключей записей, с которых необходимо снять выделение.
       * @param {Boolean} [notNotify] Не поднимать событие, используется для служебной очистки выделения.
       * @example
       * <pre>
       *    dataView.clearSelection([ "11", "12", "22"]);
       * </pre>
       */
      clearSelection: function (args, notNotify) {
         var keys,
            index;

         keys = this._normalizeArgs(args);
         if (keys.length >= 1) {
            var records = [];
            for (var i = 0, l = keys.length; i < l; i++) {
               index = this._selected[keys[i]];
               delete this._selected[keys[i]];
               if (index >= 0) {
                  this._selectedRecords[index] = undefined;
               }
               this._body.find('[rowkey="' + keys[i] + '"]').removeClass('ws-browser-selected');
            }
            this._selectedRecords = $ws.helpers.filter(this._selectedRecords, function (record) {
               return !!record;
            });
            //после того как почистили отмеченные записи нужно обновить о них сведения
            this._resetSelectedRecords();
            if (!notNotify) {
               this._notifyBatchDelayed('onChangeSelection', records, false);
            }
         }
         this._head.find('tr:first').removeClass('ws-browser-selected');
         this._updatePager();
      },
      /**
       * <wiTag group="Управление">
       * Снять отметки со всех записей.
       * Не убирает синию полоску с текущей записи.
       * @command
       */
      removeSelection : function(){
         //запомним копию записей, с которых сниманием отметку. selected нормально сохраняются без клонирования
         // (ибо с  клонированием запись становилась протсым объектом)
         var selected  = this._selectedRecords;
         //вычистим всю информацию об отметке
         this._selected = {};
         this._selectedRecords = [];
         this._container.find('.ws-browser-selected').removeClass('ws-browser-selected');
         //обновим счетчики
         this._updatePager();
         //поднимаем отложенно событие об изменении выделения, отдав в нем копию отмеченных записей,
         //при этом отмеченных в таблице по факту уже не будет - отметку-то сняли
         this._notifyBatchDelayed('onChangeSelection', selected, false);
         return true;
      },
      /**
       * <wiTag group="Управление" >
       * Показать только отмеченные записи.
       * Свёртывает невыделенные записи в браузере как по нажатию Ctrl+Space.
       * @param {Boolean} [rollUp] Признак свертывания: свернуть или развернуть
       * @example
       * <pre>
       *    dataView.showSelection(!dataView.isMinimized());
       * </pre>
       * @command
       */
      showSelection : function(rollUp){

         var selectedRows = this.getSelection(),
             dropdownContainer = this._foot.find('.ws-browser-dropdown-container'),
             self = this;

         if (!this._options.useSelection) {
            return;
         }
         
         rollUp = rollUp === undefined ? true : rollUp;
         this._isShowSelection = rollUp;

         if (this._isShowSelection) {
            if(!this._minimized){
               this._initialRecordSet = this._initialRecordSet || this._currentRecordSet;
               $ws.core.setCursor(false);
               var dataSourceCopy = $ws.core.merge({}, this._options.dataSource),
                  selectedRecordCount = this.getSelection(true).length,
                  footText = 'Выбра' + $ws.helpers.wordCaseByNumber(selectedRecordCount, 'но', 'на', 'ны') +
                     ' ' + selectedRecordCount + ' запис' + $ws.helpers.wordCaseByNumber(selectedRecordCount, 'ей', 'ь', 'и') + '.';
               $ws.core.attachInstance('Source:RecordSet', $ws.core.merge(dataSourceCopy, {firstRequest : false})).addCallback(function(instance){
                  instance.setColumns(self._currentRecordSet.getColumns());
                  for(var i = 0, l = selectedRows.length; i < l; i++){
                     instance.appendRecord(selectedRows[i]);
                  }
                  if (self._paging) { //Если есть постраничная навигация, то сбрасываем страницу на первую
                     self._paging.setCurrentPage(1);
                  }
                  self._selectedBeforeChoice = {
                     'selected': self._selected,
                     'selectedRecords': self._selectedRecords
                  };
                  self.once('onAfterLoad', function() {
                     self._minimized = true;
                  });
                  self._prepareHierarchyRollUp(rollUp);
                  self.setData(instance);
               }).addErrback(function(error){
                  $ws.helpers.alert(error, { checkAlreadyProcessed: true }, self);
               }).addBoth(function(){
                  $ws.core.setCursor(true);
               });
               this._foot.find('.ws-browser-pager-text').text(footText);
               if(this._paging) {
                  dropdownContainer.addClass('ws-hidden');
               }
            }
         }else{
            if(this._minimized){
               if(this._initialRecordSet instanceof $ws.proto.RecordSet){
                  var activeRecord = this.getActiveRecord(),
                      key = activeRecord ? activeRecord.getKey() : undefined;
                  this.removeSelection();
                  this.once('onAfterRender', function() {
                     var row = self._body.find('[rowkey="' + key + '"]'),
                         k;
                     if ($.isPlainObject(self._selectedBeforeChoice)) {
                        self._selected = self._selectedBeforeChoice.selected;
                        self._selectedRecords = self._selectedBeforeChoice.selectedRecords;
                        self._selectedBeforeChoice = undefined;
                     }
                     self._resetSelectedRecords();
                     for (var i in self._selected) {
                        if (self._selected.hasOwnProperty(i)) {
                           k = self._selected[i];
                           if (k !== -1 && self._currentRecordSet && self._currentRecordSet.contains(i)) {
                              self._body.find('[rowkey="' + i + '"]').addClass('ws-browser-selected');
                           }
                        }
                     }
                     self._notifyBatchDelayed('onChangeSelection', self._selectedRecords, true);
                     if (row.length) {
                        self.setActiveElement(row);
                     }
                     self._updatePager();
                  });
                  this.once('onAfterLoad', function() {
                     self._minimized = false;
                  });
                  self._prepareHierarchyRollUp(rollUp);
                  this.setData(this._initialRecordSet);
                  this._minimized = false;
                  this._initialRecordSet = false;
               }
               if(this._paging) {
                  dropdownContainer.removeClass("ws-hidden");
               }
            }
         }

         return true;

      },
      //Переопределено в HierarchyView
      _prepareHierarchyRollUp: function(rollUp){},
      /**
       * <wiTag group="Управление">
       * Получить признак было ли инициировано отображение только отмеченных записей.
       * @return {Boolean} true-было инициировано, false-нет.
       * @example
       * Если в представлении данных (dataView) было инициировано отображение только отмеченных записей,
       * то открыть панель операций (panel).
       * <pre>
       *    if (dataView.isShowSelection()) {
       *       panel.open();
       *    }
       * </pre>
       */
      isShowSelection: function() {
         return this._isShowSelection;
      },
      /**
       * <wiTag group="Управление" >
       * Получить состояние записей в представлении данных на текущий момент.
       * Возвращает состояние записей в браузере: показаны только отмеченные или все записи.
       * @return {Boolean} true-только отмеченные, false-все.
       * @example
       * <pre>
       *    if(!dataView.isMinimized())
       *       dataView.showSelection();
       * </pre>
       */
      isMinimized : function(){
         return this._minimized;
      },
      /**
       * <wiTag group="Управление">
       * Подтверждает выбор отмеченных записей в таблице.
       * Если передали записи (records), то подтверждает выбор этих записей.
       * Если нет, то подтверждает выбор выделенных в текущий момент.
       * @param {Array} [records=this.getSelection()]
       * @example
       * <pre>
       *    dataView.confirmSelection();
       * </pre>
       * @command
       */
      confirmSelection : function(records){
         records = records || this.getSelection();
         var filteredRecords = [];
         for(var i in records){
           if(records.hasOwnProperty(i) && this._testSelectedRecord(records[i]))
              filteredRecords.push(records[i]);
         }
         if(filteredRecords && filteredRecords.length > 0){
            this._notifyBatchDelayed('onSelectionConfirm', filteredRecords);
         } else {
            this._notifyBatchDelayed('onSelectionConfirm', [null]);
         }
         return true;
      },
      /**
       * Тестирует запись на возмозность отображения(или выбора) в браузере, в зависимости от selectionType
       * @param record запись для проверки
       */
      _testSelectedRecord: function(record){
         return true;
      },
      _selectRecords: function(tbody, records){
         var rows = tbody.find('.ws-browser-table-row');
         this._selected = {};
         this._selectedRecords = records;
         for(var k = 0, cnt = records.length; k < cnt; k++){
            this._selected[records[k].getKey()] = k;
         }
         for(var i = 0; i < rows.length; ++i){
            rows.eq(i).addClass('ws-browser-selected');
         }
      },
      /**
       * <wiTag group="Управление">
       * Отметить все записи как выбранные.
       * Отмечает все записи как выбранные, независимо от постраничной навигации.
       * Если страниц несколько, то получит все данные без учета страниц.
       * Возвращает асинхронное событие завершения процесса отметки.
       * @returns {$ws.proto.Deferred} Окончание отметки.
       * @example
       * <pre>
       *    dataView.selectAll().addCallback(function(){
       *       dataView.sendCommand('confirmSelection');
       *    });
       * </pre>
       * @command
       */
      selectAll: function(){
         var endSelection = new $ws.proto.Deferred(),
            self = this;
         this._selected = {};
         this._selectedRecords = [];
         if(this._options.display.usePaging === 'full' && this._currentRecordSet.getRecordCount() < this._currentRecordSet.hasNextPage() ||
            this._options.display.usePaging === 'parts' && this._currentRecordSet.hasNextPage()){
            var dataSourceCopy = $ws.core.merge({}, this.getDataSource());
            //просим с отключенным пэйджингом
            dataSourceCopy.filterParams = this.getQuery();
            delete dataSourceCopy.filterParams["pageNum"];
            delete dataSourceCopy.filterParams["pageCount"];
            dataSourceCopy.filterParams["usePages"] = "";
            dataSourceCopy.usePages = "";
            dataSourceCopy.firstRequest = true;
            dataSourceCopy.handlers = {
               "onAfterLoad": function(){
                  self._selectRecords(self._body, this.getRecords());
                  endSelection.callback();
               }
            };
            $ws.core.attachInstance('Source:RecordSet', dataSourceCopy);
         } else {
            this._selectRecords(this._body, this._currentRecordSet.getRecords());
            endSelection.callback();
         }
         endSelection.addCallback(function(res){
            self._notifyBatchDelayed('onChangeSelection', self._selectedRecords, true);
            self._updatePager();
            self.setCheckboxState(true);
            self._notifyOnSizeChanged(true);
            return res;
         });
         return endSelection;
      },
      /**
       * <wiTag group="Управление">
       * Отмечает все записи на текущей странице.
       * @command
       */
      selectCurrentPage: function(){
         this._selected = {};
         this._selectedRecords = [];
         this._selectRecords(this._body, this._currentRecordSet.getRecords());
         this._notifyBatchDelayed('onChangeSelection', this._selectedRecords, true);
         this._updatePager();
         this.setCheckboxState(true);
         this._notifyOnSizeChanged(true);
      },
      /**
       * Ставит/снимает флаг, отображающий отметку всех записей
       * @param isSelected Поставить/снять флаг (true/false)
       * @private
       */
      setCheckboxState: function(isSelected) {
         if (this._selectAllCheckboxRow && this._selectAllCheckbox) {
            this._selectAllCheckboxRow.toggleClass('ws-browser-selected', isSelected);
            this._selectAllCheckbox.attr('title', isSelected ? 'Снять отметку' : 'Отметить всю страницу');
         }
      },
      /**
       * <wiTag group="Управление">
       * Инвертирует отметку на текущей странице
       */
      invertSelection: function(){
         var selectedKeys = [],
             self = this,
             selectedRecords = this.getSelection(true),
             invert = function(marked, needClear){
                if(marked.length){
                   if(needClear)
                      this.removeSelection();
                   else
                      this.clearSelection(marked, true);
                }
                this._notifyBatchDelayed('onChangeSelection', this._selectedRecords, true);
                this._updatePager();
                this._notifyOnSizeChanged(true);
             };

         for(var i = 0, l = selectedRecords.length; i < l; i++){
            selectedKeys.push(selectedRecords[i].getKey());
         }
         var selectCount = selectedKeys.length,
             allSelected = selectCount === this._currentRecordSet.getRecordCount();
         if(selectCount === 0 || !allSelected){
            this.selectCurrentPage();
         }
         invert.apply(self, [selectedKeys, allSelected]);
      },
      /**
       * <wiTag group="Данные">
       * Получить поля для суммирования.
       * @returns {Object} Объект с описанием полей для суммирования.
       * @example
       * При готовности панели массовых операций (panel) проверить наличие полей для суммирования.
       * Если поля отсутствуют, то установить их.
       * <pre>
       *    panel.subscribe('onReady', function() {
       *       if (Object.isEmpty(this.getSumFields())) {
       *          var object = {
       *             'Число' : undefined,
       *             'ЗарПлат': 'Заработная плата'
       *          };
       *          this.setSumFields(object);
       *       }
       *    });
       * </pre>
       * @see sumFields
       * @see setSumFields
       */
      getSumFields: function() {
         //Перенес метод из панели массовых операций, ответственный: Чистякова Алена

         return this._options.sumFields;
      },
      /**
       * <wiTag group="Данные">
       * Установить поля для суммирования.
       * @param {Object} sumNamesObject Объект с описанием полей для суммирования.
       * @example
       * При готовности панели массовых операций (panel) проверить наличие полей для суммирования.
       * Если поля отсутствуют, то установить их.
       * <pre>
       *    panel.subscribe('onReady', function() {
       *       if (Object.isEmpty(this.getSumFields())) {
       *          var object = {
       *             'Число' : undefined,
       *             'ЗарПлат': 'Заработная плата'
       *          };
       *          this.setSumFields(object);
       *       }
       *    });
       * </pre>
       * @see sumFields
       * @see getSumFields
       */
      setSumFields: function(sumNamesObject) {
         //Перенес метод из панели массовых операций, ответственный: Чистякова Алена

         if (sumNamesObject){
            this._options.sumFields = sumNamesObject;
            this._setSumFieldsArray(sumNamesObject);
         }
      },
      _setSumFieldsArray: function(sumFields){
         //Перенес метод из панели массовых операций, ответственный: Чистякова Алена

         this._sumFieldsArray = [];
         //Формируем массив полей суммирования
         for (var i in sumFields){
            if (sumFields.hasOwnProperty(i)) {
               this._sumFieldsArray.push(i);
            }
         }
      },
      _createSumDialog: function(record) {
         //Перенес метод из панели массовых операций, ответственный: Чистякова Алена

         var self = this;

         new Dialog({
            template: 'sumDialog',
            resizable: false,
            handlers: {
               'onAfterLoad': function() {
                  if (record) {
                     this.getChildControlByName('ws-dataview-sum').setContent(self._prepareHTMLForRecord(record));
                  }
               },
               'onAfterShow' : function() {
                  this.moveWindowToCenter();
               }
            }
         });

      },
      _prepareHTMLForRecord: function(record) {

         var columns = record.getColumns(),
             html = '<table class="ws-dataview-sum-table">',
             render = function(column, text) {
                return [
                          '<tr class="ws-sum-tr">',
                             '<td class="ws-sum-left">', column, '</td>',
                             '<td class="ws-sum-right">', text, '</td>',
                          '</tr>'
                       ].join('');
             },
             self = this;

         $ws.helpers.forEach(columns, function(v) {

            var recordText = record.get(v),
                columnName = self._options.sumFields[v] || v;

            switch (record.getColumnType(v)){
               case "Деньги":
                  recordText = $ws.render.defaultColumn.money(recordText);
                  break;
               case "oid":
               case "int2":
               case "int4":
               case "int8":
               case "Число целое":
                  recordText = $ws.render.defaultColumn.integer(recordText); // формат числа
                  break;
               default:
                  break;
            }

            html += render(columnName, recordText);
         });

         html += '</table>';

         return html;

      },
      /**
       * Метод суммирования.
       * Показывает индикатор загрузки.
       * Отрабатывает показывание диалога результатов суммирования.
       * @param isSelected - true:вызывает функцию суммирования выбранных или массовое суммироние (false).
       * @private
       */
      _sum: function(isSelected) {
         //Перенес метод из панели массовых операций, ответственный: Чистякова Алена

         var self = this,
             indicator = new LoadingIndicator({
                message : "Суммирование записей...",
                name: 'ws-load-indicator'
             });

         $ws.helpers.callbackWrapper( isSelected ?  this._sumSelectedRecords.call(this) : this._sumRecords.call(this), function(record){
            indicator.hide();
            indicator.destroy();
            //Здесь может быть false, тогда не показываем диалог
            if (record) {
               self._createSumDialog(record);
            }
         });
      },
      _makeArgsForSum : function(methodName, filter, columns) {
         //Перенес метод из панели массовых операций, ответственный: Чистякова Алена

         return {
            'ИмяМетода' : this._options.dataSource.readerParams.linkedObject + '.' +  methodName,
            'Фильтр' : this._currentRecordSet.getReader().prepareFilter(filter),
            'Поля': columns
         };
      },
      sumRecords: function() {
         this._sum();
      },
      sumSelectedRecords: function() {
         this._sum(true);
      },
      /**
       * Массовое суммирование записей
       * @returns {$ws.proto.Deferred}
       * @private
       */
      _sumRecords: function() {
         //Перенес метод из панели массовых операций, ответственный: Чистякова Алена

         if (this._minimized) {
            return this._sumSelectedRecords();
         }

         var blObject = new $ws.proto.BLObject('Сумма'),
             queryName = this._options.dataSource.readerParams.queryName,
             result = this._notify('onCalculateSum');

         return (result instanceof $ws.proto.Deferred) ? result : blObject.call('ПоМетоду',
               this._makeArgsForSum(queryName !== undefined ? queryName : 'Список', this.getQuery(), this._sumFieldsArray),
               $ws.proto.BLObject.RETURN_TYPE_RECORD);

      },
      /**
       * Суммирование выделенных записей
       * @returns {$ws.proto.Deferred}
       * @private
       */
      _sumSelectedRecords: function() {
         //Перенес метод из панели массовых операций, ответственный: Чистякова Алена

         var selected = this.getSelection(true),
             selection = this._minimized && !selected.length ? this.getRecordSet().getRecords() : selected,
             blObject,
             result,
             recordSet;

         result = this._notify('onCalculateSum', selection);
         if (result instanceof $ws.proto.Deferred) {
            return result;
         }
         if(selection.length > 0){
            blObject = new $ws.proto.BLObject('Сумма');
            recordSet = new $ws.proto.RecordSet({
               readerType: 'ReaderUnifiedSBIS',
               readerParams: {
                  adapterType : 'TransportAdapterStatic',
                  adapterParams: {
                     data : {
                        s: $ws.single.SerializatorSBIS.serialize(selection[0]).s,
                        d: []
                     }
                  }
               }
            });
            //По-хорошему надо бы сделать appendRecord, но так как все равно нужно клонировать каждую запись отдельно
            //цикл все равно останется
            for(var i = 0, len = selection.length; i < len; i++ ){
               recordSet.appendRecord(selection[i].cloneRecord());
            }
            return blObject.call('ПоВыборке', {
                     'Записи': $ws.single.SerializatorSBIS.serialize(recordSet),
                     'Поля': this._sumFieldsArray
                  },
                  $ws.proto.BLObject.RETURN_TYPE_RECORD);
         } else {
            return new $ws.proto.Deferred().callback(false);
         }
      },
      /**
       * <wiTag group="Данные">
       * Получить текущую активную запись данных для текущей активной строки или для той, которая передана (row).
       * @param {jQuery} [row=this.getActiveElement()] Строка, запись которой хотим получить.
       * @returns {$ws.proto.Record | Boolean} Запись, если есть активня строка или false, если строки нет.
       * @example
       * <pre>
       *    var record = dataView.getActiveRecord();
       *    if(record)
       *       record.update();
       * </pre>
       */
      getActiveRecord: function(row){
         row = row || this.getActiveElement();
         if(!row){
            return false;
         }
         var record = false,
               rowkey = row.attr('rowkey');
         if(rowkey !== undefined && this._currentRecordSet.contains(rowkey))
            record = this._currentRecordSet.getRecordByPrimaryKey(rowkey);
         return record;
      },
      _checkPager: function(recordsCount, hasNextPage){
         return (this._options.display.usePaging && recordsCount !== hasNextPage);
      },
      /**
       * Обновляет сведения о количестве записей в таблице
       */
      _updatePager: function(){
         if(this._currentRecordSet){
            var recordsCount = this._count === 0 ? this._currentRecordSet.getRecordCount() : this._count,
                hasNextPage = this._currentRecordSet.hasNextPage() || (this._options.display.usePaging === 'full' && recordsCount),
                pagerStr = '';
            if(this._currentRecordSet.getRecordCount() > 0){
               if(this._options.display.showRecordsCount){
                  if (this._checkPager(recordsCount, hasNextPage)){
                     var strEnd = this._options.display.usePaging === 'full' && hasNextPage ? (" из " + hasNextPage) : '',
                         page = this._currentRecordSet.getPageNumber(),
                         startRecord = page * this._options.display.recordsPerPage + 1;
                     if(recordsCount === 0){
                         pagerStr = '';
                     }
                     else if(recordsCount === 1 && page === 0){
                        pagerStr = '1 запись';
                     }
                     else{
                        pagerStr = startRecord + " - " + (startRecord + recordsCount - 1) + strEnd;
                     }
                  } else {
                     pagerStr += pagerStr === "" ? "Всего : " : ". Всего : ";
                     pagerStr += recordsCount;
                  }
               }
            }
            var selectedCount = 0;
            for(var i = 0, len = this._selectedRecords.length; i < len; ++i){
               if(this._selectedRecords[i]){
                  ++selectedCount;
               }
            }
            if (this._options.multiSelect && selectedCount > 0) {
               if (recordsCount == 1) {
                  pagerStr = 'Выбрана 1 запись';
               } else {
                  pagerStr = 'Выбра' + $ws.helpers.wordCaseByNumber(selectedCount, 'но', 'на', 'ны') +
                     ' ' + selectedCount + ' запис' + $ws.helpers.wordCaseByNumber(selectedCount, 'ей', 'ь', 'и') + '. ' + pagerStr;
               }
            }

            this._rootElement.find('.ws-browser-dropdown-container').toggleClass('ws-hidden',
               !(recordsCount > 0 || this._currentRecordSet.getPageNumber() !== 0));

            this._foot.find('.ws-browser-pager').removeClass('ws-hidden');
            this._rootElement.find('.ws-browser-pager-text').text(pagerStr);

            if(!this._paging && this._options.display.usePaging && this._options.display.showPaging){
               var element = this._rootElement.find('.ws-browser-paging');
               if(element.length){
                  this._rootElement.find('.ws-browser-pager-cont').addClass('ws-browser-has-paging');
                  var self = this,
                     footer = element.closest('.ws-browser-foot'),
                     // TODO Нужно ли здесь это?
                     footerWidth = footer.width(),
                     footerHeight = footer.height();
                  if(hasNextPage === undefined){
                     hasNextPage = 0;
                  }
                  this._paging = new Paging({
                     recordsPerPage: this._options.display.recordsPerPage,
                     currentPage: this._currentRecordSet.getPageNumber() + 1,
                     recordsCount: hasNextPage,
                     pagesLeftRight: this._options.display.pagesLeftRight,
                     onlyLeftSide: (this._options.display.usePaging === 'parts'),
                     rightArrow: hasNextPage,
                     element: element,
                     allowChangeEnable: false, //Запрещаем менять состояние, т.к. он нужен активный всегда
                     handlers:{
                        'onPageChange': function(event, pageNum, def) {
                           self._setPageSave(pageNum);
                           self._pageChangeDeferred = def;
                           self._currentRecordSet.setPage(pageNum - 1, false, false);
                        }
                     }
                  });
                  this._processPaging();
                  this._paging.setRecordSet(this._currentRecordSet);
                  this._paging.update(this._currentRecordSet.getPageNumber() + 1);
                  if(footer.width() !== footerWidth || footer.height() !== footerHeight){
                     this._notifyOnSizeChanged(true);
                  } else if (this._resizer) {
                     //Если у нас как будто бы высота не поменялась, то проставим _resizer
                     //TODO отказаться от него бы вообще
                     this._resizer.height(this._rootElement.height());
                  }
               }
            }
         }
      },
      //переопределяется в HierarchyView
      _setPageSave: function(pageNum){
      },
      //переопределяется в HierarchyView
      _dropPageSave: function () {
      },
      /**
       * @protected
       * TODO causes Layouting
       */
      _updateSizeVariables: function(){
         this._getVerticalScrollShowed.reset();
         this._fixVerticalScrollGap();
      },

      _getVerticalScrollShowed: $ws.helpers.memoize(function() {
         var el = this._data.parent();
         return !this._isHeightGrowable() && $ws.helpers.hasVerticalScrollbar(el);
      }, '_getVerticalScrollShowed'),

      /**
       * Показываем/прячем в заголовке td, выравнивающий заголовок при появлении вертикальной прокрутки у данных
       * @private
       */
      _fixVerticalScrollGap: function() {
         var gapHolder = this._scrollGapPlaceholder,
             vertScroll;
         if (gapHolder && gapHolder.size() > 0) {
            vertScroll = this._getVerticalScrollShowed();
            if(gapHolder.lastState !== vertScroll) {
               gapHolder.lastState = vertScroll;
               gapHolder.toggle(vertScroll);
            }
         }
      },

      /**
       * Эти переменные должны считаться только здесь!
       * _bodyHeight/_bodyRealHeight
       * @private
       */
      _updateBodyHeight: function() {
         this._bodyHeight = this._data.parent().height();// <table class="ws-browser">
         this._bodyRealHeight = this._body.height();
      },

      /**
       * Изменение высоты
       */
      _setHeight: function(isExternalChange) {
         var sh = BOOMR.plugins.WS.startSpan('_setHeight');
         var table, additionalHeight, newHeight,
             haveMinHeight, haveMaxHeight, isHeightGrowable = this._isHeightGrowable(),
             styleMinHeight, minHeight;

         table = this._data.parent();

         haveMinHeight = this._options.minHeight !== 0;
         haveMaxHeight = this._options.maxHeight !== Infinity;

         if (isHeightGrowable) {
            if (!isExternalChange) {
               if (haveMinHeight || haveMaxHeight) {
                  additionalHeight = this._getAdditionalHeight() + 2;
               }

               // new algoritmm
               table.height('auto');
               this._container.height('auto');

               if(haveMaxHeight){
                  this._browserContainerWrapper.css('max-height', additionalHeight > this._options.maxHeight? 0: (this._options.maxHeight - additionalHeight));
               } else {
                  this._browserContainerWrapper.css('max-height', '');
               }

               this._browserContainerWrapper.css('min-height', '');
               if(haveMinHeight && additionalHeight <= this._options.minHeight){
                  styleMinHeight = parseInt(this._browserContainerWrapper.css('min-height'), 10) || 0;
                  minHeight = Math.max(styleMinHeight, this._options.minHeight - additionalHeight);
                  if (styleMinHeight !== minHeight) {
                     this._browserContainerWrapper.css('min-height', minHeight);
                  }
               }
            }
         } else {
            additionalHeight = this._getAdditionalHeight() + 2;
            newHeight = this._container.height() - additionalHeight;

            if (this._emptyDataBlock.hasClass('ws-hidden')) {
               table.height(Math.max(newHeight, 0));
            }
            else {
               table.height('auto');
               newHeight -= table.height();

               //В браузере случае растяга по высоте не растягиваем блок "нет данных", а ставим ему макс. высоту,
               // по которой уже появится прокрутка, если содержимое блока "нет данных" будет слишком высоким.
               // Это нужно для того, чтобы блок "нет данных" не спихивал блок "добавить новую строку" к нижнему краю браузера.
               this._emptyDataBlock.css('max-height', Math.max(newHeight, 0) + 'px');
            }
         }

         this._updateSizeVariables();
         this._updateDataBlockSize(isExternalChange);

         //Хак для IE9: была ошибка, при которой браузер, принадлежащий автодополнению, увеличивался по вертикали при наведении мышки (ховере),
         // если у него была верт. прокрутка (или у окна автодополнения)
         //TODO: проверить, нужен ли этот хак
         if (isHeightGrowable && !isExternalChange) {
            //Надо проверять, является ли браузер видимым, а то стали неправильно расщитываться размеры
            //браузера, если он скрыт через ws-hidden
            if ($ws.helpers.isElementVisible(table)) {
               //Надо прибавить единичку, а то может не хватить высоты и появится прокрутка (FF, Chrome)
               //sbisdoc://1+ОшРазраб+03.12.12+37928+2DBDF88C-35F7-4D89-A64B-3FFA3E7584F+
               table.height(table.outerHeight() + 1);
            }

            //Если у браузера есть ресайзер - надо поставить ему высоту.
            //Ресайзер нужен для браузера с гориз. растягом и автовысотой (см. _getBrowserDataContainerStyles)
            if (this._resizer) {
               this._resizer.height(this._rootElement.height());
            }
         }

         //см. комментарий к _checkContainerHeightForRecalk
         if(isHeightGrowable && isExternalChange) {
            this._checkContainerHeightForRecalk();
         }
         sh.stop();
      },
      /**
       * Возвращает высоту всего, кроме тела браузера
       */
      _getAdditionalHeight: function(){
         var footHeight = this._foot.height(),
             headHeight = this._headContainer.height();
         return footHeight + headHeight;
      },
      /**
       * Обработчик ресайза окна
       */
      _onResizeHandler: function(event, initiator){
         var s = BOOMR.plugins.WS.startSpan('_onResizeHandler');
         if (this !== initiator) {
            this._setHeight(true);
         }
         $ws.proto.DataViewAbstract.superclass._onResizeHandler.apply(this, arguments);
         //Если изменился размер строки браузера, то перместим и опции строки
         //Но только если у нас ховер остался на этой строке
         if(this._options.display.rowOptions && this._rowOptionsElement) {
            this._resetRowOptionsShift();
            if (this._rowOptionsTargetRow === this._rowOptionsHoverRow) {
               this._showRowOptionsForRow(this._rowOptionsTargetRow);
            }
         }
         s.stop();
      },
      /**
       * <wiTag group="Данные">
       * Получить текущий набор данных табличного браузера.
       * @returns {$ws.proto.RecordSet}
       * @example
       * <pre>
       *    //получим запись выборки по ключу
       *    dataView.getRecordSet().getRecordByPrimaryKey("11");
       * </pre>
       */
      getRecordSet: function(){
         return this._currentRecordSet;
      },
      /**
       * <wiTag group="Управление">
       * Изменить режим выбора.
       * Переводит браузер в режим выбора или выводит его из этого режима, в зависимости от переданного значения.
       * @param {Boolean} isEnabled
       * @example
       * <pre>
       *    if(!dataView.getSelectionMode())
       *       dataView.setSelectionMode(true);
       * </pre>
       */
      setSelectionMode : function(isEnabled){
         this._selectMode = !!isEnabled;
         this._options.display.showSelectionCheckbox = !!isEnabled;
      },
      /**
       * <wiTag group="Управление">
       * Получить статус режима выбора.
       * Режим выбора: активация записи приводит к выбору (выбор в поле связи, например).
       * @return {Boolean} selectMode Включен или нет режим выбора.
       * @example
       * <pre>
       *    if(!dataView.getSelectionMode())
       *       dataView.setSelectionMode(true);
       * </pre>
       */
      getSelectionMode : function(){
         return this._selectMode;
      },
      /**
       * Создаёт/удаляет ненужные кнопки с тулбара и меню, пересчитывает возможные действия для пользователя
       */
      _rebuildActions: function(){
         this._initActionsFlags();
         this._notifyOnUpdateActions();
      },
      /**
       * Метод поднимает событие "При перестроении списка действий"
       * @private
       */
      _notifyOnUpdateActions: function() {
         var actions = {};
         for (var i in this._actions) {
            if (this._actions.hasOwnProperty(i)) {
               actions[i] = !!this._actions[i];
            }
         }
         this._notify('onUpdateActions', actions);
      },
      /**
       * <wiTag group="Управление">
       * Изменить состояние режима браузера "только для чтения".
       * @param {Boolean} status Признак возможности редактрования, true - можно редактировать, false - нет.
       * @example
       * <pre>
       *    dataView.setReadOnly(true);
       * </pre>
       */
      setReadOnly : function(status){
         if(this._options.display.readOnly !== !!status){
            this._options.display.readOnly = !!status;
            this._rebuildActions();
            if(this._options.display.rowOptions){
               for(var i = 0; i < this._rowOptionsDefault.length; ++i){
                  if( this._rowOptionsDefault[i][2] === 'edit' ){
                     this._rowOptionsDefault[i][0] = (status ? 'Просмотреть (F3)' : 'Редактировать (F3)');
                     break;
                  }
               }
            }
         }
      },
      /**
       * <wiTag class=TableView page=5 group="Управление">
       * <wiTag group="Управление" page=2>
       * Установить возможность добавления записей.
       * @param {Boolean} allow Можно - true, или нельзя - false.
       * @example
       * <pre>
       *    dataView.setAllowAdd(false);
       * </pre>
       */
      setAllowAdd: function(allow){
         if(this._options.allowAdd != allow){
            this._options.allowAdd = allow;
            this._rebuildActions();
         }
      },
      /**
       * <wiTag class=TableView page=5 group="Управление">
       * <wiTag group="Управление">
       * Возвращает признак есть ли возможность добавления записей
       * @returns {Boolean} allow Можно или нельзя
       */
      getAllowAdd: function(){
         return this._options.allowAdd;
      },
      /**
       * <wiTag class=TableView page=5 group="Управление">
       * <wiTag group="Управление" page=2>
       * Установить возможность редактирования записей.
       * @param {Boolean} allow Можно - true,  или нельзя - false.
       * @example
       * <pre>
       *    dataView.setAllowEdit(false);
       * </pre>
       */
      setAllowEdit: function(allow){
         if(this._options.allowEdit != allow){
            this._options.allowEdit = allow;
            this._rebuildActions();
         }
      },
      /**
       * <wiTag class=TableView page=5 group="Управление">
       * <wiTag group="Управление">
       * Возвращает признак есть ли возможность редактирования записей
       * @returns {Boolean} allow Можно или нельзя
       */
      getAllowEdit: function(){
         return this._options.allowEdit;
      },
      /**
       * <wiTag class=TableView page=5 group="Управление">
       * <wiTag group="Управление" page=2>
       * Установить возможность удаления записей.
       * @param {Boolean} allow Можно - true, или нельзя - false.
       * @example
       * <pre>
       *    dataView.setAllowDelete(false);
       * </pre>
       */
      setAllowDelete: function(allow){
         if(this._options.allowDelete != allow){
            this._options.allowDelete = allow;
            this._rebuildActions();
         }
      },
      /**
       * <wiTag class=TableView page=5 group="Управление">
       * <wiTag group="Управление">
       * Возвращает признак есть ли возможность удаления записей
       * @returns {Boolean} allow Можно или нельзя
       */
      getAllowDelete: function(){
         return this._options.allowDelete;
      },
      /**
       * <wiTag class=TableView page=1 group="Управление">
       * <wiTag group="Управление" page=1>
       * Получить признак готовности постраничной навигации.
       * @returns {$ws.proto.Deferred} Вернёт асинхронное событие готовности элемента управления "постраничная
       * навигация" представления данных.
       */
      getPaging: function(){
         return new $ws.proto.Deferred().callback(this._paging);
      },
      /**
       * Изменить статус включенности элемента.
       * Т.е. возможность взаимодействия с ним пользователя.
       * <wiTag group="Управление">
       * <pre>
       *    if(control.isEnabled())
       *       control.setEnabled(false);
       * </pre>
       * @param {Boolean} enable статус "включенности" элемента управления
       */
      _setEnabled: function(enable){
         $ws.proto.DataViewAbstract.superclass._setEnabled.apply(this, arguments);
         if(this._paging) {
            this._paging.setEnabled(enable);
         }
         if(this._pageOptionsDropdown){
            this._pageOptionsDropdown.setEnabled(enable);
         }
         if(this._options.display.rowOptions){
            // для опций записи следим за их инициализированностью с помощью внутренней переменной,
            // так как логика работы setEnabled у Control такая, что сначала установится значение параметра в опции,
            // а только потом вызовется _setEnabled, поэтому придется делать вот такой стриптиз с переменной
            if(!enable && this._rowOptionsIsInit){
               this._hideRowOptions();
               this._uninitRowOptions();
            }
            else if(!this._rowOptionsIsInit){
               this._initRowOptions();
            }
         }
      },
      /**
       * Включает/выключает передагрузку данных после выполнения операции
       * @param {Boolean} enable статус включения перезагрузки данных
       * @example
       * Отключает перезагрузку данных после выполнения операции
       * <wiTag group="Управление">
       * <pre>
       *    control.setReload(false);
       * </pre>
       */
      setReload: function(reload) {
         this._options.reloadAfterChange = reload;
      },
      /**
       * Возвращает текущее значение флага перезагрузки данных после выполнения операции
       * @returns {Boolean}
       */
      getReload: function() {
         return this._options.reloadAfterChange;
      },
      /**
       * Частично обновляет размеры блока с данными
       */
      _updateDataBlockSize: function(isExternalChange){
      },
      /**
       * <wiTag group="Управление" noShow>
       */
      setSelectionType: function(type){
      },

      _showEmptyDataBlock: function(){
      },
      /**
       * Обрабатывает нажатия клавиш
       * @param {Object} eventObject Событие из _notify
       * @param {Object} event jQuery-Событие
       * @returns {Boolean|undefined}
       * @protected
       */
      _keyboardShortcut: function(event){
         if(!this._currentRecordSet || !this._currentRecordSet.isLoaded()){
            return false;
         }
         var key = event.which;
         if(key in this._keysActions){
            var shortcut = this._keysActions[key],
               modifiers = this._modifiersFromEvent(event);
            if(modifiers in shortcut){
               var res = shortcut[modifiers].call(this, event);
               if( !res ){
                  event.stopPropagation();
               }
               return res;
            }
         }
         return undefined;
      },
      /**
       * Возвращает модификаторы из указанного keyboard-события
       * @param {Object} event jQuery-событие
       * @return {Number}
       * @protected
       */
      _modifiersFromEvent: function(event){
         var sum = 0;
         if(event.ctrlKey){
            sum += $ws._const.modifiers.control;
         }
         if(event.altKey){
            sum += $ws._const.modifiers.alt;
         }
         if(event.shiftKey){
            sum += $ws._const.modifiers.shift;
         }
         return sum;
      },
      /**
       * Запоминает для указанной клавиши с указанными модификаторами функцию, которую нужно будет выполнить
       * @param {Number} key Клавиша ($ws._const.key)
       * @param {Number|Array} modifiers Модификаторы ($ws._const.modifiers). Два варианта: или передавать в стиле control | alt (ctrl и alt должны быть точно нажаты), или передавать массив вида [control, ...]. Во втором случае модификаторы считаются опциональными, могут быть как нажаты, так и не нажаты. Тем самым, если передать массив из двух элементов, то эта функция подпишется сразу на 4 клавиатурных сокращения.
       * @param {Function} callback Функция, которую нужно будет вызвать
       * @protected
       */
      _registerShortcut: function(key, modifiers, callback){
         if(!this._keysActions[key]){
            this._keysActions[key]  = {};
         }
         if(modifiers instanceof Array){
            var len = 1 << modifiers.length;
            for(var i = 0; i < len; ++i){
               var mask = 0;
               for(var j = 0; j < modifiers.length; ++j){
                  if((i & (1 << j))){
                     mask |= modifiers[j];
                  }
               }
               this._keysActions[key][mask] = callback;
            }
         }
         else{
            this._keysActions[key][modifiers] = callback;
         }
      },
      /**
       * Возвращает признак отображения древовидной структуры
       * <wiTag group="Управление">
       * @returns {boolean} дерево или нет
       * @example
       * <pre>
       *    if(dataView.isTree())
       *       dataView.applyTurnTree(true);
       *    else
       *       dataView.reload();
       * </pre>
       */
      isTree: function(){
         return false;
      },
      /**
       * Возвращает признак иерархическое представление или нет
       * <wiTag group="Управление">
       * @returns {boolean} иерархическое представление
       * @example
       * <pre>
       *    if(dataView.isHierarchy())
       *       dataView.showBranch(key);
       *    else
       *       dataView.reload();
       * </pre>
       */
      isHierarchy: function(){
         return false;
      },
      /**
       * Возвращает признак произвольное это представление данных или нет
       * <wiTag group="Управление">
       * @returns {boolean} произвольное представление
       * @example
       * <pre>
       *    if(dataView.isCustomView())
       *       dataView.setDisplayValue(fucn);
       *    else
       *       return;
       * </pre>
       */
      isCustomView: function() {
         return false;
      },
      /**
       * Устанавливает html для показа при пустой таблице
       * <wiTag group="Отображение">
       * @param {String} html или просто текст
       * @example
       * <pre>
       *    dataView.setEmptyHtml('Нажмите Ins, чтобы добавить записи.');
       * </pre>
       * @see emptyHtml
       */
      setEmptyHtml: function(html){
         this._emptyDataBlock.html(html);
         this._options.display.emptyHtml = this._emptyDataText = html; //Запоминаем измененный текст, отображаемый при пустой таблице
         this._emptyDataTextSet = false;
      },
      _unbindParentHandlers: function() {
         if(this._parent){
            this._parent.unsubscribe('onReady', this._dataBindHandler);
         }
         if(this._setDataHandler){
            this._parent.unsubscribe('onReady', this._setDataHandler);
         }
      },
      _createFooterArea: function(){
         var isShowFooter = this._options.display.showRecordsCount || this._options.display.showPaging || this._needShowSelectionCheckbox();
         return (this._useShowingFooter() ? [
            '<table class="ws-browser-foot" cellspacing="0">' ,
            '<tfoot>' ,
            (isShowFooter ? ['<tr>' ,
               '<td class="ws-browser-pager-cont">',
               (this._options.display.showPaging ?
                  '<div class="ws-browser-paging"></div>' : ''),
               (this._options.display.showRecordsCount ? [
                  '<div class="ws-browser-pager ws-hidden">',
                  '<span class="ws-browser-pager-text">&nbsp;</span>',
                  (this._options.display.usePaging && this._options.display.usePageSizeSelect ? [
                     '<div class="ws-browser-dropdown-container">',
                     '<span class="ws-browser-page-selector ws-browser-pager-select-text">, по</span>',
                     '<div  class="ws-browser-page-selector ws-browser-pager-select"></div>',
                     '<span class="ws-browser-page-selector ws-browser-pager-select-text"></span>',
                     '</div>'].join('') : ''),
                  '</div>' ].join('') : ''),
               '</td>' ,
               '</tr>'].join('') : '') ,
            '</tfoot>' ,
            '</table>' ].join('') : '')
      },
      /**
       *<wiTag group="Управление">
       * Изменить paging.
       * @param {pagingType} принимает одно из значений usePaging: "parts", "full", "" или false для отмены.
       * @param {recordsPerPage} устанавливает количество записей на страницу.
       * @example
       * <pre>
       *    browser.setUsePaging("full",5);
       * </pre>
       */
      setUsePaging: function(pagingType, recordsPerPage){
         if (!pagingType){
            this._options.display.usePaging = "full";
            this._options.display.showPaging = false;
            this._foot.get(0).innerHTML = "";
         } else {
            this._options.display.usePaging = pagingType;
            this._options.display.showPaging = true;
            //В drawFooter делается concat - и записи дублируются, нужно обнулить список опций
            this._pageOptions = [];
            this._foot.get(0).innerHTML = this._createFooterArea();
            this._footerDrawed=false;
            this._drawFooter();
         }
         this._paging=null;
         this._updatePager();
         this._currentRecordSet.setUsePages(pagingType);
         if (recordsPerPage !== undefined){
            this.setPageSize(recordsPerPage);
         }
         if (this._paging){
            this._paging.update(1);
         }
      },
      /**
       * Возвращает индекс колонки с указанным именем
       * @param {String} columnName Имя колонки
       * @returns {Number} Индекс колонки
       * @private
       */
      _getColumnIndex: function(columnName) {
         var columns = this.getColumnMap();
         for (var i in columns) {
            if (columnName === columns[i].field)
               return columns[i].index;
         }
      },
      /**
       * <wiTag group="Данные">
       * Устанавливает текущую сортировку
       * @param {Array} sorting Массив, где каждый элемент имеет вид: {field: '...', order: 'asc' / 'desc'}. Чем раньше встретится элемент с полем field, тем важнее field будет для сортировки
       * @param {Boolean} [noLoad] Если указано, то браузер изменится только внешне, сортировка будет использована  при следующей загрузке
       */
      setSorting: function(sorting, noLoad){
         this._head.find('.ws-browser-sortable').removeClass('asc desc').addClass('none');
         this._sortingStack = [];
         var values = [];
         for(var i = 0; i < sorting.length; ++i){
            var field = sorting[i].field,
                order = sorting[i].order,
                columnIdx = this._getColumnIndex(field); //Получаем индекс колонки, для которой устанавливаем сортировку
            this._sortingStack.push({'field': field, 'type': order === 'asc' ? 0 : 1});
            values.push([field, order === 'desc']);
            if (columnIdx !== undefined) {
               //Находим в заголовке колонки контейнер иконки сортировки и вешаем на него класс в зависимости от типа сортировки
               this.getContainer().find('td[columnid="' + columnIdx + '"] .ws-browser-sortable').removeClass('none').addClass(order);
            }
         }
         if(this._currentRecordSet){
            this._currentRecordSet.setSorting(values, this.getQuery(), false, noLoad);
         }
      },
      /**
       * Проверяет, можно ли создать опции записи и устанавливает соответствующий флаг
       * Если создать опции можно, то создаёт по готовности браузера
       */
      _checkRowOptions: function(){
         if(this._options.display.rowOptions){
            if(!this._rowOptionsInitialized){
               this._rowOptionsInitialized = true;
               this._initRowOptions();
               this.once('onReady', function() {
                  this._createRowOptions();
                  if (this._options.display.userRowOptions.length) {
                     this._addUsersRowOptions();
                  }
               });
            }
         }
      },
      /**
       * Инициализирует события опций строки
       */
      _initRowOptions: function(){
         if (this.isEnabled()) {
            var self = this,
               wrapper = this._rootElement.find('.ws-browser-container-wrapper');
            self._rowOptionsIsInit = true;

            $(self._rowOptionsSelector, self._body.parent()[0]).live('mouseenter mouseleave', function(event) {
               if (self._checkMoveRowOptions()) {
                  if(event.type === 'mouseenter') {
                     //хак для Ipad, при клике по строке не переходил маркер
                     if ($ws._const.browser.isMobileSafari) {
                        var row = $(event.target).closest('tr.ws-browser-table-row');
                        self.setActiveElement(row, false, false, true);
                     }
                     self._showRowOptions.apply(self, [event.target]);
                  } else {
                     self._rowMouseLeave.call(self, false, event);
                  }
               }
            });
            wrapper.find('.ws-browser').bind('mouseleave', this._rowMouseLeave.bind(this, false));
         }
      },
      /**
       * Создаёт шаблон ячейки с опциями строки и инициализирует события
       */
      _createRowOptions: function(){
         if(this._rowOptionsElement){
            return;
         }
         var self = this,
            browserContainer = this._rootElement.find('.ws-browser-container-wrapper'),
            imgPath = this._calcImgPath(),
            options = this._rowOptionsDefault;
         if(options.length){
              var div = $('<div class="ws-browser-row-options-block ws-hidden ' +
                 (self._options.display.rowOptionsPosition === 'top' ? 'ws-browser-rowOptions-top' : '') + '"></div>'),
               container = $('<div class="' + this._rowOptionsContainer + '"></div>').prependTo(div);
            //хак для ipad, если назначали класс, то плохо работал клил по RowOptions
            if(!$ws._const.browser.isMobileSafari) {
               div.bind('mouseenter mouseleave', $.proxy(this._rowOptionsEventHandler, self));
            }
            this._rowOptionsMenuButton =
               $('<span class="ws-browser-row-option-border ws-browser-row-option-menu-button">' +
               '<span class="ws-browser-row-option menu"></span></span>')
                  .appendTo(container)
                  .mouseup(function(event){
                     event.stopImmediatePropagation();
                     self._rowOptionsShowMenu(this);
                  });
            for(var i = 0, len = options.length; i < len; ++i){
               var
                  button = this._createRowOptionButton(options[i]);
               button.appendTo(container);
            }
            this._rowOptionsElement = div.appendTo(browserContainer)
               .bind('mouseleave', this._rowMouseLeave.bind(this, true))
               .bind('mousemove', function(){
                  self._rowOptionsTargetRow = self._rowOptionsHoverRow;
               });
         }
         else{
            this._rowOptionsElement = undefined;
         }
      },
      /**
       * Создаёт переданные пользовательские опции строки
       * @private
       */
      _addUsersRowOptions: function() {
         var option;

         for (var i = 0, len = this._options.display.userRowOptions.length; i<len; i++) {
            option = this._options.display.userRowOptions[i];
            if(typeof option === 'object') {
               this.addRowOption(option);
            }
         }
      },
      /**
       * Инициализирует начальные опции строки
       */
      _initRowOptionsDefaults: function(){
         this._rowOptionsDefault = this._getRowOptions();
      },
      /**
       * Cкрывает переданную опцию для строки
       * @param name {String} Имя опции, которую нужно скрыть
       * @param rowKey {String} Номер строки, для которой скрываем опцию
       */
      hideRowOption: function(name, rowKey) {
         if (this._hiddenRowOptions.hasOwnProperty(rowKey)) {
            //если опцию уже скрыли, нечего ее опять скрывать
            if (this._hiddenRowOptions[rowKey].hasOwnProperty(name)) {
               return;
            }
            //если не скрыли, но для этой строки уже что-то скрывали, то скроем эту опцию
            this._hiddenRowOptions[rowKey][name] = true;
         } else {
            //если для строки ещё ничего не скрывали, то создадим объект строки и добавим в неё опцию
            this._hiddenRowOptions[rowKey] = {};
            this._hiddenRowOptions[rowKey][name] = true;
         }
         //скроем сразу же, если есть выделеная строка
         if (this._rowOptionsHoverRow) {
            this._applyRowOptions();
         }
      },
      /**
       * Показывает скрытую опцию для строки(если раньше она были скрыта)
       * @param name {String} Имя опции, которую нужно показать
       * @param rowKey {String} Номер строки, для которой показываем опцию
       */
      showHiddenRowOption: function(name, rowKey) {
         if(!Object.isEmpty(this._hiddenRowOptions)) {
            //если у строки скрыта эта опция, то удалим её из скрытых
            if(this._hiddenRowOptions.hasOwnProperty(rowKey) && this._hiddenRowOptions[rowKey].hasOwnProperty(name)) {
               delete this._hiddenRowOptions[rowKey][name];
               //если после удаления, обьект строки оказался пустым, то удалим его
               if(Object.isEmpty(this._hiddenRowOptions[rowKey])) {
                  delete this._hiddenRowOptions[rowKey];
               }
               //сразу же покажем нашу запись, если есть строка с ховером
               if(this._rowOptionsHoverRow) {
                  this._applyRowOptions();
               }
            }
         }
      },
      /**
       * @param name {String} Имя опции, которую мы проверяем на скрытость
       * @returns {boolean} Возвращает, скрыта ли данная опция для текущей строки(которая сейчас выделена)
       * @private
       */
      _isHiddenOptionForHoveredRow: function(name) {
         if( this._rowOptionsHoverRow ) {
            var rowKey = this._rowOptionsHoverRow.attr('rowKey');
            if(!Object.isEmpty(this._hiddenRowOptions)) {
               return this._hiddenRowOptions.hasOwnProperty(rowKey) && this._hiddenRowOptions[rowKey].hasOwnProperty(name);
            }
         }
         return false;
      },
      /**
       * Скрывает опции для строки (display.rowOptions)
       */
      _hideRowOptions: function(){
         if (this._rowOptionsMenuVisible) {
            if (this._scrolledToActive) { //Если скролл стрельнул по установке фокуса на активную запись - не скрываем меню
               this._scrolledToActive = false;
            } else {
               this._rowOptionsMenuVisible = false;
               this._rowOptionsCurrentMenu.hide();
            }
         }
         if(this._rowOptionsElement){
            this._rowOptionsElement.addClass('ws-hidden');
         }
         this._rowOptions = {};
         this._rowOptionsTargetRow = this._rowOptionsHoverRow = undefined;
         this._rowOptionsHoverRecord = undefined;
         if(this._options.useSelection && this._options.useHoverRowAsActive)
            this._activeHoverHideSelection();
      },
      /**
       * <wiTag group="Управление" page=10>
       * Добавить одну пользовательскую опцию строки и перерисовать опции записи.
       * См. так же описание {@link addRowOptions}.
       * @param {Object} settings Объект формата {title: ..., icon: ..., name: ..., callback: ..., weight: ..., linkText: ... , isMainOption: ...}
       * При этом название кнопки не должно совпадать со стандартным.
       * По этому имени кнопку можно скрывать в событии {@link onRowOptions}.
       * Если необходимо создать опцию, которая всегда будет видна пользователю, то параметр isMainOption должен быть установлен в true
       * @example
       * <pre>
       *    tableView.addRowOptions([
       *       {
       *          title: 'Опция2',
       *          name: 'addToFavourite',
       *          callback: function(row, record){
       *             record.set("Избранное", true);
       *             record.update();
       *          },
       *          icon: 'sprite:icon-16 icon-Alert icon-attention'
       *       }
       *    ]);
       * </pre>:
       * @see addRowOptions
       */
      addRowOption: function(settings){
         this._addRowOption([settings['title'], settings['icon'], settings['callback'], settings['name'], settings['weight'], settings['linkText'], settings['isMainOption']]);
      },
      /**
       * <wiTag group="Управление" page=10>
       * Добавить пользовательские опции строки и перерисовать опции записи.
       * Ждёт массив с описанием новых опций, каждая из которых описывается объектом или массивом.
       * Список имён стандартных кнопок опций записи:
       * <ol>
       *    <li>edit - Редактировать запись;</li>
       *    <li>copy - Копировать записи;</li>
       *    <li>delete - Удалить запись;</li>
       *    <li>history - История записи;</li>
       *    <li>printRecord - Печать записи.</li>
       * </ol>
       * @param {Array} options Массив объектов или массивов. Каждый внутренний объект вида: {
       *    title: 'Заголовок',
       *    icon: 'Иконка',
       *    callback: 'Название команды или функция',
       *    name: 'Название кнопки',
       *    weight: 'Вес опции',
       *    linkText: 'Текст ссылки',
       *    isMainOption: 'Часто ли используемая опция (true/false)'
       * }.
       * Каждый внутренний массив вида: ['Заголовок', 'Иконка', 'Название команды или функция', 'Название кнопки', 'Перед чем вставлять', 'Текст ссылки (опционально)', 'Часто ли используемая опция'].
       * При этом название кнопки не должно совпадать со стандартным.
       * По этому имени кнопку можно скрывать в событии {@link onRowOptions}.
       * @example
       * <pre>
       *    tableView.addRowOptions([
       *       {
       *          title: 'Опция1',
       *          callback: 'delete',
       *          name: 'deleteAll',
       *          icon: 'sprite:icon-16 icon-Add icon-attention',
       *          isMainOption: true
       *       },
       *       {
       *          title: 'Опция2',
       *          name: 'addToFavourite',
       *          //обращаем внимание на порядок аргументов в функции
       *          callback: function(record, row){
       *             record.set("Избранное", true);
       *             record.update();
       *          },
       *          icon: 'sprite:icon-16 icon-Alert icon-attention'
       *       }
       *    ]);
       * </pre>
       */
      addRowOptions: function(options){
         var option = [];
         for(var i = 0, len = options.length; i < len; ++i){
            if(options[i] instanceof Array) {
               option = options[i];
               } else if(options[i] instanceof Object) {
               option.push(options[i]['title'], options[i]['icon'], options[i]['callback'], options[i]['name'], options[i]['weight'], options[i]['linkText'], options[i]['isMainOption']);
            }

            //По умолчанию(если не передали явно) опция будет главной
            option[6] = option[6] === undefined ? true : option[6];
            this._addRowOption(option);
            option = [];
         }
      },
      /**
       * Проверяет, показываются ли сейчас опции строки
       * @returns {boolean}
       */
      isRowOptionsVisible: function() {
         return this._rowOptionsElement && this._rowOptionsElement.is(':visible');
      },
      /**
       * Возвращает набор действий, которые должны быть доступны в опциях строки
       * @returns {Array} Массив, каждый элемент которого - тоже массив, вида [название, иконка, название действия (для _actions)]
       */
      _getRowOptions: function(){
         var actions = [];
         //если у нас нет использования порядковых номеров, то и опции не надо добавлять.
         if(this._hasSequenceNumbers()){
            actions.push(['Переместить вверх (Ctrl+↑)', 'sprite:icon-16 icon-ArrowUp icon-primary', 'recordUp', 'recordUp', 10]);
            actions.push(['Переместить вниз (Ctrl+↓)', 'sprite:icon-16 icon-ArrowDown icon-primary', 'recordDown', 'recordDown', 20]);
         }
         actions.push(['Удалить', 'sprite:icon-16 icon-Erase icon-error', 'delete', 'delete', 30]);
         actions.push([this._options.display.readOnly ? 'Просмотреть (F3)' : 'Редактировать (F3)', 'sprite:icon-16 icon-Edit icon-primary', 'edit', 'edit', 40]);

         return actions;
      },
      /**
       * Показывает опции строки для указанной строки
       * @param {jQuery} row Строка, для которой нужно показать опции
       */
      _showRowOptionsForRow: function(row){
         var rowkey,
            record;
         if (this._useKeyboard || !row) {
            return;
         }
         rowkey = row.attr('rowkey');
         record = this._currentRecordSet.contains(rowkey) && this._currentRecordSet.getRecordByPrimaryKey(rowkey);
         if(record){
            var filter = [];
            if(this._options.useHoverRowAsActive && !this._useKeyboard) {
               this.setActiveElement(row, false, true, false);
            }
            if(!record) {
               filter = ['edit', 'delete', 'recordUp', 'recordDown'];
            }
            else {
               if(this._rowOptionsDisableStandart === true) {
                  filter = ['edit', 'delete', 'recordUp', 'recordDown'];
               }
               else if(this._rowOptionsDisableStandart !== false) {
                  filter = this._rowOptionsDisableStandart || [];
               }
            }
            this._additionalFilterRowOptions(filter, record);
            filter = this._rowOptionsFilterConcat(filter);
            this._refilterRowOptions(filter);

            var prevOptions = $ws.core.merge({}, this._rowOptions, {clone:true}),
               res = this._notify('onRowOptions', record, row, this._rowOptions);
            if(res !== false){
               var rowHeight = row.outerHeight();
               this._rowOptionsHoverRow = this._rowOptionsTargetRow = row;
               this._rowOptionsHoverRecord = record;

               if(!(res instanceof Array)){
                  res = [];
               }
               this._createRowOptions();
               res = res.concat(this._updateRowOptions(prevOptions));
               this._refilterRowOptions(filter.concat(res));
               this._applyRowOptions();
               if(this._hasRowOptions && this._rowOptionsElement && row.parent().parent().length){
                  this._rowOptionsElement.css(this._getRowOptionPositionForRow(row)).removeClass('ws-hidden');
                  if($ws._const.theme != 'wi_scheme') {
                     this._rowOptionsElement.find('.ws-browser-row-option-border').css('top', (rowHeight / 2 - 10) + 'px');
                  }
                  return;
               }
            }
         }
         this._hideRowOptions();
      },
      /**
       * Устанавливает положение опций строки
       * @see rowOptionsPosition
       * @param {string} position
       */
      setRowOptionsPosition: function(position) {
         //Поищем текущее положение, возможно надо сразу навесить нужный класс
         var currentPos = this._rowOptionsElement && this._rowOptionsElement.hasClass('ws-browser-rowOptions-top');

         if(position === 'top' && this._options.display.rowOptionsPosition !== 'top') {
            this._options.display.rowOptionsPosition = position;
            } else {
            this._options.display.rowOptionsPosition = 'bottom';
         }
         if(currentPos === false && position === 'top') {
            this._rowOptionsElement.addClass('ws-browser-rowOptions-top');
         } else if (currentPos && position !== 'top') {
            this._rowOptionsElement.removeClass('ws-browser-rowOptions-top');
         }
         //сразу же спозиционируем опции, если есть выделенная строка
         if (this._rowOptionsTargetRow === this._rowOptionsHoverRow) {
            this._showRowOptionsForRow(this._rowOptionsTargetRow);
         }
      },
      /**
       * Возвращает, к какому краю прибиты опции строки
       * @returns {string}
       */
      getRowOptionsPosition: function() {
         return this._options.display.rowOptionsPosition;
      },
      /**
       * Вычисляет положение опций записи
       * @param {jQuery} row
       * @return {Object} Позиция
       * @private
       */
      _getRowOptionPositionForRow: function(row){
         var rowHeight = row.outerHeight(),
             rowOptionsContainerHeight = this._rowOptionsElement.height(),
             margin;
         //ставим маржин, чтобы прибить опции к низу только в том случае, если высота строки больше
         //чем высота блока с опциями
         if(rowHeight > rowOptionsContainerHeight &&  this._options.display.rowOptionsPosition === 'bottom') {
            margin = rowHeight - rowOptionsContainerHeight;
         } else if(parseInt(this._rowOptionsElement.css('margin-top'), 10) > 0) {
            margin = 0;
         }
         return {
            'top': row.position().top + this._rowOptionsShift.top -
            (row.hasClass('ws-browser-no-table-row-last') ? 1 : 0) + (margin ? margin : 0),
            'right': this._rowOptionsShift.right
         }
      },

      /**
       * Дополняет фильтр опций строки, исходя из своих параметров
       * @param {Array} filter Фильтр, который необходимо дополнить
       * @return {Array} Новый фильтр
       * @private
       */
      _rowOptionsFilterConcat: function(filter){
         var disabled = [];
         if(this._options.display.readOnly){
            if((!this._options.allowEdit || this._options.useHoverRowAsActive) && !this._selectMode)
               disabled.push('edit');
            if(!this._options.allowDelete)
               disabled.push('delete');
            if(this._hasSequenceNumbers()){
               disabled.push('recordUp', 'recordDown');
            }
         }
         for(var i = 0, len = disabled.length; i < len; ++i){
            var found = false;
            for(var j = 0; j < filter.length; ++j){
               if(filter[j] == disabled[i]){
                  found = true;
                  break;
               }
            }
            if(!found){
               filter.push(disabled[i]);
            }
         }
         return filter;
      },
      /**
       * Находит нужные опции строки, исходя из представленного фильтра
       * @param {Array} filter Имена опций, которые нужно скрыть
       * @private
       */
      _refilterRowOptions: function(filter){
         var filterMap = {},
             options = this._rowOptions;

         for(var i = 0; i < filter.length; ++i){
            filterMap[filter[i]] = true;
         }
         this._rowOptions = {};
         for(i = 0; i < this._rowOptionsDefault.length; ++i){
            var option = this._rowOptionsDefault[i],
               name = option[3] || option[2];
            if(!filterMap[name] && !(typeof(option[2]) === 'string' && !this._actions[option[2]])){
               this._rowOptions[name] = {
                  'title': option[0],
                  'icon': option[1],
                  'callback': typeof(option[2]) === 'string' ? this._actions[option[2]] : option[2],
                  'name': name,
                  'linkText': option[5],
                  'isMainOption': options[name] ? options[name]['isMainOption'] : option[6]
               };
            }
         }
      },
      /**
       * Показывает меню опций строки
       * @param {HTMLElement} element Объект, по которому кликнули
       * @private
       */
      _rowOptionsShowMenu: function(element){
         this._rowOptionsMenuVisible = true;
         this.setActiveRow(this._rowOptionsHoverRow);
         if(this._rowOptionsMenu instanceof Object){
            this._applyRowOptions();
            (this._rowOptionsCurrentMenu = this._rowOptionsMenu).show($(element), $ws._const.Browser.rowOptionsMenuOffset, {objectLeft: false, targetLeft: false});
         }
         else if(this._rowOptionsMenu === undefined){
            this._createRowOptionsMenu(element);
         }
      },
      _rowOptionsEventHandler: function(e){
         if(this._rowOptionsHoverRow && !this._rowOptionsMenuVisible){
            this._rowOptionsHoverRow.toggleClass('ws-browser-row-hover', e.type === 'mouseenter');
         }
      },
      _applyRowOptionItem: function (option, imgPath, imgSrc) {
         if (imgSrc.indexOf('sprite:') != -1) {
            $(option).removeClass().addClass(imgSrc.split("sprite:")[1]).addClass('ws-browser-row-option-sprite');
            if(imgSrc.indexOf('primary') > -1){
               $(option).addClass('action-hover');
            }
         }
         else {
            imgSrc = this._calculateImagePath(imgPath, imgSrc);
            $ws.helpers.makeBackground(option, imgSrc);
         }
      },
      _calculateImagePath: function (imgPath, imgSrc) {
         return !imgSrc || imgSrc.indexOf('/') > -1 || imgSrc.indexOf('sprite:') !== -1 ? imgSrc : imgPath + imgSrc;
      },
      /**
       * Определяет часто ли используемая эта опция для записи
       * @param {Object} option Объект опции
       * @return {Boolean}
       * @private
       */
      _isMainRowOption: function(option){
         return option.isMainOption !== undefined ? option.isMainOption : !!this._options.display.mainRowOptions[option.name];
      },
      /**
       * Собирает внутренности кнопки опцииз записи
       * @param option
       * @returns {jQuery}
       * @private
       */
      _assembleRowOptionButtonSpan: function(option) {
         var
            text = '';
         if( option[5] === true ){
            text = option[0];
         } else if( typeof option[5] == 'string' ) {
            text = option[5];
         }
         var
            imgPath = this._calcImgPath(),
            optionsSpan = $('<span class="ws-browser-row-option" title="' + option[0] + '">' + text + '</span>');
         if(option[5]) {
            optionsSpan.addClass('asLink ws-browser-row-option-as-link');
         } else {
            this._applyRowOptionItem(optionsSpan, imgPath, option[1]);
         }
         return optionsSpan;
      },
      /**
       * Собирает кнопку для одной опции записи
       * Fixme: переделать на dot.tpl
       * @param option
       * @returns {*|jQuery}
       * @private
       */
      _assembleRowOptionButton: function(option) {
         var
            callback = this._rowOptionsButtonCallback(option),
            name = typeof(option[2]) === 'string' ? option[2] : option[3],
            optionsSpan = this._assembleRowOptionButtonSpan(option),
            button = $('<span class="ws-browser-row-option-border" title="' + option[0] + '"></span>')
               .append(optionsSpan)
               .mousedown(function(e){
                  e.stopPropagation();
                  e.preventDefault();
               });
         if(option[5]) {
            button.addClass('ws-browser-row-option-border-as-link');
         }
         if(callback){
            button.bind('click', callback);
         }
         return button;
      },
      _createRowOptionButton: function(option){
         var
            button = this._assembleRowOptionButton(option),
            name = typeof(option[2]) === 'string' ? option[2] : option[3],
            weight = option[4];
         if(name){
            this._rowOptionsButtons[name] = button;
         }
         if(weight) {
            this._rowOptionsButtons[name].weight = weight;
         }
         return button;
      },
      /**
       * Показывает опции записи для строки, сохранённой в _rowOptionsTargetRow
       */
      _showRowOptionsForTargetRow: function(){
         if(this._rowOptionsTargetRow === undefined)
            this._hideRowOptions();
         else if(this._rowOptionsTargetRow !== this._rowOptionsHoverRow)
            this._showRowOptionsForRow(this._rowOptionsTargetRow);
         else
            this._rowOptionsTargetRow = undefined;
      },
      /**
       * <wiTag group="Управление">
       * Выключает стандартные опции строки
       * @param {Array} [options] Массив имён опций, которые нужно выключить
       * @example
       * <pre>
       *    tableView.disableStandartRowOptions([ 'delete', 'edit' ]);
       * </pre>
       */
      disableStandartRowOptions: function(options){
         this._rowOptionsDisableStandart = options === undefined ? true : options;
      },
      /**
       * Возвращает обработчик нажатия на опцию строки
       * @param {Array} option Массив с параметрами опции строки
       * @return {*}
       * @private
       */
      _rowOptionsButtonCallback: function(option){
         var callback,
            self = this;
         if(typeof(option[2]) === 'function'){
            callback = this._rowOptionsCallbackWrapper(option[2]);
         }
         else{
            callback = function(event){
               if(event && event.stopPropagation){
                  event.stopPropagation();
               }
               self.setActiveRow(self._rowOptionsHoverRow);
               self._actions[option[2]](self._rowOptionsHoverRow, true, event);
            };
         }
         return callback;
      },
      /**
       * Создаёт функцию-обёртку для обработки нажатия на опцию строки
       * @param {Function} callback Функция, которую необходимо обернуть
       * @return {Function}
       * @private
       */
      _rowOptionsCallbackWrapper: function(callback){
         var self = this;
         return function(event){
            if(event && event.stopPropagation){
               event.stopPropagation();
            }
            self.setActiveRow(self._rowOptionsHoverRow);
            // arguments[2] - будет заполнен, если зовем из меню
            callback.apply(self, [self._rowOptionsHoverRecord, self._rowOptionsHoverRow, arguments[2] || this, event]);
         }
      },
      /**
       *
       * Переопределяется в плагинах
       *
       */
      _createRowOptionsSubMenu: function(actionName, menuElement){
      },
      /**
       * <wiTag group="Управление">
       * Получить деферред готовности меню опций записи
       * @returns {$ws.proto.Deferred}
       * @example
       * <pre>
       *    this.getRowOptionsMenuDeferred().addCallback(function(instance){
       *       instance.subscribe('onOpen', menuShowHandler);
       *       return instance;
       *    });
       * </pre>
       */
      getRowOptionsMenuDeferred: function() {
         if(!this._rowOptionsMenuDeferred) {
            this._rowOptionsMenuDeferred = new $ws.proto.Deferred();
            if($ws.proto.Menu && this._rowOptionsMenu instanceof $ws.proto.Menu) {
               this._rowOptionsMenuDeferred.callback(this._rowOptionsMenu);
            }
         }
         return this._rowOptionsMenuDeferred;
      },
      /**
       * Создаёт меню для опций строки. Номер меню влияет на набор строк (первое - с добавлением узлов)
       * @param {HTMLElement} element Объект, по которому кликнули
       */
      _createRowOptionsMenu: function(element){
         var actions = this._rowOptionsDefault,
            rows = [],
            imgPath = this._calcImgPath(),
            self = this,
            separator = false;
         this._rowOptionsMenu = true;
         for(var i = 0, len = actions.length; i < len; ++i){
            if(actions[i][0]){
               var callback = this._rowOptionsButtonCallback(actions[i]),
                  onActivatedFunction = function(callback, id, element){
                     if(!element.subMenu){
                        callback();
                     }
                  }.bind(this, callback),
                  menuElement = {
                     caption: actions[i][0],
                     id: self.getId() + '_' + (actions[i][3] || actions[i][2]),
                     imgSrc: this._calculateImagePath(imgPath, actions[i][1]),
                     handlers: {
                        onActivated: onActivatedFunction
                     }
                  };
               this._createRowOptionsSubMenu(actions[i][2], menuElement);
               rows.push(menuElement);
               separator = false;
            }
            else if(rows.length){
               rows.push({caption: ''});
               separator = true;
            }
         }
         if(separator){
            rows.pop();
         }
         this._rowOptionsMenu = $('<div class="ws-browser-row-option-menu-container"></div>').appendTo(document.body);
         $ws.core.attachInstance('Control/Menu', {
            data: rows,
            cssClassName: 'ws-browser-row-options-menu',
            element: this._rowOptionsMenu,
            parent: this.getParent(),
            allowChangeEnable: false,
            handlers: {
               onReady: function() {
                  self._rowOptionsMenu = this;
                  self._rowOptionsCurrentMenu = this;
                  if(self._rowOptionsMenuDeferred) {
                     self._rowOptionsMenuDeferred.callback(this);
                  }
                  self._applyRowOptions();
                  this.show($(element), $ws._const.Browser.rowOptionsMenuOffset, {objectLeft: false, targetLeft: false});
               },
               onClose: function() {
                  self._rowOptionsMenuVisible = false;
                  if(self._rowOptionsHoverRow){
                     self._rowOptionsHoverRow.removeClass('ws-browser-row-hover');
                  }
                  self._showRowOptionsForTargetRow();
               }
            }
         }).addCallback(function(instance){
            self._appendRowOptionsMenuHideButton();
         });
      },
      /**
       * Добавляет кнопку закрытия меню опций строки в меню
       * @private
       */
      _appendRowOptionsMenuHideButton: function(){
         this._rowOptionsMenu.getMenuUL()
            .append('<div class="ws-browser-row-options-hide"></div>')
            .bind('click', function(){
               this._showRowOptionsForRow(this._activeElement);
               this._rowOptionsMenu.hide();
            }.bind(this));
      },
      /**
       * Находит добавленные, удалённые и обновлённые опции строки
       * Fixme: переделать на dot.tpl
       */
      _updateRowOptions: function(prevOptions){
         var res = [];
         for(var i = 0; i < this._rowOptionsDefault.length; ++i){
            var name = this._rowOptionsDefault[i][3] || this._rowOptionsDefault[i][2];
            if(prevOptions.hasOwnProperty(name) && this._rowOptions.hasOwnProperty(name)){
               if(!this._rowOptionsButtons[name]){
                  continue;
               }
               var
                  array = [
                     this._rowOptions[name]['title'],
                     this._rowOptions[name]['icon'],
                     this._rowOptions[name]['callback'],
                     this._rowOptions[name]['name'],
                     undefined,
                     this._rowOptions[name]['linkText'],
                     this._rowOptions[name]['isMainOption']
                  ],
                  button = this._assembleRowOptionButton(array);
               this._rowOptionsButtons[name].replaceWith(button);
               this._rowOptionsButtons[name] = button;
               if (this._rowOptionsMenu) {
                  var callback = this._rowOptionsCallbackWrapper(this._rowOptions[name]['callback']);
                  this._rowOptionsMenu.setItemClickHandler(this.getId() + '_' + name, callback);
                  this._rowOptionsMenu.setItemText(this.getId() + '_' + name, this._rowOptions[name]['title']);
                  this._rowOptionsMenu.setItemIcon(this.getId() + '_' + name, this._rowOptions[name]['icon']);
               }
            } else if(prevOptions.hasOwnProperty(name)){ //remove button
               res.push(name);
            }
         }
         for(i in this._rowOptions){
            if(this._rowOptions.hasOwnProperty(i) && !prevOptions.hasOwnProperty(i)){
               this.addRowOption(this._rowOptions[i]);
            }
         }
         return res;
      },
      /**
       * Изменяет опции строки до нужного состояния - скрывает / показывает кнопки, пункты меню
       */
      _applyRowOptions: function(){
         var
            count = 0,
            onlyMain = true,
            options = this._rowOptions;
         for(var i in options){
            if(options.hasOwnProperty(i)){
               ++count;
               onlyMain &= this._isMainRowOption(options[i]);
            }
         }

         // Показываем меню если 1) опций не меньше, чем rowOptionsOverflow; 2) не все из них главные.
         var showMenu = (count >= $ws._const.Browser.rowOptionsOverflow) || (!onlyMain),
            defaultOptions = this._rowOptionsDefault;
         if(this._rowOptionsMenuButton)
            this._rowOptionsMenuButton.css('display', showMenu ? 'inline-block' : 'none');
         for(i = 0; i < defaultOptions.length; ++i){
            var defaultOption = defaultOptions[i],
               name = defaultOption[3] || defaultOption[2],
               option = options[name],
               show = options[name] && !showMenu && !this._isHiddenOptionForHoveredRow(name);

            if (option && this._isMainRowOption(option)) {
               show = this._showRowOption(name, true);
            }
            this._rowOptionsButtons[name].css('display', show ? 'inline-block' : 'none');
            if (this._rowOptionsMenu) {
               this._rowOptionsMenu[option && this._showRowOption(name, option) ? 'showItem' : 'hideItem'](this.getId() + '_' + name);
            }
         }
         this._hasRowOptions = count > 0;
      },
      _showRowOption: function(name, show) {
         if (name === 'recordUp' || name === 'recordDown') {
            show = this._isShowSequenceOptions(name);
         }
         if (this._isHiddenOptionForHoveredRow(name)) {
            show = false;
         }
         return show;
      },
      _isShowSequenceOptions: function (name) {
         var toUp = name === 'recordUp',
            hasNearestRow = !!this._getNearestRow(this._rowOptionsHoverRow, toUp);
         if (this._checkOnPaging()) {
            var rowIndex = this._rowOptionsHoverRow.index(),
               currentRecordSet = this._currentRecordSet,
               pageNum = currentRecordSet.getPageNumber(),
               hasNextPage = currentRecordSet.hasNextPage(),
               recordCount = currentRecordSet.getRecordCount(),
               num;
            if (this.getPagingMode() === 'full') {
               num = pageNum + 1;
               hasNextPage = (num > 1 ? (num - 1) * currentRecordSet.getPageSize() + recordCount : recordCount) < hasNextPage;
            }
            //Если это опция "Переместить вниз", то покажем ее только в том случае, если запись не последняя или
            //есть следующая страница в рекордсете, если опция "Переместить вверх", то покажем ее только
            //если запись не первая или текущая страница не является первой
            return toUp ? rowIndex !== 0 || pageNum !== 0 : hasNearestRow || hasNextPage;
         } else {
            return hasNearestRow;
         }
      },
      /**
       * Добавляет опцию строки
       * @param {Array} option Массив с параметрами опции
       * @private
       */
      _addRowOption: function(option){
         var callback = this._rowOptionsButtonCallback(option),
             name = '',
             imgPath = this._calcImgPath();

         if(typeof(option[2]) === 'string') {
            name = option[2];
         } else if(option[3]) {
            name = option[3];
         }

         for(var i = 0; i < this._rowOptionsDefault.length; ++i){
            if(name === (this._rowOptionsDefault[i][3] || this._rowOptionsDefault[i][2]))
               return;
         }

         this._createRowOptions();
         if(this._rowOptionsElement) {
            var
               imgSrc = option[1],
               button = this._createRowOptionButton(option),
               before;
            if(option[4] && typeof option[4] === 'number') {
               before = this._getRowOptionNameInsertBefore(option);
            }

            if(option[4] === $ws._const.Browser.rowOptionBeforeAll){
               button.prependTo(this._rowOptionsElement.find('.ws-browser-row-options-container'));
            }
            else if(option[4] && before) {
               button.insertBefore(this._rowOptionsButtons[before]);
            }
            else {
               button.appendTo(this._rowOptionsElement.find('.ws-browser-row-options-container'));
            }

            if(this._rowOptionsMenu instanceof Object){
               var menuItem = {
                  imgSrc: imgSrc,
                  id: this.getId() + '_' + name,
                  caption: option[0],
                  handlers: {
                     'onActivated': callback
                  }
               };
               if(option[4] === $ws._const.Browser.rowOptionBeforeAll){
                  this._rowOptionsMenu.insertItem(menuItem, $ws._const.Menu.insertItemBeforeAll);
               }
               else if(option[4] !== undefined && before) {
                  this._rowOptionsMenu.insertItem(menuItem, this.getId() + '_' + before);
               }
               else {
                  this._rowOptionsMenu.addItem(menuItem);
               }
            }
         }

         if(option[4] === $ws._const.Browser.rowOptionBeforeAll){
            this._rowOptionsDefault.unshift(option);
         }
         else if(option[4] && before){
            for(i = 0; i < this._rowOptionsDefault.length; ++i){
               var current = this._rowOptionsDefault[i];
               if((current[3] || current[2]) === before){
                  this._rowOptionsDefault.splice(i, 0, option);
                  break;
               }
            }
         }
         else{
            this._rowOptionsDefault.push(option);
         }
      },
      /**
       * Ищет опцию строки, перед которой вставлять опцию с переданным весом
       * @param {Array} option Массив с параметрами опции строки
       * @returns {*|String} Возвращает имя опции перед которой вставлять, либо false, если у опции самый маленький вес
       * @private
       */
      _getRowOptionNameInsertBefore: function(option) {
         var weights = [],
            weight = option[4];
         //Создадим массив, куда сольём веса всех опций, кроме переданного веса
         for (var name in this._rowOptionsButtons) {
            if(this._rowOptionsButtons.hasOwnProperty(name) && this._rowOptionsButtons[name].weight !== weight) {
               weights.push(this._rowOptionsButtons[name].weight);
            }
         }
         //отсортируем его, чтобы было проще найти ближайшие элементы
         weights.sort();
         //теперь поищем, перед каким элементом вставлять
         //если такого элемента нет, вёрнём false
         for (var i = 0, len = weights.length; i < len; i++) {
            if (weight <= weights[i]) {
               for (name in this._rowOptionsButtons) {
                  if(this._rowOptionsButtons.hasOwnProperty(name) && this._rowOptionsButtons[name].weight === weights[i]){
                     return name;
                  }
               }
            }
            if (weights[i] < weight && weights[i+1] === undefined) {
               return false;
            }
         }
      },
      _hideRowOptionsForRow: function(element, targetRow){
         if(!targetRow || targetRow.length === 0 || targetRow.parents('.ws-browser').get(0) != this._data.get(0)){
            if(element.parents('.ws-browser-row-options-block').length === 0 &&
               !element.hasClass('ws-browser-row-options-block')){
               if(!this._rowOptionsMenuVisible){
                  this._hideRowOptions();
               }
               else{
                  this._rowOptionsTargetRow = undefined;
               }
            }
            return true;
         }
      },
      _showRowOptions: function(target){
         var element = $(target),
            targetRow = element;
         //Надо вырезать точку, чтобы проверить наличие класса
         if(!element.hasClass(this._rowOptionsSelector.replace(/\./g, ''))){
            targetRow = targetRow.parents('.ws-browser ' + this._rowOptionsSelector);
         }
         this._hideRowOptionsForRow.apply(this, [element, targetRow]);
         var rowkey = targetRow.attr('rowkey'),
            record = this._currentRecordSet.contains(rowkey) && this._currentRecordSet.getRecordByPrimaryKey(rowkey);
         if(!record){
            this._hideRowOptionsForRow.apply(this, [element]);
            return true;
         }
         if(this._rowOptionsMenuVisible){
            this._rowOptionsTargetRow = targetRow;
            return true;
         }
         this._showRowOptionsForRow(targetRow);
      },
      /**
       * Обработчик уведения мыши с частей браузера
       * @param {Boolean} isRowOptions Обрабатываем ли уведение с опций строки
       * @param {Object} event jQuery-событие
       * @private
       */
      _rowMouseLeave: function(isRowOptions, event){
         if(this._checkMoveRowOptions() && !this[isRowOptions ? '_isMouseMovedToTable' : '_isMouseMovedToRowOptions'](event)){
            if(this._rowOptionsMenuVisible){
               this._rowOptionsTargetRow = undefined;
            }
            else{
               this._hideRowOptions();
            }
         }
      },
      /**
       * Проверяет, передвинули ли курсор мыши на опции пустую часть браузера
       * @param {Object} event jQuery-событие
       * @returns {Boolean}
       * @private
       */
      _isMouseMovedToTable: function(event){
         return $(event.toElement || event.relatedTarget).closest(this._data).size() > 0;
      },
      /**
       * Проверяет, передвинули ли курсор мыши на опции строки
       * @param {Object} event jQuery-событие
       * @returns {Boolean}
       * @private
       */
      _isMouseMovedToRowOptions: function(event){
         return $(event.toElement || event.relatedTarget).closest('.ws-browser-row-options-block').size() > 0;
      },
      /**
       * Отписывается от событий опций строки
       */
      _uninitRowOptions: function(){
         this._rowOptionsIsInit = false;
         this._browserContainer.unbind('mousemove');
         $(this._rowOptionsSelector, this._body.parent()[0]).die('hover');
         this._rootElement.find('.ws-browser-container-wrapper').unbind('mouseleave');
      },
      _checkMoveRowOptions: function(){
         return this.isEnabled();
      },
      /**
       * Считаем и запоминаем путь до изображений
       * ToDo: унести в константы и считать при инициилизации, поискать другие использования
       * @private
       */
      _calcImgPath: function() {
         return $ws._const.Browser.imgPath;
      },
      _onRecordUpHandler: function(){
         this._verifySequenceNumber(true);
      },
      _onRecordDownHandler: function(){
         this._verifySequenceNumber();
      },
      _getNearestRow: function(activeRow, toUp){
         return activeRow[(toUp ? 'prev' : 'next') + 'All']().filter('[rowkey]')[0];
      },
      _collectDataSource: function(toUp, pageNum){
         var dataSource = $ws.core.merge({}, this.getDataSource()),
            self = this;
         dataSource.filterParams = this.getQuery();
         dataSource.usePages = 'parts';
         dataSource.filterParams.usePages = 'parts';
         dataSource.pageNum = pageNum;
         dataSource.filterParams.pageNum = pageNum;
         dataSource.firstRequest = true;
         dataSource.handlers = dataSource.handlers || {};
         dataSource.handlers.onAfterLoad = function(){
            var records = this.getRecords(),
               count = records.length,
               neibourRecord,
               nearestRecord;
            if(count > 0){
               if (toUp) {
                  nearestRecord = records[count - 1];
                  neibourRecord = records[count - 2];
               } else {
                  nearestRecord = records[0];
                  neibourRecord = records[1];
               }
               self._changeSequenceNumber(toUp, nearestRecord, neibourRecord, pageNum).addCallback(function(){
                  self._allowChangePorNomer = true;
               });
            }
         };
         return dataSource;
      },
      _hasNearestRow: function ( ) {
         return this.getPagingMode();
      },
      _hasSequenceNumbers: function(){
         return this._options.display.sequenceNumberColumn && this._allowChangePorNomer;
      },
      _verifySequenceNumber: function(toUp){
         if(this._hasSequenceNumbers()){
            var activeRow = this.getActiveRow(),
               nearestRow = $(this._getNearestRow(activeRow, toUp)),
               currentPage = this._currentRecordSet.getPageNumber(),
               self = this,
               nearestRecord,
               neighborRecord,
               neighborRow,
               newPage;
            if (nearestRow.length > 0) {
               nearestRecord = this._currentRecordSet.getRecordByPrimaryKey(nearestRow.attr('rowkey'));
               neighborRow = $(nearestRow[(toUp ? 'prev' : 'next') + 'All']().filter('[rowkey]')[0]);
               if (neighborRow.length > 0) {
                  neighborRecord = this._currentRecordSet.getRecordByPrimaryKey(neighborRow.attr('rowkey'));
               }
               this._changeSequenceNumber(toUp, nearestRecord, neighborRecord).addCallback(function(){
                  self._allowChangePorNomer = true;
               });
            } else if (this._hasNearestRow()) {
               if (toUp) {
                  if (currentPage !== 0) {
                     newPage = --currentPage;
                  }
               } else if (this._currentRecordSet.getRecords().length >= this._currentRecordSet.getPageSize()) {
                  newPage = ++currentPage;
               }
               if (typeof newPage !== 'undefined') {
                  new $ws.proto.RecordSet(this._collectDataSource(toUp, newPage));
               }
            }
         }
      },
      _changeSequenceNumber: function(toUp, nearestRecord, neighborRecord, pageNumber){
         var activeRecord = this.getActiveRecord(),
            defResult = new $ws.proto.Deferred(),
            column = this._options.display.sequenceNumberColumn,
            activeNumber = activeRecord.get(column),
            nearestNumber = nearestRecord.get(column),
            self = this,
            eventSuffix,
            methodSuffix,
            recordAbove,
            recordBellow,
            params;
         if (toUp) {
            recordAbove = nearestRecord;
            recordBellow = neighborRecord;
            methodSuffix = 'До';
            eventSuffix = 'Up';
            if (activeNumber < nearestNumber) {
               methodSuffix = 'После';
            }
         } else {
            recordAbove = neighborRecord;
            recordBellow = nearestRecord;
            methodSuffix = 'После';
            eventSuffix = 'Down';
            if (activeNumber > nearestNumber) {
               methodSuffix = 'До';
            }
         }
         if (this._notify('onBeforeChangeOrder', activeRecord, recordAbove, recordBellow) !== false) {

            this._allowChangePorNomer = false;
            params = {
               'Объект': this.getDataSource().readerParams.linkedObject,
               'ИдО': this._getComplexKey(activeRecord.getKey()),
               'ПорядковыйНомер': column,
               'Иерархия': null
            };
            params['ИдО' + methodSuffix] = this._getComplexKey(nearestRecord.getKey());

            this._sequenceNumberObject.call(
               'Вставить' + methodSuffix,
               params,
               $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function() {

                  self.once('onAfterLoad', function() {

                     self._hideRowOptions();
                     self.setActiveRow(self._body.find('.ws-browser-table-row[rowkey="'+ activeRecord.getKey() +'"]'));
                     self._notify('onRecord' + eventSuffix, activeRecord);
                     defResult.callback();

                  });

                  if (typeof pageNumber !== 'undefined') {
                     self.setPage(pageNumber, true);
                  } else {
                     self.reload();
                  }

               });

         }
         return defResult;
      },
      /**
       * Проверяет, нужно ли показывать опцию "редактировать" для указанной записи
       * @param {$ws.proto.Record} record Запись
       * @protected
       */
      _isDisableEditOptionForRecord: function(record){
         return !this._selectMode && this._options.mode === 'oneClickMode';
      },
      /**
       * Дополнительная фильтрация опций строки для отнаследованных классов
       * @param {Array} filter Названия опций, которые не нужно отображать
       * @param {$ws.proto.Record} record Текущая запись
       * @protected
       */
      _additionalFilterRowOptions: function(filter, record) {
         if(this._isDisableEditOptionForRecord(record)){
            filter.push('edit');
         }
      }
   });

   $ws.proto.DataViewAbstract.PRELOAD_ENABLED_MODES = PRELOAD_ENABLED_MODES;

   return $ws.proto.DataViewAbstract;

});
