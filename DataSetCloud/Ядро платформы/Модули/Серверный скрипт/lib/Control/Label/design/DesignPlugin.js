define('js!SBIS3.CORE.Label/design/DesignPlugin',
   [
      'js!SBIS3.CORE.Label'
   ],
   function(Label){

   /**
    * @class $ws.proto.Label.DesignPlugin
    * @extends $ws.proto.Label
    * @plugin
    */
   $ws.proto.Label.DesignPlugin = Label.extendPlugin({
      $constructor: function(){
         $('.ws-Label__placeholder', this.getContainer().get(0))
            .addClass('genie-Placeholder').attr('data-name', 'labelContent');
      }
   });
});