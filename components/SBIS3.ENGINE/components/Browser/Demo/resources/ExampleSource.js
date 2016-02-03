define(
   ['js!SBIS3.CONTROLS.Data.Source.Memory',
   'js!SBIS3.CONTROLS.Data.Model'], function(MemorySource, Model){
   var
      lastId = 12,
      items = [{'title': 'Первый',       'id':1,  'parent@': true },
         {flag: true, 'title': 'Второй',       'id':2,  'parent@': true,  'parent' : 1 },
         {flag: true, 'title': 'Третий',       'id':3,  'parent@': true,  'parent' : 2 },
         {flag: true, 'title': 'Четвертый',    'id':4,  'parent@': null, 'parent' : 3 },
         {flag: false, 'title': 'Пятый',        'id':5,  'parent@': null, 'parent' : 1 },
         {flag: true, 'title': 'Шестой',       'id':6,  'parent@': true } ,
         {flag: true, 'title': 'Седьмой',      'id':7,  'parent@': null, 'parent' : 6 },
         {flag: false, 'title': 'Восьмой',      'id':8,  'parent@': null, 'parent' : 6 },
         {flag: false, 'title': 'Девятый',      'id':9,  'parent@': null },
         {flag: true, 'title': 'Десятый',      'id':10, 'parent@': null },
         {flag: false, 'title': 'Одиннадцатый', 'id':11, 'parent@': null },
         {flag: true, 'title': 'Двенадцатый',  'id':12, 'parent@': null }];

      return new MemorySource({
         data: items,
         idProperty: 'id',
         model: Model.extend({
            $protected: {
               _options: {
                  properties: {
                     id: { def: function() {
                        return ++lastId;
                     }},
                     title: { def: ''},
                     flag: { def: false},
                     'parent' : {def : null},
                     'parent@' : {def : null}
                  }
               }
            }
         })
      })
});