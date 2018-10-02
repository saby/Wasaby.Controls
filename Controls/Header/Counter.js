/**
 * @author Михайловский Д.С.
 */
define('Controls/Header/Counter',
   [
      'Controls/Heading/Counter',
      'Core/IoC'
   ],
   function(Counter, IoC) {
      var logger = IoC.resolve('ILogger');
      logger.error('Контрол "Controls/Header/Counter" перенесён, используйте "Controls/Heading/Counter"');
      return Counter;
   });
