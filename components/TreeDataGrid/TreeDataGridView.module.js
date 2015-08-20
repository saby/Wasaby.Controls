define('js!SBIS3.CONTROLS.TreeDataGrid', [
   'js!SBIS3.CONTROLS.TreeDataGridView'
], function(DGView){
   $ws.single.ioc.resolve('ILogger').log('DataGrid', 'Класс TreeDataGrid устарел, используйте TreeDataGridView');
   return DGView;
});
