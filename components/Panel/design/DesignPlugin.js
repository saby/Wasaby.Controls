define('SBIS3.CONTROLS/Panel/design/DesignPlugin',
   [
      'SBIS3.CONTROLS/Panel', 'css!SBIS3.CONTROLS/Panel/design/design'
   ],
   function(Panel){
   /**
    * @class SBIS3.CONTROLS.Panel.DesignPlugin
    * @extends SBIS3.CONTROLS/Panel
    * @plugin
    */
   Panel.extendPlugin({
      $constructor: function(){
         this.getContainer().addClass('genie-Placeholder genie-dragdrop').attr('data-name','content');
      }
   });
});