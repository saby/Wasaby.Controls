define('Controls-demo/BreadCrumbs/BreadCrumbs', [
   'Core/Control',
   'tmpl!Controls-demo/BreadCrumbs/BreadCrumbs'
], function(Control, template) {

   var data = [
      {
         id: 1,
         title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1'
      },
      {
         id: 2,
         title: 'Notebooks 2'
      },
      {
         id: 3,
         title: 'Smartphones 3'

      },
      {
         id: 4,
         title: 'Record1'
      },
      {
         id: 5,
         title: 'Record2'
      },
      {
         id: 6,
         title: 'Record3'
      }
   ];

   var BreadCrumbs = Control.extend({
      _template: template,
      items: data,

      _onItemClick: function(e, item) {
         console.log(item);
      }
   });

   return BreadCrumbs;
});
