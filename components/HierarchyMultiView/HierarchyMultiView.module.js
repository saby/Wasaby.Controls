define('js!SBIS3.CONTROLS.HierarchyMultiView', ['js!SBIS3.CONTROLS.TreeCompositeView'], function(TreeCompositeView) {
   'use strict';
   $ws.single.ioc.resolve('ILogger').log('MultiView', 'Класс HierarchyMultiView устарел, используйте TreeCompositeView');
   return TreeCompositeView;

});