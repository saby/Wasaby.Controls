define('js!SBIS3.Engine.SwitcherDoubleOnline', [
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!SBIS3.CONTROLS.SwitcherDouble"
], function( IoC, ConsoleLogger,SwitcherDouble) {
   IoC.resolve('ILogger').log('DataGrid', 'Класс SBIS3.Engine.SwitcherDoubleOnline устарел, используйте SBIS3.CONTROLS.SwitcherDouble');
   return SwitcherDouble;
});