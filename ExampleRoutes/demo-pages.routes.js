module.exports = function(Component) {
   var render = function render(req, res, innerControl) {
      res.render('tmpl!ExampleRoutes/View/View', {
         'content': innerControl,
         'title' : 'Демо-пример'
      }, [innerControl]); 
   };

   return {


      /*
        ### СТРАНИЧКИ ДЛЯ НОВЫХ КОНТРОЛОВ - WS4 (VDOM). ### 
        ### Для построения страницы используется компонент Controls/Application. ###
        ### Пространство имён - Controls/ . ###
      */

      // Демо-пример: открытие шаблона, совместимого с WS3, в программном окружении WS4.
      '/demo-ws4-open-component-from-ws3': function(req, res) {
         requirejs('Examples/ws4open/Module');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Examples/ws4open/Module',
            initDependencies: false
          }, []);
      },

      '/demo-ws4-input': function(req, res) {
         requirejs('Controls-demo/Example/Input');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Controls-demo/Example/Input',
            initDependencies: false
         }, []);
      },

      // Демо-пример: cвайп при работе со списочным компонентом на тач-устройствах.
      '/demo-ws4-swipe': function(req, res) {
        requirejs('Examples/Swipe/Module');
        res.render('tmpl!Controls/Application/Route', {
           application: 'Examples/Swipe/Module',
           initDependencies: false
         }, []);
      },

      // Демо-пример: работа всплывающих окон и панелей
      '/demo-ws4-opener-stack': function(req, res) {
        requirejs('Controls-demo/Popup/PopupPage');
        res.render('tmpl!Controls/Application/Route', {
           application: 'Controls-demo/Popup/PopupPage',
           initDependencies: false
         }, []);
      },

      // Демо-пример: работа инфобокса
      '/demo-ws4-infobox': function(req, res) {
        requirejs('Controls-demo/InfoBox/InfoBox');
        res.render('tmpl!Controls/Application/Route', {
           application: 'Controls-demo/InfoBox/InfoBox',
           initDependencies: false
         }, []);
      },

      // Демо-пример: редактирование по месту в списках.
      '/edit-in-place': function(req, res) {
         requirejs('Examples/List/EditInPlace/EditInPlace');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Examples/List/EditInPlace/EditInPlace',
            initDependencies: false
         }, []);
      },

      // Демо-пример: концепция использования прикладных шаблонов.
      '/demo-ws4-templates': function(req, res) {
         requirejs('Examples/List/Base');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Examples/List/Base',
            initDependencies: false
         }, []);
      },

      // Демо-пример: фильтрация и поиск.
      '/demo-ws4-filter-search': function(req, res) {
         requirejs('Examples/Layouts/SearchLayout');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Examples/Layouts/SearchLayout',
            initDependencies: false
         }, []);
      },

      // Демо-пример: компоненты для работы с всплывающими окнами.
      '/demo-ws4-popup-opener': function(req, res) {
         requirejs('Examples/Popup/Opener');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Examples/Popup/Opener',
            initDependencies: false
         }, []);
      },

      // Демо-пример: работа с перемещениями элементов интерфейса.
      '/demo-ws4-drag-n-drop': function(req, res) {
         requirejs('Examples/DragNDrop/Container');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Examples/DragNDrop/Container',
            initDependencies: false
         }, []);
      },

      // Демо-пример: чекбокс
      '/demo-ws4-checkbox': function(req, res) {
         requirejs('Controls-demo/Checkbox/standartDemoCheckboxWithApplication');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Controls-demo/Checkbox/standartDemoCheckboxWithApplication',
            initDependencies: false
         }, []);
      },

      // Демо-пример: заголовки(разделители) и кнопка назад
      '/demo-ws4-header-separator': function(req, res) {
         requirejs('Controls-demo/Headers/standartDemoHeaderWithApplication');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Controls-demo/Headers/standartDemoHeaderWithApplication',
            initDependencies: false
         }, []);
      },

      // Демо-пример: Переключатели
      '/demo-ws4-switchers': function(req, res) {
         requirejs('Controls-demo/Switch/standartDemoSwitchWithApplication');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Controls-demo/Switch/standartDemoSwitchWithApplication',
            initDependencies: false
         }, []);
      },
   
      // Демо-пример: с поиском
      '/demo-ws4-search-container': function(req, res) {
         requirejs('Controls-demo/Search/ContainerApplication');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Controls-demo/Search/ContainerApplication',
            initDependencies: false
         }, []);
      },
   
      // Демо-пример: с фильтром
      '/demo-ws4-filter-container': function(req, res) {
         requirejs('Controls-demo/Filter/ContainerApplication');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Controls-demo/Filter/ContainerApplication',
            initDependencies: false
         }, []);
      },
   
      // Демо-пример: с фильтром и поиском
      '/demo-ws4-filter-search-new': function(req, res) {
         requirejs('Controls-demo/FilterSearch/FilterSearchApplication');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Controls-demo/FilterSearch/FilterSearchApplication',
            initDependencies: false
         }, []);
      },

      // Демо-пример: операции над записью.
      '/demo-ws4-item-actions': function(req, res) {
         requirejs('Examples/List/ItemActions');
         res.render('tmpl!Controls/Application/Route', {
            application: 'Examples/List/ItemActions',
            initDependencies: false
         }, []);
      },

      /*
        ### СТРАНИЧКИ ДЛЯ СТАРЫХ КОНТРОЛОВ - WS3. ### 
        ### Для построения страницы используется шаблон VIEW. ###
        ### Пространство имён - SBIS3.CONTROLS, Lib/Controls, Deprecated/Controls. ###
      */

      // Демо-пример: открытие шаблона, совместимого с WS4, в программном окружении WS3. 
      '/demo-ws3-open-component-from-ws4': function(req, res) {
        requirejs(['Examples/ws3open/Module'], function() {
           render(req, res, 'Examples/ws3open/Module');
        });
      },

      '/demo-ws3-import': function(req, res) {
        requirejs(['Examples/Import/ImportModule'], function() {
           render(req, res, 'Examples/Import/ImportModule');
        });
      }

   }
};
