define('Controls-demo/BreadCrumbs/BreadCrumbs', [
   'Core/Control',
   'tmpl!Controls-demo/BreadCrumbs/BreadCrumbs'
], function(Control, template) {

   var data = [
      {
         id: 1,
         title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
         secondTitle: 'тест1'
      },
      {
         id: 2,
         title: 'Notebooks 2',
         secondTitle: 'тест2'
      },
      {
         id: 3,
         title: 'Smartphones 3',
         secondTitle: 'тест3'
      },
      {
         id: 4,
         title: 'Record1',
         secondTitle: 'тест4'
      },
      {
         id: 5,
         title: 'Record2',
         secondTitle: 'тест5'
      },
      {
         id: 6,
         title: 'Record3eqweqweqeqweqweedsadeqweqewqeqweqweqw',
         secondTitle: 'тест6'
      }
   ];

   var BreadCrumbs = Control.extend({
      _template: template,
      items: data,
      items1: [data[0]],
      items2: [data[0], data[5]],
      items3: [{id: 5, title: 'Recor'}, data[5]],
      info: '',

      _onItemClick: function(e, item) {
         this.info = item.id;
      },

      _resetCrumbs: function() {
         this.items = data;
         this.info = '';
      }
   });

   return BreadCrumbs;
});
