define('js!SBIS3.CONTROLS.Demo.MyFilterPanelData', ['js!WS.Data/Collection/RecordSet', 'js!WS.Data/Source/Memory'], function(RecordSet, Memory) {
   var
      data = [
         {
            id: 'Регион',
            caption: 'Регион',
            expanded: true,
            value: [],
            resetValue: [11],
            textValue: '',
            template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
            properties: {
               editor: 'list',
               properties: {
                  items: new RecordSet({
                     rawData: [
                        {'title': 'Краснодарский край', 'id': 1, count: 11},
                        {'title': 'Владимирская область', 'id': 2, count: 12},
                        {'title': 'Нижегородская область', 'id': 3, count: 13},
                        {'title': 'Астраханская область', 'id': 4, count: 14},
                        {'title': 'Белгородская область', 'id': 5, count: 15},
                        {'title': 'Вологодская область', 'id': 6, count: 16},
                        {'title': 'Псковская область', 'id': 7, count: 17},
                        {'title': 'Самарская область', 'id': 8, count: 18},
                        {'title': 'Ярославская область', 'id': 9, count: 19},
                        {'title': 'Московская область', 'id': 10, count: 10},
                        {'title': 'Калужская область', 'id': 11, count: 20},
                        {'title': 'Республика Крым', 'id': 12, count: 21}
                     ],
                     idProperty: 'id'
                  }),
                  idProperty: 'id',
                  displayProperty: 'title'
               }
            }
         },
         {
            caption: 'Покупатель',
            expanded: true,
            id: 'Покупатель',
            value: [1],
            resetValue: [],
            textValue: 'Сергей Лукьяненко',
            template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
            properties: {
               editor: 'fieldLink',
               // template: 'tmpl!SBIS3.CONTROLS.FilterPanelChooser.FieldLink/resources/FilterPanelChooserFieldLinkTpl',
               properties: {
                  idProperty: 'книга',
                  placeholder: 'Укажите контрагента',
                  displayProperty: 'автор',
                  multiselect: false,
                  dataSource: new Memory({
                     data: [
                        {'книга': 1, 'автор': 'Сергей Лукьяненко', 'Раздел': null, 'Раздел@': true},
                        {'книга': 1.0, 'автор': 'Сергей Лукьяненко', 'произведение': 'Джамп', 'Раздел': '1', 'Раздел@': null},
                        {'книга': 1.1, 'автор': 'Сергей Лукьяненко', 'произведение': 'Рыцари сорока островов', 'Раздел': '1', 'Раздел@': null},
                        {'книга': 1.3, 'автор': 'Сергей Лукьяненко', 'произведение': 'Лабиринт отражений', 'Раздел': '1', 'Раздел@': null},
                        {'книга': 1.4, 'автор': 'Сергей Лукьяненко', 'произведение': 'Фальшивые зеркала', 'Раздел': '1', 'Раздел@': null},
                        {'книга': 1.5, 'автор': 'Сергей Лукьяненко', 'произведение': 'Прозрачные витражи', 'Раздел': '1', 'Раздел@': null},
                        {'книга': 1.6, 'автор': 'Сергей Лукьяненко', 'произведение': 'Спектр', 'Раздел': '1', 'Раздел@': null},
                        {'книга': 2, 'автор': 'Аркадий и Борис Стругацкие', 'Раздел': null, 'Раздел@': true},
                        {'книга': 2.0, 'автор': 'Аркадий и Борис Стругацкие', 'произведение': 'Жук в муравейнике', 'Раздел': '2', 'Раздел@': null},
                        {'книга': 2.1, 'автор': 'Аркадий и Борис Стругацкие', 'произведение': 'Улитка на склоне', 'Раздел': '2', 'Раздел@': null},
                        {'книга': 2.2, 'автор': 'Аркадий и Борис Стругацкие', 'произведение': 'Трудно быть богом', 'Раздел': '2', 'Раздел@': null},
                        {'книга': 3, 'автор': 'Стивен Кинг', 'Раздел': null, 'Раздел@': true},
                        {'книга': 3.0, 'автор': 'Стивен Кинг', 'произведение': 'Лангольеры', 'Раздел': '3', 'Раздел@': null},
                        {'книга': 3.1, 'автор': 'Стивен Кинг', 'произведение': 'Мобильник', 'Раздел': '3', 'Раздел@': null},
                        {'книга': 3.2, 'автор': 'Стивен Кинг', 'произведение': 'Сияние', 'Раздел': '3', 'Раздел@': null},
                        {'книга': 4, 'автор': 'Андрей Белянин', 'произведение': 'Меч без имени', 'Раздел': null, 'Раздел@': null},
                        {'книга': 5, 'автор': 'Джордж Мартин', 'произведение': 'Песнь льда и пламени', 'Раздел': null, 'Раздел@': null},
                        {'книга': 6, 'автор': 'Евгений Гуляковский', 'произведение': 'Обратная сторона времени', 'Раздел': null, 'Раздел@': null},
                        {'книга': 7, 'автор': 'Сергей Волков', 'произведение': 'Стража последнего рубежа', 'Раздел': null, 'Раздел@': null},
                        {'книга': 8, 'автор': 'Сергей Бадей', 'произведение': 'Свободный полет', 'Раздел': null, 'Раздел@': null},
                        {'книга': 9, 'автор': 'Андрей Ливадный', 'произведение': 'Грань реальности', 'Раздел': null, 'Раздел@': null},
                        {'книга': 10, 'автор': 'Джордж Оруэлл', 'произведение': '1984', 'Раздел': null, 'Раздел@': null}
                     ],
                     idProperty: 'книга'
                  }),
                  dictionaries: [
                     {
                        name: 'SelectorDataFieldLink',
                        template: 'js!SBIS3.CONTROLS.Demo.SelectorDataFieldLink'
                     }
                  ],
                  dictionaryTemplate: 'js!SBIS3.CONTROLS.Demo.FilterViewDemoTemplate',
                  list: {
                     component: 'js!SBIS3.CONTROLS.TreeDataGridView',
                     options: {
                        columns: [
                           { title: 'id', field: 'книга' },
                           { title: 'ФИО', field: 'автор' },
                           { title: 'Произведение', field: 'произведение' }
                        ],
                        idProperty: 'книга',
                        displayProperty: 'автор',
                        hierField: 'Раздел',
                        itemsActions: [],
                        footerTpl: '<component data-component="SBIS3.CONTROLS.Link" name="showAllButton"><option name="caption">Показать все</option></component>'
                     }
                  },
                  searchParam: 'автор'
               }
            }
         },
         {
            caption: 'Поставщики с избранными длинный текст',
            expanded: true,
            id: 'Поставщики с избранными',
            value: [1,2],
            resetValue: [],
            textValue: 'ВТБ Капитал, АО, НК "Роснефть", ОАО',
            template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
            properties: {
               items: new RecordSet({
                  rawData:[
                     { id: 1, title: 'ВТБ Капитал, АО', count: 10 },
                     { id: 2, title: 'НК "Роснефть", ОАО', count: 39 }
                  ],
                  idProperty: 'id'
               }),
               editor: 'favorites',
               dictionaryOptions: {
                  template: 'js!SBIS3.CONTROLS.Demo.FilterViewDemoTemplate'
               },
               favoritesCount: 10,
               favorites: new RecordSet({
                  rawData: [
                     {id: 1, title: 'ВТБ Капитал, АО', count: 10},
                     {id: 2, title: 'НК "Роснефть", ОАО', count: 39}
                  ],
                  idProperty: 'id'
               }),
               defaultItems: new RecordSet({
                  rawData: [
                     {id: 1, title: 'ВТБ Капитал, АО', count: 10},
                     {id: 2, title: 'НК "Роснефть", ОАО', count: 39}
                  ],
                  idProperty: 'id'
               }),
               properties: {
                  items: new RecordSet({
                     rawData: [
                        {id: 1, title: 'ВТБ Капитал, АО', count: 10},
                        {id: 2, title: 'НК "Роснефть", ОАО', count: 39}
                     ],
                     idProperty: 'id'
                  }),
                  idProperty: 'id',
                  displayProperty: 'title'
               }
            }
         },
         /*{
            caption: 'Стоимость',
            expanded: true,
            id: 'Стоимость',
            value: [10000, 150000],
            resetValue: [null, null],
            template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateDataRange',
            properties: {
               minValue: 1,
               maxValue: 200000,
               middleLabel: '-',
               endLabel: '₽'
            }
         },*/
         /*{
            caption: 'ЖНВЛП',
            expanded: true,
            id: 'ЖНВЛП',
            value: true,
            resetValue: false,
            textValue: 'ЖНВЛП',
            template: 'js!SBIS3.CONTROLS.FilterPanelBoolean',
            className: 'controls-FilterPanelItem__withSeparator'
         },
         {
            caption: 'В наличии',
            expanded: true,
            id: 'В наличии',
            value: false,
            resetValue: false,
            textValue: '',
            template: 'js!SBIS3.CONTROLS.FilterPanelBoolean'
         },*/
         {
            caption: 'Оплата',
            expanded: true,
            id: 'Оплата',
            value: 'yes',
            resetValue: null,
            textValue: 'Оплачено',
            template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
            properties: {
               editor: 'radio',
               properties: {
                  idProperty: 'id',
                  allowEmptySelection: true,
                  displayProperty: 'title',
                  items: new RecordSet({
                     rawData: [
                        {id: 'yes', title: 'Оплачено'},
                        {id: 'no', title: 'Не оплачено'}
                     ],
                     idProperty: 'id'
                  })
               }
            }
         },
         {
            id: 'Детализация',
            caption: 'Детализация',
            expanded: true,
            value: [{
               id: 1,
               hierarchy: true
            }],
            resetValue: [],
            textValue: '',
            template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
            properties: {
               editor: 'details',
               properties: {
                  idProperty: 'id',
                  displayProperty: 'title',
                  items: new RecordSet({
                     rawData: [
                        { id: 1, 'title': 'Номенклатура', hierarchy: false },
                        { id: 2, 'title': 'Ответственный', hierarchy: true },
                        { id: 3, 'title': 'Покупатель', hierarchy: null },
                        { id: 4, 'title': 'Склад', hierarchy: false }
                     ],
                     idProperty: 'id'
                  })
               }
            }
         }
      ];

   return data;
});