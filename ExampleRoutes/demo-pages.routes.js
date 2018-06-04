module.exports = function(Component) {
   var render = function render(req, res, innerControl) {
      res.render('tmpl!ExampleRoutes/View/View', {
         'content': innerControl,
         'title' : 'Демо-пример'
      }, [innerControl]); 
   };

   // Настройка роутинга для страничек с демо-примерами к WS4.	
   return {

      // Демо-страница "Открытие всплывающего окна с шаблоном-наследником класса Lib/Control/CompoundControl/CompoundControl"
      '/demo-ws4-open-component-from-ws3': function(req, res) {
         requirejs('Examples/ws4open/Module');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Examples/ws4open/Module',
            initDependencies: false
          }, []);
      },

      // Демо-страница "Открытие всплывающего окна с шаблоном-наследником класса Core/Control. Только для WS3"
      '/demo-ws3-open-component-from-ws4': function(req, res) {
         requirejs(['Examples/ws3open/Module'], function() {
            render(req, res, 'Examples/ws3open/Module');
         });
     }
   }
};
