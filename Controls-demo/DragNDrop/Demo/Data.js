define('Controls-demo/DragNDrop/Demo/Data', ['Controls-demo/resources/Images'], function(Images) {
   'use strict';

   return {
      listItems: [{
         id: 0,
         title: '#СБИСоКомикс',
         additional: 'Мемы на рабочие темы',
         usersCunt: 55,
         image: Images.groups.comics
      }, {
         id: 1,
         title: 'Доска объявлений',
         additional: 'Найдётся все! Кому что подсказать, продать или купить.',
         usersCunt: 135,
         image: Images.groups.board
      }, {
         id: 2,
         title: 'Тензор. Спорт',
         additional: 'Бассейн, футбол, танцы, йога, фитнес... здесь каждый найдет что-то для себя.',
         usersCunt: 408,
         image: Images.groups.sport
      }, {
         id: 3,
         title: 'Стандарты интерфейса',
         additional: 'Застандартизируем нестандартизируемое или даешь семь красных линий белым цветом!',
         usersCunt: 114,
         image: Images.groups.standards
      }, {
         id: 4,
         title: 'Организация разработки',
         usersCunt: 1077,
         image: Images.groups.development
      }, {
         id: 5,
         title: 'Выпуск версий',
         usersCunt: 1178,
         image: Images.groups.release
      }, {
         id: 6,
         title: 'Новое в СБИС',
         additional: 'Сообщения об обновлениях инсайда и онлайна, советы по работе с системой отныне',
         usersCunt: 4259,
         image: Images.groups.sbis
      }, {
         id: 7,
         title: '"Мили"',
         usersCunt: 709,
         image: Images.groups.mili
      }],

      tasks: [{
         id: 0,
         title: 'Авраменко А.С.',
         time: null,
         state: null,
         received: null,
         parent: null,
         type: true,
         text: '',
         image: null,
         shared: true
      }, {
         id: 1,
         title: 'План март',
         time: null,
         state: null,
         received: null,
         parent: null,
         type: true,
         text: '',
         image: null,
         shared: false
      }, {
         id: 2,
         title: 'Срочно',
         time: null,
         state: null,
         received: null,
         parent: null,
         type: true,
         text: '',
         image: null,
         shared: false
      }, {
         id: 3,
         title: 'Перемещение записей',
         time: null,
         state: null,
         received: null,
         parent: 2,
         type: true,
         text: '',
         image: null,
         shared: false
      }, {
         id: 4,
         title: 'Крайнов Дмитрий',
         time: '08.12',
         state: 'Выполнение',
         received: '9 сен 14:45',
         parent: 3,
         type: null,
         text: 'Оформить макет на Перемещение записей учесть все поручения',
         image: Images.staff.krainov,
         shared: false
      }, {
         id: 5,
         title: 'Батурина Наталия',
         time: '11.01',
         state: 'Выполнение',
         received: '13 окт 14:31',
         parent: null,
         type: null,
         text: 'Актуализировать стандарт Флаг/Группа флагов см. предыдущую версию',
         image: Images.staff.baturina,
         shared: false
      }, {
         id: 6,
         title: 'Догадкин Владимир',
         time: '21.02',
         state: 'Выполнение',
         received: '17 июн 11:46',
         parent: 3,
         type: null,
         text: 'Неправильно работает перемещение записей',
         image: Images.staff.dogadkin,
         shared: false
      }, {
         id: 7,
         title: 'Батурина Наталия',
         time: '10.03',
         state: 'Выполнение',
         received: '10 янв 16:41',
         parent: 1,
         type: null,
         text: 'Реализовать стандарт перемещения записей',
         image: Images.staff.baturina,
         shared: false
      }, {
         id: 8,
         title: 'Батурина Наталия',
         time: '10.03',
         state: 'Выполнение',
         received: '10 янв 16:42',
         parent: 1,
         type: null,
         text: 'Реализовать стандарт плитка',
         image: Images.staff.baturina,
         shared: false
      }],

      tile: [{
         id: 0,
         parent: null,
         type: true,
         title: 'Скриншоты',
         image: null,
         size: null
      }, {
         id: 1,
         parent: null,
         type: true,
         title: 'Картинки',
         image: null,
         size: null
      }, {
         id: 2,
         parent: null,
         type: null,
         title: 'Подготовка к Аттестации.docx',
         image: Images.tile.tile1,
         size: '35 КБ'
      }, {
         id: 3,
         parent: null,
         type: null,
         title: 'Стандарт на 2017 год.docx',
         image: Images.tile.tile2,
         size: '47 КБ'
      }, {
         id: 4,
         parent: null,
         type: null,
         title: 'Цветок.png',
         image: Images.tile.tile3,
         size: '11 МБ'
      }, {
         id: 5,
         parent: null,
         type: null,
         title: 'Каньон.png',
         image: Images.tile.tile4,
         size: '8 МБ'
      }, {
         id: 6,
         parent: 1,
         type: null,
         title: 'Юелый цветок.png',
         image: Images.tile.tile5,
         size: '14 МБ'
      }]
   };
});
