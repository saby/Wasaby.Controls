define(
   [
      'Core/constants',
      'Controls/Utils/hasHorizontalScroll',
      'Controls/Input/resources/InputRender/InputRender',
      'Controls/Input/resources/InputRender/BaseViewModel'
   ],
   function(Constants, hasHorizontalScroll, Render, BaseViewModel) {

      'use strict';

      if (!Constants.isBrowserPlatform) {
         return;
      }

      describe('Controls.Input.Render', function() {
         var render, viewModel, result;
         var saveFn = getComputedStyle;

         beforeEach(function() {
            result = undefined;
            viewModel = new BaseViewModel({
               value: ''
            });
            render = new Render();

            render._options = {
               viewModel: viewModel
            };
            render._children = {
               divinput: {
                  querySelector: function() {
                     return this;
                  }
               },
               input: {
                  querySelector: function() {
                     return this;
                  }
               }
            };
            render._notify = function(eventName) {
               result = eventName;
            };

            getComputedStyle = function() {
               return {};
            };
         });

         afterEach(function() {
            getComputedStyle = saveFn;
         });

         describe('_inputHandler', function() {
            var event;

            beforeEach(function() {
               event = {
                  target: {
                     setSelectionRange: function() {}
                  },
                  nativeEvent: {}
               };
            });

            it('The value has changed', function() {
               event.target.value = '123';
               event.target.selectionStart = 3;
               event.target.selectionEnd = 3;
               render._inputHandler(event);
               assert.equal(result, 'valueChanged');
            });
            it('The value has not changed', function() {
               event.target.value = '';
               event.target.selectionStart = 0;
               event.target.selectionEnd = 0;
               render._inputHandler(event);
               assert.equal(result, undefined);
            });
         });
         describe('initSelection', function() {
            it('test1', function() {
               viewModel.updateOptions({value: '123'});
               render._viewModel = viewModel;
               render._options.content = 'content';
               Render._private.initSelection(render);

               assert.equal(render._children.divinput.selectionStart, 3);
               assert.equal(render._children.divinput.selectionEnd, 3);
            });
            it('test2', function() {
               viewModel.updateOptions({value: '123'});
               render._viewModel = viewModel;
               render._selection = {
                  selectionStart: 0,
                  selectionEnd: 0
               };
               render._children.divinput.selectionStart = 0;
               render._children.divinput.selectionEnd = 0;
               Render._private.initSelection(render);

               assert.equal(render._children.divinput.selectionStart, 0);
               assert.equal(render._children.divinput.selectionEnd, 0);
            });
         });
      });
   }
);
