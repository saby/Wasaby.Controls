define('js!SBIS3.ROLE.RoleAccess',
   ['js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.ROLE.RoleAccess',
      'css!SBIS3.ROLE.RoleAccess',
      'js!SBIS3.CORE.TableView',
      'js!SBIS3.ROLE.RoleFunction',
      'js!SBIS3.CORE.Button'],
   function(CompoundControl, dotTplFn){
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
            var self = this;
            sample.superclass.init.call(this);

            var button = this.getChildControlByName('openRoleAccess');
            button.subscribe('onClick', function(){

               function parseStr( str ) {
                  return str.substr( str.search(',')+1 );
               }
               var topParent = this.getTopParent();
               if(topParent.hasChildControlByName('roleViewTable') || topParent.hasChildControlByName('rightRoles')){
                  var roles = [],
                     sel_recs,
                     rec;

                  if(topParent.hasChildControlByName('roleViewTable')){
                     sel_recs = topParent.getChildControlByName('roleViewTable').getRecordSet().getRecords();
                  } else {
                     sel_recs = topParent.getChildControlByName('rightRoles').getSelection();
                  }

                  for( var i = 0; i < sel_recs.length; ++i ){
                     rec = sel_recs[i];
                     if( rec.get( 'Назначена' ) )
                        roles.push( parseStr( rec.get('@Роль') ) );
                  }

                  var opener = this;

                  var cfg = {
                     opener: opener,
                     template:'RightAccess',
                     opener : this,
                     context: {
                        "Роли":roles,
                        "Пользователь":self.getLinkedContext().getValue('@Пользователь')
                     },
                     overlay:true,
                     resizable: false,
                     handlers: {
                        onAfterClose: function(){this.destroy();},
                        onBeforeShow: function(){this.setEnabled( false );}
                     }
                  };

                  if(!self._options.typeDialog) {
                     cfg.isStack = true;
                     $ws.helpers.showFloatArea(cfg);
                  } else {
                     $ws.core.attachInstance('Control/Area:Dialog',cfg);
                  }
               }
            });
         }
      });
      return sample;
   });
