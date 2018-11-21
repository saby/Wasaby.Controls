define('Controls/Heading/BackButton',
   [
      'Controls/Heading/Back',
      'Core/IoC'
   ],
   function(Menu, IoC) {
      var logger = IoC.resolve('ILogger');
      logger.warn('Контрол "Controls/Heading/BackButton" перенесён, используйте "Controls/Heading/Back"');
      return Menu;
   });