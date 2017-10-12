define(['js!SBIS3.CONTROLS.FilterPanel', 'WS.Data/Collection/RecordSet', 'Core/core-functions'], function (FilterPanel, RecordSet, cFunctions) {

   'use strict';

   describe('SBIS3.CONTROLS.FilterPanel', function () {
      var
         chooserProperties = {
            items: new RecordSet({
               rawData: [
                  {'title': 'Item 1', 'id': 1, count: 11},
                  {'title': 'Item 2', 'id': 2, count: 12},
                  {'title': 'Item 3', 'id': 3, count: 13},
                  {'title': 'Item 4', 'id': 4, count: 14},
                  {'title': 'Item 5', 'id': 5, count: 15}
               ],
               idProperty: 'id'
            }),
            idProperty: 'id',
            displayProperty: 'title'
         },
         rawData = [
            {
               id: 'filter_list',
               caption: 'filter_list',
               expanded: true,
               value: [1, 2],
               textValue: 'Item 1, Item 2',
               resetValue: [1],
               template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
               properties: {
                  name: "List_1",
                  editor: 'list',
                  properties: chooserProperties
               }
            },
            {
               id: 'filter_dictionary',
               caption: 'filter_dictionary',
               expanded: true,
               value: [1],
               textValue: 'Item 1',
               resetValue: [],
               template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
               properties: {
                  name: "Dictionary_1",
                  editor: 'dictionary',
                  properties: chooserProperties
               }
            },
            {
               id: 'filter_favorites',
               caption: 'filter_favorites',
               expanded: true,
               value: [1, 2],
               textValue: 'Item 1, Item 2',
               resetValue: [],
               template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
               properties: {
                  name: "Favorites_1",
                  editor: 'favorites',
                  favoritesCount: 3,
                  favorites: new RecordSet({
                     rawData: [
                        {id: 1, title: 'Item 1'},
                        {id: 2, title: 'Item 2'}
                     ],
                     idProperty: 'id'
                  }),
                  properties: chooserProperties
               }
            },
            {
               id: 'filter_dataRange',
               caption: 'filter_dataRange',
               expanded: true,
               value: [1000, 15000],
               textValue: 'from 1000 to 15000',
               resetValue: [null, null],
               template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateDataRange',
               properties: {
                  minValue: 1000,
                  maxValue: 15000,
                  startLabel: 'from',
                  middleLabel: 'to',
                  endLabel: '$'
               }
            },
            {
               id: 'filter_boolean',
               caption: 'filter_boolean',
               expanded: true,
               value: true,
               textValue: 'boolean_true',
               resetValue: false,
               template: 'js!SBIS3.CONTROLS.FilterPanelBoolean',
               className: 'controls-FilterPanelItem__withSeparator'
            },
            {
               id: 'filter_radio',
               caption: 'filter_radio',
               expanded: true,
               value: 1,
               textValue: 'Item 1',
               resetValue: null,
               template: 'tmpl!SBIS3.CONTROLS.FilterPanel/resources/TemplateChooser',
               properties: {
                  editor: 'radio',
                  name: 'RadioGroup_1',
                  properties: {
                     idProperty: 'id',
                     allowEmptySelection: true,
                     displayProperty: 'title',
                     items: new RecordSet({
                        rawData: [
                           {id: 1, title: 'Item 1'},
                           {id: 2, title: 'item 2'}
                        ],
                        idProperty: 'id'
                     })
                  }
               }
            }
         ],
         testComponent,
         initComponent = function() {
            testComponent = new FilterPanel({
               element: $('<div class="TestFilterPanel"></div>').appendTo($('body')),
               items: new RecordSet({
                  rawData: cFunctions.clone(rawData),
                  idProperty: 'id'
               })
            });
         },
         destroyComponent = function() {
            testComponent.destroy();
            testComponent = undefined;
         },
         resultInitial = {
            filter: {
               filter_list: [1, 2],
               filter_dictionary: [1],
               filter_favorites: [1, 2],
               filter_dataRange: [1000, 15000],
               filter_boolean: true,
               filter_radio: 1
            },
            textValue: 'Item 1, Item 2, Item 1, Item 1, Item 2, from 1000 to 15000, boolean_true, Item 1'
         },
         resultEmptyFilter = {
            filter: {},
            textValue: ''
         },
         resultResetFilterField1 = {
            filter: {
               filter_dictionary: [1],
               filter_favorites: [1, 2],
               filter_dataRange: [1000, 15000],
               filter_boolean: true,
               filter_radio: 1
            },
            textValue: 'Item 1, Item 1, Item 2, from 1000 to 15000, boolean_true, Item 1'
         },
         resultResetFilterField2 = {
            filter: {
               filter_favorites: [1, 2],
               filter_dataRange: [1000, 15000],
               filter_boolean: true,
               filter_radio: 1
            },
            textValue: 'Item 1, Item 2, from 1000 to 15000, boolean_true, Item 1'
         },
         resultResetFilterField3 = {
            filter: {
               filter_dataRange: [1000, 15000],
               filter_boolean: true,
               filter_radio: 1
            },
            textValue: 'from 1000 to 15000, boolean_true, Item 1'
         },
         resultResetFilterField4 = {
            filter: {
               filter_boolean: true,
               filter_radio: 1
            },
            textValue: 'boolean_true, Item 1'
         },
         resultResetFilterField5 = {
            filter: {
               filter_radio: 1
            },
            textValue: 'Item 1'
         };
      describe('Check reset all filter fields', function () {
         if (typeof window !== 'undefined') {
            before(function() {
               initComponent();
            });
            after(function() {
               destroyComponent();
            });
            it('Check initial filter and text value', function () {
               assert.deepEqual({
                  filter: testComponent.getFilter(),
                  textValue: testComponent.getTextValue()
               }, resultInitial);
            });
            it('Check reset all fields', function () {
               testComponent.sendCommand('resetFilter');
               assert.deepEqual({
                  filter: testComponent.getFilter(),
                  textValue: testComponent.getTextValue()
               }, resultEmptyFilter);
            });
         }
      });

      describe('Check gradual reset filter fields', function () {
         if (typeof window !== 'undefined') {
            before(function() {
               initComponent();
            });
            after(function() {
               destroyComponent();
            });
            it('Check initial filter and text value', function () {
               assert.deepEqual({
                  filter: testComponent.getFilter(),
                  textValue: testComponent.getTextValue()
               }, resultInitial);
            });
            it('Check reset field "filter_list"', function () {
               testComponent.sendCommand('resetFilterField', 'filter_list');
               assert.deepEqual({
                  filter: testComponent.getFilter(),
                  textValue: testComponent.getTextValue()
               }, resultResetFilterField1);
            });
            it('Check reset field "filter_dictionary"', function () {
               testComponent.sendCommand('resetFilterField', 'filter_dictionary');
               assert.deepEqual({
                  filter: testComponent.getFilter(),
                  textValue: testComponent.getTextValue()
               }, resultResetFilterField2);
            });
            it('Check reset field "filter_favorites"', function () {
               testComponent.sendCommand('resetFilterField', 'filter_favorites');
               assert.deepEqual({
                  filter: testComponent.getFilter(),
                  textValue: testComponent.getTextValue()
               }, resultResetFilterField3);
            });
            it('Check reset field "filter_dataRange"', function () {
               testComponent.sendCommand('resetFilterField', 'filter_dataRange');
               assert.deepEqual({
                  filter: testComponent.getFilter(),
                  textValue: testComponent.getTextValue()
               }, resultResetFilterField4);
            });
            it('Check reset field "filter_boolean"', function () {
               testComponent.sendCommand('resetFilterField', 'filter_boolean');
               assert.deepEqual({
                  filter: testComponent.getFilter(),
                  textValue: testComponent.getTextValue()
               }, resultResetFilterField5);
            });
            it('Check reset field "filter_radio"', function () {
               testComponent.sendCommand('resetFilterField', 'filter_radio');
               assert.deepEqual({
                  filter: testComponent.getFilter(),
                  textValue: testComponent.getTextValue()
               }, resultEmptyFilter);
            });
         }
      });
   });
});