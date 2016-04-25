define('js!SBIS3.CONTROLS.TreeViewDS', ['js!SBIS3.CONTROLS.TreeView'], function (TreeView) {
   $ws.single.ioc.resolve('ILogger').log('TreeViewDS', 'Класс TreeViewDS устарел, используйте TreeView');
   return TreeView;
});
