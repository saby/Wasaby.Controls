define('js!SBIS3.Engine.SwitcherDoubleOnline', ['js!SBIS3.CONTROLS.SwitcherDouble'], function(SwitcherDouble) {
   $ws.single.ioc.resolve('ILogger').log('DataGrid', 'Класс SBIS3.Engine.SwitcherDoubleOnline устарел, используйте SBIS3.CONTROLS.SwitcherDouble');
   return SwitcherDouble;
});