define('Controls-demo/DragNDrop/MasterDetail/Data', [
   'Controls-demo/DragNDrop/Images'
], function(
   Images
) {

   return {
      detail: [{
         id: 100,
         name: 'Андрей Сухоручкин',
         shortMsg: 'Необходимо сделать MasterDetail',
         taskType: 'Ошибка в разработку',
         img: Images.AS,
         date: '13 авг',
         parent: '0'
      }, {
         id: 200,
         name: 'Дмитрий Крайнов',
         taskType: 'Задача в разработку',
         isNew: true,
         shortMsg: 'Нужно сделать печать на VDOM',
         img: Images.DK,
         date: '14 авг',
         parent: '0'
      }, {
         id: 300,
         name: 'Александр Герасимов',
         taskType: 'Ошибка в разработку',
         shortMsg: 'Необходимо сделать Окно выбора на VDOM',
         img: Images.AG,
         date: '23 авг',
         parent: '0'
      }, {
         id: 400,
         name: 'Андрей Бегунов',
         taskType: 'Аттестация',
         shortMsg: 'Аттестация сотрудника',
         isNew: true,
         img: Images.AB,
         date: '26 авг',
         parent: '0'
      }, {
         id: 500,
         name: 'Андрей Бегунов',
         taskType: 'Задача в разработку',
         shortMsg: 'В ваших репозиториях СБИС3 Плагина есть упоминания ссылок вида "help.sbis.ru/*" ',
         isNew: true,
         img: Images.AB,
         date: '29 авг',
         parent: '0'
      }, {
         id: 600,
         name: 'Андрей Бегунов',
         taskType: 'Ревью кода',
         shortMsg: 'Для чек-листа требуется review кода',
         isNew: true,
         img: Images.AB,
         date: '26 авг',
         parent: '0'
      }, {
         id: 700,
         name: 'Александр Герасимов',
         taskType: 'Ошибка в разработку',
         shortMsg: 'Повторить: Сотрудник - Доступ и права выделить несколько ролей в пмо выбрать мерж',
         img: Images.AG,
         date: '21 сен',
         parent: '0'
      }, {
         id: 800,
         name: 'Дмитрий Крайнов',
         taskType: 'Ошибка в разработку',
         isNew: true,
         shortMsg: 'Плашки ролей сотрудников не масштабируются в крупной теме.',
         img: Images.DK,
         date: '14 авг',
         parent: '0'
      }],
      master: [{
         id: '0',
         name: 'Входящие',
         'Раздел@': true,
         'Раздел': null,
         shared: false
      }, {
         id: '3',
         'Раздел@': true,
         'Раздел': 0,
         name: 'Входящие задачи',
         shared: false
      }, {
         id: '1',
         name: 'Поручения',
         'Раздел@': true,
         'Раздел': null,
         shared: false
      }, {
         id: '2',
         'Раздел@': true,
         'Раздел': null,
         name: 'Планы',
         shared: false
      }, {
         id: '4',
         'Раздел@': true,
         'Раздел': null,
         name: 'Задачи от Андрея Б.',
         shared: false
      }, {
         id: '5',
         'Раздел@': true,
         'Раздел': null,
         name: 'Задачи от Андрея С.',
         shared: false
      }, {
         id: '6',
         'Раздел@': true,
         'Раздел': null,
         name: 'Задачи от Дмитрия К.',
         shared: false
      }, {
         id: '7',
         'Раздел@': true,
         'Раздел': null,
         name: 'Задачи от Александра Г.',
         shared: false
      }, {
         id: '8',
         'Раздел@': true,
         'Раздел': null,
         name: 'Отложенные',
         shared: false
      }, {
         id: '9',
         'Раздел@': true,
         'Раздел': null,
         name: 'Повышение',
         shared: false
      }, {
         id: '10',
         'Раздел@': true,
         'Раздел': null,
         name: 'Критические ошибки',
         shared: false
      }, {
         id: '11',
         'Раздел@': true,
         'Раздел': null,
         name: 'Задачи вынесенные из вехи',
         shared: false
      }]
   };
});
