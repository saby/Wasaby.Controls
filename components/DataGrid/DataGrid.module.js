define('js!SBIS3.CONTROLS.DataGrid', [
   'js!SBIS3.CONTROLS.DataGridView'
], function(DGView){
   $ws.single.ioc.resolve('ILogger').log('DataGrid', 'Класс DataGrid устарел, используйте DataGridView');
   return DGView;
});