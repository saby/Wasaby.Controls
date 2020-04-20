define('Controls-demo/MasterDetail/Data', [
   'Controls-demo/MasterDetail/Images'
], function(
   Images
) {

   var ASTASK = {
      id: 0,
      name: 'Андрей Сухоручкин',
      shortMsg: 'Необходимо сделать MasterDetail',
      taskType: 'Ошибка в разработку',
      img: Images.AS,
      date: '13 авг'
   }, DKSTASK = {
      id: 1,
      name: 'Дмитрий Крайнов',
      taskType: 'Задача в разработку',
      isNew: true,
      shortMsg: 'Нужно сделать печать на VDOM',
      img: Images.DK,
      date: '14 авг'
   }, AGTASK = {
      id: 2,
      name: 'Александр Герасимов',
      taskType: 'Ошибка в разработку',
      shortMsg: 'Необходимо сделать Окно выбора на VDOM',
      img: Images.AG,
      date: '23 авг'
   }, ABTASK = {
      id: 3,
      name: 'Андрей Бегунов',
      taskType: 'Аттестация',
      shortMsg: 'Аттестация сотрудника',
      isNew: true,
      img: Images.AB,
      date: '26 авг'
   };


   return {
      incoming: [ASTASK, DKSTASK, AGTASK, ABTASK],
      incomingTasks: [DKSTASK],
      instructions: [AGTASK],
      plans: [ABTASK],
      andrewBTasks: [ABTASK],
      andrewSTasks: [ASTASK],
      dmitriyKTasks: [DKSTASK],
      alexGTasks: [AGTASK],
      postponed: [AGTASK, DKSTASK],
      levelUp: [ABTASK],
      criticalBugs: [ASTASK],
      postponedTasks: [ABTASK, AGTASK],
      '3.18.710': [ASTASK],
      todoTasks: [AGTASK],
      hotTasks: [DKSTASK],
      otherTasks: [AGTASK],
      master: [{
         id: '0',
         name: 'Входящие',
         counter: '5',
         'Раздел@': true,
         'Раздел': null,
         sourceType: 'incoming'
      }, {
         id: '3',
         'Раздел@': false,
         'Раздел': 0,
         name: 'Входящие задачи',
         counter: '16',
         sourceType: 'incomingTasks'
      }, {
         id: '1',
         name: 'Поручения',
         counter: '2',
         'Раздел@': false,
         'Раздел': null,
         sourceType: 'instructions'
      }, {
         id: '2',
         'Раздел@': null,
         'Раздел': null,
         name: 'Планы',
         counter: '3',
         sourceType: 'plans'
      }, {
         id: '4',
         'Раздел@': null,
         'Раздел': null,
         name: 'Задачи от Андрея Б.',
         counter: '84',
         sourceType: 'andrewBTasks'
      }, {
         id: '5',
         'Раздел@': null,
         'Раздел': null,
         name: 'Задачи от Андрея С.',
         counter: '1',
         sourceType: 'andrewSTasks'
      }, {
         id: '6',
         'Раздел@': null,
         'Раздел': null,
         name: 'Задачи от Дмитрия К.',
         counter: '5',
         sourceType: 'dmitriyKTasks'
      }, {
         id: '7',
         'Раздел@': null,
         'Раздел': null,
         name: 'Задачи от Александра Г.',
         sourceType: 'alexGTasks'
      }, {
         id: '8',
         'Раздел@': null,
         'Раздел': null,
         name: 'Отложенные',
         counter: '99',
         sourceType: 'postponed'
      }, {
         id: '9',
         'Раздел@': null,
         'Раздел': null,
         name: 'Повышение',
         counter: '4',
         sourceType: 'levelUp'
      }, {
         id: '10',
         'Раздел@': null,
         'Раздел': null,
         name: 'Критические ошибки',
         counter: '2',
         sourceType: 'criticalBugs'
      }, {
         id: '11',
         'Раздел@': null,
         'Раздел': null,
         name: 'Задачи вынесенные из вехи',
         counter: '74',
         sourceType: 'postponedTasks'
      }, {
         id: '12',
         'Раздел@': null,
         'Раздел': null,
         name: '3.18.710',
         counter: '5',
         sourceType: '3.18.710'
      }, {
         id: '13',
         'Раздел@': null,
         'Раздел': null,
         name: 'TODO',
         counter: '5',
         sourceType: 'todoTasks'
      }, {
         id: '14',
         'Раздел@': null,
         'Раздел': null,
         name: 'Срочные задачи',
         counter: '5',
         sourceType: 'hotTasks'
      }, {
         id: '15',
         'Раздел@': null,
         'Раздел': null,
         name: 'Прочие',
         counter: '5',
         sourceType: 'otherTasks'
      }]
   };
});
