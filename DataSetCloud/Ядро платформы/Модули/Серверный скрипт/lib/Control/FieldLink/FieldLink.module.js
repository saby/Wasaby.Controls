/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 21:59
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.FieldLink',
      ['js!SBIS3.CORE.Control', 'js!SBIS3.CORE.Menu', 'js!SBIS3.CORE.DialogSelector', 'js!SBIS3.CORE.FloatAreaSelector', 'js!SBIS3.CORE.TDataSource',
         'js!SBIS3.CORE.DialogRecord', 'js!SBIS3.CORE.FieldString', 'js!SBIS3.CORE.Suggest',
         'js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CORE.DataBoundMixin',
         'html!SBIS3.CORE.FieldLink', 'css!SBIS3.CORE.FieldLink', 'is!browser?js!Ext/jquery-ui/jquery-ui-position'
      ],
   function( Control, Menu, DialogSelector, FloatAreaSelector, TDataSource, DialogRecord, FieldString, Suggest, CompoundControl, DataBoundMixin, dotTplFn ) {

   'use strict';

   var DELETE_ICON_WIDTH = 26,
       //TODO Просто так убрать DELETE_ICON_WIDTH стремно,  будем править в 371
       REAL_DELETE_ICON_WIDTH = 16,
       // ширина запятой
       COMMA_WIDTH = 5,
       // ширина иконки разрыва связи
       ICON_WIDTH = 24,
       // ширина для вычитания у поля definition
       MINOR_DEFINITION = 19,
       //минимальная ширина поля ввода
       MIN_INPUT_WIDTH = 50,
       // доп.ширина для выпадающего меню (рассчет на запятую)
       SHOW_ALL_CONTAINER_PLUS = 8;

   $ws.single.DependencyResolver.register('SBIS3.CORE.FieldLink', function(config){
      var deps = {};

      if(config) {
         if (config.renderStyle !== 'linkOnly') {
            deps['js!SBIS3.CORE.FieldString'] = 1;
         }

         if (config.suggestSettings && config.suggestSettings.dataSource && !!config.suggestSettings.dataSource.readerParams.linkedObject) {
            deps['js!SBIS3.CORE.Suggest'] = 1;
         }
      }

      return Object.keys(deps);
   });

   var createBatchUpdateWrapperNoWaitDeferred = Control.ControlBatchUpdater.createBatchUpdateWrapperNoWaitDeferred;

   /**
    * Контрол поле связи.
    * Позволяет выбирать из нескольких справочников связанные записи.
    * После активации связи, выбранные записи доступны в контексте.
    * @class $ws.proto.FieldLink
    * @extends $ws.proto.DataBoundControl
    * @control
    * @initial <component data-component='SBIS3.CORE.FieldLink'>
    *    <options name='dictionaries' type='array'>
    *       <options>
    *          <option name='name' value='Справочник'></option>
    *          <option name='template' value='ШаблонДиалога'></option>
    *          <option name='objectName' value='объект'></option>
    *          <option name='formatMethod' value='метод'></option>
    *          <option name='keyField' value='поле'></option>
    *          <option name='selectionType' value='all'></option>
    *       </options>
    *    </options>
    *    <option name='title' value='title'></option>
    *    <option name='renderStyle' value='inputAndLink'></option>
    * </component>"
    * @category Fields
    * @css ws-FieldLink__link Ширина заголовка поля связи настраивается, навешиванием стилей на этот класс. Это важно при расположении нескольких полей связи один под другим.
    * @designTime plugin /design/DesignPlugin
    * @designTime actions /design/design
    */
   $ws.proto.FieldLink = $ws.core.mixin(CompoundControl, DataBoundMixin).extend(/** @lends $ws.proto.FieldLink.prototype */{
      /**
       * @event onBeforeDictionaryOpen Перед отображением справочника
       * Событие происходит перед тем, как будет показан справочник для выбора связанной записи.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @return {$ws.proto.Record|Object|Boolean|*} Возможные значения:
       * <ol>
       *    <li>$ws.proto.Record | Object - данные контекста, который нужно установить открываемому справочнику.</li>
       *    <li>Если вернуть false - справочник не будет открыт.</li>
       *    <li>Любой другой результат - справочник будет открыт стандартным образом.</li>
       * </ol>
       * @example
       * <pre>
       *    fieldLink.subscribe('onBeforeDictionaryOpen', function(event){
       *       // Для того, чтобы таблица для выбора взяла фильтр по организации, отдадим его диалогу в контекст.
       *       event.setResult({
       *          'ДокументНашаОрганизация': this.getLinkedContext().getValue('Контрагент')
       *       });
       *    });
       * </pre>
       */
      /**
       * @event onLinkActivated При активации связи
       * Происходит при добавлении и установке связанных записей в поле связи.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} records Массив выбранных записей.
       * @example
       * <pre>
       *    fieldLink.subscribe('onLinkActivated', function(event, records){
       *       //При выборе сотрудника установим текущей его организацию.
       *       var org = records[0] instanceof $ws.proto.Record ? records[0].get('Сотрудник.Организация') : false;
       *       if(org)
       *          $ws.single.ControlStorage.getByName("Документ.НашаОрганизация").setValue(org);
       *    });
       * </pre>
       */
      /**
       * @event onLinkSelected При выборе связи
       * Происходит при клике на визуальное представление связанной записи в поле. Актуально только в режиме отображения "Ссылка для выбора связи и поле ввода".
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record} record Связанная запись.
       * @param {Object} dictionary Описание справочника, из которого была выбрана запись.
       * @return {String|Boolean} Возможные значения:
       * <ol>
       *    <li>Если не нужно показывать диалог просмотра/редактирования записи, то необходимо вернуть false.</li>
       *    <li>Если нужно изменить шаблон диалога просмотра/редактирования, то нужно вернуть имя нужного.</li>
       * </ol>
       * @example
       * <pre>
       *    fieldLink.subscribe('onLinkSelected', function(event, record, dictionary){
       *       if(dectionary.name == 'Журнал лиц'){
       *          // Не даём просматривать записи, выбранные из справочника "Журнал лиц".
       *          event.setResult(false);
       *       } else if(record.isBranch()){
       *          // Для подразделений покажем свой диалог.
       *          event.setResult("ДиалогПодразделения");
       *       }
       *    });
       * </pre>
       */
      /**
       * @event onLinkRemove При разрыве связи
       * Происходит при любом разрыве связи как конкретной, так и всех сразу.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    fieldLink.subscribe('onLinkRemove', function(event){
       *       //При сбросе сотрудника сбросим и текущую организацию.
       *       $ws.single.ControlStorage.getByName("Документ.НашаОрганизация").dropLink();
       *    });
       * </pre>
       */
      /**
       * @event onChange При изменении
       * Происходит при любом изменении поля связи: разрыве связи или установке значения.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array | Boolean} records Массив записей или null если данные почищены.
       * @example
       * <pre>
       *    fieldLink.subscribe('onChange', function(event, records){
       *       // При изменении подскажем пользоватею сменой текста ссылки поля связи.
       *       if(records === null || records.length === 0)
       *          this.setTitle('Выберите сотрудника');
       *       else
       *          this.setTitle('Нажмите, чтобы перевыбрать сотрудника');
       *    });
       * </pre>
       */
      /**
       * @event onBeforeLinkActivated Перед выбором связанной записи
       * Происходит после того, как запись выбрана из справочника, но до обработки этой связи полем связи.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} records Выбранные запиь(записи).
       * @return {Boolean|*} Возможные значения:
       * <ol>
       *    <li>false - не обрабатывать выбор и не закрывать диалог выбора.</li>
       *    <li>true - не обрабатывать выбор, но закрыть справочник.</li>
       *    <li>Любой другой результат - выбор будет обработан полем связи, справочник закрыт.</li>
       * </ol>
       * @example
       * <pre>
       *    fieldLink.subscribe('onBeforeLinkActivated', function(event, records){
       *       if(records[0] instanceof $ws.protoRecord){
       *          if(records[0].get('Сотрудник.Уволен') === true){
       *             event.setResult(false);
       *             $ws.core.alert("Вы не можете выбрать уволенного сотрудника!");
       *          } else {
       *             event.setResult(true);
       *             this.setValue(records[0].get('Сотрудник.Лицо'));
       *          }
       *       }
       *    });
       * </pre>
       */
      /**
       * @event onVisualizeLink Визуализация выбранной записи
       * Происходит перед тем, как отобразить визуальное представление связанной записи.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} record Выбранная запись.
       * @return {String|Object|*} Возможные значения:
       * <ol>
       *    <li>Если вернули строку - визуальное представление выбранной записи.</li>
       *    <li>Для того, чтобы изменить текст и всплывающую подсказку, нужно вернуть объект со свойствами 'value' и 'title'
       * со значениями для отображаемого текста и подсказки соответственно.</li>
       *    <li>Любой другой результат - визуальное представление будет получено в соответствии с настройками поля связи.</li>
       * </ol>
       * @example
       * <pre>
       *    fieldLink.subscribe('onVisualizeLink', function(event, record){
       *       if(record.isBranch())
       *          event.setResult(record.get('Название'));
       *       else
       *          event.setResult({
       *             value: record.get('РП.ФИОСокращенное'),
       *             title: record.get('РП.ФИО')
       *          });
       *    });
       * </pre>
       */
      /**
       * @event onVisualizeHistoryLink Визуализация истории выбора
       * @deprecated
       * <wiTag page=4>
       * Событие, выполянемое для построения визуального представления значения истории выбора.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} key Ключ значения истории выбора.
       * @param {Object} dictionary Описание справочника, из которго было выбрано это значение.
       * @param {String} linkText Визуальное представление ссылки.
       * @return {String} При возврате строки - отображает её как представление связи, иные значения игнорируются.
       * @example
       * <pre>
       *    fieldLink.subscribe('onVisualizeHistoryLink', function(event, key, dictionary, linkText){
       *       // для текущего пользователя покажем текст ссылки в истории выбора как "Я"
       *       if(key == $ws.single.GlobalContext('currentUserId'))
       *          event.setResult("Я");
       *    });
       * </pre>
       */
      /**
       * @event onBeforeShowRecord Перед отображением диалога записи
       * Событие, выполянемое перед отображением диалога редактирования выбранной записи
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record} record Запись, которая будет редактироваться.
       * @return {$ws.proto.Record|$ws.proto.Deferred|Boolean} Возможные значения:
       * <ol>
       *    <li>Для подмены просматриваемой записи требуется вернуть запись {$ws.proto.Record}.</li>
       *    <li>или {$ws.proto.Deferred}, который отдаст в качестве результата при успехе запись {$ws.proto.Record}.</li>
       *    <li>Для отмены показа диалога просмотра необходимо вернуть false.</li>
       * </ol>
       * @example
       * <pre>
       *    fieldLink.subscribe('onBeforeShowRecord', function(event, record){
       *       if(record.isBranch()){
       *          // Не показываем диалог для выбранного подразделения.
       *          event.setResult(false);
       *       } else if(record.get('Сотрудник.Лицо1') !== $ws.single.GlobalContext.getValue('currentOrganization')){
       *          // Если сотрудник в текущей организации, то её запись уже есть и отдадим на показ её.
       *          event.setResult(window.currentOrgRecord);
       *       } else {
       *          // Иначе вычитаем.
       *          var waitOrg = new $ws.proto.Deferred();
       *          event.setResult(wait);
       *          $ws.helpers.newRecordSet('Организация', 'Список', {}, undefined, false).addCallback(function(rs){
       *             waitOrg.dependOn(rs.readRecord(record.get('Сотрудник.Лицо1')));
       *          }).addErrback(function(error){
       *             waitOrg.errback(error);
       *          });
       *       }
       *    });
       * </pre>
       */
      /**
       * @event onBeforeLinkRemove Перед удалением
       * Событие, выполянемое перед попыткой удалить связь(и).
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record | Array} records Запись, или массив записей на удаление.
       * @return {Boolean} Если не нужно удалять текущую запись, то нужно вернуть false.
       * @example
       * <pre>
       *    fieldLink.subscribe('onBeforeLinkRemove', function(event, records){
       *       if(this.getSelectedRecords().length <= 1){
       *          $ws.core.alert('Должен быть выбран хотя бы один сотрудник!');
       *          event.setResult(false);
       *       }
       *    });
       * </pre>
      */
      $protected: {
         _link: false,
         _options : {
            /**
             * @cfg {String} Отображаемое поле связанного контекста
             * Имя поля, в которое должно проставиться строковое представление поля связи.
             * Это же имя проставится у поля ввода поля связи.
             * Это поле можно получить методом {@link getInputField}.
             * <wiTag group="Данные">
             * <pre>
             *    fieldLink.getInputField().setValue("Поиск");
             * </pre>
             */
            owner: '',
            /**
             * @cfg {Boolean} Проверка наличия связанных записей
             * Флаг. Определяет возможность поля связи остаться незаполненным. Важно при редактировании записи.
             * Изменяется с помощью метода {@link setCanBeEmpty}.
             * Возможные значения:
             * 1. 'true' - поле связи не может быть пустым;
             * 2. 'false' - поле связи может быть пустым.
             * <wiTag group="Управление">
             * <pre>
             *    fieldLink.setCanBeEmpty(true);
             * </pre>
             */
            canNotBeEmpty: false,
            /**
             * @cfg {Boolean} Множественный выбор связываемых записей
             * <wiTag page=1 group="Управление">
             * Флаг. В состоянии 'true' позволяет связать с текущим диалогом больше одной записи.
             * Возможны значения:
             * <ul>
             *    <li>'true' - множественный выбор включён.</li>
             *    <li>'false' - множественный выбор выключен.</li>
             * </ul>
             */
            multiSelect: false,
            /**
             *  @cfg {String} Поле контекста, в которое будет вводиться описание.
             *  Принцип работы. Только для единичного выбора! Если запись выбрана, автодополнение отключается
             *  и дается возможность пользователю вводить описание выбранной записи.
             */
            definition: undefined,
            /**
             * @cfg {String} Тип выбираемых записей
             * <wiTag group="Управление">
             * Какой тип записи можно выбрать из справочника - листья, узлы или все записи.
             * Имеет смысл для выбора из иерархического справочника.
             * @deprecated Будет удалено с версии 3.8.0. Используйте одноименную опцию в настройках справочника.
             * @variant node выбираются только узлы
             * @variant leaf выбираются только листья
             * @variant all выбираются все записи
             */
            selectionType: 'all',
            /**
             * @cfg {String} Режим выбора записей. В новом диалоге или во всплывающей панели.
             * <wiTag group="Управление">
             * @variant newDialog в новом диалоге
             * @variant newFloatArea во всплывающей панели
             */
            selectRecordsMode : 'newDialog',
            /**
             * @typedef {String} editMode
             * @variant newWindow Новое окно
             * @variant newDialog Новый диалог
             * @variant newFloatArea Новая плавающая область
             */
            /**
             * @typedef {Object} Dictionary
             * @property {String} name имя справочника
             * @property {String} template имя шаблона диалога выбора
             * @property {String} objectName
             * @property {String} formatMethod метод, определяющий формат объекта при повторном вычитывании связи с БЛ.
             * @property {String} keyField поле, хранящее ключ связываемой записи
             * @property {Boolean} readOnly только для чтения
             * @property {String} readMethodName метод чтения записей
             * @property {String} editDialogTemplate шаблон диалога редактирования
             * @property {editMode} editMode где редактируются записи: newWindow, newDialog, newFloatArea
             * @editor template ExternalComponentChooser
             * @editor editDialogTemplate ExternalComponentChooser
             * @editor objectName ObjectBLChooser
             * @editor formatMethod MethodBLChooserKeyField
             * @editor readMethodName MethodBLChooser
             */
            /**
             * @cfg {Array.<Dictionary>} Описание справочников
             * <wiTag group="Данные">
             * Описание справочников для выбора связанной записи.
             * Описание каждого справочника включает в себя:
             * <ol>
             *    <li>name - имя справочника</li>
             *    <li>template - шаблон диалога выбора</li>
             *    <li>objectName - имя объекта, с которым связана выбираемая из справочника запись</li>
             *    <li>formatMethod - метод, определяющий формат объекта при повторном вычитывании связи с БЛ</li>
             *    <li>keyField - поле, хранящее ключ связываемой записи</li>
             *    <li>readOnly - только ли для чтения,</li>
             *    <li>readMethodName - метод чтения записей,</li>
             *    <li>editDialogTemplate - шаблон диалога редактирования,</li>
             *    <li>editMode - где редактируются записи: newWindow, newDialog, newFloatArea.<li>
             *    <li>selectionType - какие записи можно выбирать: all (и узлы и листья), leaf (только листья), node (только папки).
             *    Используется для иерархических справочников.<li>
             * </ol>
             * @example
             * <pre>
             *    dictionaries: [
             *       {
             *          // первый справочник выведется в меню с названием "Выбор контрагента"
             *          name: 'Выбор контрагента',
             *          // покажет окно по шаблону "ВыборИзСпискаКонтрагентов"
             *          template: 'ВыборИзСпискаКонтрагентов',
             *          // записи будет строить от базового объекта Контрагент
             *          objectName: 'Контрагент',
             *          // Каждая запись, выбранная из этого справочника, будет редактироваться диалогом "РедактированиеКонтрагента"
             *          editDialogTemplate: 'РедактированиеКонтрагента',
             *          // редактироваться будет в новой вкладке
             *          editMode: 'newWindow',
             *          // редактирование записей из этого справочника разрешено
             *          readOnly: false,
             *          // записи должны вычитываться методом "ПрочитатьКонтрагента"
             *          readMethodName: 'ПрочитатьКонтрагента'
             *       },
             *       {
             *          name: 'Выбор нашей организации',
             *          template: 'ВыборНашейОрганизации',
             *          objectName: 'Организация',
             *          editDialogTemplate: 'ПросмотрОрганизации',
             *          // в случае второго справочника для чтения потребовалось указать метод, определяющий формат объекта
             *          formatMethod: 'БазовоеРасширение',
             *          // и проставлять значение в поле связи не ключевое, а из поля "Организация.Лицо1"
             *          keyField: 'Организация.Лицо1',
             *          // просматривать записи, выбранные из этого справочника, нужно в новом диалоге
             *          editMode: 'newDialog',
             *          // и разрешен только просмотр
             *          readOnly: true
             *       },
             *       {
             *          // третий справочник предназначен только для выбора
             *          // поэтому его описание содержит минимальный набор свойств
             *          // записи, выбранные из этого справочника, не будут ни редактироваться, ни открываться на просмотр
             *          name: 'Выбор из ЕГРЮЛ',
             *          template: 'ВыборИзЕГРЮЛ',
             *          objectName: 'ЕГРЮЛ'
             *       }
             *    ]
             * @see getCurrentDictionary
             * @see getSelectedRecordDictionary
             * @see getDictionary
             * @group Data
             */
            dictionaries: [],
            /**
             * @cfg {Boolean} Включить историю выбора
             * @deprecated
             * <wiTag group="Данные" page=4>
             * Флаг. Если он установлен, включается функция "История выбора".
             * Для возможности выбирать из истории необходимо:
             * 1. В описании словаря данных dicx выставить флаг "Вести историю изменений";
             * 2. Наличие на сайте аутентификации. (См. Урок № 10);
             * 3. При использовании собственного HTML-шаблона включить передачу Пользовательских параметров.
             * Возможные значения:
             * <ul>
             *    <li>true - история выбора включена;</li>
             *    <li>false - история выбора отключена.</li>
             * </ul>
             */
            showHistory: false,
            /**
             * @cfg {String} Заголовок поля связи
             * <wiTag group="Отображение">
             * Текст ссылки поля связи, именно той, по клику на которую будет показан справочник.
             * Вместо текста можно задать иконку через sprite, при этом опция {@link imgTitle} должна быть выставлена в true.
             * @example
             * <pre>
             *     <option name="title">sprite:icon-16 icon-CurtailList icon-primary</option>
             *     <option name="imgTitle">true</option>
             * </pre>
             *
             * <pre>
             *     <option name="title">Кому</option>
             *     <option name="imgTitle">false</option>
             * </pre>
             * @translatable
             * @see setTitle
             * @see getTitle
             * @see imgTitle
             * @group Display
             */
            title: '',
            /**
             *  @cfg {Number} Ширина заголовка
             */
            titleWidth: undefined,
            /**
             * @cfg {Boolean} Отображать ли заголовок как картинку
             * <wiTag group="Отображение">
             * Возможные значения:
             * <ul>
             *    <li>true - отображать в заголовке поля связи картинку, заданную в опции {@link title};</li>
             *    <li>false - отображать в заголовке поля связи текст, заданный в опции {@link title}.</li>
             * </ul>
             * @example
             * <pre>
             *     <option name="title">sprite:icon-16 icon-CurtailList icon-primary</option>
             *     <option name="imgTitle">true</option>
             * </pre>
             * @see title
             * @group Display
             */
            imgTitle: false,
            /**
             * Показывать 2 словаря как Словарь1 / Словарь 2
             * При условии отсутствия imgTitle, т.е. при отображении ссылок у поля связи
             */
            showTwoDictionaries : true,
            /**
             * @cfg {String} Имя поля связи
             * <wiTag group="Отображение">
             * Имя элемента управления, а так же имя поля контекста, в которое будет записано значение.
             * @group Display
             */
            linkName: '',
            /**
             * @cfg {String} Отображаемое поле связанной записи
             * <wiTag group="Отображение">
             * Поле, значение которого берётся из выбранной записи и отображается в поле ввода.
             * При способе отображения "Только ссылка для выбора связи" становится текстом ссылки.
             * @group Display
             */
            linkedDisplayField: '',
            /**
             * @cfg {String} Выравнивание ссылки для выбора связи
             * <wiTag group="Отображение">
             * Имеет значение при способе отображения "Только ссылка для выбора связи".
             * Выравнивает ссылку внутри контрола "Поле связи".
             * @variant left выравнивание по левому краю контрола
             * @variant right выравнивание по правому краю контрола
             * @group Display
             */
            linkTextAlign: 'left',
             /**
             * @cfg {Boolean} Поле связи - часть редактируемой записи
             * <wiTag group="Управление">
             * Является ли поле связи частью редактируемой записи.
             * Имеет значение только при отключённом режиме множественного выбора.
             * Влияет на имена полей контекста, в которые проставятся значения полей выбранной записи.
             * Если этот флаг установлен, то имена останутся без изменений.
             * Если флаг снят, то к именам полей добавится префикс: либо имя поля связи, либо заданный в параметре
             * recordPrefix.
             * Состояние этого свойства изменяется методом {@link setIsRecordPath}.
             * <pre>
             *    fieldLink.setIsRecordPath(false);
             * </pre>
             * @see setIsRecordPath
             */
            isRecordPath: true,
            /**
             * @cfg {String} Положение ссылки для выбора связи
             * <wiTag group="Отображение">
             * Определяет положении ссылки для выбора связи относительно поля связи.
             * Имеет смысл только при способе отображения "Ссылка для выбора связи и поле ввода".             
             * @variant inline ссылка слева от поля ввода
             * @variant top ссылка над полем ввода
             * @group Display
             */
            labelPosition: 'inline',
            /**
             * @cfg {String|Function|null} Начальное значение поля связи
             * <wiTag group="Данные">
             * Поле связи хранит в качестве значений Идентификаторы записей, которые мы связали с текущим окном.
             * Может задаваться значением или обработчиком.
             * В противном случае берётся из поля связанного контекста.
             * <pre>
             *    value: function(){
             *       return $ws.single.GlobalContext.getValue('currentUser');
             *    }
             * </pre>
             */
            value: null,
            /**
             * Отображаемое значение поля связи в первый момент отображения
             */
            preProcessValue: '',
            /**
             * @cfg {Object} Конфигурация автодополнения
             * <wiTag group="Данные" page=3>
             * Описание парамеров автодополнения, в соотвествии с его конфигурацией.
             * Помимо этого необходимо задать параметры справочника поля связи:
             * <ol>
             *    <li>formatMethod - метод, определяющий формат объекта;</li>
             *    <li>keyField - поле, хранящее ключ связанной записи.</li>
             * </ol>
             * А также возможно задание всплывающей подсказки поля ввода:
             * <ol>
             *    <li>inputTooltip - текст всплывающей подсказки поля ввода;</li>
             *    <li>tooltipInside - отображать ли подсказку внутри поля ввода.</li>
             * </ol>
             * @example
             * <pre>
             *    suggestSettings: {
             *       dataSource: {
             *          readerParams: {
             *             linkedObject: 'Сотрудник',
             *             queryName: 'СписокДляПоиска'
             *          }
             *       },
             *       formatMethod: 'СписокДекларативный',
             *       inputTooltip: 'Введите для поиска сотрудника',
             *       tooltipInside: true,
             *       editDialogTemplate: 'РедактированиеСотрудника',
             *       readOnly: false,
             *       editMode: 'newWindow',
             *       readMethodName: 'ПрочитатьСоСвязями'
             *    }
             * </pre>
             */
            suggestSettings: {
               /**
                * @cfg {String} Текст всплывающей подсказки поля ввода
                * <wiTag group="Отображение" page=3>
                * @translatable
                * @group Suggest
                */
               inputTooltip: '',
               /**
                * @cfg {Boolean} Отображать ли подсказку внутри поля ввода
                * <wiTag group="Данные" page=3>
                * Отображать текст подсказки внутри поля ввода поля связи.
                * Возможные значения:
                * <ol>
                *    <li>true - отображать текст подсказки внутри поля ввода поля связи;</li>
                *    <li>false - не отображать текст подсказки внутри поля ввода поля связи.</li>
                * </ol>
                * @group Suggest
                */
               tooltipInside: false,
               /**
                * @cfg {String} Фильтр ввода
                * <wiTag group="Данные" page=3>
                * Фильтр ввода для строки поля связи
                * @group Suggest
                */
               inputFilter: '',
               /**
                * @cfg {String} Метод, определяющий формат объекта
                * <wiTag group="Данные" page=3>
                * Метод построения структуры объекта (списочный декларативный метод).
                * @editor MethodBLChooser
                * @group Suggest
                */
               formatMethod: '',
               /**
                * @cfg {String} Диалог редактирования
                * <wiTag group="Данные" page=3>
                * Каким диалогом будут редактироваться записи, выбранные через автодополнение.
                * @group Suggest
                */
               editDialogTemplate: '',
               /**
                * @cfg {String} Метод чтения записей
                * <wiTag group="Данные" page=3>
                * Каким методом должны быть прочитаны записи.
                * Актуально только при выключенном режиме множественного выбора.
                * @editor MethodBLChooser
                * @group Suggest
                */
               readMethodName: 'Прочитать',
               /**
                * @cfg {Boolean} Только для чтения
                * <wiTag group="Данные" page=3>
                * Показывать диалог выбранной записи только на просмотр.
                * Возможные значения:
                * 1. 'true' - только для чтения;
                * 2. 'false' - доступно не только чтение.
                * @group Suggest
                */
               readOnly: false,
               /**
                * @cfg {String} CSS-класс автодополнения
                * <wiTag group="Отображение" page=3>
                * @group Suggest
                */
               className: '',
               /**
                * @cfg {String} Режим редактирования
                * <wiTag group="Данные" page=3>
                * В каком режиме будут редактироваться записи, выбранные через автодополнение.
                * Возможные значения:
                * 1. 'newDialog' - режим редактирования в новом диалоге;
                * 2. 'newWindow' - режим редактирования в новой вкладке.
                * @group Suggest
                */
               editMode: 'newDialog',
               /**
                * @cfg {Number} Задержка перед получением данных
                * @group Suggest
                */
               delay: 0,
               /**
                * @cfg {Number} Минимальная длина значения
                * @group Suggest
                */
               startChar: 3,
               /**
                * @cfg {Number} Ширина подстрочного поля
                * @group Suggest
                */
               browserWidth: 100,
               /**
                * @cfg {Number} Высота подстрочного поля
                * @group Suggest
                */
               browserHeight: 100,
               /**
                * @cfg {String[]} Поля выборки
                * <wiTag group="Данные">
                * Массив имен полей выборки, значения из которых необходимо прставить в результирующие поля
                * <pre>
                *    processField: [ 'РП.ФИО' ]
                * </pre>
                * @group Suggest
                */
               processField: [],
               /**
                * @cfg {Object} Источник данных
                * <wiTag group="Данные">
                * Описание метода бизнес-логики, с помощью которого осуществляется поиск
                * Необходимо для работы без связанного браузера.
                * <pre>
                *    dataSource: {
                *       readerParams: {
                *          linkedObject: 'Пользователь',
                *          queryName: 'СписокПоСтруктуреПредприятияДляАвтодополнения'
                *       }
                *    }
                * </pre>
                * @editor TDataSourceEditorNoMethods
                * @group Suggest
                */
               dataSource: TDataSource,
               /**
               * @cfg {Object.<string, boolean|number|string|FilterParam>} Параметры метода бизнес-логики
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
                   * @property {String} width ширина столбца: можно задавать как в процентах, так и в px
                   * @property {AlignEnum} textAlign выравнивание текста в ячейке
                   * @property {AlignEnum} captionAlign выравнивание текста в заголовке столбца
                   * @property {String} className имя класса, который будет указан у каждой ячейки столбца
                   * @property {String} formatValue шаблон вывода данных в столбце - см. описание формата в {@link $ws.helpers#format}
                   * @property {Boolean} fixedSize меняется ли ширина колонки при изменении размеров окна
                   * @property {Boolean} isSortable разрешена ли сортировка по данной колонке
                   * @property {String} minWidth минимальная ширина столбца
                   * @property {VerticalAlign} verticalAlign выравнивание по высоте
                   * @property {Function} visualFilterFunction функция отображения установленного фильтра, в качестве аргументов принимает устанавливаемый фильтр
                   * @property {String} filterName имя параметра фильтрации, связанного с этим столбцом
                   * @property {String} filterDialog диалог фильтрации по данному столбцу
                   * @property {Function} captionRender функция рендеринга заголовка столбца, в качестве аргументов получает имя колонки, отображение которой строим
                   * @property {Function} render имя обработчика отрисовки столбца
                   * @property {String|Boolean} extendedTooltip расширенная подсказка
                   * @translatable title extendedTooltip
                   */
                  /**
                   * @cfg {Columns[]} Конфигурация колонок
                   * <wiTag group="Отображение">
                   * Задает описание столбцов выборки, которые нужно показать в подстрочном поле
                   * Задается аналогично описанию колонок в табличном представлении
                   * <pre>
                   *    columns: [
                   *       {
                   *          title: 'ФИО',
                   *          field: 'РП.ФИО',
                   *          width: 256
                   *       },
                   *       {
                   *          title: 'Должность',
                   *          field: 'Должность'
                   *       }
                   *    ]
                   * </pre>
                   * @group Display
                   */
                  columns : [],
                  /**
                   * @cfg {Boolean} Отображать заголовок
                   * <wiTag group="Отображение">
                   * Задает необходимость отображения заголовков столбцов таблицы.
                   * @group Display
                   */
                  showHead : true,
                  /**
                   * @cfg {Function} Функция отображения строки
                   * <wiTag group="Отображение">
                   * Функция пользовательского отбражения строки подстрочной подсказки
                   * @group Display
                   */
                  rowRender : '',
                  /**
                   * @cfg {Boolean} Обрезать ли длинные строки
                   * @group Display
                   */
                  cutLongRows: false
               }
            },
            /**
             * @cfg {String} Префикс полей связанной записи
             * <wiTag group="Данные">
             * Какой префикс нужно добавить к именам полей связанной записи при простановке их в конекст поля связи.
             * Актуально, если выключён режим множественного выбора и поле связи не является частью редактируемой записи.
             */
            recordPrefix: '',
            /**
             * @cfg {Boolean} Перечитывать связь
             * <wiTag group="Данные">
             * Задаёт необходимость перечитывать связанную запись после её выбора.
             * Такое поведение требуется, например, если нужна расширенная информация, которой нет в справочнике.
             * Актуально при выключенном режиме множественного выбора.
             */
            readLink: true,
            /**
             * @cfg {String} Стиль отображения элемента
             * <wiTag group="Отображение">
             * @variant linkOnly отображается только ссылка для выбора справочника
             * @variant inputAndLink отображаются и ссылка, и поле ввода
             * @group Display
             */
            renderStyle: 'inputAndLink'           
         },
         _keysWeHandle: [
            $ws._const.key.del,
            $ws._const.key.backspace,
            $ws._const.key.esc,
            $ws._const.key.space,
            $ws._const.key.enter,
            $ws._const.key.down,
            $ws._const.key.up
         ],
         _owner: false,
         _visualValue: false,
         dictionaries: [],
         selectedRecords : false,
         _isDicListOpened : false,
         _currentMarkedDic: 0,
         _currentDictionary : false,
         _dicMenu : false,
         _linkSpec: null, // Это описание (запись) выбранной связи (только поля связи).
         _currentLinkValue: null, // Это текущее значение связи, для сравнения с тем что приходит из контекста.
         _inputField: null,
         _suggest: null,
         _useSuggest: false,
         _showAllLinks: null,
         _deleteAllLinks: null,
         _showAllContainer: null,
         _keyStorage: [],
         _suggestDictionary: {},
         _history: false,
         _needShowHistory: true,
         _valueDeferred: undefined, //Деферред готовности текущего значения поля связи.
         _selection: [],            //Массив с информацией о текущих выбранных записях: {value: ..., visual: '...'}.
         _inputTabIndex: false,     //Табиндекс дочернего поля.
         _initialVisualValue: undefined, //Начальное значение поля ввода .
         _isReadyNotifyed: false,
         _fieldReady: null,
         _suggestReady: null,
         _settedValue: undefined, //устанавливаемое в текущий момент значение.
         _inputVisible: true,
         _dictionarySelector: undefined,
         _attachedEditor: undefined,
         _blockEdit: false,
         _dCanAcceptValue: null,
         _inputUsed: false,
         _inputNotFormatedVal: undefined,
         _fieldContainerWidth: undefined,
         _countedWidth: false   //Флаг, отвечает за то, рассчитаны ли по ширине все записи в контейнере (чтобы можно было больше не создавать и не пересчитывать на текущей итерации)
      },
      _dotTplFn: dotTplFn,
      $constructor:function(){
         var img;
         this._publishEvents();
         this.setDictionaries(this._options.dictionaries);
         this.subscribe('onValueChange', $.proxy(this.validate, this));
         this._valueDeferred = new $ws.proto.Deferred().callback();
         this._dCanAcceptValue = new $ws.proto.Deferred();

         this.once('onInit', function(){
            //только если нам надо отрисовать ссылку внутри поля вызовем установку видимого значения,
            //если у нас только ссылка, то все нужное уже сформировалось в xhtml
            //TODO убедиться в том, что после этого все хорошо работает.
            var value = this._options.preProcessValue;
            if (value && !Object.isEmpty(value || {}) && this._options.multiSelect !== true) {
               var self = this;
               //нужно оживить крестик и ссылку
               this._container.find('.ws-FieldLink__deleteContainer').click(function(event){
                  //TODO это можно вынести в отдельную функцию
                  event.stopImmediatePropagation();
                  self.dropLink($(this).closest('.ws-FieldLink__active').attr('key'), $(this).closest('.ws-FieldLink__active').attr('dic'));
                  self.setActive(true);
                  return false;
               });
               if(this._options.renderStyle === 'inputAndLink'){
                  this._container.find('.ws-FieldLink__activeLink').click($.bind(self._openRecord, self));
                  this._container.find('input').addClass('ws-hidden');
                  this._container.find('.ws-fieldLink-withInitValue').removeClass('ws-fieldLink-withInitValue');
               }
               //теперь нужно попробовать собрать запись по контексту, как при инициализации
               this._fillSelectedRecordFromContext(this._options.preProcessValue);
            }
            this._dCanAcceptValue.callback();
         });

         //TODO выпилить историю совсем, используем историю в автодополнении
         this._initHistory();
         //TODO Постараться обойтись без такого стриптиза
         this._zIndex = this._container.css('z-index');
         if (this._options.imgTitle){
            img = this._addImgTitle();
         }
         //оживим пришедшую ссылку
         if (this._options.title) {
            this._addLink(img);
         }
         this._initDeleteAllLinks();
         if (!this._initialVisualValue) {
            this._initialVisualValue = this.getLinkedContext().getValue(this._options.linkedDisplayField);
         }
      },
      _fillSelectedRecordFromContext: function(preProcessValue){
         var curCtx = this.getLinkedContext(),
             ctxVal,
             visualValue;
         if(!Object.isEmpty(preProcessValue || {})){
            ctxVal = preProcessValue.key;
            visualValue = preProcessValue.visual;
         } else {
            ctxVal = curCtx.getValue(this.getName());
            visualValue = this._options.readLink ? this._initialVisualValue : curCtx.getValue(this._options.linkedDisplayField);
         }
         visualValue = visualValue === null ? undefined : visualValue;
         if(Object.isEmpty(preProcessValue || {})){
            this._initialVisualValue = undefined;
         }
         var displayField = this._options.linkedDisplayField,
             originCtx = curCtx.getFieldOrigin(displayField),
             ctxRecord = originCtx ? originCtx.getRecord() : false;
         if (originCtx !== undefined && ctxRecord instanceof $ws.proto.Record) {
            var ctxObject = ctxRecord.toObject(),
               colDef = {},
               row = [],
               record;
            for(var k in ctxObject){
               if (ctxObject.hasOwnProperty(k) &&
                  ( (k.indexOf(this._options.linkName) === 0 || k.indexOf(this._options.recordPrefix) === 0) &&
                     (this._options.recordPrefix !== '' ? k.indexOf(this._options.recordPrefix + '.') === 0 : k.indexOf('.') != -1) ||
                     k == displayField )) {
                  colDef[k] = {
                     type:ctxRecord.getColumnType(k),
                     title:k,
                     index:row.length
                  };
                  row.push(k == this._options.linkName ? ctxVal : originCtx.getValue(k));
               }
            }
            if(ctxObject[displayField] === undefined){
               colDef[displayField] = {
                  type:$ws.proto.Record.FIELD_TYPE_STRING,
                  title:displayField,
                  index:row.length
               };
               row.push(originCtx.getValue(displayField));
            }
            record = new $ws.proto.Record({
               colDef : colDef,
               row : row,
               pkValue : ctxVal,
               parentRecordSet : null
            });
            this.selectedRecords = [ record ];
            var selRes = this._prepareSelectionResult(record, this._currentDictionary || 0);
            visualValue = selRes.visual;
         } else {
            this.selectedRecords = [ null ];
         }
         if (this._inputField === null && this._options.renderStyle !== 'linkOnly') {
            this._visualValue = visualValue;
         } else if(Object.isEmpty(preProcessValue || {})){
            this._setVisualValue(selRes ? selRes : visualValue, ctxVal, 0, true);
         }
         this._selection = [{
            visual: visualValue,
            value: ctxVal
         }];
         if(Object.isEmpty(preProcessValue || {})){
            this._currentLinkValue = ctxVal;
         }
      },
      _selectionProcessor: function(selection, fromSuggest, notNotify) {
         // Если вдруг поле связи уничтожили, то ничего не делаем.
         if (this._isDestroyed) {
            return;
         }
         var isEmptySelection = false,
            multiSelection = this._options.multiSelect && this._options.renderStyle !== 'linkOnly' && this.selectedRecords.length > 1;
         if (this._isDestroyed) { // Если вдруг поле связи уничтожили, то ничего не делаем.
            return;
         }
         this._countedWidth = false;
         // Если вдруг нет словаря, то установим первый или suggest, ибо мы присваиваем false в сбросе ссылки
         if (this._currentDictionary === false ) {
            this.setCurrentDictionary( fromSuggest ? 'suggest' : 0);
         }
         var selRes, keys = [], linkValues = [], titleValues = [], isSelected,
             target = this._getTargetContext(),
             dicNumber = fromSuggest === true ? 'suggest' : this._currentDictionary + '',
             dictionary = this.getDictionary(dicNumber);

         if(this.selectedRecords.constructor !== Array || !this._options.multiSelect) {
            this.selectedRecords = [];
            this._keyStorage = [];
            this._selection = [];
            isEmptySelection = true;
         } else {
            this._fieldContainerWidth = undefined;
         }

         if(this._options.renderStyle !== 'linkOnly' && !this._options.multiSelect){
            var inputContainer = this._fieldContainer.find('.ws-field');
            if (!this._options.definition){
               this._toggleInput(false);
            }
            var oldActiveLink = inputContainer.find('.ws-FieldLink__active');
            if (oldActiveLink.length !== 0) {
               oldActiveLink.remove();
            }
         }

         var addRecords = {}, i, len;
         for (i = 0, len = selection.length; i < len; i++) {
            addRecords['+' + this._getRelationKey(selection[i], dictionary)] = this._currentDictionary;
         }

         for (var j = 0; j < this._keyStorage.length; j++) {
            if (this._currentDictionary !== 'suggest' && this._keyStorage[j].dic == this._currentDictionary && addRecords['+' + this._keyStorage[j].key] === undefined) {
               //Обработка выбранных ранее записей: если сохраненной записи нет в списке записей, возвращаемых из dialogSelector'а, то удаляем её
               this.getContainer().find('.ws-field').find('.ws-FieldLink__active[dic="' + this._keyStorage[j].dic + '"][key="' + this._keyStorage[j].key + '"]').remove();
               this._keyStorage.splice(j, 1);
               this.selectedRecords.splice(j, 1);
               this._selection.splice(j, 1);
               j--;
            } else {
               keys.push(this._keyStorage[j].key);
            }
         }
         for (var k = 0; k < selection.length; k++) {
            var selKey = this._getRelationKey(selection[k], dictionary);
            if(this._suggest && this._options.suggestSettings.historyMethod) {
               this._suggest.addRecordToHistory(selection[k]);
            }
            if (this._getIndexByKeyAndDictionary(selKey, this._currentDictionary) !== -1) {
               if(this._options.renderStyle == 'linkOnly'){
                  selRes = this._prepareSelectionResult(selection[k]);
                  linkValues.push(selRes.visual);
                  titleValues.push(selRes.title ? selRes.title : selRes.visual);
               }
               selection.splice(k, 1);
               k--;
            } else {
               keys.push(selKey);
            }
         }

         // Вне зависимости от результата выбора чистим значение у input
         if (this._inputField !== null) {
            this._inputField.getContainer().find('input').val('');
            if (fromSuggest) {
               //Использую грязный хак из 362, чтобы написать еще один грязный хак
               //Suggest помнит старое значение и сам не умеет его переписывать, а переопределенный notFormatedVal
               //не дает сменить значение. вот и очищаем под чистую
               this.resetSuggestInputValue('');
            }
         }

         var keyStorLength = this._keyStorage.length,
             record;

         if (this._options.renderStyle !== 'linkOnly' && this._options.multiSelect && keyStorLength > 0 && selection.length > 0) { //Если в поле связи уже есть выбранные записи и добавляется хотя бы одна запись...
            var lastRecordStorage = this._keyStorage[keyStorLength - 1],
                lastRecordLink = this._fieldContainer.find('.ws-FieldLink__active[dic="' + lastRecordStorage.dic + '"][key="' + lastRecordStorage.key + '"]');
            if (!lastRecordLink.children('.ws-FieldLink__comma').length) { //... и если ещё нет запятой...
               lastRecordLink.append($('<span class="ws-FieldLink__comma">&sbquo;</span>')); //... то добавляем запятую к последней ссылке
            }
         }
         for (var l = selection.length, m = l - 1; m >= 0; m--) {
            record = isEmptySelection ? selection[m] : selection[l - m - 1];
            selRes = this._prepareSelectionResult(record);
            if (this._history) {
               this._onNewSelection(selRes, this._getCurrentDictionary());
            }
            isSelected = this._getIndexByKeyAndDictionary(selRes.value, dicNumber) !== -1;
            if(isSelected === false){
               this.selectedRecords[isEmptySelection ? 'push' : 'unshift'](record);
               this._selection[isEmptySelection ? 'push' : 'unshift'](selRes);
               var keyStorageElement = {key: selRes.value, dic: dicNumber};
               this._keyStorage[isEmptySelection ? 'push' : 'unshift'](keyStorageElement);

               if(this._options.renderStyle == 'linkOnly'){
                  linkValues.push(selRes.visual);
                  titleValues.push(selRes.title ? selRes.title : selRes.visual);
               }
               else {
                  this._setVisualValue(selRes, selRes.value, dicNumber, m !== l - 1, isEmptySelection); //Отсчет в обратном порядке, поэтому зпт нужна у 0
               }

            } else if(multiSelection) {
               var fieldContainer = this._showAllContainer === null ? this._fieldContainer.find('.ws-field') : this._showAllContainer,
                   foundElement = fieldContainer.find('.ws-FieldLink__active[dic="' + dicNumber + '"][key="' + selRes.value + '"]');
               if (foundElement.length === 0) {
                  this._setVisualValue(selRes, selRes.value, dicNumber, m!==0, isEmptySelection); //Отсчет в обратном порядке, поэтому зпт нужна у 0
               } else {
                  var lastLink = fieldContainer.find('.ws-FieldLink__active:last');
                  if(lastLink.length === 0) {
                     lastLink = this._showAllLinks;
                  }
                  if (lastLink.attr('dicNum') !== foundElement.attr('dic') && lastLink.attr('key') !== foundElement.attr('key')) {
                     lastLink.after(foundElement);
                  }
               }
               if(this._inputField !== null){
                  this._inputField.getContainer().find('input').val('');//Убираем только значение поля, а не из контекста.
                  this._inputField.setActive(true);
               }
            }
         }
         if (this._useSuggest && this._inputUsed) {
            this._container.toggleClass('ws-empty-field-validation', !this._selection.length && !this._options.canNotBeEmpty);
         }
         if (this._options.renderStyle == 'linkOnly') {
            this._setVisualValue({
               'visual' : linkValues.join(', '),
               'title' : titleValues.join(', ')
            }, keys.join(','), null, true);
         }
         var currentValue = this.getValue(),
             isChanged = currentValue === undefined || currentValue === null,
             maxLength = keys.length;
         if(!isChanged){
            if (!this._options.multiSelect) {
               currentValue = [currentValue];
            }
            var curValLength = currentValue.length;
            if (curValLength > maxLength) {
               maxLength = curValLength;
            }
            for(var s = maxLength - 1; s >= 0; s--){
               if(keys[s] !== currentValue[s]){
                  isChanged = true;
                  break;
               }
            }
         }
         keys = this._options.multiSelect ? keys : keys[0];
         this._currentLinkValue = keys;
         if (isChanged) {
            target.setValue(this._options.linkName, keys, false, !this._options.multiSelect);
         }
         //раскидаем по контексту значения связанной записи в любом случае, так как поля связанной записи могли поменяться даже если не изменился ключ
         if (!this._options.multiSelect) {
            target.insert(selection[0], this._options.isRecordPath === true ? null : this._options.linkName);
         }
         if(isChanged){
            if (notNotify !== true) {
               this._notify('onChange', this.getSelectedRecords());
            }
            this._notify('onLinkActivated', this.getSelectedRecords());
         }
         this._settedValue = undefined;
         this.validate();
         this._notifyOnValueChange([this.getSelectedRecords(), this.getValue()]);
         this._notifyOnSizeChanged(this, this, true);
      },
      _initDeleteAllLinks: function(){
         var self = this;
         if(this._options.renderStyle == 'linkOnly' || this._options.multiSelect){
            this._deleteAllLinks = this._container.find('.ws-FieldLink__delete-allLinks');
            this._deleteAllLinks
                  .click(function(event){
                     event.stopImmediatePropagation();
                     self.setActive(true);
                     self.dropAllLinks.apply(self);
                     return false;
                  });
         }
      },
      _initHistory: function(){
         var self = this;
         if($ws._const.userConfigSupport && this._options.showHistory){
            this._history = [];
            $ws.single.UserConfig.getParam(this.getClosestArea().getName() + '-' + this.getName()).addCallback(function(result){
               if(typeof(result) == 'string'){
                  self._history = $ws.helpers.deserializeURLData(result);
                  if (Object.isEmpty(self._history)) {
                     self._history = [];
                  }
                  if(self._inputField !== null){
                     self._needShowHistory = false;
                     self._drawHistory.apply(self, []);
                  }
               }
            });
         }
      },
      _publishEvents: function(){
         $ws.proto.FieldLink.superclass._publishEvents.call(this);
         this._publish(
               'onBeforeDictionaryOpen',
               'onLinkActivated',
               'onLinkRemove',
               'onVisualizeLink',
               'onLinkSelected',
               'onBeforeLinkActivated',
               'onVisualizeHistoryLink',
               'onBeforeShowRecord',
               'onBeforeLinkRemove',
               'onLoadError',
               'onAfterDelete'
         );
      },
      init: function(){
         var self = this;
         $ws.proto.FieldLink.superclass.init.call(this);
         if(this._options.renderStyle !== 'linkOnly'){
            this._fieldReady = new $ws.proto.Deferred();
            this._useSuggest = ( this._options.suggestSettings.dataSource &&
                  !!this._options.suggestSettings.dataSource.readerParams.linkedObject) || false;
            if (this._useSuggest) {
               this._suggestReady = new $ws.proto.Deferred();
            }
            this._addField();
            if (this._options.multiSelect) {
               this.subscribe('onFocusOut', function(event, destroyed, focusedControl){
                  if(focusedControl !== self._inputField && self._showAllContainer !== null){
                     self._showLinksList();
                  }
               });
            }
         }
      },
      /**
       * Переустановить текстовое значение в поле ввода. Использовать ОСТОРОЖНО!
       * Актуально только для Автодополнения
       * @param {String} value новое значение для поля ввода автодополнения
       */
      resetSuggestInputValue: function(value){
         if (this._useSuggest){
            this._suggest.forceClearValue();
            this._inputField._notFormatedVal = this._inputNotFormatedVal;
            this._inputField.setValue(value);
            this._inputField.getContainer().find('input').val(value);

            //Важно, мы curVal одинаково переопределяли
            this._inputField._notFormatedVal = this._inputField._curValue;
         }
      },
      _addLink: function(img) {
         this._link = this._container.find('.ws-FieldLink__link a');
         if (img) {
            //Удалим то, что накинул шаблонизатор и вставим картинку
            this._link.empty().append(img);
         }
         this._link.click(this._clickLink.bind(this));
         if(!this._showTwoDictionaries() && this.dictionaries.length > 1 && !this._dicMenu) {
            this._createDictionariesMenu();
         }
      },
      _showTwoDictionaries: function(){
         return this._options.showTwoDictionaries && this.dictionaries.length === 2 && !this._options.imgTitle ;
      },
      _clickLink:function(event){
         this._notifyFocus(event);
         if (this._options.enabled) {
            this.processClick(event);
         }
         event.stopPropagation();
         event.stopImmediatePropagation();
         event.preventDefault();
         return false;
      },
      _addImgTitle: function() {
         var spritePos,
            titleLink = this._options.title,
            isSpriteImage = ((spritePos = titleLink.indexOf('sprite:')) !== -1),
            imgTag = $('<'+(isSpriteImage ? 'div' : 'img')+'/>', { 'class': 'ws-FieldLink__linkImg' });
         if(isSpriteImage){
            imgTag.addClass(titleLink.substr(spritePos + 'sprite:'.length).replace(/_/g, ' '));
         } else {
            imgTag.attr('src', $ws.helpers.processImagePath(titleLink));
         }
         return imgTag;
      },
      getOwnerId: function(){
         return this._options.owner || null;
      },
      getOwner: function(){
         return this._inputField;
      },
      _getExtendedTooltipTarget: function() {
         var inputBlock = this._container.find('.input-string-field');
         if (this._options.renderStyle === 'inputAndLink'){
            return inputBlock.hasClass('ws-hidden') ? this._container : inputBlock;
         }
         else{
            return this._container.find('.ws-FieldLink__link');
         }
      },
      /**
       * Не помечаем, что начальное значение установлено до тех пор, пока запись не загрузится
       * @private
       */
      _markInitialValueSetted: function(){
      },
       /**
        * <wiTag group="Управление">
        * @deprecated
        * Получить ближайший контейнер поля связи
        * Получить ближайший контейнер поля связи: область по шаблону или окно.
        * @returns {$ws.proto.AreaAbstract} Контейнер поля связи.
        */
      getClosestArea: function(){
         var parent = this.getParent();
         while(parent && parent.getParent() &&
               !(($ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.TemplatedArea') ) || ( $ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.Window') ))){
            parent = parent.getParent();
         }
         return parent;
      },
      _onNewSelection: function(selection, dictionary){
         if (selection && !Object.isEmpty(selection)) {
            selection = [selection];
         }
         var checkElement, newHistoryItem;
         for(var i = 0, l = selection.length; i < l; i++){
            checkElement = this._checkHistoryValue(selection[i].value, dictionary);
            if (checkElement !== false) {
               this._history.splice(checkElement, 1);
            }
            newHistoryItem = {
               'k' : selection[i].value,
               'v' : selection[i].visual
            };
            if (this.dictionaries.length > 1) {
               newHistoryItem.d = dictionary;
            }
            this._history.unshift(newHistoryItem);
         }
      },
      _checkHistoryValue: function(key, dictionary){
         var historyElement = {};
         for(var i = 0, l = this._history.length; i < l; i++){
            historyElement = this._history[i];
            if (historyElement.k == key &&
                  (!historyElement.d || historyElement.d && historyElement.d.objectName == dictionary.objectName)) {
               return i;
            }
         }
         return false;
      },
      /*
      * Проверяет: остался ли переданный справочник в наборе справочников поля связи.
      * @returns {Number | Boolean} Номер справочника или false, если такого справочника не нашлось.
      */
      _checkDictionary: function(dictionary){
         var currentDictionary;
         for(var i = 0, l = this.dictionaries.length; i < l; i++){
            currentDictionary = this.dictionaries[i];
            if (currentDictionary.name == dictionary.name && currentDictionary.objectName == dictionary.objectName) {
               return i;
            }
         }
         return false;
      },
      _drawHistory: function(){
         var self = this,
             width = this._fieldContainer.width(),
             left = this._container.width() - width,
             linksWidth = 0,
             wrongItems = [],
             value, dicNumber, historyLink, historyLinkContainer, i, l, visualValue;
         this._container.append(this._historyContainer = $('<div class="ws-FieldLink__history">'));
         if (left > 0) {
            this._historyContainer.css('padding-left', left);
         }
         for(i = 0, l = this._history.length; i < l; i++) {
            value = this._history[i];
            // Проверим не удалили ли справочник.
            dicNumber = value.d ? this._checkDictionary(value.d) : 0;
            if(value.d && dicNumber === false){
               wrongItems.push(i);
            } else {
               value.n = dicNumber;
               // Если когда начали запоминать историю был один справочник, а сейчас стало больше, то сделаем вид, что запись выбирали из первого.
               if (!value.d && this.dictionaries.length > 1) {
                  value.d = this.dictionaries[0];
               }
               if(linksWidth < width){
                  visualValue = this._notify('onVisualizeHistoryLink', value.k, value.d, value.v) || value.v;
                  historyLinkContainer = $('<div class="ws-FieldLink__historyLink-container"/>').append(
                     historyLink = $('<a class="ws-FieldLink__historyLink" href="javascript:void(0);" key="' + value.k + '" dic="' + value.n + '" >' +
                           visualValue +
                     '</a>').click(function(event){
                              self.setCurrentDictionary(parseInt(this.getAttribute('dic'), 10));
                              self.setValue(this.getAttribute('key'));
                              event.stopPropagation();
                              event.preventDefault();
                              return false;
                           })
                  );
                  this._historyContainer.append(historyLinkContainer);
                  linksWidth += historyLinkContainer.width();
                  if (linksWidth >= width) {
                     historyLinkContainer.remove();
                  }
               }
            }
         }
         wrongItems.sort();
         for(i = wrongItems.length; i >= 0; i--) {
            if (wrongItems[i] !== undefined) {
               this._history.splice(wrongItems[i], 1);
            }
         }
      },
      _onContextValueReceived: function(ctxVal) {

         this._dCanAcceptValue.addCallback(function(){

            if(this._currentLinkValue && ( ctxVal && this._currentLinkValue != ctxVal || !ctxVal ) ||
               !this._currentLinkValue && ctxVal)
            {
               if (this._currentLinkValue) {
                  if (ctxVal && !this._options.multiSelect) {
                     this._linkSpec = null;
                  }
                  this.dropAllLinks(true);
               }
               //если значение отконтекста пришло раньше, чем отработал _addField, то будем искать visualValue в контексте
               if (!this._initialVisualValue && !this._inputField && this._options.renderStyle ==='inputAndLink') {
                  this._initialVisualValue = this.getLinkedContext().getValue(this._options.linkedDisplayField);
               }
               //Если начальное значение пустая строка - переведем в undefined (типа нет значения, чтобы можно было запустить вычитывание связи)
               this._initialVisualValue = this._initialVisualValue === '' ? undefined : this._initialVisualValue;
               var visualValue = this._options.readLink ? this._initialVisualValue : this.getLinkedContext().getValue(this._options.linkedDisplayField);
               visualValue = visualValue === null ? undefined : visualValue;
               if(!Object.isEmpty(this._options.preProcessValue || {}) && this._options.preProcessValue.key !== ctxVal){
                  this._options.preProcessValue = {};
               }
               if (!this._checkValForNull(ctxVal)) {
                  if (!this._options.multiSelect && visualValue !== undefined)
                  {
                     //заполним запись по контексту
                     this._fillSelectedRecordFromContext();
                     this._notifyOnSizeChanged(this, this, true);
                     this._notify('onLinkActivated', this.getSelectedRecords());
                     this._notifyOnValueChange([this.getSelectedRecords(), ctxVal]);
                     this._notifyReady();
                  } else {
                     // Защищаемся, если из контекста много много раз подряд пришло одно и то же значение
                     // В реальной жизни вероятность данного события очень мала, но все же
                     // Данное поведение было поймано интеграционными тестами
                     if (!this._isEqualValues(ctxVal, this._settedValue)) {
                        //НЕ МЕНЯТЬ СТРОКИ МЕСТАМИ!!! ЗАЦИКЛИВАЕТСЯ
                        this.setValue(ctxVal);
                        this._settedValue = ctxVal;
                     }
                  }
               } else {
                  this._notifyReady();
               }
            }
            else if (!ctxVal) {
               this._notifyReady();
            }
         }.bind(this));
      },
      _checkValForNull: function(val){
         if (val === null) {
            return true;
         }
         if (val instanceof Array) {
            for (var i = 0, len = val.length; i < len; i++){
               if (val[i] !== null) {
                  return false;
               }
            }
         }
         return false;
      },
      _isEqualValues: function(first, second){
         if (first instanceof Array && second instanceof Array && first.length === second.length) {
            for (var i = 0, len = first.length; i > len; i++) {
               if (first[i] !== second[i]) {
                  return false;
               }
            }
            return true;
         }
         return first === second;
      },
      _notifyOnReady: function(){
      },
      _notifyReady: function(){
         if(!this._isReadyNotifyed){
            this._isReadyNotifyed = true;
            if (this._options.renderStyle !== 'linkOnly') {
               var readyDef = new $ws.proto.ParallelDeferred(),
                   self = this;
               readyDef.push(this._fieldReady);
               if (this._useSuggest) {
                  readyDef.push(this._suggestReady);
               }
               readyDef.done();
               readyDef.getResult().addBoth(function(){
                  self._notify('onReady');
               });
            } else {
               this._notify('onReady');
            }
         }
         this._initialValueSetted = true;
      },
      /**
       * Переключает состояние активности элемента управления.
       * Если используется выбор через автодополнение, то установит фокус в поле ввода.
       * Иначе на ссылку для выбора
       * <wiTag group="Управление">
       * @example
       * <pre>
       *    if(!control.isActive())
       *       control.setActive(true);
       * </pre>
       * @param {Boolean} active Активируется контрол или деактивируется
       * @param {Boolean} [shiftKey] Нажата ли клавиша shift.
       * @param {Boolean} [noFocus] Не передавать фокус.
       * @param {$ws.proto.Control} [focusedControl] Контрол, на который ушёл фокус.
       * @param {$ws.proto.Control} [focusedControl] Контрол, на который ушёл фокус.
       */
      setActive: function(active, shiftKey, noFocus, focusedControl){
         $ws.proto.FieldLink.superclass.setActive.apply(this, arguments);
         // Если фокус перешёл на поле ввода, то FieldLink деактивируется и поле ввода деактивировать не надо
         if(this._inputField !== null && this._useSuggest === true && this._inputField !== focusedControl && this._inputVisible){
            this._container.removeClass('ws-has-focus');
            this._inputField.setActive.apply(this._inputField, arguments);
         }
      },
      /**
       *  Обработка клавиатурных нажатий
       *  @param {Event} e
       */
      _keyboardHover:function(e){

         if (!this.isEnabled()) {
            return true;
         }

         if(!e.ctrlKey && !e.altKey && !e.shiftKey){
            if(e.which == $ws._const.key.del){
               this.dropAllLinks();
               return false;
            }
            if(e.which == $ws._const.key.backspace){
               var selRecsLength = this._keyStorage.length;
               if (selRecsLength > 0) {
                  this.dropLink(this._keyStorage[selRecsLength - 1].key, this._keyStorage[selRecsLength - 1].dic);
               }
               return false;
            }
            else if(e.which == $ws._const.key.space){
               if(!this._useSuggest){
                  this.processClick(e);
                  return false;
               }
            }
            else if(e.which == $ws._const.key.esc && this._isDicListOpened){
               this._removeDicList();
               return false;
            } else if(e.which == $ws._const.key.enter){
               if(this._isDicListOpened) {
                  $(document).find('li.' + this.getId() + '.active').click();
                  return false;
               } else {
                  this.processClick(e);
                  return false;
               }
            }
         }
         return true;
      },
      /**
       * <wiTag group="Управление">
       * Открыть справочник для выбора.
       * Эмулирует клик по ссылке поля связи
       * Если используется один справочник, то откроет его, если несколько - покажет меню для выбора справочника.
       * @param {Object} event Событие клика.
       * @example
       * <pre>
       *    fieldLink.subscribe('onKeyPressed', function(event, e){
       *       // по нажатию на пробел на поле связи запустим процесс выбора
       *       if(e.which === $ws._const.key.space)
       *          fieldLink.processClick();
       *    });
       * </pre>
       */
      processClick: function(event){
         var dicNumber = 0;
         if (!this.isEnabled()) {
            return;
         }
         if (this._showAllContainer !== null) {
            this._showAllLinks.click();
         }
         if(this.dictionaries.length > 1){
            if (this._showTwoDictionaries()) {
               dicNumber = parseInt($(event.target).attr('dict'), 10) || 0;
            } else {
               if (!event && this._link) {
                  var offset = this._link.offset();
                  event = {
                     clientX: offset.left,
                     clientY: offset.top
                  };
               }
               this._showDicList(event);
               return;
            }
         }
         this.setCurrentDictionary(dicNumber);
         this._showDictionary(dicNumber);
      },
      /**
       * <wiTag group="Управление">
       * Сменить текст метки поля связи.
       * Изменяет текст ссылки поля связи на указанный.
       * @param {String} title Текст в поле.
       * @param {Number} titleWidth новая ширина заголовка
       * @example
       * <pre>
       *    fieldLink.setTitle("Выберите сотрудника");
       * </pre>
       * @see getTitle
       */
      setTitle : function(title, titleWidth){
         var titlelink,
             fieldLink = this._container.find('.ws-FieldLink__link');
         this._options.title = title;

         if (typeof title === 'string') {
            titlelink = $ws.helpers.escapeHtml(title) + '';
         } else {
            titlelink = $(title);
         }

         if (this._options.imgTitle){
            titlelink = this._addImgTitle();
         }

         //В старом джине расчет ширины ведется автоматически, поэтому приходится выставлять width:auto
         //TODO проверить в web-genie
         if (titleWidth) {
            fieldLink
                  .removeClass('ws-FieldLink__titleWidth')
                  .width(titleWidth);
            this._options.titleWidth = titleWidth;
         } else {
            fieldLink.addClass('ws-FieldLink__titleWidth');
         }

         if(!this._link) {
            if(title) {
               var link = $('<div class="ws-FieldLink__link ' + (this._options.enabled ? '' : 'readonly') + '"></div>');
               if(this._inputField === null) {
                  this._container.append(link);
               } else {
                  this._inputField.getContainer().before(link);
               }
               this._addLink();
            }
         }
         if(this._link)
            this._link.parent().toggleClass('ws-hidden', !titlelink);
         if(title && this._link) {
            this._link.html(titlelink);
         }
         this._onResizeHandler();
      },
     /**
      * Получить текст ссылки.
      * <wiTag group="Отображение">
      * Возвращает текущий текст ссылки поля свзяи
      * @return {String} title текст метки поля связи
      * <pre>
      *    if(fieldLink.getTitle() !== 'Выберите сотрудника')
      *       fieldLink.setTitle('Выберите сотрудника');
      * </pre>
      * @see setTitle
      */
      getTitle : function(){
         return this._link ? this._options.title : '';
      },
      /**
       * <wiTag group="Данные">
       * Изменить текущий справочник.
       * Изменяет текущий справочник на справочник с указанным номером.
       * После этого при установке значения из кода в поле связи будет считаться, что запись как будто бы выбрана из
       * указанного справочника.
       * @param {Number} dic Номер справочника.
       * @example
       * <pre>
       *    fieldLink.setCurrentDictionary(2);
       *    // установим значение, которое будет считаться, что выбрано из справочника с номером 2
       *    fieldLink.setValue(22);
       * </pre>
       */
      setCurrentDictionary: function(dic) {
         this._currentDictionary = dic;
      },
      _createDictionariesMenu: function(){
         var rows = [],
             self = this;
         if (this._link) {
            this._link.mousedown(function(e){
               e.stopPropagation();
               e.preventDefault();
            });
         }
         for(var i= 0, l = this.dictionaries.length; i < l; i++){
            rows.push({
               caption: this.dictionaries[i].name,
               id: self.getId() + '_number_' + i,
               addClass: self.getId(),
               handlers: {
                  onActivated: function(event, element){
                     if (self._dictionarySelector){
                        return false;
                     }
                     self._currentDictionary = parseInt(element.id.split('_number_')[1], 10);
                     self.setCurrentDictionary(self._currentDictionary);
                     self._showDictionary(self._currentDictionary);
                  }
               }
            });
         }
         var instance = new Menu({
            parent: this,
            data: rows,
            handlers: {
               onOpen: function(){
                  self._isDicListOpened = true;
                  if (self._currentDictionary !== false) {
                     $(document).find('li#' + this.getId() + '-' + self.getId() + '_number_' + self._currentDictionary)
                           .addClass(self.getId() + '-dic-list-item-cursor')
                           .css('font-weight', 'bold');
                  } else {
                     $(document).find('li.' + self.getId() + '-dic-list-item-cursor').css('font-weight', 'normal');
                  }
               },
               onClose: function(){
                  self._isDicListOpened = false;
                  if (self._currentDictionary !== false) {
                     $(document).find('li.' + self.getId() + '-dic-list-item-cursor').css('font-weight', 'normal');
                  }
               }
            }
         });
         if(self._dicMenu){
            self._dicMenu.destroy();
         }
         self._dicMenu = instance;
      },
      /**
       * Метод показа списка справочников
       */
      _showDicList: function(event){
         if (this._link) {
            var linkParent = this._link.parent()[0];
            this._dicMenu.show(
               this._container,
               {
                  left: linkParent.offsetLeft,
                  top: linkParent.offsetHeight
               }
            );
         }
      },
      _removeDicList : function(){
         this._dicMenu.show();
      },
      /**
       * Метод показа выбранного словаря
       * @param {Number} number Номер выбранного словаря
       */
      _showDictionary: function(number){
         var self = this,
             isDialog = this._options.selectRecordsMode === 'newDialog',
             dictionaryOpener = isDialog ? DialogSelector : FloatAreaSelector,
             contextData,
             dialogContext = new $ws.proto.Context().setPrevious(self.getLinkedContext()),
             checkedRecords = [],
             attachOptions,
             dictionaryWithSuggest = this._useSuggest && this.getDictionary(number).objectName === this._suggestDictionary.objectName,
             dictionaryRecords = [];
         if (this._dictionarySelector && !isDialog){
            return;
         }

         contextData = this._notify('onBeforeDictionaryOpen');
         //Если вернули false, значит открывать не хотят
         if (contextData === false) {
            return;
         }
         if (contextData !== undefined && (contextData instanceof $ws.proto.Record || contextData.constructor == Object)) {
            dialogContext.setContextData(contextData);
         }
         if (self._options.multiSelect) {
            for (var i = 0; i < this.selectedRecords.length; i++) {
               if (this._keyStorage[i].dic == number || (dictionaryWithSuggest && this._keyStorage[i].dic == 'suggest')) {
                  checkedRecords.push(this._keyStorage[i].key);
                  dictionaryRecords.push(this.selectedRecords[i]);
               }
            }
         } else {
            dictionaryRecords = this.selectedRecords ? this.selectedRecords.slice() : dictionaryRecords ;
         }
         attachOptions = {
            opener: self,
            //В "selectedRecords" передаем именно ВСЕ ЗАПИСИ, т.к. в конечном случае поле удаляет те записи, которые не пришли в
            //качестве результата из dialogSelector'а - см. "Обработка выбранных ранее записей"
            selectedRecords: dictionaryRecords.length ? dictionaryRecords : null,
            //В "currentValue" передается лишь массив с primary key и dictionary number
            currentValue: self._options.multiSelect ? checkedRecords : (this._currentLinkValue ? [this._currentLinkValue] : false),
            template: this.dictionaries[number].template,
            context: dialogContext,
            multiSelect: self._options.multiSelect,
            selectionType: self.dictionaries[number].selectionType || self._options.selectionType,
            selectorFieldLink: true,
            //Если в справочнике указано поле, хранящее ключ записи, то не будем выделять в селекторе записи, ибо ключи не совпадают
            selectCurrentValue: this.dictionaries[number].keyField ? false : true,
            handlers: {
               'onChange' : function(event, selectedRecords){
                  if(!(selectedRecords.length === 1 && selectedRecords[0] === null)){
                     // если пришел массив с null, то значит выбрали записи, которые нельзя было выбирать, не обрабатываем такой выбор
                     var applySelection = self._notify('onBeforeLinkActivated', selectedRecords);
                     if(applySelection !== false){
                        this._runInBatchUpdate('FieldLink.area.onChange', function() {
                           this.close();
                           if (applySelection !== true) {
                              self._valueSelection(selectedRecords);
                           }
                           self._activateControl();
                        });
                     }
                  }
               },
               'onAfterClose': function(){
                  if(self._inputField) {
                     self._inputField.setActive(true);
                  }
                  self._dictionarySelector = undefined;
               }
            }
         };
         if (!isDialog){
            attachOptions.target = self.getContainer();
            attachOptions.isStack = true;
            attachOptions.autoHide = true;
            attachOptions.autoCloseOnHide = true;
            attachOptions.overlay = true;
            attachOptions.parent = null;
            attachOptions.showDelay = 300;
         }
         this._dictionarySelector = new dictionaryOpener(attachOptions);
      },
      _activateControl: function(){
         if (this._options.multiSelect && this._useSuggest) {
            //для iPad не будем эмулировать фокус, он с ним плохо работает
            if(!$ws._const.browser.isMobileSafari){
               this._inputField.getContainer().click();//setActive(true);
            }
         } else {
            //отметим, что у нас уже не видно поле ввода
            this._inputVisible = false;
            this.setActive(true);
         }
      },
      /**
       * Обработка выбора записи в справочнике
       * @param {Array} selectedRecords Выбранные записи
       * @param {Boolean} [fromSuggest] выбрано ли значение через автодополнение
       * @param {Boolean} [notNotify] нужно ли поднимать события об изменении
       */
      _valueSelection : function(selectedRecords, fromSuggest, notNotify){

         //Здесь был код, очищавший ранее выбранную связь (присутствовал до rev 6084 включительно)
         var recKey,
             hierField,
             recordSet;
         if (!this._options.multiSelect && this._options.readLink === true) {
            recKey = this._getRelationKey(selectedRecords[0]);
            //Не сбрасываем и не устанавливаем связь если, она уже установлена. И да тут проверка integer\string
            //А то случаются проблемы с конткстом и settedValue
            if (recKey != this.getValue()) {
               recordSet =  selectedRecords[0].getRecordSet();
               if ($ws.proto.RecordSet && recordSet instanceof $ws.proto.RecordSet) {
                  hierField = recordSet.getHierarchyField();
               }
               this._processActivationById(recKey, fromSuggest, notNotify, hierField);
            }
         } else {
            this._selectionProcessor(selectedRecords, fromSuggest, notNotify);
         }
      },
      /**
       * Извещяем подписантов о приходе фокуса в поле связи
       * @private
       */
      _notifyFocus: function(args) {
         this._notify('onFocusIn', args);
      },
      /**
       * Метод обрабатывает активацию связи по имеющемуся идентификатору
       * Сюда заворачивается setValue(N) и любой выбор из справочника.
       * @param {Number | String} recKey Идентификатор активированной связи.
       * @param {Boolean} [fromSuggest] Выбрана ли запись через автодополнение.
       * @param {Boolean} [notNotify] Нужно ли поднимать событие об изменении.
       * @param {Strijn} [hierarchyField] Поле иерархии
       * @returns {$ws.proto.Deferred}
       */
      _processActivationById: function(recKey, fromSuggest, notNotify, hierarchyField) {
         var self = this,
            dLinkSpec = this._createDLinkSpec(recKey, hierarchyField),
            result;
         if (this._valueDeferred.isReady()) {
            result = new $ws.proto.Deferred();
         } else {
            result = this._valueDeferred;
         }
         result.key = recKey;
         fromSuggest = fromSuggest || this._currentDictionary === 'suggest'; /*Проверить! раньше лежало в другом месте*/
         dLinkSpec.addCallback(function(spec){
            self._linkSpec = spec;
            self._selectionProcessor([spec], fromSuggest, notNotify);
            if(!result.isReady() && result.key === recKey){
               result.callback(spec);
            }
         }).addErrback(function(e){
            self.setCurrentDictionary(false); // Сбрасываем выбранный справочник если не удалось прочитать связь
            $ws.single.ioc.resolve('ILogger').log('Поле связи ' + self.getName(), "Ошибка при загрузке связи: " + e.message);
            self._notify('onLoadError', e);
            result.errback();
            return e;
         });
         this._valueDeferred = result;
         return result;
      },
      /**
       *  Метод, отпиленный от _processActivationById, строит связь.
       * @param recKey
       * @param hierarchyField
       * @return {$ws.proto.Deferred}
       * @private
       */
      _createDLinkSpec: function(recKey, hierarchyField){
         var rec = this._options.isRecordPath ? this._getTargetRecord() : false,
             linkName = this._options.linkName;
         if (rec) { // Если есть запись - обновим ее и активируем прочитанную связь
            return rec.updateLink(recKey, linkName);
         } else {// Елси нет - вычитаем связь и обновим
            var dict = this._getCurrentDictionary();
            return this._loadLinkSpec(linkName, recKey, dict.objectName, dict.formatMethod, dict.readMethodName, hierarchyField);
         }
      },
      /**
       * @param {String} linkName
       * @param {Number} linkValue
       * @param {String} objectName
       * @param {String} [formatMethod]
       * @param {String} [readMethodName]
       * @param {String} [hierarchyField]
       * @returns {$ws.proto.Deferred}
       */
      _loadLinkSpec: function(linkName, linkValue, objectName, formatMethod, readMethodName, hierarchyField) {
         if(objectName) {
            var dotIdx,
                serviceName = '',
                readerParams = {};
            if((dotIdx = objectName.indexOf('.')) !== -1) {
               serviceName = objectName.substr(0, dotIdx);
               objectName = objectName.substr(dotIdx + 1);
            }
            //Старый джинн передает linkedObject.Прочитать, в результате получается вызов linkedObject.Прочитать.Прочитать
            if(readMethodName && (dotIdx = readMethodName.indexOf('.')) !== -1) {
               readMethodName = readMethodName.substr(dotIdx + 1);
            }
            if (!formatMethod || formatMethod === 'null' ) {
               formatMethod = null;
            }
            if(readMethodName){
               readerParams['readMethodName'] = readMethodName;
            }
            if(formatMethod){
               readerParams['format'] = formatMethod;
            }
            // Если тут не проверять - будет Exception - коммент от прошлого изменения
            return $ws.helpers.newRecordSet(
                        objectName,
                        'Список',
                        undefined,
                        undefined,
                        false,
                        $ws.core.getServiceByName(serviceName),
                        hierarchyField,
                        readerParams ).addCallback(function (recordSet){
                return recordSet.readRecord(linkValue, formatMethod).addCallback(function (result){
                    return result;
                });
            });
         }

         var tRec = this._getTargetRecord();
         if (tRec) {
            return tRec.readLink(linkValue, linkName);
         }
         return new $ws.proto.Deferred().errback("No object name and no target record while loading link spec");
      },
      /**
       * Возвращает порядковый номер в массиве selectedRecords элемента с указанными параметрами
       * @param {Number} key - primary key элемента
       * @param {Number} dic - номер словаря с элементом
       */
      _getIndexByKeyAndDictionary: function(key, dic) {
         var useSuggest = this._useSuggest && this.getDictionary(dic).objectName === this._suggestDictionary.objectName,
             dictionaryWithSuggest = -1;
         if (dic === 'suggest' && this._useSuggest) { //ToDo: костыль на поиск записей, выбранных из словаря с автодополнением
            for (var d = 0, dicCount = this.dictionaries.length; d < dicCount; d++) {
               if (this.dictionaries[d].objectName === this._suggestDictionary.objectName) {
                  dictionaryWithSuggest = d;
                  break;
               }
            }
         }
         for (var i = 0, len = this._keyStorage.length; i < len; i++) {
            if (this._keyStorage[i].key == key &&
               (this._keyStorage[i].dic == dic || //Проверки, а не была ли выбрана запись ранее из словаря или автодополнения
                  (useSuggest && this._keyStorage[i].dic == 'suggest') ||
                  (this._useSuggest && this._keyStorage[i].dic == dictionaryWithSuggest))) {
               return i;
            }
         }
         return -1;
      },
      /**
       * Устанавливает внешний вид данных
       * @param {String | Object} visualValues Текст, который должен быть отображён
       * @param {String} key
       * @param {Number} dictionary
       * @param {Number} [drawComma]
       * @param {Number} [isEmptySelection] Выбираем или добираем записи
       */
      _setVisualValue: function(visualValues, key, dictionary, drawComma, isEmptySelection) {
         var visualValue = visualValues.visual ? visualValues.visual : visualValues,
               title = visualValues.title || visualValues.title === '' ? visualValues.title : visualValue;
         isEmptySelection = typeof isEmptySelection === 'boolean' ? isEmptySelection : true;
         if(this._options.renderStyle == 'linkOnly') {
            if (this._link) {
               this._link.text(visualValue || this._options.title);
               this._link[0].title = title;
            }
            if (visualValue && this._options.enabled && !this._options.canNotBeEmpty) {
               this._deleteAllLinks.removeClass('ws-invisible');
            } else if(!this._deleteAllLinks.hasClass('ws-invisible')) {
               this._deleteAllLinks.addClass('ws-invisible');
            }
            this._onResizeHandler();
         } else if(this._inputField) {
            if(visualValue !== null){
               var fieldContainer = this._showAllContainer === null ? this._fieldContainer.find('.ws-field') : this._showAllContainer,
                   input = fieldContainer.find('input'),
                   self = this,
                   activeLink, linkElement,
                   curDicIndex = (dictionary && dictionary !== -1) ? dictionary : (self._currentDictionary || 0),
                   pageUrl = self._generateEditPageURL(key, curDicIndex),
                   linkElementHref = self.getDictionary(curDicIndex).editMode === 'newWindow' && pageUrl !== false ?
                                     pageUrl : 'javascript:void(0)';

               if(!this._options.multiSelect){
                  fieldContainer.attr('title', title);
                  if (this._useSuggest) {
                     this._toggleInputReadOnly(false, this._options.definition ? true : false);
                  }
               } else {
                  if (this._countedWidth && !this._showAllLinks.hasClass('ws-hidden') && this._showAllContainer === null ){
                     //не будем строить и считать ссылки, если уже все рассчитано и строить некуда
                     return;
                  }
               }

               linkElement = $('<div class="ws-FieldLink__active" key="' + key + '" dic="' + curDicIndex + '"/>').append(
                   activeLink = $('<a class="ws-FieldLink__activeLink" key="' + key + '" dic="' + curDicIndex + '" href="'+linkElementHref+'"' +'target="_blank"' + '>' + visualValue + '</a>')
                         .attr('title', title)
               );
               if(!self.getDictionary(curDicIndex).editDialogTemplate) {
                  activeLink.addClass('ws-FieldLink-notLink');
               }
               if (!this._options.multiSelect || this._showAllContainer !== null) {
                  fieldContainer.prepend(linkElement);
               } else {
                  var lastLink = fieldContainer.find('.ws-FieldLink__active:'+ (isEmptySelection ? 'first' : 'last'));
                  if (lastLink.length === 0) {
                     lastLink = self._showAllLinks;
                  }
                  lastLink[isEmptySelection ? 'before' : 'after'](linkElement);
               }
               activeLink.click(this._openRecord.bind(this));
               //просто порезали функцию, а то очень много кода
               //Ставим сереньким не заданное значение
               if (visualValue === 'Значение не задано') {
                  activeLink.addClass('ws-FieldLink__activeLink-noGoodValue');
               }
               if (!this._options.multiSelect && !this._options.definition) {
                  this._toggleInput(false);
               }
               if (this._options.multiSelect && this.selectedRecords.length > 1 && this._options.enabled) {
                  this._deleteAllLinks.removeClass('ws-invisible');
               } else if(this._deleteAllLinks !== null && !this._deleteAllLinks.hasClass('ws-invisible')) {
                  this._deleteAllLinks.addClass('ws-invisible');
               }
               return this._setInputFieldSupport(linkElement, fieldContainer, input, key, drawComma, dictionary)
            }
         } else if(visualValue !== undefined) {
            if (typeof this._options.owner == 'string') {
               this._visualValue = this._options.multiSelect ? arguments : visualValue;
            }
         }
         return -1;
      },
      _openRecord: function(event){
         var self = this,
             fieldContainerOffset = self._fieldContainer.offset(),
             isClosed = true,
             curDicIndex = self._currentDictionary || 0,
             selectedRecordDic,
             selectedRecord,
             $target = $(event.target).closest('[key]'),
             flag;
         if (self._options.multiSelect) {
            var attrDic = parseInt($target.attr('dic'), 10),
                recordDicIdx = isNaN(attrDic) ? 'suggest' : attrDic,
                key = $target.attr('key');
            selectedRecordDic = self.getDictionary(recordDicIdx);
            selectedRecord = self.selectedRecords[self._getIndexByKeyAndDictionary(key, recordDicIdx)];
         } else {
            selectedRecordDic = self.getDictionary(curDicIndex);
            selectedRecord = self.selectedRecords[0];
         }
         //Если не указан шаблон редактирования, то не блочим клики - никак не отследить закрытие пользовательского диалога.
         if(self._blockEdit === true && (selectedRecordDic && selectedRecordDic.editDialogTemplate)) {
            self._blockEdit = false;
            return false;
         }
         self._blockEdit = true;
         flag = self._notify('onLinkSelected', selectedRecord, selectedRecordDic);
         if (selectedRecordDic && selectedRecordDic.editMode !== undefined && selectedRecordDic.editMode !== 'newWindow'){
            //вызвать диалог редактирования под полем связи через attachInstance
            if (flag !== false && selectedRecordDic.editDialogTemplate){
               if (selectedRecordDic.editMode !=='newFloatArea') {
                  $ws.helpers.toggleIndicator(true);
               }
               (function(){
                  var eventResult = self._notify('onBeforeShowRecord', selectedRecord);
                  if (eventResult instanceof $ws.proto.Deferred) {
                     return eventResult;
                  } else if (eventResult !== false) {
                     return new $ws.proto.Deferred().callback(eventResult instanceof $ws.proto.Record ? eventResult : selectedRecord);
                  } else {
                     return new $ws.proto.Deferred().errback();
                  }
               })().addCallback(function(record){
                  var attachOptions = {
                     opener: self,
                     template: typeof(flag) == 'string' ? flag : selectedRecordDic.editDialogTemplate,
                     record: record instanceof $ws.proto.Record ? record : selectedRecord,
                     top: fieldContainerOffset.top + self._fieldContainer.height() + 'px',
                     left: fieldContainerOffset.left + 'px',
                     enable : self.isEnabled(),
                     //TODO: временное решение, в 3.6.3.10 поддержать два режима поля связи
                     readOnly: selectedRecordDic.readOnly || !self.isEnabled(),
                     handlers: {
                        'onBeforeShow' : function(){
                           self._attachedEditor = this;
                           if (self._showAllContainer !== null){
                              self._showAllContainer.css({display:'none'});
                           }
                           if (selectedRecordDic.editMode !=='newFloatArea') {
                              this._window.position({my: 'left top', at: 'left bottom',
                                                     of: self._container.find('.ws-field')});
                           }
                        },
                        'onAfterClose': function(){
                           isClosed = true;
                           self._blockEdit = false;
                           self._attachedEditor = undefined;
                           if (self._showAllContainer !== null){
                              self._showAllContainer.css({display:''});
                           }
                        }
                     }
                  },
                  attachOnDestroy = false,
                  attach = selectedRecordDic.editMode ==='newFloatArea' ? 'RecordFloatArea' : 'DialogRecord';
                  if (attach === 'RecordFloatArea'){
                     if (self._attachedEditor){

                        var onDestroy = function(){
                           $ws.core.attachInstance('SBIS3.CORE.' + (attach !== undefined ? attach : 'DialogRecord'), attachOptions);
                        };

                        if (self._attachedEditor.getTemplateName() !== attachOptions.template){
                           if (self._attachedEditor.getRecord().isChanged()){
                              attachOnDestroy = true;
                              self._attachedEditor.subscribe('onDestroy', onDestroy);
                           }
                           self._attachedEditor.hide();
                        }
                        else{
                           self._attachedEditor.setRecord(record);
                           return;
                        }
                     }
                     isClosed = false;
                     attachOptions.catchScroll = false;
                     attachOptions.target = self._fieldContainer;
                     attachOptions.isStack = true;
                     attachOptions.overlay = true;
                     attachOptions.autoHide = false;
                     attachOptions.autoCloseOnHide = true;
                     attachOptions.context = new $ws.proto.Context().setPrevious(self.getLinkedContext());
                  }
                  if (!attachOnDestroy) {
                     $ws.core.attachInstance('SBIS3.CORE.' + attach, attachOptions)
                        .addCallback(function(result){
                           result.subscribe('onRecordUpdate',function(resultUpdate,recordId){
                              self._createDLinkSpec(self._getRelationKey(selectedRecord, selectedRecordDic.keyField))
                                 .addCallback(function (record){
                                    var dic = parseInt($(this).attr('dic'), 10) || 'suggest',
                                        key = parseInt($(this).attr('key'), 10);
                                    if ((self._showAllContainer !==null) || (self._showAllContainer === null && !self._options.multiSelect)) {
                                       /*Просто пересчитываем название ссылки в контейнере
                                        * или для немножественного выбора*/
                                       var link;
                                       if (self._showAllContainer !==null) {
                                          link = self._showAllContainer.find(('[dic = "' + dic + '"][key="' + key + '"] a"'))[0];
                                       } else {
                                          link = self._fieldContainer.find('.ws-FieldLink__activeLink')[0];
                                       }
                                       var selectionResult = self._prepareSelectionResult(record, curDicIndex),
                                           deleteContainer = self._fieldContainer.find('.ws-FieldLink__deleteContainer');
                                       $(link).text(selectionResult.visual)
                                             .attr('title', selectionResult.title || selectionResult.visual);
                                       $(link.offsetParent).css('width', $(link).width() +
                                          (self.isEnabled() && deleteContainer.css('position') != 'absolute' ? ICON_WIDTH : 0) +
                                          (self._options.multiSelect ? COMMA_WIDTH : 0));
                                       if (self._showAllContainer !==null) {
                                          self._refreshLinksList();
                                       }
                                    }
                                    else{
                                       /* При мультивыборе удаляем все ссылки и заново отрисовываем*/
                                       self._fieldContainer.find('.ws-FieldLink__active').remove();
                                       self._refreshLinksList();
                                    }
                                    self.selectedRecords[self._getIndexByKeyAndDictionary(key, dic)] = record;
                                    if(!self._options.multiSelect){
                                       var target = self._getTargetContext();
                                       target.insert(record, self._options.isRecordPath === true ? null : self._options.linkName);
                                    }
                                 });
                           });
                        }).addBoth(function(){
                           if (selectedRecordDic.editMode !=='newFloatArea') {
                              $ws.helpers.toggleIndicator(false);
                           }
                        });
                     }
                  }).addErrback(function(){
                     if (selectedRecordDic.editMode !=='newFloatArea') {
                        $ws.helpers.toggleIndicator(false);
                     }
                  });

            }
            else {
               self._blockEdit = false;
            }
            event.stopPropagation();
            event.preventDefault();
            return false;
         }
         //Отменить дефолтное действие FF (чтобы пустая вкладка не открывалась)
         return false;
      },
      _setLinkElement:function(linkElement, fieldContainer, index, drawComma, dictionary, useContainerWidth){
         this._createDropButton(index, fieldContainer, useContainerWidth, dictionary, linkElement);
         if (this._options.multiSelect && drawComma) {
            linkElement.append($('<span class="ws-FieldLink__comma">&sbquo;</span>'));
         }
         return this._showAllContainer !== null ? linkElement.width() : -1;
      },
      _setInputFieldSupport: function(linkElement, fieldContainer, input, index, drawComma, dictionary){
         var activeLink = linkElement.find('.ws-FieldLink__activeLink'),
             activeLinkWidth,
             fieldContainerWidth,
             useContainerWidth,
             minor = this._options.definition ? MIN_INPUT_WIDTH : 0;
         if (this._showAllContainer === null && this._options.multiSelect ) {

            fieldContainerWidth = fieldContainer.width();
            if (fieldContainerWidth <= 0) {
               //Чтобы отработал onResizeHandler - в данный момент поле связи еще не видно
               this._fieldContainerWidth = -1;
               return;
            }

            var collection = fieldContainer.find('.ws-FieldLink__active'),
            // 1 - мифическая величина. Нужна в случае, если поле связи находится в теге td,
            // у которого ширина не фиксированое значение (округляется в большую сторону)
            // иначе input уезжает под ссылку
                  inputPadding = input.innerWidth() - input.width() + 1,
                  availableWidth = fieldContainerWidth - ( this._useSuggest && this.isEnabled() ? MIN_INPUT_WIDTH : 0 ) - ICON_WIDTH,
                  l = collection.length,
                  lastVisibleElementNumber,
                  width = 0,
                  i, tooltip;
            activeLinkWidth = activeLink.width();
            useContainerWidth = fieldContainerWidth > 0 && fieldContainerWidth <= activeLinkWidth && !this._options.multiSelect;
            this._setLinkElement(linkElement, fieldContainer, index, drawComma, dictionary, useContainerWidth);
            for(i = (l - 1); i >= 0; i--){
               width += collection[i].clientWidth;
               //Если ширина ссылки больше чем доступная, то в будущем установим ссылке доступную ширину
               if (width > availableWidth) {
                  lastVisibleElementNumber = i;
                  break;
               }
            }
            if (this.selectedRecords.length > 1 || lastVisibleElementNumber === undefined ) {
               if(lastVisibleElementNumber !== undefined){
                  for(i = lastVisibleElementNumber; i >= 0; i--){
                     if (i === lastVisibleElementNumber) {
                        width -= collection[i].clientWidth;
                     }
                     $(collection[i]).remove();
                  }
                  this._showAllLinks.removeClass('ws-hidden');
                  this._fieldContainer.find('.ws-field').prepend(this._showAllLinks);
                  collection.last().find('span.ws-FieldLink__comma').remove();
                  this._countedWidth = true;
               }
               if (!this._showAllLinks.hasClass('ws-hidden')) {
                  width += (this._options.enabled ? 1 : -1) * ICON_WIDTH;
               }
               input.width(fieldContainerWidth - width - inputPadding);
               this._container.removeClass('ws-FieldLink__oneValue');
            } else {
               this._container.addClass('ws-FieldLink__oneValue');
               if (this._useSuggest) {
                  //Доступную ширину уменьшаем на ширину иконки удаления (она уже учтитывается в padding-right)
                  $(collection[0]).width(availableWidth - ICON_WIDTH);
                  input.width(MIN_INPUT_WIDTH);
               } else{
                  $(collection[0]).width(availableWidth);
                  this._toggleInput(false);
               }
            }
            tooltip = this._fieldContainer.find('.ws-tooltip-container');
            if (tooltip.length) {
               tooltip.css('left', input.position().left);
            }
         } else if (this._options.definition && this._useSuggest){
            //TODO может быть и тут можно обойтись без перерассчета ширины?
            fieldContainerWidth = fieldContainer.width();
            if (fieldContainerWidth <= 0) {
               //Чтобы отработал onResizeHandler - в данный момент поле связи еще не видно, но продолжаем работать, чтобы добавился крестик
               this._fieldContainerWidth = -1;
            }
            activeLinkWidth = activeLink.width();
            width = fieldContainerWidth - MINOR_DEFINITION -  activeLinkWidth;
            input.width(width >= MIN_INPUT_WIDTH ? width : MIN_INPUT_WIDTH );//MIN_INPUT_WIDTH
            return this._setLinkElement(linkElement, fieldContainer, index, drawComma, dictionary, false);
         } else {
            return this._setLinkElement(linkElement, fieldContainer, index, drawComma, dictionary, false);
         }
         return -1;
      },
      _getCurrentDictionary: function() {
         var dictNum;
         if(this._currentDictionary === false) {
            this.setCurrentDictionary(dictNum = 0);
            if (this.dictionaries.length != 1) {
               $ws.single.ioc.resolve('ILogger').log('Поле связи ' + this.getName(), "Установка значения в поле связи с несколькими справочниками. Справочник не указан. Взят первый из списка.");
            }
         } else {
            dictNum = this._currentDictionary;
         }
         return dictNum == 'suggest' ? this._suggestDictionary : this.dictionaries[dictNum];
      },
      _getRelationKey: function(record, dictionary) {
         var keyField = '';
         dictionary = dictionary || this._getCurrentDictionary();
         if (dictionary !== undefined && dictionary.keyField) {
            keyField = dictionary.keyField;
         }
         if (keyField && record.hasColumn(keyField)) {
            return record.get(keyField);
         } else {
            return record.getKey();
         }
      },
      /**
       * Обрабатывает выбранную запись
       * @param {$ws.proto.Record} record Запись
       * @param {Boolean} [dictionary]
       * @return {Object} Объект, содержащий value (чаще всего - ключ выбранной записи) и visual (значение, которое
       * должно быть выведено в поле свзяи)
       */
      _prepareSelectionResult: function(record, dictionary) {
         var sRes = {
            value: undefined,
            visual: undefined,
            title: undefined
         };
         var visualizeResult = this._notify('onVisualizeLink', record);
         sRes.value = this._getRelationKey(record, dictionary);
         if (this._options.linkedDisplayField) {
            if (typeof visualizeResult === 'string') {
               sRes.visual = sRes.title = sRes.visual = visualizeResult.replace(/&quot;/g, '"');
            } else {
               if (!visualizeResult) {
                  var visual = $ws.helpers.escapeHtml(record.get(this._getLinkedRecordFieldName()));
                  if(typeof visual === 'string'){
                     visual = visual.replace(/&quot;/g, '"');
                  }
                  sRes.visual = sRes.title = visual;
               } else{
                  sRes.visual = visualizeResult.value ? visualizeResult.value :
                        $ws.helpers.escapeHtml(record.get(this._getLinkedRecordFieldName()));
                  sRes.title = visualizeResult.title !== undefined ? visualizeResult.title : sRes.visual;
               }
            }
            sRes.visual = (sRes.visual !== null) ? $ws.helpers.escapeTagsFromStr(sRes.visual + '', ['script']) : null;
            sRes.title = $ws.helpers.escapeTagsFromStr(sRes.title, []);
         }
         if (!sRes.visual) {
            sRes.visual = 'Значение не задано';
         }
         return sRes;
      },
      _getLinkedRecordFieldName: function() {
         if (this._options.linkedDisplayField === '') {
            var linkName = this._options.linkName;
            return this._options.owner.indexOf(linkName) === 0 ? this._options.owner.substr(linkName.length + 1) : false;
         } else {
            return this._options.linkedDisplayField;
         }
      },
      _getTargetRecord:function () {
         var mCtx = this.getLinkedContext(),
             origin,
             record = (mCtx && (origin = mCtx.getFieldOrigin(this._options.linkName, true)) && origin.getRecord());
         if (record && record.hasColumn(this.getName()) && record.getRecordSet() !== null) {
            return record;
         } else {
            return false;
         }
      },
      _getTargetContext: function() {
         var mCtx = this.getLinkedContext();
         return (mCtx && mCtx.getFieldOrigin(this._options.linkName, true)) || mCtx;
      },

      _onSizeChangedBatch: function() {
         this._onResizeHandler();
         return true;
      },
      /**
       * Установить новое значение
       * <wiTag group="Данные">
       * Устанавливает новое значение в поле связи
       * Если отдали ключ, то вычитает связанную запись,
       * Если отдали массив ключей, то вычитает все связанные записи с указанными ключами
       * Если передали false, то сбросит все выбранные связи
       * Если передали true будет считать что связь как будто установили
       * Если передали запись, то вычитает или установит как есть в зависимости от необходимости перечитывать связь
       * Если передали массив записей, то установит их так, как передали, ничего не перечитывая
       * Возвращает {$ws.proto.Deferred}, который завершится успехом после вычитывания и установки связанной записи
       * @param {Number | $ws.proto.Record | Boolean | Array} value Новое значение
       * @returns {$ws.proto.Deferred}
       * @example
       * <pre>
       *    fieldLink.setValue([125, 129, 133]);
       * </pre>
       */
      _setValue: createBatchUpdateWrapperNoWaitDeferred('FieldLink._setValue', function(value){
         var self = this;
         /**
          * undefined, null, false - просто сбросит связь
          */
         this._selection = [];
         this._notifyOnSizeChanged(this, this, true);

         if (!(!!value)) {
            this.setCurrentDictionary(false); // Сбрасываем выбранный справочник всегда, даже если ничего не выбрано
            this.dropAllLinks(false, true);
            this._notifyReady();
            return new $ws.proto.Deferred().callback(null);
         }
         /**
          * value == Запись -- считаем что выбрали ее из справочника
          * Заворачиваем на выбор через setValue(key)
          */
         else if(value && typeof(value) === 'object' && 'get' in value && 'hasColumn' in value) {
            if (!this._options.multiSelect && !this._options.readLink) {
               this._valueSelection([value], undefined, true);
               return new $ws.proto.Deferred().callback(value);
            } else {
               return this.setValue(this._getRelationKey(value));
            }
         }
         /**
          * value == true -- связь какбы выбрана
          * Это может быть нужно для эмуляции заполненности для прохождения валидации
          * Это потенциальный придрот
          */
         else if(value === true) {
            this._createDropButton();
            this.selectedRecords = this._currentLinkValue = true;
            return new $ws.proto.Deferred().callback(true);
         }
         /**
          * Значение - массив
          * Имитируем мультивыбор из справочника
          * Но только если мульти-выбор разрешен
          * И передали массив Record'ов
          */
         else if(value instanceof Array) {
            if(this._options.multiSelect && value.length > 0 ) {
               if (value[0] instanceof $ws.proto.Record){
                  this._valueSelection(value, undefined, true);
                  return new $ws.proto.Deferred().callback(value);
               }
               else{
                  var dMultiResult = new $ws.proto.ParallelDeferred({stopOnFirstError: false}),
                     records = [],
                     result = new $ws.proto.Deferred();
                  for (var i = 0, j = value.length; i < j; i++ ){
                     dMultiResult.push(self._createDLinkSpec(value[i]).addCallback(function(result){
                        records.push(result);
                     }).addErrback(function(e){
                           $ws.single.ioc.resolve('ILogger').log('Поле связи ' + self.getName(), "Ошибка при загрузке связи: " + e.message);
                           self._notify('onLoadError', e);
                        })
                     );
                  }
                  dMultiResult.done().getResult().addCallback(function(){
                     self._valueSelection(records, undefined, true);
                     if(!result.isReady()){
                        result.callback(records);
                     }
                  });
                  if(!this._valueDeferred.isReady()){
                     this._valueDeferred.callback();
                  }
                  this._valueDeferred = result;
                  return result;
               }
            } else if(value.length > 0) {
               value = value[0];
            }
         }
         /**
          * Здесь только число или строка...
          */
         if(typeof value === 'number' || typeof value === 'string') {
            return this._processActivationById(value, undefined, true);
         }
         $ws.single.ioc.resolve('ILogger').log('FieldLink', "Don't know how to handle such value: " + value);
         return new $ws.proto.Deferred().errback();
      }),
      /**
       * <wiTag group="Данные">
       * Устанавливает значение в поле связи
       * @param {Number | $ws.proto.Record | Boolean | Array} value Новое значение.
       * @returns {$ws.proto.Deferred}
       * @function
       */
      setValue: createBatchUpdateWrapperNoWaitDeferred('FieldLink.setValue', function(value){
         return this._setValue(value).addCallback(function(){
            this._notifyReady();
         }.bind(this));
      }),

      _doDropLink: function(key, dictionary, ind) {
         /**
          * Не даем сбрасывать связь если
          *  - поле не может быть пустым
          *  - поле задизаблено
          *  - нет выбранных записей
          */
         var linkedContext = this._getTargetContext();

         this.selectedRecords.splice(ind, 1);
         this._keyStorage.splice(ind, 1);
         this._selection.splice(ind, 1);
         this._countedWidth = false;
         // deelete приводит к ненужным undefined из-за этого количество selectedRecords считается неправильно. Обновляем
         // Возможно уже не нужны многочисленные проверки на undefined, но пока пусть будут
         //TODO порефакторить работу selectedRecords
         this.selectedRecords = this.getSelectedRecords();
         this._refreshLinkValue();
         linkedContext.setValue(this._options.linkName, this._currentLinkValue);
         // здесь был код, который вичищал что-то из контекста при обрыве связи в прежиме мультивыбора
         // (присутствовал до rev 6084 включительно)
         // зачем он тут - не ясно, потому что в контекст при мультивыборе ничего не пишется кроме выбранных идентификаторов
         for(var i = 0; i < this._selection.length; ++i){
            if(this._selection[i].value == key){
               this._selection.splice(i, 1);
            }
         }

         this._notify('onChange', this.getSelectedRecords());
         this._notify('onLinkRemove');
         this._notifyOnValueChange([this.getSelectedRecords(), this.getValue()]);
         this.setCurrentDictionary(false);

         if (this._options.renderStyle != 'linkOnly') {
            // TODO ПЕРЕДЕЛАТЬ! Поле связи не должно работать без готовности строки
            if(this._inputField) {
               this._inputField.setValue(null); // Обрабатываем если вдруг у нас гениальные пользователи поставили значение сами руками
               this._toggleInputReadOnly(this._useSuggest);
            }
            if (this._showAllContainer === null) {
               this._container.find('.ws-FieldLink__active').remove();
               this._countedWidth = false;
            } else {
               this._showAllContainer.find('.ws-FieldLink__active[dic="' + dictionary + '"][key="' + key + '"]').remove();
            }
            if (this._options.multiSelect) {
               this._refreshLinksList();
            } else {
               this._refreshInputWidth(false, true);
               this._inputField.setActive(true);
            }
         }
      },

      /**
       * Разорвать связь
       * <wiTag group="Управление">
       * Удаляет запись с указанным ключом (key), выбранную из указанного справочника (dictionary) из списка выбранных записей.
       * @example
       * <pre>
       *    fieldLink.dropLink(123, 1);
       * </pre>
       * Все параметры не обязательные, так как для случая без множественного выбора и с одним справочником, можно вызвать метод без параметров
       * <pre>
       *    fieldLink.dropLink();
       * </pre>
       * @param {Number} [key] Ключ удаляемой записи
       * @param {Number} [dictionary] Номер справочника из которого удаляем
       */
      dropLink: function(key, dictionary){
         if (this._options.renderStyle == 'linkOnly' || !this._options.multiSelect || this.getSelectedRecords().length == 1 ||
               arguments.length === 0) {
            this.dropAllLinks();
            return;
         }
         var canIDropIt,
            ind = this._getIndexByKeyAndDictionary(key, dictionary),
            self = this;
         if (key === undefined || dictionary === undefined) {
            return;
         }
         canIDropIt = this._notify('onBeforeLinkRemove', this.selectedRecords[ind]);
         if (canIDropIt === false) {
            return;
         } else if (canIDropIt instanceof $ws.proto.Deferred) {
            canIDropIt.addCallback(function(res) {
               if (res !== false) {
                  self._doDropLink.apply(self, [key, dictionary, ind]);
               }
            });
         } else {
            self._doDropLink.apply(self, [key, dictionary, ind]);
         }
      },
      _refreshLinkValue: function(){
         this._currentLinkValue = [];
         for(var i = 0, l = this.selectedRecords.length; i < l; i++){
            if (this.selectedRecords[i] !== undefined) {
               this._currentLinkValue.push(this._getRelationKey(this.selectedRecords[i], this.dictionaries[this._keyStorage[i].dic]));
            }
         }
      },
      _refreshLinksList: function(){
         if (this._showAllContainer === null) {
            this._refreshLinksShotList();
         } else if(!this.selectedRecords || this.selectedRecords.length === 0) {
            this._showLinksList();
         }
      },
      /**
       * Прервать перечитывание связи
       * <wiTag group="Управление" noShow>
       */
      abort: function(){
         if(!this._valueDeferred.isReady()){
            this._valueDeferred.errback();
         }
         //TODO Найти как использовался рекордсет или просто удалить этот кусок
/*         if(this._recordSet instanceof $ws.proto.RecordSet ){
            this._recordSet.abort();
            this._recordSet = null;
         }*/
      },
      _doDropAllLinks: function(onChangeFromContext, notNotify) {
         var linkedContext = this._getTargetContext(),
            valueFromContext = onChangeFromContext === true ? linkedContext.getValue(this._options.linkName) : null;
         this._currentLinkValue = null;
         this._countedWidth = false;
         if (this._options.definition) {
            linkedContext.setValue(this._options.definition, null);
         }
         if (!valueFromContext) { // если по факту связь не сбрасывается (из контекста пришло другое честное значение), то сбрасывать значение в контексте не нужно
            linkedContext.setValue(this._options.linkName, null, undefined, onChangeFromContext === true);
         }
         if (!this._options.multiSelect && this._linkSpec) {
            linkedContext.remove(this._linkSpec, this._options.isRecordPath === true ? null : this._options.linkName);
         }
         this.selectedRecords = false;
         this._keyStorage = [];
         this._selection = [];
         if (onChangeFromContext !== true) {
            if (notNotify !== true) {
               this._notify('onChange', null);
            }
            this._notify('onLinkRemove');
         }
         var val = this.getValue();
         if (!val) {
            this._notifyOnValueChange([null, val]);
         }
         this.setCurrentDictionary(false);

         if (this._deleteAllLinks !== null) {
            this._deleteAllLinks.addClass('ws-invisible');
         }
         if(this._options.renderStyle == 'linkOnly'){
            if (this._link) {
               if (this._options.imgTitle) {
                  this._link.html(this._addImgTitle());
               } else {
                  this._container.find('.ws-FieldLink__link').css('width',''); // сбрасываем ширину
                  this._link.text(this._options.title);
               }
               // Меняем title
               this._link.attr('title', this._options.tooltip  ?  this._options.tooltip : '');
            }
         } else {
            // TODO переименовать класс более понятно
            this._container.find('.ws-FieldLink__active').remove();
            // TODO ПЕРЕДЕЛАТЬ! Поле связи не должно работать без готовности строки
            if(this._inputField){
               if (!valueFromContext) {
                  this._inputField.setValue(null); // Обрабатываем если вдруг у нас гениальные пользователи поставили значение сами руками
               }
               this._toggleInputReadOnly(this._useSuggest);
            }
            if (this._options.multiSelect) {
               this._refreshLinksList();
            } else {
               this._refreshInputWidth(false, true);
               this._fieldContainer.find('.ws-field').attr('title', '');
            }
         }
         if (this._useSuggest) {
            this._toggleInput(!this._inputField.isReadOnly());
            this._suggest.forceClearValue();
         }
      },
      /**
       * <wiTag group="Данные">
       * Разрвать все выбранные связи.
       * Все параметры являются необязательными и используются в основном внутри поля связи.
       * @param {Boolean} [onChangeFromContext] Очистка поля связи, когда из контекста пришло другое значение.
       * @param {Boolean} [notNotify] Нужно ли поднимать события об изменении.
       * @example
       * <pre>
       *    fieldLink.dropAllLinks();
       * </pre>
       */
      dropAllLinks: function(onChangeFromContext, notNotify){
         var canIDropIt = onChangeFromContext ? true : (!notNotify ? this._notify('onBeforeLinkRemove', this.selectedRecords) : undefined),
             self = this;
         this.abort();
         if (!onChangeFromContext && (canIDropIt === false || this.selectedRecords === false || this.selectedRecords.length === 0)) {
            return;
         }
         if (canIDropIt instanceof $ws.proto.Deferred) {
            canIDropIt.addCallback(function(res) {
               if (res !== false) {
                  self._doDropAllLinks.apply(self, [onChangeFromContext, notNotify]);
               }
            });
         } else {
            self._doDropAllLinks.apply(self, [onChangeFromContext, notNotify]);
         }
      },
      /**
       * <wiTag group="Данные">
       * Получить массив выбранных связанных записей.
       * @return {Array} Массив выбранных записей.
       * @example
       * <pre>
       *    if(fieldLink.getSelectedRecords().length === 0)
       *       $ws.core.alert("Внимание! Не выбрано ни одного сотрудника!");
       * </pre>
       */
      getSelectedRecords : function(){
         var records = [];
         for(var i = 0, l = this.selectedRecords.length; i < l; i ++){
            if (this.selectedRecords[i] !== undefined) {
               records.push(this.selectedRecords[i]);
            }
         }
         return records;
      },
      /**
       * Метод создания кнопки для разрыва связи
       */
      _createDropButton: function(index, container, useContainerWidth, dictionary, link) {
         var self = this,
             deleteContainer,
             usedDictionary = dictionary !== undefined ? dictionary : this._currentDictionary;

         if (container === undefined) {
            container = this._fieldContainer.find('.ws-field');
         }
         var linkElement = link ? link : container.find('.ws-FieldLink__active[dic="' + usedDictionary + '"][key="' + index + '"]');
            linkElement.append( deleteContainer = $('<span class="ws-FieldLink__deleteContainer ' + (this.isEnabled() ? 'ws-hidden' : '') + ' " title="отменить выбор записи"/>') );
         deleteContainer.toggleClass('ws-position-absolute', this._options.linkTextAlign==='right' || (!this._options.multiSelect && linkElement.width() > container.width() || useContainerWidth));
         deleteContainer.toggleClass('ws-hidden', !self._options.enabled);
         deleteContainer.click(function(event){
            event.stopImmediatePropagation();
            self.dropLink($(this).closest('.ws-FieldLink__active').attr('key'), $(this).closest('.ws-FieldLink__active').attr('dic'));
            self._notify('onAfterDelete');
            self.setActive(true);
            return false;
         });
         deleteContainer.append($('<div class="ws-FieldLink__delete"></div>'));
      },
      /**
       * @return {Boolean}
       * @protected
       */
      _canValidate: function() {
         return $ws.proto.FieldLink.superclass._canValidate.apply(this, arguments) || this._options.canNotBeEmpty;
      },
      /**
       * метод валидации
       */
      _invokeValidation: function() {
         var parentResult = $ws.proto.FieldLink.superclass._invokeValidation.apply(this, arguments);
         if (this._options.canNotBeEmpty && !this.selectedRecords) {
            parentResult.result = false;
            parentResult.errors.push('Поле не может быть пустым');
         }
         return parentResult;
      },
      /**
       * <wiTag group="Данные">
       * Получить массив ключей выбранных связанных записей.
       * @returns {String | Array} Массив ключей выбранных связанных записей.
       * @example
       * <pre>
       *    if(fieldLink.getValue().length === 0)
       *       $ws.core.alert("Внимание! Не выбрано ни одного сотрудника!");
       * </pre>
       * @see getValueDeferred
       */
      getValue: function() {
         return this.getLinkedContext().getValue(this._options.linkName);
      },
      /**
       * <wiTag group="Данные">
       * Получить описание словаря по заданному номеру
       * @param {Number | String} number Номер словаря.
       * @returns {Object} Описание словаря.
       * @example
       * <pre>
       *    var dictionary = fieldLink.getDictionary(1);
       *    if(dictionary.name === 'Организация')
       *       fieldLink.setCanBeEmpty(false);
       * </pre>
       */
      getDictionary: function(number){
         if (number == 'suggest') {
            return {
               objectName: this._options.suggestSettings.dataSource.readerParams.linkedObject,
               name: 'suggest',
               formatMethod: this._options.suggestSettings.formatMethod,
               editDialogTemplate: this._options.suggestSettings.editDialogTemplate,
               editMode: this._options.suggestSettings.editMode,
               keyField: this._options.suggestSettings.keyField,
               readOnly: this._options.suggestSettings.readOnly,
               readMethodName: this._options.suggestSettings.readMethodName
            };
         } else {
            return this.dictionaries[number];
         }
      },
      /**
       * Установить набор словарей
       * <wiTag group="Управление">
       * Удаляет свои словари и устанавливает набор пользовательских словарей. При этом, если были выбраны записи -
       * связи уничтожаются (ибо список словарей мог полностью измениться).
       * @example
       * <pre>
       *    fieldLink.setDictionaries(dictionariesArray);
       * </pre>
       * @param {Array} dictionaries - массив словарей.
       * @see addDictionary
       */
      setDictionaries: function(dictionaries){
         if (dictionaries && dictionaries instanceof Array && dictionaries.length) {
            this.dictionaries = [];
            if (this.getSelectedRecords().length) {
               this.dropAllLinks();
            }
            var dic = dictionaries;
            for(var i =0, l = dic.length; i < l; i++){
               if (dic[i].name && dic[i].template) {
                  this.dictionaries.push(dic[i]);
               }
            }
            if (this.dictionaries.length > 1 && this._link) {
               this._createDictionariesMenu();
            } else {
               if (this._dicMenu) {
                  this._dicMenu.destroy();
               }
            }
         }
      },
      /**
       * Если передать true, то при установке 2х словарей\справочников Поле связи будет отображаться
       * как Словарь 1 / Словарь 2
       * Если передать false, то для выбора из справочника будет создано меню
       * @param show
       */
      setShowTwoDictionaries: function(show) {
         this._options.showTwoDictionaries = !!show;
      },
      /**
       * Получить текущее положение опции  showTwoDictionaries
       * @returns {boolean}
       */
      getShowTwoDictionaries: function(){
         return this._options.showTwoDictionaries;
      },
      /**
       * Добавить словарь в набор.
       * <wiTag group="Управление">
       * @example
       * <pre>
       *    fieldLink.addDictionary(dictionary);
       * </pre>
       * @param {Object} dictionary - словарь по описанию из опции {@link dictionaries}
       * @returns {Boolean}  - был ли добавлен словарь
       */
      addDictionary: function(dictionary){
         var dicts;
         if (dictionary && dictionary.name && dictionary.template ) {
            dicts = this.dictionaries;
            for (var i = 0, len = this.dictionaries.length; i < len; i++){
               if (dicts[i].name === dictionary.name){
                  return false;
               }
            }
            this.dictionaries.push(dictionary);
            if (this.dictionaries.length > 1) {
               this._createDictionariesMenu();
            }
         }
         return true;
      },
      /**
       * Установить поле контекста для описания записи. Актуально только для единичного выбора
       * @param {String} definition
       */
      setDefinition: function(definition){
         this._options.definition = definition;
         if (this._useSuggest && !this._options.multiSelect) {
            this._suggest.setDefinition(this._options.definition);
         }
      },
      /**
       * Получить поле контекста для описания записи. Актуально только для единичного выбора
       * @param {String} definition
       */
      getDefinition: function(){
         return this._options.definition;
      },
      /**
       * Снять отметку об ошибке.
       * <wiTag group="Отображение">
       * Снимает с контрола маркировку ошибочного ввода.
       * @example
       * <pre>
       *    if(this.getValue() !== null)
       *       this.clearMark();
       * </pre>
       */
      clearMark : function(){
         if (this._inputField) {
            this._inputField.clearMark();
         } else if(this._deleteAllLinks instanceof Object && 'jquery' in this._deleteAllLinks) {
            this._deleteAllLinks.removeClass('ws-hidden');
         }
         $ws.proto.FieldLink.superclass.clearMark.apply(this, arguments);
      },
      /**
       * <wiTag group="Управление">
       * Получить описание словаря, из которого была выбрана последняя запись.
       * @returns {Object} Описание словаря.
       * @example
       * <pre>
       *    var dictionary = fieldLink.getSelectedRecordDictionary();
       *    if(dictionary.name === 'Организация')
       *       fieldLink.setCanBeEmpty(false);
       * </pre>
       */
      getSelectedRecordDictionary: function(){
         return (this._currentDictionary === false) ? undefined : this.dictionaries[this._currentDictionary];
      },
      _saveHistory: function(){
         if (this._history) {
            return $ws.single.UserConfig.setParam(this.getClosestArea().getName() + '-' + this.getName(),
                  $ws.helpers.serializeURLData(this._history.slice(0, 10)));
         } else {
            return new $ws.proto.Deferred().callback();
         }
      },
	   /**
	    * @deprecated Будет удален полностью в 3.7, используйте {@link $ws.single.FieldLink#setRequired}
	    * Изменяет статус признака поля связи "не может быть пустым" на указанный
	    * После проводит валидацию для соответствия текущему состоянию
	    * @param {Boolean} canBeEmpty Может ли поле быть пустым
	    * @example
       * <pre>
       *    fieldLink.setCanBeEmpty(false);
       * </pre>
       * @see canNotBeEmpty
       */
      setCanBeEmpty: function(canBeEmpty) {
         this.setRequired(!canBeEmpty);
      },
      /**
       * Изменяет статус признака поля связи "не может быть пустым" на указанный
       * После проводит валидацию для соответствия текущему состоянию
       * @param {Boolean} required обязательно ли для заполнения
       */
      setRequired: function(required) {
         required = !!required;
         this._options.canNotBeEmpty = required;
         this._container.toggleClass('ws-FieldLink__notEmpty', this._options.canNotBeEmpty);
         this.validate();
      },
      /**
       * Возвращает, обязательно ли для заполнения
       * @returns {boolean}
       */
      isRequired: function() {
         return this._options.canNotBeEmpty;
      },
      _addField : function(){
         var self = this;
         if(!this.hasChildControlByName(this._options.owner)){
            return;
         }
         this._fieldContainer = this.getContainer().find('.ws-FieldLink__inputContainer');
         if (!this._initialVisualValue) {
            this._initialVisualValue = this.getLinkedContext().getValue(this._options.linkedDisplayField);
         }
         this._inputField = this.getChildControlByName(this._options.owner);
         self._inputField.setReadOnly(!this._useSuggest);
         self._inputField.setOwner(this);
//         self._inputField.setContext(this.getLinkedContext());

//?         'linkedContext' : this.getLinkedContext(),
//?         'parent' : this.getParent(),
         if (self._inputField.isActive()) {
            self._notifyFocus(arguments);
         }
         // TODO сделать свой класс внутренний
         self._inputField.subscribe('onFocusIn', function(event) {
            var parent = self.getParent();
            if (parent) {
               parent.storeActiveChild(self);
            }
            self._notifyFocus(event);
         });
         self._inputField.subscribe('onFocusOut', function(event, destroyed, focusedControl){
            self._checkChangedValue.apply(self, [this]);
            self._notify('onFocusOut', destroyed, focusedControl);
            if(focusedControl !== self && self._showAllContainer !== null){
               self._showLinksList();
            }
            //Проверяем есть у поля связи автодополнение, и потеряло ли автодополение фокус,
            if (self._useSuggest && self._inputUsed && self.getSuggest().isFocused()) {
               setTimeout(function() {
                     self._container.toggleClass('ws-empty-field-validation', !self._selection.length && !self._options.canNotBeEmpty);
                  }, 500);
               }
         });
         self._inputField.subscribe('onValueChange', function(){
            self._checkChangedValue.apply(self, [this]);
         });
         self._inputField.subscribe('onKeyPressed', function(event, eventKeyDown){
            self._checkChangedValue.apply(self, [this]);
            //Если начали вводить что-то для автодополнения скрываем showLinksList
            if (self._useSuggest && self._showAllContainer !== null){
               self._showLinksList();
            }
            if (!this.getValue() && (eventKeyDown.which == $ws._const.key.del ||
                  eventKeyDown.which == $ws._const.key.backspace)) {
               event.setResult(self._keyboardHover(eventKeyDown));
            }
            event.setResult(true);
         });
         self._inputField.validate = function(){ return true; }; //игнорируем валидацию на созданном поле
         self._inputField._getExtendedTooltipTarget = this._getExtendedTooltipTarget.bind(this);
         self._inputField._setValueInternal = function(value){
            if (value === null || value === undefined) {
               value = '';
            }
            if (typeof value != 'string') {
               value = value + '';
            }
            if (this._options.inputFilter) {
               value = this._filterValue(value);
            }
            if (this._options.maxLength && value.length > this._options.maxLength) {
               value = value.substr(0, this._options.maxLength);
            }
//            Удаляем проставление текста в input. Тесты пока прошли. Если 2 fl смотрят в один и тот же контекст из автодополенния прилетает лишнее
//            this._inputControl.val(value);
            $ws.proto.FieldString.superclass._setValueInternal.apply(self._inputField, [value]);
            self._inputField._tooltipHandler();
         };
         self._inputField.getPureValue = function(){
            return this._inputControl.val();
         };
         this._inputNotFormatedVal = self._inputField._notFormatedVal;
         self._inputField._curValue =  self._inputField._notFormatedVal = function(noAutoComplete, onKeyUp){
            var val = this._inputControl.val();
            return onKeyUp ? val : val || this.getValue();
         };
         self._inputField.getMinWidth = function(){ return 0; }; //игнорируем размеры контрола, чтобы он не мог изменять ширину/высоту родителя
         self._inputField.getMinHeight = function(){ return 0; };
         // если пользовательские параметры отработали раньше, чем построилось поле, то нарисуем историю
         if (this._needShowHistory && this._history && !Object.isEmpty(this._history)) {
            this._drawHistory();
         }
         this._fieldContainer.find('.ws-field').toggleClass('not-readonly', this._options.enabled);
         self._inputField.getContainer().find('.input-string-field').click(function(){
            if (self.isEnabled()) {
               self.setActive(true);
            }
         });
         if (self._options.multiSelect) {
            self._fieldContainer.find('.ws-field').prepend(
               self._showAllLinks = $('<a class="ws-FieldLink__showAllLinks ws-hidden" href="javascript:void(0)">&hellip;</a>')
            );
            self._showAllLinks.click($.proxy(self._showLinksList, self));
            $(document).bind('click.wsFieldLink',function(){
               if (self._showAllContainer !== null) {
                  self._showAllLinks.click();
               }
            });
         }
         var input = this._fieldContainer.find('.ws-field input');
         if (!this._options.enabled) {
            input.addClass('ws-invisible');
         }
         if (this._visualValue) {
            if (this._options.multiSelect) {
               this._setVisualValue(this._visualValue);
            } else {
               this._setVisualValue(this._visualValue, this._currentLinkValue, -1, true);
            }
            this._visualValue = false;
         }
         if (this._useSuggest) {
            this._addSuggest();
         } else {
            this._fieldContainer.addClass('ws-FieldLink__withoutSuggest');
         }
         // TODO отказаться
         this._fieldReady.callback();
      },
      _checkChangedValue: function(field){
         var value = field.getPureValue();
         this._inputUsed = !!value;
         if(!this._inputUsed){
            this._container.removeClass('ws-empty-field-validation');
         }
      },
      _addSuggest: function(){
         var self = this,
             config = {
                sourceField : [ this._inputField.makeOwnerName() ],
                resultField : [ ],
                owner: this.makeOwnerName(),
                linkedContext : this.getLinkedContext(),
                parent : this.getParent(),
                enabled: this._options.enabled,
                className: this._options.suggestSettings.className,
                allowChangeEnable: this._options.allowChangeEnable,
                historyKeyField: this._options.suggestSettings.keyField,
                definition: this._options.definition
             };
         delete this._options.suggestSettings.sourceField;
         delete this._options.suggestSettings.resultField;
         config = $ws.core.merge(config, this._options.suggestSettings);
         this._suggestDictionary = {
            formatMethod : this._options.suggestSettings.formatMethod,
            name: 'suggest',
            objectName: config.dataSource.readerParams.linkedObject,
            keyField: this._options.suggestSettings.keyField
         };
         var instance = new Suggest(config);
         this._suggest = instance;
         instance.subscribe('onSuggest', function(event, record){
            event.setResult(false);
            var applySelection = self._notify('onBeforeLinkActivated', [record]);
            if (applySelection !== false) {
               if (applySelection !== true) {
                  self._currentDictionary = 'suggest';
                  self._valueSelection.apply(self, [ [record], true ]);
               }
               this.hide();
               self._activateControl();
            }
         });
         // TODO отказаться?
         this._suggestReady.callback();
      },
      /**
       * <wiTag group="Управление">
       * Возвращает своё автодополнение.
       * Если автодополнение не используется, то возвращает undefined.
       * @return {$ws.proto.Suggest} Автодополнение.
       */
      getSuggest: function(){
         return this._suggest;
      },
      /**
       * Очистить поле с автодополнением
       */
      clearInputField: function(){
         this.getInputField().getContainer().find('input').val('');
         this.getLinkedContext().setValue(this._options.owner, null);
      },
      /**
       * Показывает/скрывает список со всеми ссылками в отдельном диве с position: absolute
       */
      _showLinksList: function(){
         var maxLinkWidth = -1,
             linkWidth;
         if(this._showAllContainer === null){
            this._container.css('z-index', 1001);
            this._countedWidth = false;
            this._fieldContainer.find('.ws-FieldLink__active').remove();
            this._refreshInputWidth(true, false);
            $(document.body).append(this._showAllContainer = $('<div class="ws-FieldLink__showAll-container" />'));
            var offset = this._fieldContainer.offset();
            this._showAllContainer.toggleClass('ws-disabled', !this.isEnabled());
            maxLinkWidth = this._fieldContainer.width();
            this._showAllContainer.css({
               'top': offset.top + this._fieldContainer.height(),
               'left': offset.left,
               'width': maxLinkWidth,
               'position': 'absolute'
            }).click(function(e){
               e.stopPropagation();
               e.preventDefault();
               return false;
            });
            for (var i = this.selectedRecords.length, lastRec = i - 1; i >= 0; i--) { //Добавляем в обратном порядке - чтобы порядок был как и в поле связи
               if (this.selectedRecords[i] !== undefined) {
                  var selRes = this._prepareSelectionResult(this.selectedRecords[i], this.dictionaries[this._keyStorage[i].dic]);
                  linkWidth = this._setVisualValue(selRes, selRes.value, this._keyStorage[i].dic, i !== lastRec); //Не ставим запятую для последней записи
                  maxLinkWidth = linkWidth > maxLinkWidth ?  linkWidth : maxLinkWidth;
               }
            }
            /**
             * поставим минимальную ширину как ширину самой длинной ссылки
             * @type {string}
             */
            this._showAllContainer.get(0).style.minWidth = maxLinkWidth + SHOW_ALL_CONTAINER_PLUS + 'px';

            this._showAllContainer.position({
               my: 'left top',
               at: 'left bottom',
               collision: 'flip',
               of: this._fieldContainer
            });
            this._container.trigger('wsSubWindowOpen');
         } else {
            this._container.css('z-index', this._zIndex);
            this._showAllContainer.remove();
            this._showAllContainer = null;
            this._refreshLinksShotList();
            this._container.trigger('wsSubWindowClose');
         }
      },
      _refreshLinksShotList: function(){
         if(this._options.multiSelect && this._options.renderStyle !== 'linkOnly'){
            var k = this.selectedRecords.length,
                recordsCount = 0,
                selRes, collection;
            //selectedRecords были добавлены в обратном порядке
            for(var j = 0; j < k; j++){
               if(this.selectedRecords[j] !== undefined){
                  recordsCount++;
                  selRes = this._prepareSelectionResult(this.selectedRecords[j], this.dictionaries[this._keyStorage[j].dic]);
                  this._setVisualValue(selRes, selRes.value, this._keyStorage[j].dic, j !== 0); //Если не последняя запись - ставим запятую
               }
            }
            collection = this._fieldContainer.find('.ws-field').find('.ws-FieldLink__active');
            if (recordsCount === collection.length && !this._showAllLinks.hasClass('ws-hidden')) {
               this._showAllLinks.addClass('ws-hidden');
            }
            if (recordsCount === 0) {
               this._refreshInputWidth(false, true);
            }
         }
      },
      _refreshInputWidth: function(useIcon, needShow){
         var input = this._fieldContainer.find('input'),
             inputPadding,
             newInputWidth,
             tooltipContainer;
         if(!input.size() || !$ws.helpers.isElementVisible(input)){
            return;
         }
         inputPadding = input.innerWidth() - input.width();
         newInputWidth = this._fieldContainer.find('.ws-field').width() - inputPadding;
         if (useIcon === true) {
            newInputWidth -= DELETE_ICON_WIDTH;
         }
         input.width(newInputWidth);
         tooltipContainer = this._fieldContainer.find('.ws-tooltip-container');
         if (tooltipContainer.length) {
            tooltipContainer.css('left', input.position().left);
         }
         if (needShow === true) {
            this._toggleInput(true);
         }
      },
      /**
       * Скрывает/показывает поле ввода
       * @param {Boolean} show true - показать, false - скрыть
       * @private
       */
      _toggleInput: function(show){
         this._inputVisible = show;
         if (this._inputField.isActive() && !show) {
            this._container.focus();
         }
         $(this._fieldContainer.find('input, .ws-tooltip-container')).val('')
            .toggleClass('ws-hidden', !show);
      },
      _initFocusCatch: function(){
         $ws.proto.Control.prototype._initFocusCatch.apply(this, arguments);
      },
      _onResizeHandler : function(){
         if(this._options.renderStyle === 'linkOnly') {
            if (this._options.linkTextAlign === 'left' && this._link) { //Скриптом ширину нужно считать только для левого выравнивания текста - для правого оно считается стилями
               var containerWidth = this._container.width();
               //если у нас начальное значение, то все уже стоит хорошо из xhtml, и менять ничего не нужно
               //засекаем по отображаемому значению, потому что оно могло измениться для одной и той же записи
               //рассчитываем ширину, только если получили containerWidth, иначе - в IE безвозвратно портится ширина linkWrapper'a
               if (containerWidth && (Object.isEmpty(this._options.preProcessValue || {}) || this.getStringValue() !== this._options.preProcessValue.visual)) {
                  var linkWrapper = this._link.closest('.ws-FieldLink__link'),
                      showDeleteIcon = !this._options.canNotBeEmpty && this._options.enabled && this.selectedRecords && this.selectedRecords.length,
                      paddingRight = parseInt(linkWrapper.css('padding-right'), 10) || 0,
                      paddingLeft = parseInt(linkWrapper.css('padding-left'), 10) || 0,
                      containerWidthWithDelete = containerWidth - (showDeleteIcon ? DELETE_ICON_WIDTH : 0) - paddingRight,
                      curLinkWidth,
                      $linkInBody,
                      newW,
                      currentW;
                  /**
                   * Если Браузер ie, то он неправильно определяет ширину ссылки, если она шире контейнера, то возьмется лишь ширина контейнера
                   * Высчитываем через body
                   */
                  if ($ws._const.browser.isIE) {
                     $linkInBody = this._link.clone().prependTo('body');
                     curLinkWidth = $linkInBody.width();
                     $linkInBody.remove();

                  } else {
                     curLinkWidth = this._link.width()
                  }
                  //Добавим 1 пиксель ширины для ие, так как он считает не очень хорошо ширину ссылки
                  newW = Math.min(curLinkWidth + paddingLeft + paddingRight + ($ws._const.browser.isIE ? 1 : 0), containerWidthWithDelete);
                  currentW = linkWrapper.width() + (showDeleteIcon ? DELETE_ICON_WIDTH : 0) + paddingRight;
                  if (currentW !== newW + (showDeleteIcon ? DELETE_ICON_WIDTH : 0)) {
                     //Ширину ставить имеет смысл только если ссылка больше ширины контейнера (+тут же учитываем и наличие крестика)
                     if (containerWidth < curLinkWidth + (showDeleteIcon ? REAL_DELETE_ICON_WIDTH : 0)) {
                        //Растянем linkWrapper, чтоб в IE не было поблем с link.width() - там оно в маленьком контейнере тоже маленькую ширину выдаёт
                        linkWrapper.width(containerWidth);
                        //Теперь поставим ширину linkWrapper по ширине ссылки
                        linkWrapper.width(newW);
                     } else { //Если ширина ссылки меньше ширины контейнера, то сбрасываем ширину с контейнера ссылки
                        linkWrapper.width('');
                     }
                  }
               }
            }
         } else {
            if ($ws.helpers.instanceOfModule(this._inputField, 'SBIS3.CORE.FieldString')) {
               if(this._options.multiSelect){
                  var width = this._fieldContainer.width();
                  //Если ширина не изменилась, то и перерисовывать ничего не надо
                  if (width !==  this._fieldContainerWidth) {
                     this._countedWidth = false;
                     this._fieldContainer.find('.ws-FieldLink__active').remove();
                     this._refreshLinksList();
                  }
                  this._fieldContainerWidth = width;
               } else {
                  var linkContainer = this._fieldContainer.find('.ws-FieldLink__active'),
                      link = linkContainer.find('a.ws-FieldLink__activeLink'),
                      deleteContainer = this._fieldContainer.find('.ws-FieldLink__deleteContainer');
                  link.width('auto');
                  linkContainer.width('auto');
                  var iconWidth = this._options.enabled ? ICON_WIDTH : 0,
                      //Добавим 1 пиксель ширины для ие, так как он считает не очень хорошо ширину ссылки
                      linkWidth = link.outerWidth() + ($ws._const.browser.isIE ? 1 : 0),
                      //Если у контейнера с кнопкой удаления уже стоит relative, то не нужно повторно учитывать его наличие в контейнере ссылки
                      fieldWidth = this._fieldContainer.innerWidth() - iconWidth,
                      minor = this._options.definition && this._useSuggest ? this._fieldContainer.find('input').width() + COMMA_WIDTH + iconWidth : 0,
                      newWidth = linkWidth < fieldWidth ? linkWidth : fieldWidth;
                  if (fieldWidth > 0) {
                     deleteContainer.toggleClass('ws-position-absolute', linkWidth >= fieldWidth);
                     linkWidth = newWidth === fieldWidth ? newWidth - minor : newWidth;
                     linkContainer.width(linkWidth + 1);
                     link.width(linkWidth);
                     if (minor > 0 ) {
                        linkContainer.parent().find('input').width((newWidth === fieldWidth ? minor : fieldWidth - linkWidth)  - COMMA_WIDTH );
                     }
                  }
               }
            }
         }
      },
      /**
       * Метод маркирует контрол в случае ошибки.
       * <wiTag group="Отображение">
       * Не проводит валидацию, просто подсвечивает контрол. Не только ссылку, но и поле ввода.
       * @example
       * <pre>
       *    if(fieldLink.getValue() === null)
       *       fieldLink.markControl('Введено слишком большое значение');
       * </pre>
       * @param {Array|String} errors Сообщение об ошибке.
       */
      markControl: function(errors) {
         if (!this._selection.length) {
            if (this._deleteAllLinks) { //Скрываем ярлык удаления, если имеется указатель
               this._deleteAllLinks.addClass('ws-hidden');
            } else { //Иначе - получаем указатель и после этого скрываем ярлык
               this.getContainer().find('.ws-FieldLink__delete-allLinks').addClass('ws-hidden');
            }
         }
         if (this._inputField !== null) {
            this._inputField.markControl(errors);
         }
         $ws.proto.FieldLink.superclass.markControl.apply(this, arguments);
         if (this._useSuggest && this._inputUsed) {
            //Если поле обязательно для заполнения - оно и так покраснеет полностью (не вешаем класс)
            this._container.toggleClass('ws-empty-field-validation', !this._selection.length && !this._options.canNotBeEmpty);
         }
      },
      _toggleInputReadOnly: function(enable, withDefinition){
         this._inputField.setReadOnly(!(enable && this._useSuggest || withDefinition));
         if (this._useSuggest) {
            this._suggest.setUseDefinition(!enable && withDefinition);
            //Не надо смотреть на withDefinition, мы можем переставлять тултип только для полей, где точно определен definition
            if (this._options.suggestSettings.tooltipInside && this._options.definition) {
               this._inputField.setTooltip( ( !withDefinition ? this.dictionaries[0].name + '/' : '') + this._options.suggestSettings.inputTooltip);
            }
         }
         this._fieldContainer.find('.ws-field').toggleClass('not-readonly', this._options.enabled);
         this._fieldContainer.find('.ws-FieldLink__deleteContainer').toggleClass('ws-hidden', !enable);
      },
      /**
       * Изменяет статус включенности элемента
       * То есть возможность взаимодейтсвия с ним пользователя.
       * <wiTag group="Управление">
       * @example
       * <pre>
       *    if(control.isEnabled())
       *       control.setEnabled(false);
       * </pre>
       * @param {Boolean} enabled Статус "включенности" элемента управления.
       */
      _setEnabled: function(enable){
         if (this._useSuggest) {
            if (this._suggest !== null) {
               this._suggest.setEnabled(enable);
            }
         }
         if (this._inputField !== null) {
            // При смене состояния - все равно смотрим на this._useSuggest.
            // Если автодополнения нет, то редактировать поле ввода нельзя.
            this._toggleInputReadOnly(enable);
         }
         if (this._options.renderStyle === 'linkOnly' && this.selectedRecords && !this._options.canNotBeEmpty || this.selectedRecords.length > 1) {
            this._deleteAllLinks.toggleClass('ws-invisible', !enable);
         }
         if (this._link) {
            this._link.parent('.ws-FieldLink__link').toggleClass('readonly', !enable);
         }
         $ws.proto.FieldLink.superclass._setEnabled.apply(this, arguments);
         this._onResizeHandler();
      },
      /**
       * Собирает параметры для редактирования записи в строку.
       * Возвращает false, если нельзя редактировать.
       * @param {String} [recordId] Идентификатор записи.
       * @return {String | Boolean}
       */
      _generateEditPageURL: function(recordId, dicId){
         var dictionary = this.getDictionary(dicId || 0);
         if (dictionary.editDialogTemplate && dictionary.editMode === 'newWindow'){
            var dataSource = {},
            handlers = {
               'onBeforeShowRecord': this._handlersPath('onBeforeShowRecord')
            };
            dataSource.readerParams = {};
            dataSource.readerParams.format = dictionary.formatMethod || '';
            dataSource.readerParams.linkedObject = dictionary.objectName;
            if (dictionary.readMethodName) {
               dataSource.readerParams.readMethodName = dictionary.readMethodName;
            }
            return $ws.helpers.generateURL(recordId, false, null, false, dictionary.editDialogTemplate, this.getId(),
                  !this._options.enabled ? true : (dictionary.readOnly || false), dataSource,undefined, undefined, handlers);
         }
         return false;
      },
      /**
       * <wiTag group="Управление">
       * Изменяет признак "является частью редактируемой записи" на переданный.
       * Для корректной работы необходимо вызывать в момент готовности поля связи.
       * @param {Boolean} value Является ли частью записи.
       * @example
       * <pre>
       *    fieldLink.setIsRecordPath(true);
       * </pre>
       */
      setIsRecordPath: function(value){
         value = !!value;
         if(this._options.isRecordPath !== value){
            if (!this._options.multiSelect && this._linkSpec) {
               var target = this._getTargetContext();
               if (!this._options.isRecordPath) {
                  target.remove(this._linkSpec, this._options.linkName);
               }
               target.insert(this._linkSpec, this._options.isRecordPath === true ? null : this._options.linkName);
            }
            this._options.isRecordPath = value;
         }
      },
      /**
       * <wiTag group="Управление">
       * Возвращает контрол поля ввода, используемый полем связи.
       * @returns {$ws.proto.FieldString} Поле ввода.
       * @example
       * <pre>
       *    fieldLink.getInputField().getContainer().addClass('my-fieldLink-input');
       * </pre>
       * @see owner
       */
      getInputField: function(){
         return this._inputField;
      },
      /**
       * Возвращает строковое представление поля связи
       * <wiTag group="Управление">
       * @return {String} Строковое представление.
       * @example
       * <pre>
       *    $ws.core.alert("Вы выбрали: " + fieldLink.getStringValue());
       * </pre>
       * @see getValueDeferred
       */
      getStringValue: function(){
         var visualValues = [];
         for(var i = 0; i < this._selection.length; ++i){
            visualValues.push(this._selection[i].visual);
         }
         return visualValues.join(', ');
      },
      /**
       * Видимость поля ввода по мнению поля связи
       * @returns {boolean|*}
       */
      getInputVisibility: function() {
         return this._inputVisible;
      },
      /**
       * <wiTag group="Управление">
       * Возвращает деферред готовности значения контрола (getValue, getStringValue).
       * @returns {$ws.proto.Deferred}
       * @example
       * <pre>
       *    fieldLink.getValueDeferred().addCallback(function(){
       *       fieldLink.validate();
       *    });
       * </pre>
       * @see getValue
       * @see getStringValue
       */
      getValueDeferred: function(){
         return this._valueDeferred;
      },
      /**
       * Возвращает значение по умолчанию
       * @returns {String|Number}
       * @protected
       */
      _getDefaultValue: function(){
         if(typeof this._options.value === 'function'){
            return this._options.value();
         }
         return this._options.value;
      },
      /**
       * Переопределение из {$ws.proto.AreaAbstact}.Поле связи должно проставлять свой контекст в контекс парента
       * @private
       */
      _createDependentContext: function(){
         this._craftedContext = false; // Чтобы Area не разрушила наш контекст дважды
         return this._context;
      },
      /**
       * Разрушает экземпляр класса
       * <wiTag group="Управление">
       * @example
       * <pre>
       *    control.destroy();
       * </pre>
       */
      destroy: function(){
         var self = this;
         if (this._dicMenu !== false) {
            this._dicMenu.destroy();
         }
         if (this._showAllContainer !== null) {
            this._showAllContainer.remove();
            this._showAllContainer = null;
            this._container.trigger('wsSubWindowClose');
         }
         if (this._showAllLinks !== null) {
            this._showAllLinks.remove();
            this._showAllLinks = null;
         }
         if (this._options.multiSelect) {
            $(document).unbind('.wsFieldLink');
         }
         if (this._deleteAllLinks !== null) {
            this._deleteAllLinks.remove();
            this._deleteAllLinks = null;
         }
         this._saveHistory().addBoth(function(){
            $ws.proto.FieldLink.superclass.destroy.apply(self, arguments);
         });
      }
   });

   return $ws.proto.FieldLink;

});
