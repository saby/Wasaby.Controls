define('js!WSControls/Containers/CompoundArea',
   [
      'Core/Control',
      'tmpl!WSControls/Containers/CompoundArea',
      'Core/moduleStubs'
   ],
   function(Control,
            template,
            moduleStubs) {
      var CompoundArea = Control.extend({
         _template: template,
         componentOptions: null,
         compatible: null,

         _beforeMount: function(cfg){
            var
               self = this;
            if (cfg.componentOptions) {
               this.componentOptions = cfg.componentOptions;
            } else {
               this.componentOptions = {};
            }
            return moduleStubs.require(
               [
                  cfg.component,
                  'js!SBIS3.CORE.Control/Control.compatible',
                  'js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible',
                  'js!SBIS3.CORE.BaseCompatible'
               ]).addCallback(function(result){

               for(var i in result[1]) {
                  self[i] = result[1][i];
               }
               for(var i in result[2]) {
                  self[i] = result[2][i];
               }
               for(var i in result[3]) {
                  self[i] = result[3][i];
               }

               self.deprecatedContr(cfg);
            });
         },

         _afterMount: function(){
            this.reviveSuperOldControls();
         }
      });

      return CompoundArea;
   });