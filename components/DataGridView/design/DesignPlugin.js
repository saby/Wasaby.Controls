define('SBIS3.CONTROLS/DataGridView/design/DesignPlugin', ['SBIS3.CONTROLS/DataGridView'], function(DataGridView){
   DataGridView.extendPlugin({
      setColumns: function(){
         var self = this;
         setTimeout(function() {
            self._redrawHead();
            self._notify('onDataLoad');
         }, 0);
      }
   });
});