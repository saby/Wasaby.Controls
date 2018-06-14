module.exports = function(Component) {
   var render = function render(req, res, innerControl) {
      res.render('tmpl!ExampleRoutes/View/View', {
         'content': innerControl,
         'title' : 'Демо-пример'
      }, [innerControl]); 
   };

   return {
      // Демо-пример: Демо-пример: открытие шаблона, совместимого с WS3, в программном окружении WS4.
      // Для построения страницы используется компонент Controls/Application.
      '/demo-ws4-open-component-from-ws3': function(req, res) {
         requirejs('Examples/ws4open/Module');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Examples/ws4open/Module',
            initDependencies: false
          }, []);
      },

      // Демо-пример: cвайп при работе со списочным компонентом на тач-устройствах.
      // Для построения страницы используется компонент Controls/Application.
      '/demo-ws4-swipe': function(req, res) {
        requirejs('Examples/Swipe/Module');
        res.render('tmpl!Controls/Application/Route', {
           application: 'Examples/Swipe/Module',
           initDependencies: false
         }, []);
      },

      // Демо-пример: открытие шаблона, совместимого с WS4, в программном окружении WS3.
      // Для построения страницы используется шаблон VIEW.
      '/demo-ws3-open-component-from-ws4': function(req, res) {
         requirejs(['Examples/ws3open/Module'], function() {
            render(req, res, 'Examples/ws3open/Module');
         });
      }
   }
};
