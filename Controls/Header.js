/**
 * @author Михайловский Д.С.
 */
define('Controls/Header',
   [
      'Controls/Heading',
      'Core/IoC'
   ],
   function(Heading, IoC) {

      var logger = IoC.resolve('ILogger');
      logger.error('Контрол "Controls/Header" перенесён, используйте "Controls/Heading"');
      return Heading;
   }
);
