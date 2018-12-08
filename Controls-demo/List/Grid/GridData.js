define('Controls-demo/List/Grid/GridData', ['Controls-demo/resources/Images'], function(DemoImages) {
   var data = {
      catalog: [
         {
            id: '463152',
            name: 'Арахисовые лепестки',
            price: null,
            balance: null,
            balanceCostSumm: null,
            reserve: null,
            costPrice: 260
         },
         {
            id: '447037',
            name: 'Булгур',
            price: null,
            balance: 2.501,
            balanceCostSumm: 390.12,
            reserve: null,
            costPrice: 156
         },
         {
            id: '448390',
            name: 'Вафельная крошка ',
            price: null,
            balance: 3.441,
            balanceCostSumm: 2408.39,
            reserve: null,
            costPrice: 700
         },
         {
            id: '457328',
            name: 'Вода минеральная газ.',
            price: null,
            balance: null,
            balanceCostSumm: null,
            reserve: null,
            costPrice: 17.34
         },
         {
            id: '471329',
            name: 'Вода питьевая 5л',
            price: null,
            balance: null,
            balanceCostSumm: null,
            reserve: null,
            costPrice: 36
         },
         {
            id: '441931',
            name: 'Вода Святой источник, газ.',
            price: 0,
            balance: 27.19,
            balanceCostSumm: 1039.97,
            reserve: null,
            costPrice: 38.25
         },
         {
            id: '441737',
            name: 'Гель кондитерский',
            price: 0,
            balance: 3.925,
            balanceCostSumm: 618.23,
            reserve: null,
            costPrice: 157.51
         },
         {
            id: '439693',
            name: 'Геркулес',
            price: 0,
            balance: 18.59,
            balanceCostSumm: 1268.7,
            reserve: null,
            costPrice: 68.25
         },
         {
            id: '441627',
            name: 'Глазурь',
            price: 0,
            balance: 56.983,
            balanceCostSumm: 8039.06,
            reserve: null,
            costPrice: 141.08
         },
         {
            id: '451295',
            name: 'Глазурь Премиум',
            price: null,
            balance: 39.718,
            balanceCostSumm: 13375.42,
            reserve: null,
            costPrice: 336.76
         },
         {
            id: '442584',
            name: 'Глофа-экстракт',
            price: null,
            balance: 1.233,
            balanceCostSumm: 286.61,
            reserve: null,
            costPrice: 232.41
         },
         {
            id: '447664',
            name: 'Глюкозный сироп',
            price: null,
            balance: 14.549,
            balanceCostSumm: 2037.62,
            reserve: null,
            costPrice: 140.05
         },
         {
            id: '439698',
            name: 'Горох',
            price: 0,
            balance: 19.093,
            balanceCostSumm: 511.59,
            reserve: null,
            costPrice: 26.8
         },
         {
            id: '443503',
            name: 'Горох (нут)',
            price: 0,
            balance: 0.45,
            balanceCostSumm: 69,
            reserve: null,
            costPrice: 153.33
         },
         {
            id: '446823',
            name: 'Горчица "Дижонская" ',
            price: 508,
            balance: 10.314,
            balanceCostSumm: 2288.29,
            reserve: null,
            costPrice: 221.86
         },
         {
            id: '439672',
            name: 'Греча',
            price: 0,
            balance: 49.877,
            balanceCostSumm: 2828.4,
            reserve: null,
            costPrice: 56.71
         },
         {
            id: '441302',
            name: 'Дрожжи (кг)',
            price: 0,
            balance: 14.311,
            balanceCostSumm: 3353.67,
            reserve: null,
            costPrice: 234.34
         },
         {
            id: '441518',
            name: 'Желатин',
            price: 0,
            balance: 6.857,
            balanceCostSumm: 5799.66,
            reserve: null,
            costPrice: 845.82
         },
         {
            id: '447906',
            name: 'Желатин листовой',
            price: null,
            balance: 4.388,
            balanceCostSumm: 8475.09,
            reserve: null,
            costPrice: 1931.63
         },
         {
            id: '460310',
            name: 'Инвертный сахарный сироп',
            price: null,
            balance: 7.64,
            balanceCostSumm: 1336.99,
            reserve: null,
            costPrice: 175
         },
         {
            id: '439688',
            name: 'Какао',
            price: 0,
            balance: 5.37,
            balanceCostSumm: 3405.95,
            reserve: null,
            costPrice: 634.23
         },
         {
            id: '460976',
            name: 'Какао-масло',
            price: null,
            balance: 11.621,
            balanceCostSumm: 11131.65,
            reserve: null,
            costPrice: 957.93
         },
         {
            id: '443202',
            name: 'Квасное сусло- концентрат',
            price: 0,
            balance: -0.013,
            balanceCostSumm: null,
            reserve: null,
            costPrice: null
         },
         {
            id: '443050',
            name: 'Квас (покупной)',
            price: 0,
            balance: 4,
            balanceCostSumm: 110.48,
            reserve: null,
            costPrice: 27.62
         },
         {
            id: '443400',
            name: 'Кока-кола- концентрат ',
            price: 0,
            balance: null,
            balanceCostSumm: null,
            reserve: null,
            costPrice: 312.28
         },
         {
            id: '441856',
            name: 'Кока-кола (л)',
            price: 0,
            balance: null,
            balanceCostSumm: null,
            reserve: null,
            costPrice: 35.11
         },
         {
            id: '441915',
            name: 'Кокосовая стружка',
            price: 0,
            balance: 12.137,
            balanceCostSumm: 2034.89,
            reserve: null,
            costPrice: 167.66
         },
         {
            id: '448193',
            name: 'Кокосовое молоко',
            price: null,
            balance: 3.437,
            balanceCostSumm: 988.6,
            reserve: null,
            costPrice: 287.66
         },
         {
            id: '441637',
            name: 'Конфитюр',
            price: 0,
            balance: 96.46,
            balanceCostSumm: 9203.36,
            reserve: null,
            costPrice: 95.41
         },
         {
            id: '441717',
            name: 'Кофе зерновой',
            price: 0,
            balance: 32.308,
            balanceCostSumm: 39908.68,
            reserve: null,
            costPrice: 1235.26
         },
         {
            id: '441693',
            name: 'Кофе растворимый',
            price: 0,
            balance: 0.622,
            balanceCostSumm: 1077.32,
            reserve: null,
            costPrice: 1732.23
         },
         {
            id: '464854',
            name: 'Краситель кандурин',
            price: null,
            balance: 0.08,
            balanceCostSumm: 1245.57,
            reserve: null,
            costPrice: 15569.63
         },
         {
            id: '441681',
            name: 'Краситель пищевой',
            price: 0,
            balance: 9.671,
            balanceCostSumm: 16367.59,
            reserve: null,
            costPrice: 1692.39
         },
         {
            id: '466461',
            name: 'Краситель пищевой сухой',
            price: null,
            balance: null,
            balanceCostSumm: null,
            reserve: null,
            costPrice: 109666.67
         },
         {
            id: '439671',
            name: 'Крахмал',
            price: 0,
            balance: 8.82,
            balanceCostSumm: 992.11,
            reserve: null,
            costPrice: 112.48
         },
         {
            id: '459928',
            name: 'Крахмал кукурузный',
            price: null,
            balance: 4.162,
            balanceCostSumm: 762.73,
            reserve: null,
            costPrice: 183.25
         },
         {
            id: '468442',
            name: 'Крупа Киноа',
            price: null,
            balance: 1.09,
            balanceCostSumm: 376.22,
            reserve: null,
            costPrice: 345.16
         },
         {
            id: '461983',
            name: 'Крупа    кукурузная',
            price: null,
            balance: 7.745,
            balanceCostSumm: 268.89,
            reserve: null,
            costPrice: 34.72
         },
         {
            id: '443348',
            name: 'Крупа перловая ',
            price: 0,
            balance: 6.891,
            balanceCostSumm: 157.88,
            reserve: null,
            costPrice: 22.91
         },
         {
            id: '461982',
            name: 'Крупа пшеничная',
            price: null,
            balance: null,
            balanceCostSumm: null,
            reserve: null,
            costPrice: 25
         },
         {
            id: '461602',
            name: 'Крупа ячневая',
            price: null,
            balance: 3.63,
            balanceCostSumm: 88.09,
            reserve: null,
            costPrice: 24.27
         },
         {
            id: '443562',
            name: 'Кус-кус ',
            price: 0,
            balance: 4.234,
            balanceCostSumm: 1456.92,
            reserve: null,
            costPrice: 344.13
         },
         {
            id: '441570',
            name: 'Мак',
            price: 0,
            balance: 6.865,
            balanceCostSumm: 2008.6,
            reserve: null,
            costPrice: 292.59
         },
         {
            id: '439668',
            name: 'Макароны ',
            price: 0,
            balance: 146.43,
            balanceCostSumm: 9334.41,
            reserve: null,
            costPrice: 63.75
         },
         {
            id: '448218',
            name: 'Макароны паста ',
            price: null,
            balance: 29.096,
            balanceCostSumm: 4454.06,
            reserve: null,
            costPrice: 153.08
         },
         {
            id: '440193',
            name: 'Манная крупа',
            price: 0,
            balance: 17.828,
            balanceCostSumm: 515.83,
            reserve: null,
            costPrice: 28.93
         },
         {
            id: '462143',
            name: 'Мармелад жев.',
            price: null,
            balance: null,
            balanceCostSumm: null,
            reserve: null,
            costPrice: 290
         },
         {
            id: '442239',
            name: 'Марципан,мастика, петтинис (пластичная масса)',
            price: null,
            balance: 58.164,
            balanceCostSumm: 19848.76,
            reserve: null,
            costPrice: 341.26
         },
         {
            id: '441871',
            name: 'Маршмеллоу (мини зефир)',
            price: 0,
            balance: 0.235,
            balanceCostSumm: 188,
            reserve: null,
            costPrice: 800
         },
         {
            id: '447036',
            name: 'Масло арахисовое ',
            price: null,
            balance: null,
            balanceCostSumm: null,
            reserve: null,
            costPrice: null
         },
         {
            id: '447038',
            name: 'Масло грец.ореха',
            price: null,
            balance: 0.99,
            balanceCostSumm: 784.82,
            reserve: null,
            costPrice: 792.75
         },
         {
            id: '457491',
            name: 'Масло лес.ореха',
            price: null,
            balance: null,
            balanceCostSumm: null,
            reserve: null,
            costPrice: 1670.77
         },
         {
            id: '439725',
            name: 'Масло оливковое',
            price: 0,
            balance: 18.945,
            balanceCostSumm: 7940,
            reserve: null,
            costPrice: 419.1
         },
         {
            id: '439724',
            name: 'Масло растительное',
            price: 0,
            balance: 80.123,
            balanceCostSumm: 5079.39,
            reserve: null,
            costPrice: 63.4
         },
         {
            id: '457489',
            name: 'Масло расторопши ',
            price: null,
            balance: null,
            balanceCostSumm: null,
            reserve: null,
            costPrice: null
         }
      ],
      tasks: [
         {
            id: 1,
            message: 'Регламент: Ошибка в разработку. Автор: Дубенец Д.А. Описание: (reg-chrome-presto) 3.18.150 controls - Поехала верстка кнопок когда они задизейблены prestocarry',
            fullName: 'Крайнов Дмитрий',
            photo: DemoImages.staff.krainov,
            date: '6 мар',
            state: 'Review кода (нач. отдела)'
         },
         {
            id: 2,
            message: 'Регламент: Ошибка в разработку. Автор: Волчихина Л.С. Описание: Отображение колонок. При снятии галки с колонки неверная всплывающая подсказка',
            fullName: 'Крайнов Дмитрий',
            photo: DemoImages.staff.krainov,
            date: '6 мар',
            state: 'Review кода (нач. отдела)'
         },
         {
            id: 3,
            message: 'Смотри надошибку. Нужно сделать тесты, чтобы так в будущем не разваливалось',
            fullName: 'Крайнов Дмитрий',
            photo: DemoImages.staff.krainov,
            date: '6 мар',
            state: 'Выполнение'
         },
         {
            id: 4,
            message: 'Регламент: Ошибка в разработку. Автор: Оборевич К.А. Описание: Розница. Замечания к шрифтам в окнах Что сохранить в PDF/Excel и Что напечатать',
            fullName: 'Крайнов Дмитрий',
            photo: DemoImages.staff.krainov,
            date: '12 ноя',
            state: 'Review кода (нач. отдела)'
         },
         {
            id: 5,
            message: 'Пустая строка при сканировании в упаковку Тест-онлайн adonis1/adonis123 1) Создать документ списания 2) отсканировать в него наименование/открыть РР/+Упаковка 3) Заполнить данные по упаковке/отсканировать еще 2 марки',
            fullName: 'Корбут Антон',
            photo: DemoImages.staff.korbyt,
            date: '5 мар',
            state: 'Выполнение'
         },
         {
            id: 6,
            message: 'Разобраться с getViewModel - либо наследование, либо создавать модель прямо в TreeControl и передавать в BaseControl, либо ещё какой то вариант придумать.',
            fullName: 'Кесарева Дарья',
            photo: DemoImages.staff.kesareva,
            date: '12 сен',
            state: 'Выполнение'
         },
         {
            id: 7,
            message: 'Научить reload обновлять табличное представление VDOM с сохранением набранных данных (например загруженных по кнопке "еще"). В данный момент есть deepReload, но он не сохраняет набранные данные.',
            fullName: 'Кесарева Дарья',
            photo: DemoImages.staff.kesareva,
            date: '12 сен',
            state: 'Выполнение'
         },
         {
            id: 8,
            message: 'Лесенка на VDOM. Перевести алгоритм на предварительный расчет в модели. Сделать демку.',
            fullName: 'Кесарева Дарья',
            photo: DemoImages.staff.kesareva,
            date: '12 сен',
            state: 'Выполнение'
         },
         {
            id: 9,
            message: 'Прошу сделать возможность отключения: 1) ховера на айтемах  у Controls/List, 2) курсор: поинтер',
            fullName: 'Кесарева Дарья',
            photo: DemoImages.staff.kesareva,
            date: '12 сен',
            state: 'Выполнение'
         },
         {
            id: 10,
            message: 'через шаблон ячейки должна быть возможность управлять colspan (или rowspan) отдельной ячейки. <ws:partial template="standartCellTemplate" colspan="2"> типа такого если я напишу, то у меня будет ячейка на две колонки',
            fullName: 'Кесарева Дарья',
            photo: DemoImages.staff.kesareva,
            date: '12 сен',
            state: 'Выполнение'
         },
         {
            id: 11,
            message: 'Не работают хлебные крошки и навигация по ним если идентификатор записи равен 0 Как повторить',
            fullName: 'Догадкин Владимир',
            photo: DemoImages.staff.dogadkin,
            date: '28 фев',
            state: 'Выполнение'
         },
         {
            id: 12,
            message: 'Не работает collapse в группировке в дереве test-online.sbis.ru сталин/Сталин123',
            fullName: 'Догадкин Владимир',
            photo: DemoImages.staff.dogadkin,
            date: '26 фев',
            state: 'Выполнение'
         }
      ]
   };
   return data;
});
