define('Controls/Toggle/Radio',
   [
      'Controls/Toggle/RadioGroup',
      'Core/IoC'
   ],
   function(RadioGroup, IoC) {

      var logger = IoC.resolve('ILogger');
      logger.error('Контрол "Controls/Toggle/Radio" перенесён, используйте "Controls/Toggle/RadioGroup"');
      return RadioGroup;
   }
);
