define('js!SBIS3.CONTROLS.Demo.MyFilterPanelData', function() {
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
               items: [
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
                  {'title': 'Республика Крым', 'id': 12, count: 21}]
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
               items: [
                  { id: 1, title: 'ВТБ Капитал, АО', count: 10 },
                  { id: 2, title: 'НК "Роснефть", ОАО', count: 39 } ],
               viewMode: 'dictionary',
               dictionaryTemplate: 'js!SBIS3.CONTROLS.Demo.FilterViewDemoTemplate'
            }
         },
         {
            caption: 'Поставщики с избранными длинное название',
            expanded: true,
            id: 'Поставщики с избранными',
            value: [1,2],
            resetValue: [],
            template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
            properties: {
               items: [
                  { id: 1, title: 'ВТБ Капитал, АО', count: 10 },
                  { id: 2, title: 'НК "Роснефть", ОАО', count: 39 } ],
               viewMode: 'favorites',
               dictionaryTemplate: 'js!SBIS3.CONTROLS.Demo.FilterViewDemoTemplate',
               favoritesCount: 10,
               favorites: [1, 2]
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
            properties: {
               minValue: 1,
               maxValue: 200000,
               middleLabel: '-',
               endLabel: '₽'
            }
         }
      ];

   return data;
});