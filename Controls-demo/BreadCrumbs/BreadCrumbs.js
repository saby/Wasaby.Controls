define('Controls-demo/BreadCrumbs/BreadCrumbs', [
   'Core/Control',
   'wml!Controls-demo/BreadCrumbs/BreadCrumbs',
   'WS.Data/Entity/Model'
], function(
   Control,
   template,
   Model
) {
   var BreadCrumbs = Control.extend({
      _template: template,
      items: null,
      items1: null,
      items2: null,
      items3: null,
      info: '',
      _arrowActivated: false,
      _beforeMount: function() {
         this.items = [
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
         ].map(function(item) {
            return new Model({
               rawData: item,
               idProperty: 'id'
            });
         });
         this.items1 = [{
            id: 1,
            title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
            secondTitle: 'тест1'
         }].map(function(item) {
            return new Model({
               rawData: item,
               idProperty: 'id'
            });
         });
         this.items2 = [{
            id: 1,
            title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
            secondTitle: 'тест1'
         }, {
            id: 6,
            title: 'Record3eqweqweqeqweqweedsadeqweqewqeqweqweqw',
            secondTitle: 'тест6'
         }].map(function(item) {
            return new Model({
               rawData: item,
               idProperty: 'id'
            });
         });
         this.items3 = [{ id: 5, title: 'Recor' },
            {
               id: 6,
               title: 'Record3eqweqweqeqweqweedsadeqweqewqeqweqweqw',
               secondTitle: 'тест6'
            }].map(function(item) {
            return new Model({
               rawData: item,
               idProperty: 'id'
            });
         });
      },
      _onItemClick: function(e, item) {
         this.info = item.getId();
         this._arrowActivated = false;
      },

      _resetCrumbs: function() {
         this.items = [
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
         ].map(function(item) {
            return new Model({
               rawData: item,
               idProperty: 'id'
            });
         });
         this.info = '';
         this._arrowActivated = false;
      },

      _onArrowActivated: function() {
         this.info = '';
         this._arrowActivated = true;
      }
   });

   return BreadCrumbs;
});
