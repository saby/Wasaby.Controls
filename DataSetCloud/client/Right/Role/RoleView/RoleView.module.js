define('js!SBIS3.ROLE.RoleView',
   ['js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.ROLE.RoleView',
      'css!SBIS3.ROLE.RoleView',
      'js!SBIS3.CORE.TableView',
      'js!SBIS3.ROLE.RoleFunction',
      'js!SBIS3.CORE.Button'],
   function(CompoundControl, dotTplFn){

      function A(){}

      var sample = CompoundControl.extend({
         $protected: {
            _options: {
               urlShadow : ''
            }
         },
         _dotTplFn: dotTplFn,
         $constructor: function() {
         },
         init: function() {
            sample.superclass.init.call(this);
         }
      });
      return sample;
   });
