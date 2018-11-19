define(
   [
      'Controls/Filter/Button/History/List',
      'Core/Serializer',
      'WS.Data/Chain',
      'tests/Filter/Button/History/testHistorySource',
      'Controls/Filter/Button/History/resources/historyUtils'
   ],
   function(List, Serializer, Chain, HistorySourceDemo, historyUtils) {
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

         after(() => {
            list.destroy();
         });

         historyUtils.loadHistoryItems('TEST_HISTORY_ID').addCallback(function(items) {
            config.items = items;
         });

         list.saveOptions(config);

         it('get text', function() {
            var textArr = [];
            list._beforeMount(config);
            textArr = list._getText(list._options.items, historyUtils.getHistorySource(config.historyId));
            assert.equal(textArr[0], 'Past month, Due date, Ivanov K.K., Unread, On department');
            assert.equal(textArr[1], 'Past month, Ivanov K.K.');

         });

         it('on resize', function() {
            List._private.onResize(list);
            assert.isTrue(list._isMaxHeight);
         });

         it('click separator', function() {
            list._isMaxHeight = true;
            list._clickSeparatorHandler();
            assert.isFalse(list._isMaxHeight);
         });

         it('content click', function() {
            var histItems = [];
            list._notify = (e, args) => {
               if (e == 'applyHistoryFilter') {
                  histItems = args[0];
               }
            };
            var savedList = list;
            Chain(list._options.items).each(function(item, index) {
               if (item) {
                  savedList._contentClick('click', item);
                  assert.deepEqual(histItems, itemsHistory[index]);
               }
            });
         });

         it('pin click', function() {
            var savedList = list;
            Chain(list._options.items).each(function(item) {
               if (item) {
                  savedList._onPinClick('click', item);
               }
            });
         });


      });
   });
