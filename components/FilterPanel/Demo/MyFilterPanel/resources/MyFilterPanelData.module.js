define('js!SBIS3.CONTROLS.Demo.MyFilterPanelData', ['js!WS.Data/Collection/RecordSet'], function(RecordSet) {
   var
      data = [
         {
            id: 'Регион',
            caption: 'Регион',
            expanded: true,
            value: [11, 12],
            resetValue: [11],
            template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
            properties: {
               items: new RecordSet({
                  rawData: [
                     {'title': 'Краснодарский край', 'id': 1, count: 11},
                     {'title': 'Владимирская область', 'id': 2, count: 12},
                     {'title': 'Нижегородская область', 'id': 3,count: 13},
                     {'title': 'Астраханская область', 'id': 4,  count: 14},
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
               })
            }
         },
         {
            caption: 'Поставщики',
            expanded: true,
            id: 'Поставщики',
            value: [1],
            resetValue: [],
            template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
            properties: {
               items: new RecordSet({
                  rawData:[
                     { id: 1, title: 'ВТБ Капитал, АО', count: 10 },
                     { id: 2, title: 'НК "Роснефть", ОАО', count: 39 }
                  ],
                  idProperty: 'id'
               }),
               editor: 'dictionary',
               dictionaryTemplate: 'js!SBIS3.CONTROLS.Demo.FilterViewDemoTemplate'
            }
         },
         {
            caption: 'Поставщики с избранными длинный текст',
            expanded: true,
            id: 'Поставщики с избранными',
            value: [1,2],
            resetValue: [],
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
               dictionaryTemplate: 'js!SBIS3.CONTROLS.Demo.FilterViewDemoTemplate',
               favoritesCount: 10,
               favorites: new RecordSet({
                  rawData:[
                     { id: 1, title: 'ВТБ Капитал, АО', count: 10 },
                     { id: 2, title: 'НК "Роснефть", ОАО', count: 39 }
                  ],
                  idProperty: 'id'
               })
            }
         },
         {
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
         },
         {
            caption: 'ЖНВЛП',
            expanded: true,
            id: 'ЖНВЛП',
            value: true,
            resetValue: false,
            template: 'js!SBIS3.CONTROLS.FilterPanelBoolean',
            className: 'controls-FilterPanelItem__withSeparator'
         },
         {
            caption: 'В наличии',
            expanded: true,
            id: 'В наличии',
            value: false,
            resetValue: false,
            template: 'js!SBIS3.CONTROLS.FilterPanelBoolean'
         },
         {
            caption: 'Оплата',
            expanded: true,
            id: 'Оплата',
            value: 'yes',
            resetValue: null,
            template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
            properties: {
               items: new RecordSet({
                  rawData:[
                     { id: 'yes', title: 'Оплачено' },
                     { id: 'no', title: 'Не оплачено' }
                  ],
                  idProperty: 'id'
               }),
               editor: 'radio'
            }
         }
      ];

   return data;
});