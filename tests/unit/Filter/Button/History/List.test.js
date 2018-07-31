define(
   [
      'Controls/Filter/Button/History/List',
      'Core/Serializer',
      'WS.Data/Chain',
      'tests/unit/Filter/Button/History/testHistorySource'
   ],
   function(List, Serializer, Chain, HistorySourceDemo) {
      describe('FilterHistoryList', function() {
         var items2 = [
            {id: 'period', value: [3], resetValue: [1], textValue: 'Past month'},
            {id: 'state', value: [1], resetValue: [1]},
            {id: 'limit', value: [1], resetValue: '', textValue: 'Due date', visibility: false},
            {id: 'sender', value: '', resetValue: '', visibility: false},
            {id: 'author', value: 'Ivanov K.K.', textValue: 'Ivanov K.K.', resetValue: ''},
            {id: 'responsible', value: '', resetValue: '', visibility: false},
            {id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false},
            {id: 'operation', value: '', resetValue: '', visibility: false},
            {id: 'group', value: [1], resetValue: '', visibility: false},
            {id: 'unread', value: true, resetValue: false, textValue: 'Unread', visibility: false},
            {id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false},
            {id: 'own', value: [2], resetValue: '', textValue: 'On department', visibility: false},
            {id: 'our organisation', value: '', resetValue: '', visibility: false},
            {id: 'document', value: '', resetValue: '', visibility: false},
            {id: 'activity', value: [1], resetValue: '', selectedKeys: [1], visibility: false}
         ];

         var items1 = [
            {id: 'period', value: [3], resetValue: [1], textValue: 'Past month'},
            {id: 'state', value: [1], resetValue: [1]},
            {id: 'limit', value: [1], resetValue: '', textValue: 'Due date', visibility: true},
            {id: 'sender', value: '', resetValue: '', textValue: 'Petrov B.B', visibility: true},
            {id: 'author', value: 'Ivanov K.K.', textValue: 'Ivanov K.K.', resetValue: ''},
            {id: 'responsible', value: '', resetValue: '', visibility: false},
            {id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false},
            {id: 'operation', value: '', resetValue: '', visibility: false},
            {id: 'group', value: [1], resetValue: '', visibility: false},
            {id: 'unread', value: true, resetValue: false, textValue: 'Unread', visibility: true},
            {id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false},
            {id: 'own', value: [2], resetValue: '', textValue: 'On department', visibility: true},
            {id: 'our organisation', value: '', resetValue: '', visibility: false},
            {id: 'document', value: '', resetValue: '', visibility: false},
            {id: 'activity', value: [1], resetValue: '', selectedKeys: [1], visibility: false}
         ];

         var itemsHistory = [items1, items2];

         var list = new List();

         var config = {
            historyId: 'TEST_HISTORY_ID'
         };

         var items = [
            {id: 'period', value: [2], resetValue: [1], textValue: 'Today'},
            {id: 'sender', value: '', resetValue: '', textValue: ''},
            {id: 'author', value: 'Ivanov K.K.', resetValue: '', textValue: 'Ivanov K.K.', visibility: true},
            {id: 'responsible', value: '', resetValue: '', textValue: 'Petrov T.T.', visibility: false}
         ];

         it('get text', function(done) {
            var savedList = list,
               text = [];
            list._beforeMount(config).addCallback(function() {
               Chain(list._listItems).each(function(item) {
                  if (item) {
                     text.push(savedList._getText(item));
                  }
               });
               assert.equal(text[0], 'Past month, Due date, Ivanov K.K., Unread, On department');
               assert.equal(text[1], 'Past month, Ivanov K.K.');
               done();
            });

         });

         it('on resize', function(done) {
            list._beforeMount(config).addCallback(function() {
               List._private.onResize(list);
               assert.isTrue(list._isMaxHeight);
               done();
            });
         });

         it('click separator', function() {
            list._isMaxHeight = true;
            list._clickSeparatorHandler();
            assert.isFalse(list._isMaxHeight);
         });

         it('load items', function(done) {
            list._beforeMount(config).addCallback(function(items) {
               list._afterMount();
               list._afterUpdate();
               assert.deepEqual(items.getRawData(), list._listItems.getRawData());
               done();
            });
         });

         it('update items', function(done) {
            list._beforeUpdate({historyId: 'NEW_HISTORY_ID'}).addCallback(function(items) {
               assert.deepEqual(items.getRawData(), list._listItems.getRawData());
               done();
            });
         });

         it('content click', function(done) {
            var histItems = [];
            list._notify = (e, args) => {
               if (e == 'applyHistoryFilter') {
                  histItems = args[0];
               }
            };
            var savedList = list;
            list._beforeMount(config).addCallback(function() {
               Chain(list._listItems).each(function(item, index) {
                  if (item) {
                     savedList._contentClick('click', item);
                     assert.deepEqual(histItems, itemsHistory[index]);
                  }
               });
               list.destroy();
               done();
            });
         });

         it('pin click', function(done) {
            var savedList = list;
            list._beforeMount(config).addCallback(function(items) {
               Chain(list._listItems).each(function(item) {
                  if (item) {
                     savedList._onPinClick('click', item);
                  }
               });
               done();
            });
         });


      });
   });
