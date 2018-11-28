define('Controls-demo/List/Tree/TreeData', [
   'WS.Data/Source/Memory',
   'Core/core-merge',
   'Core/core-clone'
], function(Memory, cMerge, cClone) {

   var
      tasksMemoryData = [
         {
            id: 1,
            author: 'Бегунов Андрей',
            title: 'нужно перенести Display из ws.data в контролы. рассмотреть возможность избавиться от Display для VDOM, т.к. в них слишком много лишних ответственностей',
            comment: 'когда будем списки переделывать',
            received: '19 окт 16:16',
            type: null,
            subTask: null,
            parent: null
         },
         {
            id: 2,
            author: 'Грушникова Ольга',
            title: 'Прошу реализовать стандарт "Пустые страницы, в соответствии со стандартом',
            comment: '',
            received: '10 сен 09:01',
            type: null,
            subTask: null,
            parent: null
         },
         {
            id: 3,
            author: 'Горева Анна',
            title: 'Предоставить прикладным разработчикам модификаторы для шрифтов, используемых в  дереве',
            comment: '',
            received: '5 сен 13:38',
            type: null,
            subTask: null,
            parent: null
         },
         {
            id: 4,
            author: 'Крайнов Дмитрий',
            title: 'Базовый функционал плоского списка',
            comment: '',
            received: '23 сен 15:11',
            type: false,
            subTask: 'Родионов Егор',
            parent: null
         },
         {
            id: 5,
            author: 'Авраменко Алексей',
            title: 'Реализовать механизм Virtual scrolling\'a для табличного представления.',
            comment: '',
            received: '7 окт 12:03',
            type: null,
            subTask: null,
            parent: 4
         }
      ],
      tasksFoldersMemoryData = [
         {
            id: 1,
            title: 'Входящие',
            count: 4,
            type: true,
            parent: null,
            hasChild: false
         },
         {
            id: 2,
            title: 'Планы - на след. месяц',
            count: 2,
            type: true,
            parent: null,
            hasChild: false
         },
         {
            id: 3,
            title: 'Списки VDOM',
            count: 31,
            type: true,
            parent: null,
            hasChild: true
         },
         {
            id: 31,
            title: 'Высший приоритет',
            count: 7,
            type: true,
            parent: 3,
            hasChild: false
         },
         {
            id: 32,
            title: 'На декабрь',
            count: 11,
            type: true,
            parent: 3,
            hasChild: false
         },
         {
            id: 33,
            title: 'Остальное',
            count: 13,
            type: true,
            parent: 3,
            hasChild: false
         },
         {
            id: 4,
            title: '3.18.700',
            count: 14,
            type: true,
            parent: null,
            hasChild: false
         },
         {
            id: 5,
            title: '3.18.620',
            count: 1,
            type: true,
            parent: null,
            hasChild: false
         },
         {
            id: 6,
            title: 'Планы',
            count: 2,
            type: true,
            parent: null,
            hasChild: false
         },
         {
            id: 7,
            title: 'Прочие доработки',
            count: 12,
            type: true,
            parent: null,
            hasChild: false
         },
         {
            id: 8,
            title: 'Code review',
            count: 4,
            type: true,
            parent: null,
            hasChild: false
         },
         {
            id: 9,
            title: 'Согласование',
            count: null,
            type: true,
            parent: null,
            hasChild: false
         }
      ],
      tasksFoldersMemoryDefaultParams = {
         data: tasksFoldersMemoryData,
         idProperty: 'id'
      },
      tasksMemoryDefaultParams = {
         data: tasksMemoryData,
         idProperty: 'id'
      };

   function prepareParams(baseParams, additionalParams) {
      var
         params = cClone(baseParams);
      if (additionalParams) {
         cMerge(params, additionalParams);
      }
      return params;
   }

   return {
      getTasksMemory: function(additionalParams) {
         return new Memory(prepareParams(tasksMemoryDefaultParams, additionalParams));
      },
      getTasksFoldersMemory: function(additionalParams) {
         return new Memory(prepareParams(tasksFoldersMemoryDefaultParams, additionalParams));
      }
   };
});
