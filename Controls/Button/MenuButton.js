define('Controls/Button/MenuButton',
   [
      'Controls/dropdown',
      'Env/Env'
   ],
   function(dropdown, Env) {

      var logger = Env.IoC.resolve('ILogger');
      logger.warn('Controls/Button/MenuButton', 'Контрол перенесён, используйте "Controls/Button/Menu"');
      return dropdown.Button;
   }
);
