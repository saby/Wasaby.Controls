define('Controls/Button/MenuButton',
   [
      'Controls/Button/Menu',
      'Env/Env'
   ],
   function(Menu, Env) {

      var logger = Env.IoC.resolve('ILogger');
      logger.warn('Controls/Button/MenuButton', 'Контрол перенесён, используйте "Controls/Button/Menu"');
      return Menu;
   }
);
