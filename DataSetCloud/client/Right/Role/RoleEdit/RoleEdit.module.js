define('js!SBIS3.ROLE.RoleEdit',
   ['js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.ROLE.RoleEdit',
      'css!SBIS3.ROLE.RoleEdit',
      'js!SBIS3.CORE.TableView',
      'js!SBIS3.ROLE.RoleFunction',
      'js!SBIS3.CORE.Button'],
   function(CompoundControl, dotTplFn){

      var sample = CompoundControl.extend({
         $protected: {
            _options: {
            }
         },
         _dotTplFn: dotTplFn,
         $constructor: function() {
         },
         init: function() {
            var self = this;
            sample.superclass.init.call(this);
            var button = self.getChildControlByName('openRoleEdit');
            button.subscribe('onClick', function(){
               var context = this.getTopParent().getLinkedContext(),
                  id = context.getValue('@Пользователь');

               if(((typeof id) === 'number')) {

                  var cfg = {
                     name: 'roleEdit',
                     template: 'EditRoleUserDialog',
                     parent: null,
                     opener : this,
                     context: context,
                     handlers: {
                        onAfterClose: function() {
                           this.destroy();
                        }
                     }
                  }
                  if(!self._options.typeDialog){
                     cfg.isStack = true;
                     $ws.helpers.showFloatArea(cfg);
                  } else {
                     $ws.core.attachInstance('Control/Area:Dialog',cfg);
                  }
               } else {
                  alert('id не найден!');
               }
            });
         },
         setEnabled: function(param){
            return this.getChildControlByName('openRoleEdit').setEnabled(param);
         }
      });
      return sample;
   });
