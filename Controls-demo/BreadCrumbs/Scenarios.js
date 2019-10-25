define('Controls-demo/BreadCrumbs/Scenarios', [
   'Core/Control',
   'wml!Controls-demo/BreadCrumbs/Scenarios/Scenarios',
   'Types/source',
   'Types/entity',
   'Core/constants',
   'Controls-demo/Utils/MemorySourceFilter',
   'wml!Controls-demo/BreadCrumbs/Scenarios/First/columnTemplate',
   'wml!Controls-demo/BreadCrumbs/Scenarios/Second/columnTemplate',
   'wml!Controls-demo/BreadCrumbs/Scenarios/Second/headerTemplate',
   'wml!Controls-demo/BreadCrumbs/Scenarios/Third/columnTemplate',
   'wml!Controls-demo/BreadCrumbs/Scenarios/Third/resultTemplate',
   'wml!Controls-demo/BreadCrumbs/Scenarios/Fourth/columnTemplate',
   'wml!Controls-demo/BreadCrumbs/Scenarios/Fourth/resultTemplate',
   'wml!Controls-demo/BreadCrumbs/Scenarios/Fifth/resultTemplate',
   'wml!Controls-demo/BreadCrumbs/Scenarios/Fifth/columnTemplate',
   'css!Controls-demo/BreadCrumbs/Scenarios/Scenarios'
], function(
   Control,
   template,
   source,
   entity,
   cConstants,
   memorySourceFilter,
   firstColumnTemplate,
   secondColumnTemplate,
   secondHeaderTemplate,
   thirdColumnTemplate,
   thirdResultTemplate,
   fourthColumnTemplate,
   fourthResultTemplate,
   fifthResultTemplate,
   fifthColumnTemplate
) {
   'use strict';

   var Scenarios = Control.extend({
      _template: template,

      _beforeMount: function() {
         this._columns = [{
            template: firstColumnTemplate,
            width: 'auto'
         }];
         this._viewSource = new source.HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: [{
               id: 1,
               'parent': null,
               'parent@': true,
               department: 'Разработка',
               head: 'Новиков Д.В.',
               icon: 'icon-16 icon-Company icon-disabled',
               countOfEmployees: 4,
               counterCaption: 4
            }, {
               id: 11,
               'parent': 1,
               'parent@': null,
               name: 'Новиков Дмитрий',
               photo: cConstants.resourceRoot + 'Controls-demo/BreadCrumbs/Scenarios/images/Novikov.png',
               position: 'Директор департамента разработки',
               phone: '2300'
            }, {
               id: 12,
               'parent': 1,
               'parent@': true,
               department: 'sbis.Communication',
               head: 'Боровиков К.С.',
               icon: 'icon-16 icon-Company icon-disabled',
               countOfEmployees: 3,
               counterCaption: 3
            }, {
               id: 121,
               'parent': 12,
               'parent@': null,
               name: 'Боровиков Кирилл',
               photo: cConstants.resourceRoot + 'Controls-demo/BreadCrumbs/Scenarios/images/Borovikov.png',
               position: 'Заместитель директора по информационным системам',
               phone: '2500'
            }, {
               id: 122,
               'parent': 12,
               'parent@': true,
               department: 'sbis.Communication и соц.сеть',
               head: 'Жукова О.В.',
               countOfEmployees: 2,
               counterCaption: 2
            }, {
               id: 1221,
               'parent': 122,
               'parent@': null,
               name: 'Жукова Ольга',
               photo: cConstants.resourceRoot + 'Controls-demo/BreadCrumbs/Scenarios/images/Zhukova.png',
               position: 'Менеджер проекта (2 категории)',
               phone: '2562'
            }, {
               id: 1222,
               'parent': 122,
               'parent@': true,
               department: 'Проектирование',
               head: 'Жукова О.В.',
               countOfEmployees: 1,
               counterCaption: 1
            }, {
               id: 12221,
               'parent': 1222,
               'parent@': true,
               department: 'Проектирование мобильного приложения',
               countOfEmployees: 1,
               counterCaption: 1
            }, {
               id: 122211,
               'parent': 12221,
               'parent@': null,
               name: 'Белоконь Дарья',
               photo: cConstants.resourceRoot + 'Controls-demo/BreadCrumbs/Scenarios/images/Belokon.png',
               position: 'Проектировщик пользовательских интерфейсов (3+ категории)',
               phone: '6377'
            }]
         });

         this._columns1 = [{
            displayProperty: 'title',
            width: '300px'
         }, {
            displayProperty: 'price',
            width: '72px',
            align: 'right',
            template: secondColumnTemplate
         }, {
            displayProperty: 'remainder',
            width: '70px',
            align: 'right',
            template: secondColumnTemplate
         }, {
            displayProperty: 'free',
            width: '80px',
            align: 'right',
            template: secondColumnTemplate
         }, {
            displayProperty: 'costPrice',
            width: '107px',
            align: 'right',
            template: secondColumnTemplate
         }, {
            displayProperty: 'amountOfBalance',
            width: '110px',
            align: 'right',
            template: secondColumnTemplate
         }];
         this._header1 = [{
            title: ''
         }, {
            title: 'Цена',
            align: 'right',
            template: secondHeaderTemplate
         }, {
            title: 'Остаток',
            align: 'right',
            template: secondHeaderTemplate
         }, {
            title: 'Свободно',
            align: 'right',
            template: secondHeaderTemplate
         }, {
            title: 'Себестоимость',
            align: 'right',
            template: secondHeaderTemplate
         }, {
            title: 'Сумма остатка',
            align: 'right',
            template: secondHeaderTemplate
         }];
         this._viewSource1 = new source.HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: [{
               id: 1,
               'parent': null,
               'parent@': true,
               title: '05. Торговое оборудование'
            }, {
               id: 12,
               'parent': 1,
               'parent@': true,
               title: '02. Онлайн-кассы для 54-ФЗ'
            }, {
               id: 121,
               'parent': 12,
               'parent@': true,
               title: '10. Комплекты модернизации'
            }, {
               id: 1211,
               'parent': 121,
               'parent@': true,
               title: 'Под заказ'
            }, {
               id: 12111,
               'parent': 1211,
               'parent@': true,
               title: '01. Фискальные регистраторы Viki Print'
            }, {
               id: 121111,
               'parent': 12111,
               'parent@': true,
               title: 'С фискальным накопителем на 36 мес.'
            }, {
               id: 1211111,
               'parent': 121111,
               'parent@': null,
               title: 'Фискальный регистратор Viki Print 57 Plus Ф',
               price: 28490,
               remainder: 43,
               free: 40,
               costPrice: 15795,
               amountOfBalance: 28490
            }]
         });
         this._header2 = [{
            title: ''
         }, {
            title: ''
         }, {
            title: 'На начало',
            align: 'right'
         }, {
            title: 'Получено',
            align: 'right'
         }, {
            title: ''
         }, {
            title: 'Выполнено',
            align: 'right'
         }, {
            title: ''
         }, {
            title: 'Осталось',
            align: 'right'
         }];
         this._columns2 = [{
            displayProperty: 'department',
            width: '400px',
            template: firstColumnTemplate,
            resultTemplate: thirdResultTemplate
         }, {
            displayProperty: 'overdueStart',
            width: '70px',
            template: thirdColumnTemplate,
            align: 'right',
            resultTemplate: thirdResultTemplate,
            result: 5662
         }, {
            displayProperty: 'start',
            width: '70px',
            align: 'right',
            resultTemplate: thirdResultTemplate,
            result: 38770
         }, {
            displayProperty: 'received',
            width: '70px',
            align: 'right',
            resultTemplate: thirdResultTemplate,
            result: 579213
         }, {
            displayProperty: 'overdueCompleted',
            width: '70px',
            template: thirdColumnTemplate,
            align: 'right',
            resultTemplate: thirdResultTemplate,
            result: 26277
         }, {
            displayProperty: 'completed',
            width: '75px',
            align: 'right',
            resultTemplate: thirdResultTemplate,
            result: 578386
         }, {
            displayProperty: 'overdueLeft',
            width: '70px',
            template: thirdColumnTemplate,
            align: 'right',
            resultTemplate: thirdResultTemplate,
            result: 2325
         }, {
            displayProperty: 'left',
            width: '70px',
            align: 'right',
            resultTemplate: thirdResultTemplate,
            result: 39597
         }];
         this._viewSource2 = new source.HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: [{
               id: 1,
               parent: null,
               'parent@': true,
               department: 'Технологи',
               overdueStart: 374,
               start: 2226,
               received: 24952,
               overdueCompleted: 2016,
               completed: 24799,
               overdueLeft: 199,
               left: 2379
            }, {
               id: 2,
               parent: null,
               'parent@': true,
               department: 'Разработка',
               overdueStart: 5288,
               start: 36544,
               received: 554261,
               overdueCompleted: 24261,
               completed: 553587,
               overdueLeft: 2126,
               left: 37218
            }, {
               id: 21,
               parent: 2,
               'parent@': true,
               department: 'Платформа',
               overdueStart: 562,
               start: 2664,
               received: 18513,
               overdueCompleted: 1581,
               completed: 18526,
               overdueLeft: 251,
               left: 2651
            }, {
               id: 211,
               parent: 21,
               'parent@': true,
               department: 'Интерфейсный фреймворк',
               overdueStart: 242,
               start: 1234,
               received: 8072,
               overdueCompleted: 528,
               completed: 8038,
               overdueLeft: 134,
               left: 1268
            }, {
               id: 2111,
               parent: 211,
               'parent@': true,
               department: 'Контролы',
               overdueStart: 85,
               start: 755,
               received: 5722,
               overdueCompleted: 350,
               completed: 5744,
               overdueLeft: 17,
               left: 733
            }, {
               id: 21111,
               parent: 2111,
               'parent@': true,
               department: 'Расширенный набор контролов',
               overdueStart: 22,
               start: 329,
               received: 1484,
               overdueCompleted: 107,
               completed: 1685,
               overdueLeft: 3,
               left: 128
            }, {
               id: 211111,
               parent: 21111,
               'parent@': null,
               name: 'Баранов М.А.',
               position: 'Инженер-программист (2 категории)',
               photo: cConstants.resourceRoot + 'Controls-demo/BreadCrumbs/Scenarios/images/Baranov.png',
               start: 35,
               received: 170,
               overdueCompleted: 12,
               completed: 170,
               left: 35
            },{
               id: 211112,
               parent: 21111,
               'parent@': null,
               name: 'Белоконь Д.Д.',
               position: 'Проектировщик пользовательских интерфейсов',
               photo: cConstants.resourceRoot + 'Controls-demo/BreadCrumbs/Scenarios/images/Belokon.png',
               start: 22,
               received: 190,
               overdueCompleted: 6,
               completed: 155,
               left: 35
            }, {
               id: 211113,
               parent: 21111,
               'parent@': null,
               name: 'Боровиков К.К.',
               position: 'аместитель директора по информационным системам',
               photo: cConstants.resourceRoot + 'Controls-demo/BreadCrumbs/Scenarios/images/Borovikov.png',
               start: 345,
               received: 234,
               overdueCompleted: 34,
               completed: 342,
               left: 35
            }
            ]
         });
         this._header3 = [{
            title: ''
         }, {
            title: 'Кол-во',
            align: 'right'
         }, {
            title: 'Ср. цена',
            align: 'right'
         }, {
            title: 'Сумма',
            align: 'right',
            template: secondHeaderTemplate
         }];
         this._columns3 = [{
            displayProperty: 'title',
            width: '500px',
            resultTemplate: thirdResultTemplate
         }, {
            displayProperty: 'amount',
            align: 'right',
            template: fourthColumnTemplate,
            resultTemplate: fourthResultTemplate,
            result: 317814.01
         }, {
            displayProperty: 'price',
            align: 'right',
            template: fourthColumnTemplate,
            resultTemplate: fourthResultTemplate,
            result: 311
         }, {
            displayProperty: 'sum',
            align: 'right',
            template: fourthColumnTemplate,
            resultTemplate: fourthResultTemplate,
            result: 99088195.46
         }];
         this._viewSource3 = new source.HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: [{
               id: 1,
               parent: null,
               'parent@': true,
               title: '05. Торговое оборудование',
               amount: 3611.25,
               price: 3592,
               sum: 12974827.5
            }, {
               id: 11,
               parent: 1,
               'parent@': true,
               title: '01. Онлайн-кассы для 54-ФЗ',
               amount: 925,
               price: 10198,
               sum: 9433770
            }, {
               id: 111,
               parent: 11,
               'parent@': true,
               title: '01. Фискальные регистраторы',
               amount: 97,
               price: 17090,
               sum: 1656750.00
            }, {
               id: 1111,
               parent: 111,
               'parent@': true,
               title: 'С ФН на 36 мес.',
               amount: 25,
               price: 21514,
               sum: 537850.00
            }, {
               id: 11111,
               parent: 1111,
               'parent@': null,
               title: 'Фискальный регистратор Viki Print 57Ф (36 мес.)',
               amount: 5,
               price: 16700.00,
               sum: 83500.00
            }]
         });
         this._header4 = [{
            title: ''
         }, {
            title: 'Сотрудник должен',
            align: 'right'
         }, {
            title: 'Сотруднику должны',
            align: 'right'
         }, {
            title: 'Срок',
            align: 'right'
         }, {
            title: 'Дата',
            align: 'right'
         }];
         this._columns4 = [{
            displayProperty: 'department',
            template: firstColumnTemplate,
            width: '550px',
            resultTemplate: fifthResultTemplate
         }, {
            displayProperty: 'employeeOwes',
            align: 'right',
            width: '100px',
            template: fifthColumnTemplate,
            resultTemplate: fifthResultTemplate,
            result: 2862396.00
         }, {
            displayProperty: 'orgOwes',
            align: 'right',
            width: '100px',
            template: fifthColumnTemplate,
            resultTemplate: fifthResultTemplate,
            result: 4203146.00
         }, {
            displayProperty: 'termInDays',
            align: 'right',
            width: '50px',
            resultTemplate: fifthResultTemplate
         }, {
            displayProperty: 'date',
            align: 'right',
            width: '100px',
            resultTemplate: fifthResultTemplate
         }];
         this._viewSource4 = new source.HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: [{
               id: 1,
               parent: null,
               'parent@': true,
               department: 'Управление региональной сети',
               employeeOwes: 1452964.00,
               orgOwes: 2651962.00,
               termInDays: 932,
               date: '21.03.16'
            }, {
               id: 11,
               parent: 1,
               'parent@': true,
               department: 'Отдел администрирования',
               employeeOwes: 102964.00,
               orgOwes: 951962.00,
               termInDays: 32,
               date: '21.03.16'
            }, {
               id: 111,
               parent: 11,
               'parent@': null,
               name: 'Белоконь Дарья',
               phone: 6377,
               position: 'Руководитель группы',
               photo: cConstants.resourceRoot + 'Controls-demo/BreadCrumbs/Scenarios/images/Belokon.png',
               employeeOwes: 2964.00,
               orgOwes: 1962.00,
               termInDays: 28,
               date: '21.03.16'
            }]
         });
         this._header5 = [{
            title: ''
         }, {
            title: 'Сотрудник должен',
            align: 'right'
         }, {
            title: 'Сотруднику должны',
            align: 'right'
         }, {
            title: 'Срок в днях',
            align: 'right'
         }, {
            title: 'Дата возникновения',
            align: 'right'
         }];
         this._columns5 = [{
            displayProperty: 'department',
            template: firstColumnTemplate,
            width: '550px',
            resultTemplate: fifthResultTemplate
         }, {
            displayProperty: 'employeeOwes',
            align: 'right',
            width: '100px',
            template: fifthColumnTemplate,
            resultTemplate: fifthResultTemplate,
            result: 2862396.00
         }, {
            displayProperty: 'orgOwes',
            align: 'right',
            width: '100px',
            template: fifthColumnTemplate,
            resultTemplate: fifthResultTemplate,
            result: 4203146.00
         }, {
            displayProperty: 'termInDays',
            align: 'right',
            width: '50px',
            resultTemplate: fifthResultTemplate
         }, {
            displayProperty: 'date',
            align: 'right',
            width: '100px',
            resultTemplate: fifthResultTemplate
         }];
         this._viewSource5 = new source.HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: [{
               id: 1,
               parent: null,
               'parent@': true,
               department: 'Управление региональной сети',
               employeeOwes: 1452964.00,
               orgOwes: 2651962.00,
               termInDays: 932,
               date: '21.03.16'
            }, {
               id: 11,
               parent: 1,
               'parent@': true,
               department: 'Отдел администрирования',
               employeeOwes: 102964.00,
               orgOwes: 951962.00,
               termInDays: 32,
               date: '21.03.16'
            }, {
               id: 111,
               parent: 11,
               'parent@': null,
               name: 'Белоконь Дарья',
               phone: 6377,
               position: 'Руководитель группы',
               photo: cConstants.resourceRoot + 'Controls-demo/BreadCrumbs/Scenarios/images/Belokon.png',
               employeeOwes: 2964.00,
               orgOwes: 1962.00,
               termInDays: 28,
               date: '21.03.16'
            }]
         });
         this._breadCrumbs6 = [
            new entity.Model({
               keyProperty: 'id',
               rawData: {
                  id: 1,
                  title: 'Солнце-море-пляж'
               }
            }), new entity.Model({
               keyProperty: 'id',
               rawData: {
                  id: 2,
                  title: 'Сардиния'
               }
            })];
         this._toolbarSource7 = new source.Memory({
            keyProperty: 'id',
            data: [
               {
                  id: '1',
                  icon: 'icon-Print',
                  title: 'Распечатать',
                  '@parent': false,
                  parent: null,
                  buttonViewMode: 'iconToolbar'
               },
               {
                  id: '2',
                  icon: 'icon-RelatedDocumentsDown',
                  title: 'Связанные документы',
                  '@parent': false,
                  parent: null,
                  buttonViewMode: 'iconToolbar'
               },
               {
                  id: '3',
                  icon: 'icon-Question2',
                  title: 'Задать вопрос',
                  '@parent': false,
                  parent: null,
                  buttonViewMode: 'iconToolbar'
               }
            ]
         });
         this._viewSource8 = new source.HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            filter: memorySourceFilter(),
            data: [{
               id: 1,
               department: 'Продвижение СБИС',
               parent: null,
               '@parent': true
            }, {
               id: 2,
               department: 'Филиальная сеть',
               parent: 1,
               '@parent': true
            }, {
               id: 3,
               department: 'Работа с партнёрами',
               parent: 1,
               '@parent': true
            }, {
               id: 4,
               name: 'Новикова Елена',
               photo: cConstants.resourceRoot + 'Controls-demo/BreadCrumbs/Scenarios/images/NovikovaE.png',
               position: 'Менеджер по работе с партнёрами',
               phone: '5136',
               parent: 3,
               '@parent': null
            }, {
               id: 5,
               department: '2-й дивизион',
               parent: 2,
               '@parent': true
            }, {
               id: 6,
               department: '4-й дивизион',
               parent: 2,
               '@parent': true
            }, {
               id: 7,
               department: '7700 Тензор - Москва (Андропова)',
               parent: 5,
               '@parent': true
            }, {
               id: 8,
               department: 'Инженеры',
               parent: 7,
               '@parent': true
            }, {
               id: 9,
               name: 'Новиков Дмитрий',
               photo: cConstants.resourceRoot + 'Controls-demo/BreadCrumbs/Scenarios/images/Novikov2.png',
               position: 'Инженер-программист (ЭО)',
               phone: '4357',
               parent: 8,
               '@parent': null
            }, {
               id: 10,
               department: '7002 Тензор - Томск',
               parent: 6,
               '@parent': true
            }, {
               id: 11,
               department: 'Менеджеры',
               parent: 10,
               '@parent': true
            }, {
               id: 12,
               name: 'Новикова Яна',
               photo: cConstants.resourceRoot + 'Controls-demo/BreadCrumbs/Scenarios/images/NovikovaY.png',
               position: 'Менеджер по продажам',
               phone: '7435',
               parent: 11,
               '@parent': null
            }]
         });
         this._filter8 = {};
         this._header5 = [{
            title: 'Название'
         }, {
            title: 'Цена',
            align: 'right',
            template: secondHeaderTemplate
         }, {
            title: 'Остаток',
            align: 'right',
            template: secondHeaderTemplate
         }, {
            title: 'Свободно',
            align: 'right',
            template: secondHeaderTemplate
         }, {
            title: 'Себестоимость',
            align: 'right',
            template: secondHeaderTemplate
         }, {
            title: 'Сумма остатка',
            align: 'right',
            template: secondHeaderTemplate
         }];
         this._breadCrumbs7 = [
            new entity.Model({
               keyProperty: 'id',
               rawData: {
                  id: 1,
                  title: 'Папка 1'
               }
            }), new entity.Model({
               keyProperty: 'id',
               rawData: {
                  id: 2,
                  title: 'Папка с длинным названием 2'
               }
            }), new entity.Model({
               keyProperty: 'id',
               rawData: {
                  id: 3,
                  title: 'Папка с длинным названием 3'
               }
            }), new entity.Model({
               keyProperty: 'id',
               rawData: {
                  id: 4,
                  title: 'Папка с длинным названием 4'
               }
            }), new entity.Model({
               keyProperty: 'id',
               rawData: {
                  id: 5,
                  title: 'Папка с длинным названием 5'
               }
            })];
         this._breadCrumbs8 = [
            new entity.Model({
               keyProperty: 'id',
               rawData: {
                  id: 1,
                  title: 'Папка с длинным названием 1'
               }
            }), new entity.Model({
               keyProperty: 'id',
               rawData: {
                  id: 2,
                  title: 'Папка с длинным названием 2'
               }
            })];
      }
   });

   return Scenarios;
});
