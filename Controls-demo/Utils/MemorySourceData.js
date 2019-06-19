/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-demo/Utils/MemorySourceData', function() {

   'use strict';

   return {
      departments: [
         {id: 1, department: 'Разработка', owner: 'Новиков Д.В.', title: 'Разработка'},
         {id: 2, department: 'Продвижение СБИС', owner: 'Кошелев А.Е.', title: 'Продвижение СБИС'},
         {id: 3, department: 'Федеральная клиентская служка', owner: 'Мануйлова Ю.А.', title: 'Федеральная клиентская служка'},
         {id: 4, department: 'Служба эксплуатации', owner: 'Субботин А.В.', title: 'Служба эксплуатации'},
         {id: 5, department: 'Технологии и маркетинг', owner: 'Чеперегин А.С.', title: 'Технологии и маркетинг'},
         {id: 6, department: 'Федеральный центр продаж. Call-центр Ярославль', owner: 'Кошелев А.Е.', title: 'Федеральный центр продаж. Call-центр Ярославль'},
         {id: 7, department: 'Сопровождение информационных систем', owner: 'Кошелев А.Е.', title: 'Сопровождение информационных систем'}
      ],
      companies: [
         {
            id: 8,
            title: 'Наша компания',
            city: null,
            description: 'Управленческая структура',
            active: true
         },
         {
            id: 9,
            title: 'Все юридические лица',
            city: null,
            description: null,
            active: true
         },
         {
            id: 10,
            title: 'Инори, ООО',
            city: 'г. Ярославль',
            description: null,
            active: true
         },
         {
            id: 11,
            title: '"Компания "Тензор" ООО',
            city: 'г. Ярославль',
            description: null,
            active: true
         },
         {
            id: 12,
            title: 'Ромашка, ООО',
            city: 'г. Москва',
            description: null,
            active: false
         },
         {
            id: 13,
            title: 'Сбербанк-Финанс, ООО',
            city: 'г. Пермь',
            description: null,
            active: true
         },
         {
            id: 14,
            title: 'Петросоюз-Континент, ООО',
            city: 'г. Самара',
            description: null,
            active: false
         },
         {
            id: 15,
            title: 'Альфа Директ сервис, ОАО',
            city: 'г. Москва',
            description: null,
            active: true
         },
         {
            id: 16,
            title: 'АК "ТРАНСНЕФТЬ", ОАО',
            city: 'г. Москва',
            description: null,
            active: false
         },
         {
            id: 17,
            title: 'Иванова Зинаида Михайловна, ИП',
            city: 'г. Яросалвль',
            description: null,
            active: true
         }
      ]
   };
});