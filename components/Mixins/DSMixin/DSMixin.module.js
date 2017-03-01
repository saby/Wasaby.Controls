define('js!SBIS3.CONTROLS.DSMixin', [
   "Core/core-functions",
   "Core/Deferred",
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!WS.Data/Source/Memory",
   "js!WS.Data/Source/SbisService",
   "js!WS.Data/Collection/RecordSet",
   "js!WS.Data/Query/Query",
   "js!WS.Data/Collection/ObservableList",
   "js!WS.Data/Display/Display",
   "js!WS.Data/Collection/IBind",
   "js!WS.Data/Display/Collection",
   "js!SBIS3.CONTROLS.Utils.TemplateUtil",
   "Core/core-instance",
   "Core/helpers/functional-helpers",
   "Core/helpers/fast-control-helpers"
], function ( cFunctions, Deferred, IoC, ConsoleLogger,MemorySource, SbisService, RecordSet, Query, ObservableList, Projection, IBindCollection, Collection, TemplateUtil, cInstance, fHelpers, fcHelpers) {

   /**
    * Миксин, задающий любому контролу поведение работы с набором однотипных элементов.
    * @mixin SBIS3.CONTROLS.DSMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   function propertyUpdateWrapper(func) {
      return function() {
         return this.runInPropertiesUpdate(func, arguments);
      };
   }

   var DSMixin = /**@lends SBIS3.CONTROLS.DSMixin.prototype  */{
       /**
        * @event onDrawItems Происходит после отрисовки всех элементов коллекции.
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @example
        * <pre>
        *     Menu.subscribe('onDrawItems', function(){
        *        if (Menu.getItemsInstance(2).getCaption() == 'Входящие'){
        *           Menu.getItemsInstance(2).destroy();
        *        }
        *     });
        * </pre>
        * @see items
        * @see displayProperty
        */
       /**
        * @event onDataLoad Происходит после загрузки данных.
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {WS.Data/Collection/RecordSet} dataSet Набор данных.
        * @example
        * <pre>
        *     myComboBox.subscribe('onDataLoad', function(eventObject) {
        *        TextBox.setText('Загрузка прошла успешно');
        *     });
        * </pre>
        * @see items
        * @see setDataSource
        * @see getDataSource
        */
      /**
       * @event onDataLoadError Происходит после загрузки данных, завершенной с ошибкой.
       * @remark
       * Событие сработает при получении ошибки от любого метода БЛ, вызванного стандартным способом.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {HTTPError} error Произошедшая ошибка.
       * @return {Boolean} Если вернуть:
       * <ol>
       * <li>true, то будет считаться, что ошибка обработана, и стандартное поведение отменяется.</li>
       * <li>Если не возвращать true, то выведется alert с описанием ошибки.</li>
       * </ol>
       * @example
       * <pre>
       *    myView.subscribe('onDataLoadError', function(event, error){
       *       event.setResult(true);
       *       TextBox.setText('Ошибка при загрузке данных');
       *    });
       * </pre>
       */
      /**
       * @event onBeforeDataLoad Происходит перед загрузкой данных.
       * @remark
       * Событие сработает перед запросом к источнику данных.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    myView.subscribe('onBeforeDataLoad', function(event, error){
       *       var filter = this.getFilter();
       *       filter['myParam'] = myValue;
       *       this.setFilter(filter, true)
       *    });
       * </pre>
       */
      /**
       * @event onItemsReady Происходит при готовности экземпляра коллекции iList.
       * @remark
       * Например когда представлению задается Source и нужно подписаться на события List, который вернется в результате запроса
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    myView.subscribe('onItemsReady', function(event){
       *       var items = this.getItems();
       *       items.subscribe('onCollectionChange', function(){
       *          alert('Collection is changed')
       *       })
       *    });
       * </pre>
       */
      $protected: {
         _needToRedraw: false,
         _itemsProjection: null,
         _items : null,
         _itemsInstances: {},
         _offset: 0,
         _limit: undefined,
         _dataSource: undefined,
         _dataSet: null,
         _dotItemTpl: null,
         _options: {
            /**
             * @cfg {String} Устанавливает поле элемента коллекции, значения которого будут использованы в качестве первичного ключа.
             * @deprecated
             */
            keyField : null,
            /**
             * @cfg {String} Устанавливает поле элемента коллекции, значения которого будут использованы в качестве первичного ключа.
             * @remark
             * Для данного поля справедливо ограничение уникальности. С помощью его значений можно однозначно
             * идентифицировать любой элемент коллекции.
             * Данные задаются либо с помощью опции {@link items}, либо методом {@link setDataSource}.
             * @example
             * <pre class="brush:xml">
             *     <option name="idProperty">@Идентификатор</option>
             * </pre>
             * @see items
             * @see displayProperty
             * @see setDataSource
             * @see SBIS3.CONTROLS.Selectable#selectedKey
             * @see SBIS3.CONTROLS.Selectable#setSelectedKey
             * @see SBIS3.CONTROLS.Selectable#getSelectedKey
             * @see SBIS3.CONTROLS.SuggestMixin#list
             */
            idProperty : null,
            /**
             * @cfg {String} Определяет поле элемента коллекции, данные из которого будут использованы для отображения в контроле.
             * @deprecated
             */
            displayField: null,
            /**
             * @cfg {String} Определяет поле элемента коллекции, данные из которого будут использованы для отображения в контроле.
             * @remark file DSMixin-displayField.md
             * @example
             * Отображение в поле связи значений поля "ФИО" выбранных элементов коллекции:
             * ![](/DSMixin01.png)
             * фрагмент верстки:
             * <pre class="brush:xml">
             *     <option name="displayProperty">НазваниеПоля</option>
             * </pre>
             * @see idProperty
             * @see items
             */
            displayProperty: null,
             /**
              * @cfg {Array.<Object>} Устанавливает набор исходных данных, по которому строится отображение.
              * @remark
              * Набор исходных данных - это данные определенного формата, которые будут преобразованы
              * в элементы коллекции (экземпляры класса {@link WS.Data/Entity/Model Model}).
              *
              * Опция items описывает набор данных, который будет преобразован в статический источник данных.
              * Изменять значение опции items можно с помощью метода {@link setItems}.
              *
              * Данные для коллекции элементов задаются либо с помощью этой опции,
              * либо через источник данных методом {@link setDataSource}.
              * Опция {@link SBIS3.CONTROLS.TreeMixin#hierField} устанавливает поле,
              * по которому будет построена иерархия.
              * @example
              * Задаем набор данных для отображения календаря; использован класс {@link SBIS3.CONTROLS.TreeDataGridView}:
              * ![](/DSMixin01.png)
              * фрагмент верстки:
              * <pre class="brush:xml">
              *     <option name="idProperty">id</option>
              *     <option name="displayProperty">title</option>
              *     <option name="parentProperty" value="parent"></option>
              *     <option name="nodeProperty" value="parent@"></option>
              *     <options name="items" type="array">
              *        <options>
              *           <option name="id">I</option>
              *           <option name="title">квартал 1</option>
              *           <option name="parent" value="null" type="null"></option>
              *           <option name="parent@" value="true" type="boolean"></option>
              *        </options>
              *        <options>
              *           <option name="id">01</option>
              *           <option name="title">январь</option>
              *           <option name="parent" value="I"></option>
              *           <option name="parent@" value="null" type="null"></option>
              *        </options>
              *        <options>
              *           <option name="id">02</option>
              *           <option name="title">февраль</option>
              *           <option name="parent" value="I"></option>
              *           <option name="parent@" value="null" type="null"></option>
              *        </options>
              *     </options>
              * </pre>
              * @see setItems
              * @see idProperty
              * @see displayProperty
              * @see setDataSource
              * @see SBIS3.CONTROLS.TreeMixin#hierField
              */
            items: null,
            /**
             * @cfg {DataSource|WS.Data/Source/ISource|Function|Object} Устанавливает набор исходных данных, по которому строится отображение.
             * @remark
             * Если установлен источник данных, то значение опции {@link items} будет проигнорировано.
             * @example
             * <b>Пример 1.</b> Чтобы установить конфигурацию источника данных через JS-код компонента, необходимо его инициализировать и установить с помощью метода {@link setDataSource}.
             * <pre>
             *    // SbisService - это переменная, в которую импортирован класс источника данных из массива зависимостей
             *    var myDataSource = new SbisService({ // Инициализация источника данных
             *        endpoint: {
             *           contract: 'Отчеты', // Устанавливаем объект БЛ, в котором есть методы для работы с данными таблицы
             *           address: 'myNewService/service/sbis-rpc-service300.dll' // Устанавливаем точку входа в другой сервис
             *        },
             *        binding: {
             *           query: 'Список' // Устанавливаем списочный метод
             *        },
             *        idProperty: '@Идентификатор' // Устанавливаем поле первичного ключа
             *    });
             *    myView.setDataSource(myDataSource); // Устанавливаем представлению источник данных
             * </pre>
             *
             * <b>Пример 2.</b> Конфигурация источника данных через вёрстку компонента.
             * Первый способ основан на использовании объекта со следующими свойствами:
             * <ul>
             *    <li>module - название класса источника данных;</li>
             *    <li>options - конфигурация источника данных.</li>
             * </ul>
             * Аналогичная предыдущему примеру конфигурация будет выглядеть следующим образом:
             * <pre>
             *    <options name="dataSource">
             *       <option name="module" value="js!WS.Data/Source/SbisService"></options>
             *       <options name="options">
             *          <options name="endpoint">
             *             <option name="contract" value="Отчеты"></option>
             *             <option name="address" value="myNewService/service/sbis-rpc-service300.dll"></option>
             *          </options>
             *          <options name="binding">
             *             <option name="query" value="Список"></option>
             *          </options>
             *          <option name="idProperty" value="@Идентификатор"></option>
             *       </options>
             *    </options>
             * </pre>
             *
             * <b>Пример 3.</b> Конфигурация источника данных через вёрстку компонента.
             * Второй способ основан на использовании функции, которая возвращает конфигурацию источника.
             * <pre>
             *    <option name="dataSource" type="function">js!SBIS3.MyArea.MyComponent:prototype.getMyDataSource</option>
             * </pre>
             * Функция должна возвращать объект с конфигурацией источника данных.
             * <pre>
             *    getMyDataSource: function() {
             *       return new MemorySource({
             *          ...
             *       });
             *    }
             * </pre>
             * @see setDataSource
             * @see getDataSource
             * @see items
             */
            dataSource: undefined,
             /**
              * @cfg {Number} Устанавливает количество элементов коллекции, запрашиваемых с источника данных.
              * @remark
              * Опция определяет количество элементов коллекции, которые запрашиваются от источника данных.
              * Это используется для функционала постраничной навигации {@link SBIS3.CONTROLS.ListView#showPaging} и
              * бесконечной подгрузки данных по скроллу {@link SBIS3.CONTROLS.ListView#infiniteScroll}.
              *
              * При работе с коллекцией иерархической структуры следует учитывать, что в количество элементов коллекции
              * считаются и узлы, и листья, т.е. подсчет идет относительно полностью развернутого представления данных.
              * Поэтому визуально может показаться, что подгружается меньше элементов коллекции, чем указано в опции.
              *
              * Например, один узел и его четыре дочерних листа будут посчитаны как пять элементов коллекции.
              * Если опция pageSize установлена в значение 5, а содержимое узла не раскрыто, то отображен будет только
              * один элемент коллекции - узел.
              * @example
              * Для {@link SBIS3.CONTROLS.SuggestMixin#list выпадающего блока} в поле связи, отображающего список значений
              * для автодополнения, установим пять значений и {@link SBIS3.CONTROLS.ListView#showPaging режим постраничной навигации}:
              * фрагмент верстки:
              * <pre class="brush:xml">
              *     <option name="pageSize">5</option>
              *     <option name="showPaging">true</option>
              * </pre>
              * результат настройки:
              * ![](/DSMixin03.png)
              * @see setPageSize
              * @see SBIS3.CONTROLS.ListView#showPaging
              * @see SBIS3.CONTROLS.ListView#infiniteScroll
              */
            pageSize: undefined,
            /**
             * @typedef {Object} GroupBy
             * @property {String} field Поле источника данных, по которому производится группировка элементов коллекции.
             * Обязательная к использованию подопция. Когда среди всех подопций установлено field, то элементы коллекции будут сгруппированы без отображения заголовка группы.
             * @property {Function} method Функция, которая возвращает признак необходимости отображения как заголовка группы перед обрабатываемым элементом коллекции, так и самого элемента.
             * Аргументы функции:
             * <ol>
             *    <li>item - обрабатываемый элемент коллекции, экземпляр класса {@link WS.Data/Entity/Model}.</li>
             *    <li>at.</li>
             *    <li>last - признак, по которому можно установить является ли обрабатываемый элемент последним в группе. В значении true - это последний элемент группы.</li>
             * </ol>
             * Функция может возвращать два типа значений:
             * <ul>
             *    <li>Типа Boolean. В значении true заголовок будет отрисован.</li>
             *    <li>Типа Object. В этом случае объект может содержать два свойства:
             *       <ul>
             *          <li>drawItem. Устанавливает необходимость отрисовки обрабатываемого элемента коллекции. Значение будет приведено к типу Boolean.</li>
             *          <li>drawGroup. Устанавливает необходимость отрисовки заголовка группы перед обрабатываемым элементом коллекции. Значение будет приведено к типу Boolean.</li>
             *       </ul>
             *    </li>
             * </ul>
             * @property {String} template Шаблон, по которому будет построен заголовок каждой группы.
             * Шаблон представляет собой XHTML-файл. Чтобы шаблон можно было использовать, его нужно предварительно подключить в массив зависимостей компонента.
             * На клик по заголовку группы можно установить функцию-обработчик, которая конфигурируется подопцией clickHandler.
             * Внутри шаблона допускается использование {@link http://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/component/xhtml/template/ конструкций шаблонизатора}, через которые можно получить доступ к полям первого элемента группы.
             * @property {Function} render Функция, дополняющая функционал обработки заголовка группы.
             * Аргументы функции:
             * <ol>
             *    <li>item - элемент коллекции, который отрисовывается первым в группе. Экземпляр класса {@link WS.Data/Entity/Model}.</li>
             *    <li>container - содержимое контейнера визуального отображения (DOM-элемента) заголовка группы.</li>
             *    <li>last - признак, по которому можно установить является ли первый элемент группы одновременно и последним.</li>
             * </ol>
             * @property {Function} clickHandler Функция, с помощью которой можно обработать клик по заголовку группы.
             * Аргументы функции:
             * <ul>
             *    <li>Объект с контейнером визуального отображения группы (DOM-элемент).
             *       <pre>
             *          myClickHandlerFunction: function(object) {
             *             object.context // контейнер визуального отображения группы
             *          }
             *       </pre>
             *    </li>
             * </ul>
             */
            /**
             * @cfg {GroupBy} Устанавливает группировку элементов коллекции.
             * @remark file DSMixin-groupBy.md
             * @example
             * Ниже проиллюстрирована работа функционала группировки на примере выпадающего блока автодополнения для поля связи.
             *
             * Пример 1. Список значений без группировки.
             * ![](/DSMixin03.png)
             *
             * Пример 2. Список значений с простой группировкой. Данные с одинаковыми значениями поля "ФИО" сгруппированы в отдельные группы.
             * ![](/DSMixin04.png)
             * Фрагмент верстки компонента:
             * <pre class="brush:xml">
             *     <options name="groupBy">
             *        <option name="field">ФИО</option>
             *     </options>
             * </pre>
             *
             * Пример 3. Список значений с группировкой по типу "Лесенка". Одинаковые значения по полям "ФИО" и "Должность" скрыты.
             * ![](/DSMixin05.png)
             * Фрагмент верстки компонента:
             * <pre class="brush:xml">
             *     <options name="ladder" type="array">
             *        <option>ФИО</option>
             *        <option>Должность</option>
             *     </options>
             * </pre>
             * @see setGroupBy
             * @see SBIS3.CONTROLS.DataGridView#ladder
             * @see sorting
             */
            groupBy : {},
            /**
             * @typedef {Function} UserItem
             * @property {String} container Контейнер визуального отображения (DOM-элемент) текущего элемента коллекции.
             * @property {WS.Data/Entity/Model} item Текущий элемент коллекции.
             */
            /**
             * @cfg {UserItem} Устанавливает метод, с помощью которого можно производить манипуляции с контейнером визуального отображения элементов коллекции.
             * @remark
             * С помощью данного метода можно изменять контейнер визуального отображения (DOM-элемент) для каждого элемента
             * коллекции. К манипуляциям над контейнером можно отнести, например, изменение CSS-классов, добавление новых
             * атрибутов, преобразование содержимого контейнера или его полное удаление из DOM.
             *
             * Аргументы метода:
             * 1. container: Контейнер визуального отображения (DOM-элемент) текущего элемента коллекции.
             * 2. item: екущий элемент коллекции в виде экземпляра класса {@link WS.Data/Entity/Model Model}.
             * @example
             * Устанавливаем функцию из вёрстки компонента:
             * <pre class="brush:xml">
             *    <option name="userItemAttributes" type="function">js!SBIS3.Contacts.MessageViewBP:prototype.myUserItemAttributes</option>
             * </pre>
             * Создаём функцию в JS-коде компоненнта:
             * <pre>
             *    myUserItemAttributes: function (container, item) {
             *       var isFolder = item ? item.get('Раздел@') : false; // проверяем признак: является ли текущий элемент папкой в иерархической структуре коллекции
             *       if (isFolder) { // если текущий элемент это папка, то производим изменение DOM-элемента
             *          container.find('td.controls-DataGridView__td__checkBox').remove(); // удаляем ячейку с чекбоксом
             *          container.find('td.controls-DataGridView__td').attr('colspan', 2); // меняем стиль соседней ячейке
             *       }
             *    },
             * </pre>
             * @deprecated
             */
            userItemAttributes : null,
            /**
             * @cfg {String|HTMLElement|jQuery} Устанавливает текст, который будет отображаться при отсутствии данных.
             * @remark
             * Устанавливает текст, который будет отображаться при отсутствии данных после запроса к источнику, или в результате фильтрации.
             * Применяется в компонентах, которые используются для отображения данных в списках.
             * Переопределить текст можно при помощи метода {@link setEmptyHTML}.
             * @example
             * Пример использования опции в {@link SBIS3.CONTROLS.FieldLink#dictionaries справочнике выбора значений}
             * для поля связи:
             * ![](/DSMixin02.png)
             * В примере для отображения данных использован компонент класса {@link SBIS3.CONTROLS.DataGridView} -
             * контрол, отображающий набор данных в виде таблицы с несколькими колонками.
             *
             * Для {@link SBIS3.CONTROLS.FieldLink поля связи} в настройке {@link SBIS3.CONTROLS.SuggestMixin#list выпадающего блока},
             * отображающего список значений для автодополнения, описание опции не дает результата, подобного
             * проиллюстрированному в примере. При отсутствии данных автодополнение работать не будет.
             *
             * Фрагмент верстки:
             * <pre class="brush:xml">
             *     <option name="emptyHTML">Данные для выбора отсутствуют</option>
             * </pre>
             * @translatable
             * @remark
             * Опция задаёт текст, отображаемый как при абсолютном отсутствии данных, так и в результате {@link groupBy фильтрации}.
             * @see items
             * @see setDataSource
             * @see groupBy
             * @see setEmptyHTML
             */
            emptyHTML: '',
            /**
             * @cfg {Object} Фильтр данных
             * @example
             * <pre class="brush:xml">
             *     <options name="filter">
             *        <option name="creatingDate" bind="selectedDocumentDate"></option>
             *        <option name="documentType" bind="selectedDocumentType"></option>
             *     </options>
             * </pre>
             */
            filter: {},
            /**
             * @cfg {Array} Устанавливает сортировку данных, возвращаемых методом БЛ.
             * @remark file DSMixin-sorting.md
             * @example
             * Пример сортировки данных автодополнения. Данные будут отсортированы по возрастанию, по полям "ФИО" и "Город":
             * ![](/DSMixin02.png)
             * фрагмент верстки:
             * <pre class="brush:xml">
             *     <options name="list">
             *        <option name="component" value="js!SBIS3.CONTROLS.DataGridView"></option>
             *        <options name="options">
             *           <option name="idProperty" value="@Пользователь"></option>
             *           <options name="sorting" type="array">
             *              <options>
             *                 <option name="ФИО">ASC</option>
             *              </options>
             *              <options>
             *                 <option name="Город">ASC</option>
             *              </options>
             *           </options>
             *        </options>
             *     </options>
             * </pre>
             */
            sorting: [],
            /**
             * @cfg {Object.<String,String>} соответствие опций шаблона полям в рекорде
             */
            templateBinding: {},
            /**
             * @cfg {Object.<String,String>} подключаемые внешние шаблоны, ключу соответствует поле it.included.<...> которое будет функцией в шаблоне
             */
            includedTemplates: {},
            /**
             * @cfg {String|function} Шаблон элементов, которые будут рисоваться под даннными.
             * @remark
             * Например для отрисовки кнопко +Документ, +Папка.
             * Если задан, то под всеми(!) элементами появится контейнер с содержимым этого шаблона
             */
            footerTpl: undefined,
            /**
             * @cfg {Boolean} Устанавливает режим автоматической перерисовки набора элементов коллекции при их изменении.
             * * true Режим автоперерисовки набора элементов коллекции установлен.
             * * false Режим автоперерисовки набора элементов коллекции отменен.
             * @remark
             * Опция используется для тех случаев, при которых элементы коллекции будут изменены только на клиентской
             * стороне приложения. Их не требуется изменять в БД, нужно только отобразить в текущем представлении.
             * Режим автоперерисовки можно установить или изменить при помощи метода {@link redraw}
             * @example
             * Пример. Режим автоперерисовки установлен:
             * <pre class="brush:xml">
             *     <option name="autoRedraw">true</option>
             * </pre>
             * @see redraw
             * @noShow
             */
            autoRedraw: true
         },
         _loader: null
      },

      $constructor: function () {
         this._publish('onDrawItems', 'onDataLoad', 'onDataLoadError', 'onBeforeDataLoad', 'onItemsReady');
         if (typeof this._options.pageSize === 'string') {
            this._options.pageSize = this._options.pageSize * 1;
         }
         this._bindHandlers();
         this._prepareConfig(this._options.dataSource, this._options.items);
      },

      _getItemProjectionByItemId: function(id) {
         return this._getItemsProjection() ? this._getItemsProjection().getItemBySourceItem(this.getItems().getRecordById(id)) : null;
      },

      _prepareConfig : function(sourceOpt, itemsOpt) {
         var idProperty = this._options.idProperty;

         if (!idProperty) {
            IoC.resolve('ILogger').log('ListView', 'Option idProperty is required');
         }

         if (sourceOpt) {
            this._dataSource = this._prepareSource(sourceOpt);
            this._items = null;
         } else if (itemsOpt) {
            if (cInstance.instanceOfModule(itemsOpt, 'WS.Data/Display/Display')) {
               this._itemsProjection = itemsOpt;
               this._items = this._convertItems(this._itemsProjection.getCollection());
               this._setItemsEventHandlers();
               this._notify('onItemsReady');
               this._itemsReadyCallback();
            } else if(cInstance.instanceOfModule(itemsOpt, 'WS.Data/Collection/RecordSet')) {
               this._processingData(itemsOpt);
            } else if (itemsOpt instanceof Array) {
               /*TODO уменьшаем количество ошибок с key*/
               if (!this._options.idProperty) {
                  var itemFirst = itemsOpt[0];
                  if (itemFirst) {
                     this._options.idProperty = Object.keys(itemFirst)[0];
                  }
               }

               /*TODO для совеместимости пока создадим сорс*/
               this._dataSource = new MemorySource({
                  data: itemsOpt,
                  idProperty: this._options.idProperty
               });
            } else {
               this._items = itemsOpt;
               this._dataSource = null;
               this._createDefaultProjection(this._items);
               this._itemsReadyCallback();
               this._notify('onItemsReady');
            }
         }
      },
      before : {
         _modifyOptions: function(cfg) {
            if (cfg.keyField) {
               IoC.resolve('ILogger').log('DSMixin', 'Опция keyField является устаревшей, используйте idProperty');
               cfg.idProperty = cfg.keyField;
            }
            if (cfg.displayField) {
               IoC.resolve('ILogger').log('DSMixin', 'Опция displayField является устаревшей, используйте displayProperty');
               cfg.displayProperty = cfg.displayField;
            }
         }
      },
      after : {
         _modifyOptions: function (opts) {
            opts.footerTpl = TemplateUtil.prepareTemplate(opts.footerTpl);
            return opts;
         },
         destroy : function() {
            this._unsetItemsEventHandlers();
            this._clearItems();
         }
      },

      _createDefaultProjection: function(items) {
         this._itemsProjection = Projection.getDefaultDisplay(items);
      },

      _convertItems: function (items) {
         items = items || [];
         if (items instanceof Array) {
            items = new ObservableList({
               items: items
            });
         }

         if (!cInstance.instanceOfMixin(items, 'WS.Data/Collection/IEnumerable')) {
            throw new Error('Items should implement WS.Data/Collection/IEnumerable');
         }

         return items;
      },

      _prepareSource: function(sourceOpt) {
         var result;
         switch (typeof sourceOpt) {
            case 'function':
               result = sourceOpt.call(this);
               break;
            case 'object':
               if (cInstance.instanceOfMixin(sourceOpt, 'WS.Data/Source/ISource')) {
                  result = sourceOpt;
               }
               if ('module' in sourceOpt) {
                  var DataSourceConstructor = require(sourceOpt.module);
                  result = new DataSourceConstructor(sourceOpt.options || {});
               }
               break;
         }
         return result;
      },

      /**
       * Возвращает отображаемую контролом коллекцию, сделанную на основе источника данных
       * @param {WS.Data/Source/ISource} source
       * @returns {WS.Data/Collection/IList}
       * @private
       */
      _convertDataSourceToItems: function (source) {
         return new ObservableList({
            source: source
         });
      },


      _bindHandlers: function () {
         /*this._onBeforeItemsLoad = onBeforeItemsLoad.bind(this);
         this._onAfterItemsLoad = onAfterItemsLoad.bind(this);
         this._dataLoadedCallback = this._dataLoadedCallback.bind(this);*/
         this._onCollectionChange = onCollectionChange.bind(this);
         this._onCollectionItemChange = onCollectionItemChange.bind(this);
         /*this._onCurrentChange = onCurrentChange.bind(this);*/
      },

      _setItemsEventHandlers: function() {
         this.subscribeTo(this._itemsProjection, 'onCollectionChange', this._onCollectionChange);
         this.subscribeTo(this._itemsProjection, 'onCollectionItemChange', this._onCollectionItemChange);
      },

      _unsetItemsEventHandlers: function () {
         this.unsubscribeFrom(this._itemsProjection, 'onCollectionChange', this._onCollectionChange);
         this.unsubscribeFrom(this._itemsProjection, 'onCollectionItemChange', this._onCollectionItemChange);
      },
      /**
       * Устанавливает источник данных.
       * @remark
       * Если источник данных установлен, значение опции {@link items} будет проигнорировано.
       * @param {DataSource|WS.Data/Source/ISource} source Новый источник данных.
       * @param {Boolean} noLoad Признак, с помощью устанавливается необходимость запроса нового набора данных по установленному источнику.
       * Если параметр установлен в значение true, то данные не будут подгружены, а также не произойдут события {@link onBeforeDataLoad}, {@link onDataLoad}, {@link onItemsReady} или {@link onDataLoadError}.
       * @example
       * <pre>
       *     define( 'SBIS3.MyArea.MyComponent',
       *        [ // Массив зависимостей компонента
       *           ... ,
       *           'js!WS.Data/Source/Memory' // Подключаем класс для работы со статическим источником данных
       *        ],
       *        function(
       *           ...,
       *           MemorySource // Импортируем в переменную класс для работы со статическим источником данных
       *        ){
       *           ...
       *           var arrayOfObj = [ // Формируем набор "сырых" данных
       *              {'@Заметка': 1, 'Содержимое': 'Пункт 1', 'Завершена': false},
       *              {'@Заметка': 2, 'Содержимое': 'Пункт 2', 'Завершена': false},
       *              {'@Заметка': 3, 'Содержимое': 'Пункт 3', 'Завершена': true}
       *           ];
       *           var dataSource = new MemorySource({ // Производим инициализацию статического источника данных
       *              data: arrayOfObj,                // Передаём набор "сырых" данных
       *              idProperty: '@Заметка'           // Устанавливаем поле первичного ключа в источнике данных
       *           });
       *           this.getChildControlByName("ComboBox 1").setDataSource(ds1); // Устанавливаем источник представлению данных
       *        }
       *     );
       * </pre>
       * @see dataSource
       * @see getDataSource
       * @see items
       * @see onBeforeDataLoad
       * @see onDataLoad
       * @see onDataLoadError
       * @see onItemsReady
       * @see onDrawItems
       */
      setDataSource: function (source, noLoad) {
          this._unsetItemsEventHandlers();
          this._prepareConfig(source);
          if (!noLoad) {
             return this.reload();
          }
      },
      /**
       * Метод получения набора данных, который в данный момент установлен в представлении.
       * @example
       * <pre>
       *     var dataSet = myComboBox.getDataSet(),
       *     count = dataSet.getCount();
       *     if (count > 1) {
	   *        title.setText('У вас есть выбор: это хорошо!');
       *     }
       * </pre>
       * @see dataSource
       * @see setDataSource
       * @see onDrawItems
       * @see onDataLoad
       */

      /*TODO поддержка старого API*/
      getDataSet: function(compatibilityMode) {
         if(!compatibilityMode) {
            IoC.resolve('ILogger').log('Получение DataSet явялется устаревшим функционалом используйте getItems()');
         }
         return this._dataSet;
      },
      /**
       * Перезагружает набор записей представления данных с последующим обновлением отображения.
       * @param {Object} filter Параметры фильтрации.
       * @param {String|Array.<Object.<String,Boolean>>} sorting Параметры сортировки.
       * @param {Number} offset Смещение первого элемента выборки.
       * @param {Number} limit Максимальное количество элементов выборки.
       * @example
       * <pre>
       *    myDataGridView.reload(
       *       { // Устанавливаем параметры фильтрации: требуются записи, в которых поля принимают следующие значения
       *          iata: 'SVO',
       *          direction: 'Arrivals',
       *          state: 'Landed',
       *          fromCity: ['New York', 'Los Angeles']
       *       },
       *       [ // Устанавливаем параметры сортировки: сначала производится сортировка по полю direction, а потом - по полю state
       *          {direction: false}, // Поле direction сортируется по возрастанию
       *          {state: true} // Поле state сортируется по убыванию
       *       ],
       *       50, // Устанавливаем смещение: из всех подходящих записей отбор результатов начнём с 50-ой записи
       *       20 // Требуется вернуть только 20 записей
       *    );
       * </pre>
       */
      reload: propertyUpdateWrapper(function (filter, sorting, offset, limit) {
         if (this._options.pageSize) {
            this._limit = this._options.pageSize;
         }

         var
            def,
            self = this,
            filterChanged = typeof(filter) !== 'undefined',
            sortingChanged = typeof(sorting) !== 'undefined',
            offsetChanged = typeof(offset) !== 'undefined',
            limitChanged = typeof(limit) !== 'undefined';

         this._cancelLoading();
         if (filterChanged) {
            this.setFilter(filter, true);
         }
          if (sortingChanged) {
             this.setSorting(sorting, true);
          }
          this._offset = offsetChanged ? offset : this._offset;
          this._limit = limitChanged ? limit : this._limit;

          if (this._dataSource) {
             this._toggleIndicator(true);
             this._notify('onBeforeDataLoad', this._options.filter, this.getSorting(), this._offset, this._limit);
             /*класс для автотестов*/
             this._container.removeClass('controls-ListView__dataLoaded');
             def = this._callQuery(this._options.filter, this.getSorting(), this._offset, this._limit)
                .addCallback(fHelpers.forAliveOnly(function (list) {
                    var hasItems = !!this._items;

                    self._toggleIndicator(false);
                    self._notify('onDataLoad', list);
                    self._processingData(list);

                    if(hasItems) {
                       if(!self._options.autoRedraw) {
                          self.redraw();
                       }
                    } else {
                       self.redraw();
                    }
                    if (self._options.infiniteScroll === 'up'){
                       var firstItem = self._itemsProjection.at(0);
                       if (firstItem) {
                           self._scrollToItem(firstItem.getContents().getId());
                       }
                    }
                    //self._notify('onBeforeRedraw');
                    return list;
                }, self))
                .addErrback(fHelpers.forAliveOnly(function (error) {
                   if (!error.canceled) {
                      self._toggleIndicator(false);
                      if (self._notify('onDataLoadError', error) !== true) {
                         fcHelpers.message(error.message.toString().replace('Error: ', ''));
                      }
                   }
                   return error;
                }, self));
             this._loader = def;
          } else {
             if (this._items) {
                this._redraw();
             }
             def = new Deferred();
             def.callback();
          }

         this._notifyOnPropertyChanged('filter');
         this._notifyOnPropertyChanged('sorting');
         this._notifyOnPropertyChanged('offset');
         this._notifyOnPropertyChanged('limit');

         return this._loader;
      }),

      _processingData: function(list) {
         var hasItems = !!this._items;

         if (hasItems) {
            this._dataSet.setMetaData(list.getMetaData());
            this._items.assign(list);
            if (this._items !== this._dataSet) {
               this._dataSet.assign(list);
            }
         } else {
            this._items = list;
            this._dataSet = list;
            this._createDefaultProjection(this._items);
            this._setItemsEventHandlers();
            this._notify('onItemsReady');
            this._itemsReadyCallback();
         }

         this._dataLoadedCallback();
      },

      _callQuery: function (filter, sorting, offset, limit) {
         if (!this._dataSource) {
            return;
         }
         var query = new Query();
         query.where(filter)
            .offset(offset)
            .limit(limit)
            .orderBy(sorting);

         return this._dataSource.query(query).addCallback((function(dataSet) {
            if (this._options.idProperty && this._options.idProperty !== dataSet.getIdProperty()) {
               dataSet.setIdProperty(this._options.idProperty);
            }
            return dataSet.getAll();
         }).bind(this));
      },

      _toggleIndicator:function(){
         /*Method must be implemented*/
      },
      _toggleEmptyData:function() {
         /*Method must be implemented*/
      },
       /**
        * Метод установки количества элементов на одной странице.
        * @param {Number} pageSize Количество элементов.
        * @example
        * <pre>
        *     myListView.setPageSize(20);
        * </pre>
        * @remark
        * Метод задаёт/меняет количество элементов при построении представления данных.
        * В случае дерева и иерархии:
        * <ul>
        *    <li>при пейджинге по скроллу опция также задаёт количество подгружаемых элементов кликом по кнопке "Ещё";</li>
        *    <li>элементами являются и листья, и узлы; общее количество элементов считается относительно полностью
        *    развёрнутого представления данных. Например, узел с тремя листьями - это 4 элемента.</li>
        * </ul>
        * @see pageSize
        */
      setPageSize: function(pageSize){
         this._options.pageSize = pageSize;
         this._dropPageSave();
         this.reload(this._options.filter, this.getSorting(), 0, pageSize);
      },
      /**
       * Метод получения количества элементов на одной странице.
       * @see pageSize
       */
      getPageSize: function() {
         return this._options.pageSize
      },
      /**
       * Получить текущий фильтр в наборе данных
       * @returns {Object|*|DSMixin._filter}
       */
      getFilter: function() {
         return this._options.filter;
      },
      /**
       * Установить фильтр на набор данных
       * @param {Object} filter
       * @param {Boolean} noLoad установить фильтр без запроса на БЛ
       */
      setFilter: function(filter, noLoad){
         this._options.filter = filter;
         this._dropPageSave();
         if (this._dataSource && !noLoad) {
            this.reload(this._options.filter, this.getSorting(), 0, this.getPageSize());
         } else {
            this._notifyOnPropertyChanged('filter');
         }
      },
      /**
       * Получает текущую сортировку
       * @returns {Array}
       */
      getSorting: function() {
         return this._options.sorting;
      },
      /**
       * Устанавливает текущую сортировку
       */
      setSorting: function(sorting, noLoad) {
         this._options.sorting = sorting;
         this._dropPageSave();
         if (this._dataSource && !noLoad) {
            this.reload(this._options.filter, this.getSorting(), 0, this.getPageSize());
         }
      },
      /**
       * Получить текущий сдвиг навигации
       * @returns {Integer}
       */
      getOffset: function() {
         return this._offset;
      },
      /**
       * Устанавливает текущий сдвиг навигации
       */
      setOffset: function(offset) {
         this._offset = offset;
      },
      //переопределяется в HierarchyMixin
      _setPageSave: function(pageNum){
      },
      //переопределяется в HierarchyMixin
      _dropPageSave: function () {
      },
      /**
       * @deprecated метод будет удален в 3.7.4 используйте isLoading()
       * @private
       */
      _isLoading: function () {
         IoC.resolve('ILogger').log('ListView', 'Метод _isLoading() будет удален в 3.7.4 используйте isLoading()');
         return this.isLoading();
      },
      isLoading: function () {
         return this._loader && !this._loader.isReady();
      },
      //TODO Сделать публичным? вроде так всем захочется делать
      /**
       * После использования нужно присвоить null переданному loader самостоятельно!
       * @param loader
       * @private
       */
      _cancelLoading: function () {
         if (this.isLoading()) {
            this._loader.cancel();
         }
         this._loader = null;
      },
      //TODO поддержка старого - обратная совместимость
      getItems : function() {
         return this._items;
      },
      _getItemsProjection: function() {
         return this._itemsProjection;
      },
       /**
        * Устанавливает набор элементов коллекции.
        * @param {Array.<Object>} items Набор новых данных, по которому строится отображение.
        * @example
        * <pre>
        *     var myItems = [ // Подготавливаем новый набор элементов коллекции
        *         {
        *            id: 1,
        *            title: 'Сообщения'
        *         },{
        *            id: 2,
        *            title: 'Прочитанные',
        *            parent: 1
        *         },{
        *            id: 3,
        *            title: 'Непрочитанные',
        *            parent: 1
        *         }
        *     ];
        *     myControl.setItems(myItems); // Устанавливаем новый набор элементов коллекции.
        * </pre>
        * @see items
        * @see addItem
        * @see getItems
        * @see onDrawItems
        * @see onDataLoad
        */
       setItems: function (items) {
         this._unsetItemsEventHandlers();
         this._items = null;
         this._prepareConfig(undefined, items);
          if(items instanceof Array) {
             this.reload();
          } else {
             this.redraw();
          }
      },

      _drawItemsCallback: function () {
         /*Method must be implemented*/
      },
      /**
       * Метод перерисовки набора элементов коллекции без запроса к источнику данных.
       * @remark
       * Используется в случаях, когда данные были изменены только на клиентской стороне приложения.
       * Их не требуется изменять в БД, нужно только отобразить в текущем представлении.
       * @see autoRedraw
       */
      redraw: function() {
         this._redraw();
      },
      _redraw: function () {
         var records;

         if (this._items) {
            this._clearItems();
            this._needToRedraw = false;
            records = this._getRecordsForRedraw();
            this._toggleEmptyData(!records.length && this._options.emptyHTML);
            this._drawItems(records);
         }
         /*класс для автотестов*/
         this._container.addClass('controls-ListView__dataLoaded');
      },
      _destroySearchBreadCrumbs: function(){
      },
      _getRecordsForRedraw : function() {
         var records = [];
         this._itemsProjection.each(function(item){
            records.push(item.getContents());
         });
         return records;
      },

      _drawItems: function (records, at) {
         var
            curAt = at,
               targetContainer;
         if (records && records.length > 0) {
            for (var i = 0; i < records.length; i++) {
               this._drawAndAppendItem(records[i], curAt, i === records.length - 1);
               if (curAt && curAt.at) {
                  curAt.at++;
               }
            }
         } else {
            this._notifyOnDrawItems();
         }
         this._reviveItems();
      },

      _reviveItems : function() {
         this.reviveComponents().addCallback(this._notifyOnDrawItems.bind(this)).addErrback(function(e){
            throw e;
         });
      },

      /**
       * Сигналит о том, что отрисовка набора закончена
       */
      _notifyOnDrawItems: function() {
         this._notify('onDrawItems');
         this._drawItemsCallback();
      },

      _clearItems: function (container) {
         container = container || this._getItemsContainer();
         /*Удаляем компоненты-инстансы элементов*/
         if (!Object.isEmpty(this._itemsInstances)) {
            for (var i in this._itemsInstances) {
               if (this._itemsInstances.hasOwnProperty(i)) {
                  this._itemsInstances[i].destroy();
               }
            }
         }
         this._itemsInstances = {};
         if (container.length){
            var itemsContainers;
            //В случае, когда это полная перерисовка, надо дестроить контролы только в итемах и группировках
            if (container.get(0) == this._getItemsContainer().get(0)) {
               itemsContainers = $('.controls-ListView__item, .controls-GroupBy', container.get(0));
               /*Удаляем вложенные компоненты*/
               this._destroyControls(itemsContainers);

               /*Удаляем сами items*/
               itemsContainers.remove();
            }
            else {
               this._destroyControls(container);
            }

         }
      },

      _destroyControls: function(container){
         $('[data-component]', container).each(function (i, item) {
            var inst = item.wsControl;
            if (inst) {
               inst.destroy();
            }
         });
      },
      //метод определяющий в какой контейнер разместить определенный элемент
      _getTargetContainer: function (item) {
         //по стандарту все строки рисуются в itemsContainer
         return this._getItemsContainer();
      },

      //метод отдающий контейнер в котором надо отрисовывать элементы
      _getItemsContainer: function () {
         return this._container;
      },

      /**
       * Метод перерисовки определенного элемента коллекции.
       * @param {Object} item Элемент коллекции, который необходимо перерисовать.
       */
      redrawItem: function(item) {
         var
            targetElement = this._getElementByModel(item),
            newElement = this._drawItem(item);
         targetElement.after(newElement).remove();
         this._reviveItems();
      },

      _getElementByModel: function(item) {
         return this._getItemsContainer().find('.js-controls-ListView__item[data-id="' + item.getId() + '"]');
      },

      _drawItem: function (item, at, last) {
         var
            itemInstance;
         //Запускаем группировку если она есть. Иногда результат попадает в группровку и тогда отрисовывать item не надо
         if (this._group(item, at, last) !== false) {
            itemInstance = this._createItemInstance(item, this._getTargetContainer(item), at);
            this._addItemAttributes(itemInstance, item);
         }
         return itemInstance;
      },

      _drawAndAppendItem: function(item, at, last) {
         var
            itemInstance = this._drawItem(item, at, last);
         if (itemInstance) {
            this._appendItemTemplate(item, this._getTargetContainer(item), itemInstance, at);
         }
      },

      /**
       *
       * Из метода группировки можно вернуть Boolean - рисовать ли группировку
       * или Объект - {
       *    drawItem - рисовать ли текущий элемент коллекции
       *    drawGroup - рисовать ли группировку перед текущим элементом коллекции
       * }
       * @param item
       * @param at
       */
      _group: function(item, at, last){
         var groupBy = this._options.groupBy,
               resultGroup,
               drawGroup,
               drawItem = true;
         if (!Object.isEmpty(groupBy)){
            resultGroup = groupBy.method.apply(this, [item, at, last]);
            drawGroup = typeof resultGroup === 'boolean' ? resultGroup : (resultGroup instanceof Object && resultGroup.hasOwnProperty('drawGroup') ? !!resultGroup.drawGroup : false);
            drawItem = resultGroup instanceof Object && resultGroup.hasOwnProperty('drawItem') ? !!resultGroup.drawItem : true;
            if (drawGroup){
               this._drawGroup(item, at, last)
            }
         }
         return drawItem;
      },
      _drawGroup: function(item, at, last){
         var
               groupBy = this._options.groupBy,
               tplOptions = {
                  columns : cFunctions.clone(this._options.columns || []),
                  multiselect : this._options.multiselect,
                  hierField: this._options.hierField + '@'
               },
               targetContainer,
               itemInstance;
         targetContainer = this._getTargetContainer(item);
         tplOptions.item = item;
         tplOptions.colspan = tplOptions.columns.length + this._options.multiselect;
         itemInstance = this._buildTplItem(item, groupBy.template(tplOptions));
         this._appendItemTemplate(item, targetContainer, itemInstance, at);
         //Сначала положим в дом, потом будем звать рендеры, иначе контролы, которые могут создать в рендере неправмльно поймут свою ширину
         if (groupBy.render && typeof groupBy.render === 'function') {
            groupBy.render.apply(this, [item, itemInstance, last]);
         }
         //Навесим класс группировки и удалим лишний класс на item, если он вдруг добавился
         itemInstance.addClass('controls-GroupBy')
               .removeClass('controls-ListView__item');

      },
      /**
       * Устанавливает группировку элементов коллекции.
       * @remark
       * Подробнее о группировках элементов коллекции вы можете прочитать в описании к опции {@link groupBy}.
       * Всем элементам группы добавляется css-класс controls-GroupBy.
       * @param {GroupBy} group Объект с настройками группировки элементов.
       * Обязательными для конфигурации являются подопции method, template и render. Полный список подопций вы можете найти в описании к типу данных {@link SBIS3.CONTROLS.DSMixin/GroupBy.typedef}.
       * @param {Boolean} [redraw=false] Признак, по которому устанавливается необходимость перерисовски набора элементов коллекции без запроса к источнику данных.
       * В значении true будет произведена перерисовка.
       * @example
       * <pre>
       * myView.setGroupBy( // Устанавливаем группировку отображаемых записей
       *    {
       *       field: 'ДатаВхода', // Имя поля, по которому будет производиться группировка
       *       method: function(record) {
       *          // Получаем от записи значение поля ДатаВхода, это объекты типа Date
       *          var curField = record.get(this._options.groupBy.field),
       *              curTime = curField.getTime(); // Ролучаем значение даты в приемлемом виде для сравнения
       *          if (this._previousGroupBy) { // Проверяем записано ли предыдущее значение поля для группировк
       *             result = curTime !== this._previousGroupBy.getTime(); // Сравниваем предыдущее и текущее значения полей для группировки
       *             this._previousGroupBy = curField; // Записываем текущее значение поля группировки в переменную
       *             return result; // Возвращаем результат сравнения, здесь мы определяем рисовать или нет шаблон группировки
       *          } else { // Этот блок срабатываем в первый раз, когда предыдущего значение поля группировки неизвестны
       *             this._previousGroupBy = curField; // Записываем текущее значение поля группировки в переменную
       *             return true;
       *          }
       *       },
       *       template: groupTpl // Устанавливаем шаблон группировки
       *    },
       *    true
       * });
       * @see groupBy
       */
      setGroupBy : function(group, redraw){
         //TODO может перерисовку надо по-другому делать
         this._options.groupBy = group;
         // запросим данные из источника
         if (!Object.isEmpty(this._options.groupBy)){
            if (!this._options.groupBy.hasOwnProperty('method')){
               this._options.groupBy.method = this._groupByDefaultMethod;
            }
            if (!this._options.groupBy.hasOwnProperty('template')){
               this._options.groupBy.template = this._getGroupTpl();
            }
            if (!this._options.groupBy.hasOwnProperty('render')){
               this._options.groupBy.render = this._groupByDefaultRender;
            }

         }
         if (redraw){
            this._redraw();
         }
      },
      _groupByDefaultMethod: function(){
         throw new Error('Method _groupByDefaultMethod() must be implemented');
      },
      _getGroupTpl : function(){
         throw new Error('Method _getGroupTpl() must be implemented');
      },
      _groupByDefaultRender: function(){
         throw new Error('Method _groupByDefaultRender() must be implemented');
      },
      _getItemTemplate: function () {
         throw new Error('Method _getItemTemplate() must be implemented');
      },

      _addItemAttributes: function (container, item) {
         var strKey = item.getId();
         if (strKey == null) {
            strKey += '';
         }
         container.attr('data-id', strKey).addClass('controls-ListView__item');
         if (this._options.userItemAttributes && this._options.userItemAttributes instanceof Function) {
            this._options.userItemAttributes(container, item);
         }
      },

      _createItemInstance: function (item, targetContainer, at) {
         return this._buildTplItem(item, this._getItemTemplate(item));
      },

      _buildTplItem: function(item, itemTpl){
         var dotTemplate = TemplateUtil.prepareTemplate(itemTpl);

         if (typeof dotTemplate == 'function') {
            return $(dotTemplate(this._buildTplArgs(item)));
         } else {
            throw new Error('Ошибка в itemTemplate');
         }
      },
      _buildTplArgs: function(item) {
         var tplOptions = {
            templateBinding : this._options.templateBinding,
            item: item
         };
         if (this._options.includedTemplates) {
            var tpls = this._options.includedTemplates;
            tplOptions.included = {};
            for (var j in tpls) {
               if (tpls.hasOwnProperty(j)) {
                  tplOptions.included[j] = TemplateUtil.prepareTemplate(tpls[j]);
               }
            }
         }
         return tplOptions
      },
      _appendItemTemplate: function (item, targetContainer, itemBuildedTpl, at) {
         if (at && (typeof at.at !== 'undefined')) {
            var atContainer = at.at !== 0 && $('.controls-ListView__item', this._getItemsContainer().get(0)).eq(at.at-1);
            if (atContainer.length) {
               atContainer.after(itemBuildedTpl);
            }
            else {
               atContainer = $('> .controls-ListView__item', this._getItemsContainer().get(0)).eq(at.at);
               if (atContainer.length) {
                  atContainer.before(itemBuildedTpl);
               } else {
                  targetContainer.append(itemBuildedTpl);
               }
            }
         }
         else {
            targetContainer.append(itemBuildedTpl);
         }
      },

      _fillItemInstances: function () {
         var childControls = this.getChildControls();
         for (var i = 0; i < childControls.length; i++) {
            if (childControls[i].getContainer().hasClass('controls-ListView__item')) {
               var id = childControls[i].getContainer().attr('data-id');
               this._itemsInstances[id] = childControls[i];
            }
         }

      },
       /**
        * Метод получения элементов коллекции.
        * @returns {*}
        * @example
        * <pre>
        *     var ItemsInstances = Menu.getItemsInstances();
        *     for (var i = 0; i < ItemsInstances.length; i++){
        *        ItemsInstances[i].setCaption('Это пункт меню №' + ItemsInstances[i].attr('data-id'));
        *     }
        * </pre>
        */
      getItemsInstances: function () {
         if (Object.isEmpty(this._itemsInstances)) {
            this._fillItemInstances();
         }
         return this._itemsInstances;
      },
       /**
        * Метод получения контрола по идентификатору элемента коллекции.
        * @param {String|Number|*} id Идентификатор элемента коллекции.
        * @returns {*} Возвращает:
        * <ul>
        *    <li>для группы радиокнопок - соответствующую радиокнопку;</li>
        *    <li>для группы флагов - соответствующий флаг;</li>
        *    <li>для меню - соответствующий элемент меню.</li>
        * </ul>
        * @example
        * <pre>
        *     Menu.getItemsInstance(3).setCaption('SomeNewCaption');
        * </pre>
        * @see getItems
        * @see setItems
        * @see items
        * @see getItemInstances
        */
      getItemInstance: function (id) {
         var instances = this.getItemsInstances();
         return instances[id];
      },
      //TODO Сделать публичным? И перенести в другое место
      _hasNextPage: function (hasMore, offset) {
         offset = offset == undefined ? this._offset : offset;
         //n - приходит true, false || общее количество записей в списочном методе
         //Если offset отрицательный, значит запрашивали последнюю страницу
         return offset < 0 ? false : (typeof (hasMore) !== 'boolean' ? hasMore > (offset + this._options.pageSize) : !!hasMore);
      },
      _scrollToItem: function(itemId) {
         var itemContainer  = $('.controls-ListView__item[data-id="' + itemId + '"]', this._getItemsContainer());
         if (itemContainer.length) {
            itemContainer
               .attr('tabindex', -1)
               .focus();
         }
      },
      /**
       * Устанавливает текст, который будет отображаться при отсутствии элементов коллекции.
       * @param html Отображаемый текст.
       * @example
       * <pre>
       *     DataGridView.setEmptyHTML('Данные отсутствуют');
       * </pre>
       * @see emptyHTML
       */
      setEmptyHTML: function (html) {
         this._options.emptyHTML = html;
      },
      /**
       * Возвращает источник данных.
       * @remark
       * Метод создает экземпляр класса источника данных. Экземпляр класса будет содержать данные,
       * если источник данных - статический.
       * @returns {*}
       * @see dataSource
       * @see setDataSource
       */
      getDataSource: function(){
         return this._dataSource;
      },

      _dataLoadedCallback: function () {

      },
      _itemsReadyCallback: function() {

      },

      _addItem: function (item, at) {
         var previousGroupBy = this._previousGroupBy;//После добавления записи восстанавливаем это значение, чтобы не сломалась группировка
         /*TODO отдельно обрабатываем случай с группировкой*/
         var flagAfter = false;
         if (!Object.isEmpty(this._options.groupBy)) {
            var
               meth = this._options.groupBy.method,
               prev = this._itemsProjection.getPrevious(item),
               next = this._itemsProjection.getNext(item);
            if(prev)
                meth.call(this, prev.getContents());
            meth.call(this, item.getContents());
            if (next && !meth.call(this, next.getContents())) {
               flagAfter = true;
            }
         }
         /**/
         item = item.getContents();
         var target = this._getTargetContainer(item),
            currentItemAt = at > 0 ? this._getItemContainerByIndex(target, at - 1) : null,
            template = this._getItemTemplate(item),
            newItemContainer = this._buildTplItem(item, template),
            rows;
         this._addItemAttributes(newItemContainer, item);
         if (flagAfter) {
            newItemContainer.insertBefore(this._getItemContainerByIndex(target, at));
            rows = [newItemContainer.prev().prev(), newItemContainer.prev(), newItemContainer, newItemContainer.next(), newItemContainer.next().next()];
         } else if (currentItemAt && currentItemAt.length) {
            meth && meth.call(this, prev.getContents());
            newItemContainer.insertAfter(currentItemAt);
            rows = [newItemContainer.prev().prev(), newItemContainer.prev(), newItemContainer, newItemContainer.next(), newItemContainer.next().next()];
         } else if(at === 0) {
            this._previousGroupBy = undefined;
            newItemContainer.prependTo(target);
            rows = [newItemContainer, newItemContainer.next(), newItemContainer.next().next()];
         } else {
            newItemContainer.appendTo(target);
            rows = [newItemContainer.prev().prev(), newItemContainer.prev(), newItemContainer, newItemContainer.next()];
         }
         this._group(item, {at: at});
         this._previousGroupBy = previousGroupBy;
      },
      _isNeedToRedraw: function(){
      	return this._options.autoRedraw && this._needToRedraw && !!this._getItemsContainer();
      },

      _moveItem: function(item, to){
         item = item.getContents();
         var
            targetNode = this._getTargetContainer(item),
            fromContainer = this._getItemContainer(targetNode, item),
            toContainer = this._getItemContainerByIndex(targetNode, to);
         if (fromContainer.length && toContainer.length) {
            fromContainer.insertAfter(toContainer);
         }
      },

      _removeItem: function (item) {
         item = item.getContents();
         var container = this._getItemContainer(this._getTargetContainer(item), item);
         /*TODO отдельно обрабатываем случай с группировкой*/
         if (!Object.isEmpty(this._options.groupBy)) {
            var
               prevContainer = container.prev(),
               nextContainer = container.next();
            /*Если спереди группировка, а сзади группировка или конец, значит это последний элемент группы и надо удалить группировку*/
            if (prevContainer.length && prevContainer.hasClass('controls-GroupBy')) {
               if (!nextContainer.length || nextContainer.hasClass('controls-GroupBy')) {
                  prevContainer.remove();
               }
            }
         }
         /**/
         if (container.length) {
            this._clearItems(container);
            container.remove();
         }
      },

      _updateItem: function(item) {
         item = item.getContents();
         var container = this._getItemContainer(this._getTargetContainer(item), item),
            lostFocus = document.activeElement === container.get(0),
            template = this._getItemTemplate(item);

         if (container.length) {
            var newItemContainer = this._buildTplItem(item, template);
            this._addItemAttributes(newItemContainer, item);
            this._clearItems(container);
            container.replaceWith(newItemContainer);
            //если фокус ушёл на строку, которая была удалена то вернём фокус на контейнер контрола.
            if (lostFocus) {
               this.getContainer().focus();
            }
         }
         //TODO: код понадобится для частичной перерисовки после перемещения
         /*else if(this.getItems().getIndex(item) > -1) {
            //todo если записи нет в доме но она есть в рекордстее  и ее кто то изменит, то она должна перерисоваться
            //todo нужно когда запись перемещается из закрытой папки
            this.redraw();
         }*/
      },

      _getItemContainerByIndex: function(parent, at) {
         return parent.find('> .controls-ListView__item:eq(' + at + ')');
      },

      _getItemContainer: function(parent, item) {
         return parent.find('>[data-id="' + item.getId() + '"]');
      }
   };

   var
      onCollectionItemChange = function(eventObject, item, index, property){
         if (this._isNeedToRedraw()) {
            this._updateItem(item);
            this._reviveItems();
         }
      },
      /**
       * Обрабатывает событие об изменении коллекции.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} action Действие, приведшее к изменению.
       * @param {WS.Data/Display/CollectionItem[]} newItems Новые элементы коллеции.
       * @param {Integer} newItemsIndex Индекс, в котором появились новые элементы.
       * @param {WS.Data/Display/CollectionItem[]} oldItems Удаленные элементы коллекции.
       * @param {Integer} oldItemsIndex Индекс, в котором удалены элементы.
       * @private
       */
      onCollectionChange = function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         var i;
         if (this._isNeedToRedraw()) {
	         switch (action) {
	            case IBindCollection.ACTION_ADD:
	            case IBindCollection.ACTION_REMOVE:
	               for (i = 0; i < oldItems.length; i++) {
	                  this._removeItem(
	                     oldItems[i]
	                  );
	               }
	               for (i = 0; i < newItems.length; i++) {
	                  this._addItem(
	                     newItems[i],
                        newItemsIndex + i
	                  );
	               }
                  this._toggleEmptyData(!this._itemsProjection.getCount());
	               //this._view.checkEmpty(); toggleEmtyData
	               this._reviveItems();
	               break;

	            case IBindCollection.ACTION_MOVE:
                   //TODO: код понадобится для частичной перерисовки после перемещения
	               /*for (i = 0; i < newItems.length; i++) {
	                  this._moveItem(
	                     newItems[i],
	                     newItemsIndex + newItems.length - 1
	                  );
	               }
	               this._reviveItems();*/
	               break;

	            case IBindCollection.ACTION_REPLACE:
	               for (i = 0; i < newItems.length; i++) {
	                  this._updateItem(
	                     newItems[i]
	                  );
	               }
	               this._reviveItems();
	               break;

	            case IBindCollection.ACTION_RESET:
	               this.redraw();
	               break;
	         }
      	}
      };
   return DSMixin;

});