define('Controls/Button/MenuButton',
   [
      'Controls/Button/Menu',
      'Env/Env'
   ],
   function(Menu, Env) {

      var logger = Env.IoC.resolve('ILogger');
      logger.warn('Контрол "Controls/Button/MenuButton" перенесён, используйте "Controls/Button/Menu"');
      return Menu;
   }
);
