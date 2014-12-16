define('js!SBIS3.ROLE.RoleRegistry',
['js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.ROLE.RoleRegistry',
   'css!SBIS3.ROLE.RoleRegistry',
   'js!SBIS3.CORE.TableView',
   'js!SBIS3.ROLE.RoleFunction',
   'js!SBIS3.CORE.Button',
   'js!SBIS3.CORE.FieldRadio'],
function(CompoundControl, dotTplFn){

   var sample = CompoundControl.extend({
      $protected: {
         _options: {
            disableButton: false,
            switch: false
         }
      },
      _dotTplFn: dotTplFn,
      $constructor: function() {
      },
      init: function() {
         sample.superclass.init.call(this);
         var self = this,
            addButtonRole = self.getChildControlByName('addRole');
         addButtonRole.subscribe('onActivated',function() {
            self.getChildControlByName('reestrRoles').sendCommand('newItem');
         });

         if(!this._options.switch){
            $('.Role_RoleRegistry_switchClass').hide();
            $('.Role_RoleRegistry_FieldDropDown').hide();
         }
      },
      getOnlyRead: function(){
         return this._options.onlyRead;
      }
   });
   return sample;
});
