define('Controls/Button/MenuButton',
   [
      'Controls/Button/Menu',
      'Core/IoC'
   ],
   function(Menu, IoC) {

      var logger = IoC.resolve('ILogger');
      logger.warn('Контрол "Controls/Button/MenuButton" перенесён, используйте "Controls/Button/Menu"');
      return Menu;
   }
);
