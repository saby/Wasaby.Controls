define(
   [
      'Controls/Input/Area',
      'Core/constants'
   ],
   function (Area, constants) {
      'use strict';
      describe('Controls.Input.Area', function () {
         var areaControl = new Area({});

         it('constructor', function () {
            areaControl._beforeMount({
               minLines: 2
            });

            assert.equal(areaControl._multiline, true);
         });

         it('_beforeUpdate', function () {
            areaControl._children = {
               fakeArea: {
                  scrollHeight: 20,
                  clientHeight: 10
               },
               fakeAreaWrapper: {
                  clientHeight: 20
               },
               fakeAreaValue: {}
            };

            areaControl._beforeUpdate({
               value: 123
            });

            assert.equal(areaControl._hasScroll, true);
            assert.equal(areaControl._multiline, false);
            assert.equal(areaControl._children.fakeAreaValue.innerHTML, '123');
         });

         it('_afterUpdate', function () {
            areaControl._options.value = 'qwe';
            areaControl._caretPosition = 3;
            areaControl._children = {
               realArea: {
                  setSelectionRange: function() {}
               }
            };

            areaControl._afterUpdate({
               value: 'asd'
            });

            assert.equal(this._caretPosition, null);
         });

         it('_valueChangedHandler', function () {
            areaControl._children = {
               fakeArea: {
                  scrollHeight: 20,
                  clientHeight: 10
               },
               fakeAreaWrapper: {
                  clientHeight: 20
               },
               fakeAreaValue: {}
            };

            areaControl._valueChangedHandler({}, '123');

            assert.equal(areaControl._hasScroll, true);
            assert.equal(areaControl._multiline, false);
            assert.equal(areaControl._children.fakeAreaValue.innerHTML, '123');
         });

         it('_keyDownHandler', function () {
            var mockEvent = {
               nativeEvent: {
                  keyCode: constants.key.enter,
                     ctrlKey: true
               },
               target: {
                  value: 'qwe'
               }
            };

            areaControl._children = {
               inputRender: {
                  _inputHandler: function() {}
               }
            };

            areaControl._options.newLineKey = 'ctrlEnter';

            areaControl._keyDownHandler(mockEvent);

            assert.equal(mockEvent.target.value, 'qwe\n');
         });

         it('_scrollHandler', function () {
            areaControl._children = {
               fakeArea: {
                  scrollHeight: 20,
                  clientHeight: 10
               }
            };

            areaControl._scrollHandler({});

            assert.equal(areaControl._hasScroll, true);
         });



         it('updateHasScroll', function () {
            var
               mockSelfObj = {
                  _children: {
                     fakeArea: {
                        scrollHeight: 10,
                        clientHeight: 20
                     }
                  }
               };
            Area._private.updateHasScroll(mockSelfObj);

            assert.equal(mockSelfObj._hasScroll, false);

            mockSelfObj._children.fakeArea.scrollHeight = 20;
            mockSelfObj._children.fakeArea.clientHeight = 10;

            Area._private.updateHasScroll(mockSelfObj);

            assert.equal(mockSelfObj._hasScroll, true);
         });

         it('updateMultiline', function () {
            var
               mockSelfObj = {
                  _children: {
                     fakeArea: {
                        clientHeight: 10
                     },
                     fakeAreaWrapper: {
                        clientHeight: 20
                     }
                  }
               };
            Area._private.updateMultiline(mockSelfObj);

            assert.equal(mockSelfObj._multiline, false);

            mockSelfObj._children.fakeArea.clientHeight = 20;
            mockSelfObj._children.fakeAreaWrapper.clientHeight = 10;

            Area._private.updateMultiline(mockSelfObj);

            assert.equal(mockSelfObj._multiline, true);
         });

         it('setFakeAreaValue', function () {
            var
               mockSelfObj = {
                  _children: {
                     fakeAreaValue: {}
                  }
               };
            Area._private.setFakeAreaValue(mockSelfObj, '123');

            assert.equal(mockSelfObj._children.fakeAreaValue.innerHTML, '123');
         });
      })
   });
