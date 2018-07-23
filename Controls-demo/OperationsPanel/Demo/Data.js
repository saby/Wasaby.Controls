define('Controls-demo/OperationsPanel/Demo/Data', function() {
   var
      data = {
         employees: [
            {
               id: 1,
               'Раздел': null,
               'Раздел@': false,
               name: 'Новиков Дмитрий',
               photo: '/Controls-demo/OperationsPanel/Demo/resources/novikov.png',
               position: 'Директор департамента разработки',
               phone: '2300',
               likes: 9
            },
            {
               id: 2,
               'Раздел': null,
               'Раздел@': true,
               department: 'Стандарты интерфейса',
               head: 'Батурина Н.А.',
               count: 2
            },
            {
               id: 3,
               'Раздел': 2,
               'Раздел@': false,
               name: 'Батурина Наталия',
               photo: '/Controls-demo/OperationsPanel/Demo/resources/baturina.png',
               position: 'Ведущий проектировщик пользовательских интерфейсов (3 категории)',
               phone: '1018',
               likes: 2
            },
            {
               id: 4,
               'Раздел': 2,
               'Раздел@': false,
               name: 'Лосикова Ольга',
               photo: '/Controls-demo/OperationsPanel/Demo/resources/losikova.png',
               position: 'Проектировщик пользовательских интерфейсов (2+ категории)',
               phone: '2514',
               likes: 2,
               maternityLeave: true
            },
            {
               id: 5,
               'Раздел': null,
               'Раздел@': true,
               department: 'Платформа',
               head: 'Голованов К.А.',
               count: 71
            },
            {
               id: 6,
               'Раздел': null,
               'Раздел@': true,
               department: 'Предприятие',
               head: 'Макаров С.А.',
               count: 39
            },
            {
               id: 7,
               'Раздел': null,
               'Раздел@': true,
               department: 'Управленческий и налоговый учет',
               head: 'Гареева Д.А.',
               count: 6
            }
         ]
      };
   return data;
});
