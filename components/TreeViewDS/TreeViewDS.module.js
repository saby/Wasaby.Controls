define('js!SBIS3.CONTROLS.TreeViewDS', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!SBIS3.CONTROLS.TreeView"
], function ( IoC, ConsoleLogger,TreeView) {
   IoC.resolve('ILogger').log('TreeViewDS', 'Класс TreeViewDS устарел, используйте TreeView');
   return TreeView;
});
