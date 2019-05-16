define(
   [
      'Controls/_filter/converterFilterItems'
   ],
   function(Converter) {
      describe('ConverterFilterItems', function() {

         let filterSource = [
            {
               name: 'text',
               value: 'value1',
               resetValue: 'resetValue1',
               viewMode: 'basic'
            },
            {
               name: 'boolean',
               value: 'value2',
               resetValue: 'resetValue2',
               textValue: '123',
               viewMode: 'basic',
               source: 'dataSource'
            },
            {
               name: 'Array',
               value: 'value3',
               resetValue: 'resetValue3',
               viewMode: 'extended',
               visibility: false,
               caption: '12345'
            },
            {
               name: 'Number',
               value: 'value4',
               resetValue: 'resetValue4',
               viewMode: 'frequent',
               editorOptions: { source: 'dataSource' }
            }
         ];

         let detailPanelItems = [
            {
               id: 'text',
               value: 'value1',
               resetValue: 'resetValue1',
               visibility: undefined
            },
            {
               id: 'boolean',
               value: 'value2',
               resetValue: 'resetValue2',
               textValue: '123',
               source: 'dataSource',
               visibility: undefined
            },
            {
               id: 'Array',
               value: 'value3',
               resetValue: 'resetValue3',
               visibility: false,
               caption: '12345'
            },
            {
               id: 'Number',
               value: 'value4',
               resetValue: 'resetValue4',
               visibility: undefined,
               editorOptions: { source: 'dataSource' }
            }
         ];

         it('convertToDetailPanelItems', function() {
            let actualDetailPanelItems = Converter.convertToDetailPanelItems(filterSource);
            assert.deepStrictEqual(actualDetailPanelItems, detailPanelItems);
         });

         it('convertToFilterSource', function() {
            let actualFilterSource = Converter.convertToFilterSource(detailPanelItems);
            assert.deepStrictEqual(actualFilterSource, filterSource);
         });

      });
   }
);
