define('Controls/Heading/BackButton',
   [
      'Controls/Heading/Back',
      'Env/Env'
   ],
   function(Menu, Env) {
      var logger = Env.IoC.resolve('ILogger');
      logger.warn('Контрол "Controls/Heading/BackButton" перенесён, используйте "Controls/Heading/Back"');
      return Menu;
   });
