define('js!SBIS3.CONTROLS.DataGridView/design/DesignPlugin', ['js!SBIS3.CONTROLS.DataGridView'], function(DataGridView){
   DataGridView.extendPlugin({
      setColumns: function(){
         var self = this;
         setTimeout(function(){
            self._notify('onDataLoad');
         }, 0);
      }
   });
});