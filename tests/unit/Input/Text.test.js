define(
   [
      'Controls/Input/Text/ViewModel'
   ],
   function(TextViewModel) {

      'use strict';

      var
         testCases = [
            {
               testName: 'Constraint test [0-9]',
               controlConfig: {
                  constraint: '[0-9]'
               },
               splitValue: {
                  before: '12',
                  insert: 'a',
                  after: '',
                  delete: ''
               },
               result: {
                  value: '12',
                  position: 2
               }
            },
            {
               testName: 'Constraint test [a-z]',
               controlConfig: {
                  constraint: '[a-z]'
               },
               splitValue: {
                  before: 'qwe',
                  insert: '5',
                  after: '',
                  delete: ''
               },
               result: {
                  value: 'qwe',
                  position: 3
               }
            },
            {
               testName: 'Max length test',
               controlConfig: {
                  maxLength: '5'
               },
               splitValue: {
                  before: '12345',
                  insert: '6',
                  after: '',
                  delete: ''
               },
               result: {
                  value: '12345',
                  position: 5
               }
            }
         ];

      describe('Controls.Input.Text', function() {
         testCases.forEach(function(item) {
            it(item.testName, function () {
               var
                  textViewModel = new TextViewModel(item.controlConfig),
                  result = textViewModel.prepareData(item.splitValue);
               assert.equal(result.value, item.result.value);
            });
         });
      });
   }
);