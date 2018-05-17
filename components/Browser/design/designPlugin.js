define('SBIS3.CONTROLS/Browser/design/designPlugin',
   [
      'SBIS3.CONTROLS/Browser',
      'css!SBIS3.CONTROLS/Browser/design/design'
   ],
   function(Browser){


      Browser.prototype.init = function(opts){
         Browser.superclass.init.apply(this, arguments);
      };

      Browser.extendPlugin({
         $constructor: function(){
            this.getContainer().addClass('genie-Placeholder genie-dragdrop').attr('data-name','content');
         }
      });

   });
