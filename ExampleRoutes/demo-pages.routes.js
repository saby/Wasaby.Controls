module.exports = function(Component) {
   var render = function render(req, res, innerControl) {
      res.render('tmpl!ExampleRoutes/View/View', {
         'content': innerControl,
         'title' : 'Демо-пример'
      }, [innerControl]); 
   };

   // Настройка роутинга для страничек с демо-примерами к WS4.	
   return {

      // Демо-пример: открытие шаблона WS3 во всплывающем окне WS4
      '/demo-ws4-open-component-from-ws3': function(req, res) {
         requirejs('Examples/ws4open/Module');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Examples/ws4open/Module',
            initDependencies: false
          }, []);
      },

      // Демо-пример: открытие шаблона WS4 во всплывающем окне WS3
      '/demo-ws3-open-component-from-ws4': function(req, res) {
         requirejs(['Examples/ws3open/Module'], function() {
            render(req, res, 'Examples/ws3open/Module');
         });
      },

      // Демо-пример: cвайп при работе со списочным компонентом на тач-устройствах
      '/demo-ws4-swipe': function(req, res) {
        requirejs(['Examples/Swipe/Module'], function() {
           render(req, res, 'Examples/Swipe/Module');
        });
     }
   }
};
