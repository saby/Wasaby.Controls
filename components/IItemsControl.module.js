define('js!SBIS3.CONTROLS.IItemsControl', [], function() {

   'use strict';

   var IItemsControl =/** @lends SBIS3.CONTROLS.IItemsControl.prototype */ {
      /**
       * @event onDrawItems После отрисовки всех элементов коллекции
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
       * @see displayField
       */
      /**
       * @event onDataLoad При загрузке данных
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {SBIS3.CONTROLS.DataSet} dataSet Набор данных.
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
       * @event onDataLoadError При ошибке загрузки данных
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
       * @event onItemsReady при готовности экземпляра коллекции iList
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
      /**
       * Возвращает источник данных.
       * @returns {*}
       * @see dataSource
       * @see setDataSource
       */
      getDataSource: function(){
         throw new Error('Method must be implemented');
      },
      /**
       * Устанавливает источник данных.
       * @remark
       * Если источник данных установлен, значение опции {@link items} будет проигнорировано.
       * @param {DataSource|WS.Data/Source/ISource} source Новый источник данных.
       * @param {Boolean} noLoad Признак, с помощью устанавливается необходимость запроса нового набора данных по установленному источнику.
       * Если параметр установлен в значение true, то данные не будут подгружены, а также не произойдут события {@link onDataLoad}, {@link onItemsReady} или {@link onDataLoadError}.
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
       *           this.getChildControlByName('ComboBox 1').setDataSource(ds1); // Устанавливаем источник представлению данных
       *        }
       *     );
       * </pre>
       * @see dataSource
       * @see getDataSource
       * @see items
       * @see onDataLoad
       * @see onDataLoadError
       * @see onItemsReady
       * @see onDrawItems
       */
      setDataSource: function(source, noLoad) {
         throw new Error('Method must be implemented');
      },
      /**
       * Устанавливает новый набор элементов коллекции.
       * @param {Array.<Object>} items Набор новых данных, по которому строится отображение.
       * @example
       * Для списка устанавливаем набор данных из трёх записей. Опция keyField установлена в значение id, а hierField - parent.
       * <pre>
       *     myView.setItems([
       *        {
        *           id: 1, // Поле с первичным ключом
        *           title: 'Сообщения'
        *        },{
        *           id: 2,
        *           title: 'Прочитанные',
        *           parent: 1 // Поле иерархии
        *        },{
        *           id: 3,
        *           title: 'Непрочитанные',
        *           parent: 1
        *        }
       *     ]);
       * </pre>
       * @see items
       * @see addItem
       * @see getItems
       * @see onDrawItems
       * @see onDataLoad
       */
      setItems: function(items) {
         throw new Error('Method must be implemented');
      },
      getItems: function() {
         throw new Error('Method must be implemented');
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
      reload: function(filter, sorting, offset, limit) {
         throw new Error('Method must be implemented');
      },
      /**
       * Метод установки количества элементов на одной странице.
       * @param {Number} pageSize Количество записей.
       * @param {Boolean} noLoad установить кол-во записей без запроса на БЛ.
       * @example
       * <pre>
       *     myListView.setPageSize(20);
       * </pre>
       * @remark
       * Метод задаёт/меняет количество записей при построении представления данных.
       * В случае дерева и иерархии:
       * <ul>
       *    <li>при пейджинге по скроллу опция также задаёт количество подгружаемых записей кликом по кнопке "Ещё";</li>
       *    <li>как листья, так и узлы являются записями, количество записей считается относительно полностью
       *    развёрнутого представления данных. Например, узел с тремя листьями - это 4 записи.</li>
       * </ul>
       * @see pageSize
       */
      setPageSize: function(pageSize, noLoad) {
         throw new Error('Method must be implemented');
      },
      /**
       * Метод получения количества элементов на одной странице.
       * @see pageSize
       */
      getPageSize: function() {
         throw new Error('Method must be implemented');
      },
      /**
       * Получить текущий фильтр в наборе данных
       * @returns {Object|*|ItemsControlMixin._filter}
       */
      getFilter: function() {
         throw new Error('Method must be implemented');
      },
      /**
       * Установить фильтр на набор данных
       * @param {Object} filter
       * @param {Boolean} noLoad установить фильтр без запроса на БЛ
       */
      setFilter: function(filter, noLoad){
         throw new Error('Method must be implemented');
      },
      /**
       * Устанавливает шаблон для каждого элемента коллекции.
       * @param {String} tpl Шаблон отображения каждого элемента коллекции
       * @example
       * <pre>
       *    <div class="listViewItem" style="height: 30px;">\
       *       {{=it.item.get("title")}}\
       *    </div>
       * </pre>
       */
      setItemTpl: function() {
         throw new Error('Method must be implemented');
      },
      /**
       * {String} Устанавливает поле элемента коллекции, которое является идентификатором записи
       * @example
       * <pre class="brush:xml">
       *     <option name="idProperty">Идентификатор</option>
       * </pre>
       * @see items
       * @see displayProperty
       * @see setDataSource
       * @param {String} idProperty
       */
      setIdProperty: function() {
         throw new Error('Method must be implemented');
      },
      /**
       * @cfg {String} Устанавливает поле элемента коллекции, из которого отображать данные
       * @example
       * <pre class="brush:xml">
       *     <option name="displayProperty">Название</option>
       * </pre>
       * @remark
       * Данные задаются либо в опции {@link items}, либо методом {@link setDataSource}.
       * Источник данных может состоять из множества полей. В данной опции необходимо указать имя поля, данные
       * которого нужно отобразить.
       * @see idProperty
       * @see items
       * @see setDataSource
       * @param {String} displayProperty
       */
      setDisplayProperty: function() {

      }
   };

   return IItemsControl;

});