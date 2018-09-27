/**
 * @author Михайловский Д.С.
 */
define('Controls/Header/BackButton',
   [
      'Controls/Heading/BackButton',
      'Core/IoC'
   ],
   function(BackButton, IoC) {
      var logger = IoC.resolve('ILogger');
      logger.error('Контрол "Controls/Header/BackButton" перенесён, используйте "Controls/Heading/BackButton"');
      return BackButton;
   });
