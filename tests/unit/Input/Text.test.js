define(
   [
      'Controls/Input/Text/OldViewModel'
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
               testName: 'Max length test. Insert character at the end of the string',
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
            },
            {
               testName: 'Max length test. Insert character at the beginning of the string',
               controlConfig: {
                  maxLength: '5'
               },
               splitValue: {
                  before: '',
                  insert: '1',
                  after: '23456',
                  delete: ''
               },
               result: {
                  value: '23456',
                  position: 0
               }
            },
            {
               testName: 'Max length test. Insert character at the middle of the string',
               controlConfig: {
                  maxLength: '5'
               },
               splitValue: {
                  before: '12',
                  insert: '3',
                  after: '456',
                  delete: ''
               },
               result: {
                  value: '12456',
                  position: 2
               }
            },
            {
               testName: 'Constraint and max length test',
               controlConfig: {
                  constraint: '[0-9]',
                  maxLength: '5'
               },
               splitValue: {
                  before: '12345',
                  insert: 'a',
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
                  result = textViewModel.handleInput(item.splitValue);
               assert.equal(result.value, item.result.value);
            });
         });
      });
   }
);