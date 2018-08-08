define('Controls/Header',
   [
      'Controls/Heading',
      'Core/IoC'
   ],
   function(Heading, IoC) {

      var logger = IoC.resolve('ILogger');
      logger.warn('Контрол "Controls/Header" перенесён, используйте "Controls/Heading"');
      return Heading;
   }
);