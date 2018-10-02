/**
 * @author Михайловский Д.С.
 */
define('Controls/Header/Separator',
   [
      'Controls/Heading/Separator',
      'Core/IoC'
   ],
   function(Separator, IoC) {
      var logger = IoC.resolve('ILogger');
      logger.error('Контрол "Controls/Header/Separator" перенесён, используйте "Controls/Heading/Separator"');
      return Separator;
   });
