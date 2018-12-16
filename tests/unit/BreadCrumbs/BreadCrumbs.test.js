define([
   'Controls/BreadCrumbs/View',
   'WS.Data/Entity/Model'
], function(
   BreadCrumbsView,
   Model
) {
   describe('Controls.BreadCrumbs.View', function() {
      var bc, data;
      beforeEach(function() {
         data = [
            {
               id: 1,
               title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
               parent: null
            },
            {
               id: 2,
               title: 'Notebooks 2',
               parent: 1
            },
            {
               id: 3,
               title: 'Smartphones 3',
               parent: 2
            },
            {
               id: 4,
               title: 'Record1',
               parent: 3
            },
            {
               id: 5,
               title: 'Record2',
               parent: 4
            },
            {
               id: 6,
               title: 'Record3eqweqweqeqweqweedsadeqweqewqeqweqweqw',
               parent: 5
            }
         ];
         bc = new BreadCrumbsView();
         bc.saveOptions({
            items: data.map(function(item) {
               return new Model({
                  rawData: item
               });
            }),
            keyProperty: 'id',
            parentProperty: 'parent'
         });
      });
      afterEach(function() {
         bc.destroy();
         bc = null;
      });
      describe('_onItemClick', function() {
         it('item', function() {
            var itemData = {
               item: new Model({
                  rawData: {
                     id: 2,
                     title: 'Notebooks 2'
                  }
               })
            };
            bc._notify = function(e, args) {
               if (e === 'itemClick') {
                  assert.equal(itemData.item.get('id'), args[0]);
               }
            };
            bc._onItemClick({}, itemData);
         });
         it('dots', function() {
            var itemData = {
               item: {
                  title: '...'
               },
               isDots: true
            };
            var stopPropagationCalled = false;
            bc._children = {
               menuOpener: {
                  open: function(openerOptions) {
                     assert.equal(openerOptions.target, 123);
                     assert.equal(openerOptions.templateOptions.items.at(0).get('title'), data[0].title);
                  }
               }
            };
            bc._onItemClick({
               target: 123,
               stopPropagation: function() {
                  stopPropagationCalled = true;
               }
            }, itemData);
            assert.isTrue(stopPropagationCalled);
         });
      });
      it('_onResize', function(done) {
         bc._children = {
            menuOpener: {
               close: function() {
                  done();
               }
            }
         };
         bc._onResize();
      });
      it('_onResult', function(done) {
         var args = {
            action: 'itemClick',
            data: [new Model({
               rawData: data[0]
            })]
         };
         bc._notify = function(e, eventArgs) {
            if (e === 'itemClick') {
               assert.equal(bc._options.items[0].get('id'), eventArgs[0]);
            }
         };
         bc._children = {
            menuOpener: {
               close: function() {
                  done();
               }
            }
         };
         bc._onResult(args);
      });
   });
});
