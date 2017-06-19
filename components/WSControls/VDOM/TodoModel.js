define('js!WSControls/VDOM/TodoModel',
   [
      'js!WS.Data/Entity/Model'
   ],
   function (Model) {
      var TODO = Model.extend({
         _$properties: {
            title: {
               def: ''
            },
            completed: {
               def: false
            }
         }
      });
      
      return TODO;
   }
);
