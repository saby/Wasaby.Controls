define('Controls-demo/Selector/SelectorData', [],
   
   function() {
      
      'use strict';
      
      return {
         companies: [
            {
               id: 'Наша компания',
               title: 'Наша компания',
               city: null,
               description: 'Управленческая структура',
               active: true
            },
            {
               id: 'Все юридические лица',
               title: 'Все юридические лица',
               city: null,
               description: null,
               active: true
            },
            {
               id: 'Инори, ООО',
               title: 'Инори, ООО',
               city: 'г. Ярославль',
               description: null,
               active: true
            },
            {
               id: '"Компания "Тензор" ООО',
               title: '"Компания "Тензор" ООО',
               city: 'г. Ярославль',
               description: null,
               active: true
            },
            {
               id: 'Ромашка, ООО',
               title: 'Ромашка, ООО',
               city: 'г. Москва',
               description: null,
               active: false
            },
            {
               id: 'Сбербанк-Финанс, ООО',
               title: 'Сбербанк-Финанс, ООО',
               city: 'г. Пермь',
               description: null,
               active: true
            },
            {
               id: 'Петросоюз-Континент, ООО',
               title: 'Петросоюз-Континент, ООО',
               city: 'г. Самара',
               description: null,
               active: false
            },
            {
               id: 'Альфа Директ сервис, ОАО',
               title: 'Альфа Директ сервис, ОАО',
               city: 'г. Москва',
               description: null,
               active: true
            },
            {
               id: 'АК "ТРАНСНЕФТЬ", ОАО',
               title: 'АК "ТРАНСНЕФТЬ", ОАО',
               city: 'г. Москва',
               description: null,
               active: false
            },
            {
               id: 'Иванова Зинаида Михайловна, ИП',
               title: 'Иванова Зинаида Михайловна, ИП',
               city: 'г. Яросалвль',
               description: null,
               active: true
            }
         ],
         departments: [
            { department: 'Разработка', owner: 'Новиков Д.В.' },
            { department: 'Продвижение СБИС', owner: 'Кошелев А.Е.' },
            { department: 'Федеральная клиентская служка', owner: 'Мануйлова Ю.А.' },
            { department: 'Служба эксплуатации', owner: 'Субботин А.В.' },
            { department: 'Технологии и маркетинг', owner: 'Чеперегин А.С.' },
            { department: 'Федеральный центр продаж. Call-центр Ярославль', owner: 'Кошелев А.Е.'},
            { department: 'Сопровождение информационных систем', owner: 'Кошелев А.Е.'}
         ]
      };
      
   });
