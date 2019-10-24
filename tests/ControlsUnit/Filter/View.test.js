define(
   [
      'Controls/filter',
      'Core/core-clone',
      'Types/source',
      'Types/collection',
      'Controls/history',
      'Core/Deferred'
   ],
   function(filter, Clone, sourceLib, collection, history, Deferred) {
      describe('Filter:View', function() {

         let defaultItems = [
            [
               {id: 1, title: 'My'},
               {id: 2, title: 'My department'}
            ],

            [
               {id: 1, title: 'In any state'},
               {id: 2, title: 'In progress'},
               {id: 3, title: 'Completed'},
               {
                  id: 4,
                  title: 'Completed positive'
               },
               {
                  id: 5,
                  title: 'Completed negative'
               },
               {id: 6, title: 'Deleted'},
               {id: 7, title: 'Drafts'}
            ]
         ];

         let defaultSource = [
            {
               name: 'document',
               value: null,
               resetValue: null,
               textValue: '',
               emptyText: 'All documents',
               editorOptions: {
                  source: new sourceLib.Memory({
                     keyProperty: 'id',
                     data: defaultItems[0]
                  }),
                  displayProperty: 'title',
                  keyProperty: 'id'
               },
               viewMode: 'frequent'
            }, {
               name: 'state',
               value: [1],
               resetValue: [null],
               textValue: '',
               emptyText: 'all state',
               editorOptions: {
                  source: new sourceLib.Memory({
                     keyProperty: 'id',
                     data: defaultItems[1]
                  }),
                  displayProperty: 'title',
                  keyProperty: 'id',
                  multiSelect: true
               },
               viewMode: 'frequent'
            },
            {name: 'author', value: 'Ivanov K.K.', textValue: 'Author: Ivanov K.K.', resetValue: '', viewMode: 'basic'},
            {name: 'sender', value: '', resetValue: '', viewMode: 'extended', visibility: false},
            {name: 'responsible', value: '', resetValue: '', viewMode: 'extended', visibility: false}
         ];

         let defaultConfig = {
            source: defaultSource
         };

         let getView = function (config) {
            let view = new filter.View();
            view.saveOptions(config);
            return view;
         };

         let getItems = function (items) {
            return new collection.RecordSet({
               keyProperty: 'id',
               rawData: items
            });
         };

         it('_beforeMount from receivedState', function() {
            let view = getView(defaultConfig);
            let receivedState = {
               configs: {
                  document: {
                     items: getItems(Clone(defaultItems[0])),
                     displayProperty: 'title',
                     keyProperty: 'id'},
                  state: {
                     items: getItems(Clone(defaultItems[1])),
                     displayProperty: 'title',
                     keyProperty: 'id',
                     multiSelect: true}
               }
            };
            let expectedDisplayText = {
               document: {},
               state: {text: 'In any state', title: 'In any state', hasMoreText: ''}
            };
            view._beforeMount(defaultConfig, {}, receivedState);

            assert.deepStrictEqual(view._displayText, expectedDisplayText);
            assert.strictEqual(view._filterText, 'Author: Ivanov K.K.');
            assert.isOk(view._configs.document._sourceController);
            assert.isOk(view._configs.state._sourceController);
            assert.isFalse(view._hasSelectorTemplate);

            receivedState.configs.document.selectorTemplate = 'New Template';
            view._beforeMount(defaultConfig, {}, receivedState);
            assert.isTrue(view._hasSelectorTemplate);
         });

         it('_beforeMount from options', function(done) {
            let view = getView(defaultConfig);
            let expectedDisplayText = {
               document: {},
               state: {text: 'In any state', title: 'In any state', hasMoreText: ''}
            };
            view._beforeMount(defaultConfig).addCallback(function() {
               assert.deepStrictEqual(view._displayText, expectedDisplayText);
               assert.strictEqual(view._filterText, 'Author: Ivanov K.K.');
               assert.isOk(view._configs.document._sourceController);
               assert.isOk(view._configs.state._sourceController);
               done();
            });
         });

         it('_beforeUpdate', function(done) {
            let view = getView(defaultConfig);
            view._beforeUpdate(defaultConfig);

            let expectedDisplayText = {
               document: {text: 'My', title: 'My', hasMoreText: ''},
               state: {text: 'In any state', title: 'In any state', hasMoreText: ''}
            };

            let newConfig = Clone(defaultConfig);
            newConfig.source[0].value = 1;
            newConfig.source[0].editorOptions.source = new sourceLib.Memory({
               keyProperty: 'id',
               data: defaultItems[0]
            });
            view._configs = {};
            view._displayText = {};

            //isNeedReload = true
            view._beforeUpdate(newConfig).addCallback(function() {
               assert.deepStrictEqual(view._displayText, expectedDisplayText);

               newConfig = Clone(defaultConfig);
               newConfig.source[0].value = 2;
               newConfig.source[1].value = [5];
               expectedDisplayText = {
                  document: {text: 'My department', title: 'My department', hasMoreText: ''},
                  state: {text: 'Completed negative', title: 'Completed negative', hasMoreText: ''}
               };

               //isNeedReload = false
               view._beforeUpdate(newConfig);
               assert.deepStrictEqual(view._displayText, expectedDisplayText);
               done();
            });
         });

         it('_beforeUpdate new items length', function() {
            let view = getView(defaultConfig);
            view._beforeUpdate(defaultConfig);

            let expectedDisplayText = {
               document: {text: 'My', title: 'My', hasMoreText: ''}
            };

            let newConfig = Clone(defaultConfig);
            newConfig.source[0].value = 1;
            newConfig.source[0].editorOptions.source = new sourceLib.Memory({
               keyProperty: 'id',
               data: defaultItems[0]
            });
            view._configs = {};
            view._displayText = {};
            newConfig.source.splice(1,1);
            view._beforeUpdate(newConfig).addCallback(() => {
               assert.deepStrictEqual(view._displayText, expectedDisplayText);
            });
         });

         it('openDetailPanel', function() {
            let view = getView(defaultConfig),
               popupOptions;
            view._children = {
               StickyOpener: { open: (options) => {popupOptions = options;}, isOpened: () => {return false;} }
            };
            view._container = {};
            view._options.detailPanelTemplateName = 'detailPanelTemplateName.wml';
            view._source = defaultConfig.source;

            view.openDetailPanel();

            assert.strictEqual(popupOptions.template, 'detailPanelTemplateName.wml');
            assert.strictEqual(popupOptions.templateOptions.items.length, 5);

            view._options.detailPanelTemplateName = null;
            view.openDetailPanel();
         });

         it('_openPanel', function() {
            let view = getView(defaultConfig),
               popupOptions;
            view._children = {
               StickyOpener: { open: (options) => {popupOptions = options;}, isOpened: () => {return false;} }
            };
            view._container = ['filter_container'];
            view._options.panelTemplateName = 'panelTemplateName.wml';
            view._source = defaultConfig.source;
            view._configs = {
               document: {
                  items: Clone(defaultItems[0]),
                  displayProperty: 'title',
                  keyProperty: 'id'},
               state: {
                  items: Clone(defaultItems[1]),
                  displayProperty: 'title',
                  keyProperty: 'id',
                  multiSelect: true}
            };
            view._openPanel();

            assert.strictEqual(popupOptions.template, 'panelTemplateName.wml');
            assert.strictEqual(popupOptions.templateOptions.items.getCount(), 2);
            assert.strictEqual(popupOptions.className, 'controls-FilterView-SimplePanel__buttonTarget-popup');

            view._children['second_filter'] = 'div_second_filter';
            view._openPanel('click', 'second_filter');
            assert.strictEqual(popupOptions.target, 'div_second_filter');
            assert.strictEqual(popupOptions.className, 'controls-FilterView-SimplePanel-popup');

            view._openPanel('click');
            assert.deepStrictEqual(popupOptions.target, 'filter_container');
         });

         it('_open', function() {
            let view = getView(defaultConfig),
               popupOptions,
               isOpened = true;
            view._children = {
               StickyOpener: { open: (options) => {popupOptions = options;}, isOpened: () => {return isOpened;} }
            };
            view._container = {};

            view._open();
            assert.strictEqual(popupOptions, undefined);

            isOpened = false;
            view._open([1, 2, 4], {template: 'templateName'});

            assert.strictEqual(popupOptions.template, 'templateName');
            assert.deepStrictEqual(popupOptions.templateOptions.items, [1, 2, 4]);
         });

         it('_isFastReseted', function() {
            let view = getView(defaultConfig);
            view._source = defaultConfig.source;

            let isFastReseted = view._isFastReseted();
            assert.isFalse(isFastReseted);

            view._source = Clone(defaultConfig.source);
            view._source[1].value = view._source[1].resetValue;
            isFastReseted = view._isFastReseted();
            assert.isTrue(isFastReseted);
         });

         it('_reset', function() {
            let view = getView(defaultConfig),
               isOpened = true, closed,
               filterChanged, itemsChanged;
            view._children = {
               StickyOpener: { isOpened: () => {return isOpened;}, close: () => {closed = true;} }
            };
            view._notify = (event, data) => {
              if (event === 'filterChanged') {
                 filterChanged = data[0];
              } else if (event === 'itemsChanged') {
                 itemsChanged = data[0];
              }
            };
            view._displayText = {};
            view._source = Clone(defaultConfig.source);
            view._configs = {
               document: {
                  items: Clone(defaultItems[0]),
                  displayProperty: 'title',
                  keyProperty: 'id'},
               state: {
                  items: Clone(defaultItems[1]),
                  displayProperty: 'title',
                  keyProperty: 'id',
                  multiSelect: true}
            };
            let item = view._source[1];
            view._reset('clearClick', item);
            assert.deepStrictEqual(item.value, [null]);
            assert.isTrue(closed);

            isOpened = false;
            item = view._source[1];
            view._reset('clearClick', item);
            assert.deepStrictEqual(item.value, [null]);
            assert.deepStrictEqual(filterChanged, {'author': 'Ivanov K.K.'});
            assert.deepStrictEqual(view._displayText, {document: {}, state: {}});

            item = view._source[0];
            view._displayText = {};
            view._reset('clearClick', item);
            assert.deepStrictEqual(item.value, null);
            assert.deepStrictEqual(view._displayText, {document: {}, state: {}});
         });

         it('_resetFilterText', function() {
            let view = getView(defaultConfig),
               isOpened = true, closed,
               filterChanged, itemsChanged;
            view._children = {
               StickyOpener: { isOpened: () => {return isOpened;}, close: () => {closed = true;} }
            };
            view._notify = (event, data) => {
               if (event === 'filterChanged') {
                  filterChanged = data[0];
               } else if (event === 'itemsChanged') {
                  itemsChanged = data[0];
               }
            };
            view._displayText = {};
            view._source = Clone(defaultConfig.source);
            view._configs = {
               document: {
                  items: getItems(Clone(defaultItems[0])),
                  displayProperty: 'title',
                  keyProperty: 'id'},
               state: {
                  items: getItems(Clone(defaultItems[1])),
                  displayProperty: 'title',
                  keyProperty: 'id',
                  multiSelect: true}
            };
            view._resetFilterText();
            assert.isTrue(closed);
            assert.strictEqual(view._source[2].value, '');
            assert.deepStrictEqual(filterChanged, {state: [1]});
            assert.deepStrictEqual(view._displayText, {document: {}, state: {text: 'In any state', title: 'In any state', hasMoreText: ''}});

            view._source.push({
               name: 'date',
               value: [new Date(2019, 5, 1), new Date(2019, 5, 31)],
               resetValue: [new Date(2019, 7, 1), new Date(2019, 7, 31)],
               editorOptions: {
                  option1: '1',
                  option2: '2'
               },
               type: 'dateRange',
               viewMode: 'basic'
            });
            closed = false;
            view._resetFilterText();
            assert.isTrue(closed);
            assert.strictEqual(view._source[2].value, '');
            assert.deepStrictEqual(view._source[5].value, [new Date(2019, 5, 1), new Date(2019, 5, 31)]);
         });

         it('_rangeChangedHandler', () => {
            let source = [...defaultSource];
            let dateItem = {
               name: 'date',
               value: [new Date(2019, 7, 1), new Date(2019, 7, 31)],
               resetValue: [new Date(2019, 7, 1), new Date(2019, 7, 31)],
               editorOptions: {
                  option1: '1',
                  option2: '2'
               },
               type: 'dateRange',
               viewMode: 'basic'
            };
            source.push(dateItem);
            let view = getView(source),
               newFilter;
            view._notify = (event, data) => {
               if (event === 'filterChanged') {
                  newFilter = data[0];
               }
            };
            view._source = source;
            view._dateRangeItem = dateItem;
            view._rangeChangedHandler('rangeChanged', new Date(2019, 6, 1), new Date(2019, 6, 31));
            assert.deepStrictEqual(filter.View._private.getDateRangeItem(view._source).value, [new Date(2019, 6, 1), new Date(2019, 6, 31)]);
            assert.deepStrictEqual(filter.View._private.getDateRangeItem(view._source).textValue, "Июль'19");
            assert.deepStrictEqual(newFilter, {
               date: [new Date(2019, 6, 1), new Date(2019, 6, 31)],
               author: 'Ivanov K.K.',
               state: [1]});
         });

         it('_private:getDateRangeItem', () => {
            let source = [...defaultSource];
            let dateItem = {
               name: 'date',
               value: [new Date(2019, 7, 1), new Date(2019, 7, 31)],
               resetValue: [new Date(2019, 7, 1), new Date(2019, 7, 31)],
               editorOptions: {
                  option1: '1',
                  option2: '2'
               },
               type: 'dateRange',
               viewMode: 'basic'
            };
            source.push(dateItem);
            let item = filter.View._private.getDateRangeItem(source);
            assert.deepStrictEqual(item, dateItem)
         });

         it('_private:updateText filterText', function() {
            let source = [
               {name: 'date', type: 'dateRange', value: [new Date(2019, 7, 1), new Date(2019, 7, 31)], textValue: "July'19", resetValue: [new Date(2019, 6, 1), new Date(2019, 6, 31)], viewMode: 'basic'},
               {name: 'author', value: 'Ivanov K.K.', textValue: 'Author: Ivanov K.K.', resetValue: '', viewMode: 'basic'},
               {name: 'sender', value: 'Vasiliev A.A.', textValue: 'Sender: Vasiliev A.A.', resetValue: '', viewMode: 'extended', visibility: false},
               {name: 'responsible', value: 'test_extended', resetValue: '', textValue: 'test_extended', viewMode: 'extended', visibility: true},
               {name: 'frequent', value: 'test_frequent', textValue: 'test_frequent', resetValue: '', viewMode: 'frequent'}
            ];
            let self = {};
            filter.View._private.updateText(self, source, {});
            assert.strictEqual(self._filterText, 'Author: Ivanov K.K., test_extended');
         });

         it('_private:getFastText', function() {
            let config = {
               displayProperty: 'title',
               keyProperty: 'id',
               emptyText: 'empty text',
               emptyKey: 'empty',
               items: new collection.RecordSet({
                  rawData: [
                     {id: null, title: 'Reset'},
                     {id: '1', title: 'Record 1'},
                     {id: '2', title: 'Record 2'},
                     {id: '3', title: 'Record 3'}
                  ]
               })
            };
            let display = filter.View._private.getFastText(config, [null]);
            assert.strictEqual(display.text, 'Reset');

            display = filter.View._private.getFastText(config, ['empty']);
            assert.strictEqual(display.text, 'empty text');
         });

         it('_private:getKeysUnloadedItems', function() {
            let config = {
               displayProperty: 'title',
               keyProperty: 'id',
               emptyText: 'empty text',
               emptyKey: 'empty',
               items: new collection.RecordSet({
                  rawData: [
                     {id: '1', title: 'Record 1'},
                     {id: '2', title: 'Record 2'},
                     {id: '3', title: 'Record 3'}
                  ]
               })
            };
            let keys = filter.View._private.getKeysUnloadedItems(config, null);
            assert.strictEqual(keys[0], null);

            keys = filter.View._private.getKeysUnloadedItems(config, 'empty');
            assert.isFalse(!!keys.length);
         });

         it('_private:prepareItems', function() {
            let date = new Date();
            date.setSQLSerializationMode(Date.SQL_SERIALIZE_MODE_TIME);
            let self = {};
            filter.View._private.prepareItems(self, date);
            assert.strictEqual(self._source.getSQLSerializationMode(), date.getSQLSerializationMode());
         });

         it('_private:updateHistory', function() {
            let view = getView(defaultConfig);
            view._source = Clone(defaultConfig.source);
            let resultHistoryItems, resultMeta;
            let source = new history.Source({
               originSource: new sourceLib.Memory({
                  keyProperty: 'key',
                  data: []
               }),
               historySource: new history.Service({
                  historyId: 'TEST_HISTORY_ID'
               })
            });
            source.update = (historyItems, meta) => {
               resultHistoryItems = historyItems;
               resultMeta = meta;
            };
            view._source[0].editorOptions.source = source;
            view._configs = {
               document: {
                  items: Clone(defaultItems[0]),
                  displayProperty: 'title',
                  keyProperty: 'id'
               }
            };
            let items = [{key: 1}];
            filter.View._private.updateHistory(view, 'document', items);
            assert.deepEqual(resultHistoryItems, items);
            assert.deepEqual(resultMeta, {$_history: true});
         });

         it('_private:loadSelectedItems', function(done) {
            let source = [...defaultSource];
            source[1].value = [1];
            let configs = {
               document: {
                  items: new collection.RecordSet({
                     rawData: defaultItems[0],
                     keyProperty: 'id'
                  }),
                  source: source[0].editorOptions.source,
                  emptyText: 'All documents',
                  emptyKey: null,
                  displayProperty: 'title',
                  keyProperty: 'id'},
               state: {
                  items: new collection.RecordSet({
                     rawData: defaultItems[1].slice(1),
                     keyProperty: 'id'
                  }),
                  source: source[1].editorOptions.source,
                  emptyText: 'all state',
                  emptyKey: null,
                  _sourceController: {hasMoreData: () => {return true;}},
                  displayProperty: 'title',
                  keyProperty: 'id',
                  multiSelect: true}
            };
            assert.strictEqual(configs['state'].items.getCount(), 6);
            filter.View._private.loadSelectedItems(source, configs).addCallback(() => {
               assert.strictEqual(configs['state'].items.getCount(), 6);
               assert.deepStrictEqual(configs['state'].items.at(0).getRawData(), {id: 1, title: 'In any state'});
               done();
            });
         });

         it('_private:setValue', function() {
            let view = getView(defaultConfig);
            view._source = [
               {
                  name: 'document',
                  value: '',
                  resetValue: false,
                  emptyText: 'Test',
                  emptyKey: null
               }
            ];
            view._configs = {
               document: {
                  items: Clone(defaultItems[0]),
                  displayProperty: 'title',
                  keyProperty: 'id',
                  emptyText: 'Test',
                  emptyKey: null,
                  source: new sourceLib.Memory({
                     keyProperty: 'id',
                     data: defaultItems[0]
                  })
               }
            };
            filter.View._private.setValue(view, [null], 'document');
            assert.strictEqual(view._source[0].value, null);

            // emptyKey is not set
            view._source = [
               {
                  name: 'document',
                  value: '',
                  resetValue: false,
                  emptyText: 'Test'
               }
            ];
            view._configs = {
               document: {
                  items: Clone(defaultItems[0]),
                  displayProperty: 'title',
                  keyProperty: 'id',
                  emptyText: 'Test',
                  emptyKey: null,
                  source: new sourceLib.Memory({
                     idProperty: 'id',
                     data: defaultItems[0]
                  })
               }
            };
            filter.View._private.setValue(view, [null], 'document');
            assert.strictEqual(view._source[0].value, false);

            view._source[0].resetValue = [];
            filter.View._private.setValue(view, [null], 'document');
            assert.deepEqual(view._source[0].value, []);
         });

         it('_private:setPopupConfig', function() {
            let isLoading = false;
            let source = Clone(defaultSource);
            let configs = {
               document: {
                  items: Clone(defaultItems[0]),
                  displayProperty: 'title',
                  keyProperty: 'id',
                  source: new sourceLib.Memory({
                     keyProperty: 'id',
                     data: defaultItems[0]
                  })
               },
               state: {
                  items: Clone(defaultItems[1]),
                  _sourceController: {
                     load: () => {
                        isLoading = true; return Deferred.success();
                     },
                     hasMoreData: () => {return true;}},
                  displayProperty: 'title',
                  keyProperty: 'id',
                  multiSelect: true}
            };

            let self = {
               _children: {},
               _onSelectorTemplateResult: () => {}
            };

            filter.View._private.setPopupConfig(self, configs, source);
            assert.isTrue(isLoading);
         });

         it('_beforeUpdate loadSelectedItems', function(done) {
            let filterView = getView(defaultConfig);
            let source = [...defaultSource];
            source[1].value = [1];
            let configs = {
               document: {
                  items: new collection.RecordSet({
                     rawData: defaultItems[0],
                     keyProperty: 'id'
                  }),
                  source: source[0].editorOptions.source,
                  _sourceController: {hasMoreData: () => {return false;}},
                  displayProperty: 'title',
                  keyProperty: 'id'},
               state: {
                  items: new collection.RecordSet({
                     rawData: defaultItems[1].slice(1),
                     keyProperty: 'id'
                  }),
                  source: source[1].editorOptions.source,
                  _sourceController: {hasMoreData: () => {return false;}},
                  displayProperty: 'title',
                  keyProperty: 'id',
                  multiSelect: true}
            };
            filterView._configs = configs;
            filterView._displayText = {};
            filterView._beforeUpdate({source: source}).addCallback(() => {
               assert.strictEqual(configs['state'].items.getCount(), 7);
               assert.deepStrictEqual(configs['state'].items.at(0).getRawData(), {id: 1, title: 'In any state'});
               done();
            });
         });

         describe('View::resultHandler', function() {
            let view;
            beforeEach(function() {
               view = getView(defaultConfig);
               view._displayText = {};
               view._source = Clone(defaultConfig.source);
               view._configs = {
                  document: {
                     items: getItems(Clone(defaultItems[0])),
                     displayProperty: 'title',
                     keyProperty: 'id'},
                  state: {
                     items: getItems(Clone(defaultItems[1])),
                     displayProperty: 'title',
                     keyProperty: 'id',
                     multiSelect: true}
               };
               view._children = {
                  StickyOpener: { close: () => {} }
               };
            });

            it('_resultHandler itemClick', function() {
               let filterChanged;
               view._notify = (event, data) => {
                  if (event === 'filterChanged') {
                     filterChanged = data[0];
                  }
               };
               let eventResult = {
                  action: 'itemClick',
                  id: 'state',
                  selectedKeys: [2]
               };
               view._resultHandler('resultEvent', eventResult);
               assert.deepStrictEqual(view._source[1].value, [2]);
               assert.deepStrictEqual(view._displayText, {document: {}, state: {text: 'In progress', title: 'In progress', hasMoreText: ''}});
               assert.deepStrictEqual(filterChanged, {'author': 'Ivanov K.K.', state: [2]});

               eventResult.selectedKeys = [null];
               view._resultHandler('resultEvent', eventResult);
               assert.deepStrictEqual(view._source[1].value, defaultSource[1].resetValue);
               assert.deepStrictEqual(view._displayText, {document: {}, state: {}});
               assert.deepStrictEqual(filterChanged, {'author': 'Ivanov K.K.'});
            });

            it('_resultHandler applyClick', function() {
               let filterChanged;
               view._notify = (event, data) => {
                  if (event === 'filterChanged') {
                     filterChanged = data[0];
                  }
               };
               let eventResult = {
                  action: 'applyClick',
                  selectedKeys: { state: [1, 2] }
               };
               view._resultHandler('resultEvent', eventResult);
               assert.deepStrictEqual(view._source[1].value, [1, 2]);
               assert.deepStrictEqual(view._displayText, {document: {}, state: {text: 'In any state', title: 'In any state, In progress', hasMoreText: ', еще 1'}});
               assert.deepStrictEqual(filterChanged, {'author': 'Ivanov K.K.', state: [1, 2]});
            });

            it('_resultHandler selectorResult', function() {
               let filterChanged;
               view._notify = (event, data) => {
                  if (event === 'filterChanged') {
                     filterChanged = data[0];
                  }
               };
               view._configs.state.items = new collection.RecordSet({
                  keyProperty: 'id',
                  rawData: defaultItems[1]
               });
               let newItems = new collection.RecordSet({
                  keyProperty: 'id',
                  rawData: [{id: 3, title: 'Completed'}, {id: 20, title: 'new item'}, {id: 28, title: 'new item 2'}]
               });
               let eventResult = {
                  action: 'selectorResult',
                  id: 'state',
                  data: newItems
               };
               view._resultHandler('resultEvent', eventResult);
               assert.deepStrictEqual(view._source[1].value, [3, 20, 28]);
               assert.deepStrictEqual(view._displayText, {document: {}, state: {text: 'new item', title: 'new item, new item 2, Completed', hasMoreText: ', еще 2'}});
               assert.deepStrictEqual(filterChanged, {'author': 'Ivanov K.K.', state: [3, 20, 28]});
            });

            it('selectorResult selectorCallback', function() {
               let filterChanged;
               view._notify = (event, data) => {
                  if (event === 'selectorCallback') {
                     data[1].at(0).set({id: 11, title: 'item 11'});
                  }
               };
               view._configs.state.items = new collection.RecordSet({
                  keyProperty: 'id',
                  rawData: defaultItems[1]
               });
               view._idOpenSelector = 'state';
               let newItems = new collection.RecordSet({
                  keyProperty: 'id',
                  rawData: [{id: 3, title: 'Completed'}, {id: 20, title: 'new item'}, {id: 28, title: 'new item 2'}]
               });
               view._onSelectorTemplateResult('event', newItems);
               assert.deepStrictEqual(view._source[1].value, [11, 20, 28]);
               assert.deepStrictEqual(view._displayText, {document: {}, state: {text: 'item 11', title: 'item 11, new item, new item 2', hasMoreText: ', еще 2'}});
            });

            it('_resultHandler filterDetailPanelResult', function() {
               let filterChanged;
               let historyEventFired;

               view._notify = (event, data) => {
                  if (event === 'filterChanged') {
                     filterChanged = data[0];
                  }
                  if (event === 'historyApply') {
                     historyEventFired = true;
                  }
               };
               view._source = [{name: 'author', value: '', textValue: 'Author: Ivanov K.K.', resetValue: '', viewMode: 'basic'},
                  {name: 'sender', value: 'Sander123', resetValue: '', viewMode: 'extended', visibility: false},
                  {name: 'responsible', value: '', resetValue: '', viewMode: 'extended', visibility: false},
                  {name: 'document', value: '11111', resetValue: '', textValue: 'new document', viewMode: 'frequent', visibility: false}];

               let eventResult = {
                  id: 'state',
                  items: [{ id: 'author', value: '', textValue: 'Author: Ivanov K.K.'},
                     { id: 'sender', value: 'Sander123', visibility: false },
                     { id: 'responsible', value: '', visibility: false },
                     { id: 'document', value: '11111', resetValue: '', textValue: 'new document', visibility: false }],
                  history: [{ test: 'test' }]
               };
               view._resultHandler('resultEvent', eventResult);
               assert.deepStrictEqual(view._source[1].value, 'Sander123');
               assert.deepStrictEqual(view._source[1].viewMode, 'extended');
               assert.deepStrictEqual(view._source[3].textValue, 'new document');
               assert.deepStrictEqual(filterChanged, {'document': '11111', 'sender': 'Sander123'});
               assert.deepStrictEqual(view._displayText, {document: { hasMoreText: '', text: '', title: ''}});
               assert.isTrue(historyEventFired);
            });

            it('_onSelectorTemplateResult', function() {
               let filterChanged;
               view._notify = (event, data) => {
                  if (event === 'filterChanged') {
                     filterChanged = data[0];
                  }
               };
               view._configs.state.items = new collection.RecordSet({
                  keyProperty: 'id',
                  rawData: defaultItems[1]
               });
               let newItems = new collection.RecordSet({
                  keyProperty: 'id',
                  rawData: [{id: 3, title: 'Completed'}, {id: 20, title: 'new item'}, {id: 28, title: 'new item 2'}]
               });
               view._idOpenSelector = 'state';
               view._onSelectorTemplateResult('resultEvent', newItems);
               assert.deepStrictEqual(view._source[1].value, [3, 20, 28]);
               assert.deepStrictEqual(view._displayText, {document: {}, state: {text: 'new item', title: 'new item, new item 2, Completed', hasMoreText: ', еще 2'}});
               assert.deepStrictEqual(filterChanged, {'author': 'Ivanov K.K.', state: [3, 20, 28]});
            });
         });

         describe('View hierarchyList', function() {
            let view;
            beforeEach(function() {
               let documentItems = [
                  {id: -1, title: 'Folder 1', node: true},
                  {id: -2, title: 'Folder 2', node: true},
                  {id: 1, title: 'In any state', parent: -1},
                  {id: 2, title: 'In progress', parent: -1},
                  {id: 3, title: 'Completed', parent: -1},
                  {id: 4, title: 'Deleted', parent: -2},
                  {id: 5, title: 'Drafts', parent: -2}
               ];
               let hierarchySource = [
                  {
                     name: 'document',
                     value: {'-1': [-1], '-2': []},
                     resetValue: [],
                     textValue: '',
                     emptyText: 'All documents',
                     editorOptions: {
                        source: new sourceLib.Memory({
                           keyProperty: 'id',
                           data: documentItems
                        }),
                        displayProperty: 'title',
                        keyProperty: 'id',
                        nodeProperty: 'node',
                        parentProperty: 'parent',
                        multiSelect: true
                     },
                     viewMode: 'frequent'
                  }
               ];
               view = getView({source: hierarchySource});
               view._displayText = {};
               view._source = Clone(hierarchySource);
               view._configs = {
                  document: {
                     items: new collection.RecordSet({
                        keyProperty: 'id',
                        rawData: documentItems
                     }),
                     displayProperty: 'title',
                     keyProperty: 'id',
                     nodeProperty: 'node',
                     parentProperty: 'parent',
                     multiSelect: true
                  }
               };
               view._children = {
                  StickyOpener: { close: () => {} }
               };
            });

            it ('updateText', function () {
               filter.View._private.updateText(view, view._source, view._configs);
               assert.deepStrictEqual(view._displayText.document, {text: 'Folder 1', title: 'Folder 1', hasMoreText: '' });
            });

            it ('applyClick', function () {
               let filterChanged;
               view._notify = (event, data) => {
                  if (event === 'filterChanged') {
                     filterChanged = data[0];
                  }
               };
               let eventResult = {
                  action: 'applyClick',
                  selectedKeys: { document: {'-1': [1, 2], '-2': [-2, 4]} }
               };
               view._resultHandler('resultEvent', eventResult);
               assert.deepStrictEqual(view._source[0].value, {'-1': [1, 2], '-2': [-2]});
               assert.deepStrictEqual(view._displayText.document, {text: 'Folder 2', title: 'Folder 2, In any state, In progress', hasMoreText: ', еще 2' });
               assert.deepStrictEqual(filterChanged, {document: {'-1': [1, 2], '-2': [-2]}});

               eventResult = {
                  action: 'applyClick',
                  selectedKeys: { document: {'-1': [], '-2': []} }
               };
               view._resultHandler('resultEvent', eventResult);
               assert.deepStrictEqual(view._source[0].value, []);
               assert.deepStrictEqual(view._displayText.document, {});
            });
         });
      });
   }
);
