define('js!SBIS3.CONTROLS.MultiView', ['js!SBIS3.CONTROLS.CompositeView'], function(CompositeView) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').log('MultiView', 'Класс MultiView устарел, используйте CompositeView');
   return CompositeView;

});