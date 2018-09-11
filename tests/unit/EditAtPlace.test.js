define([
   'Controls/EditAtPlace',
   'WS.Data/Entity/Record',
   'Core/Deferred'
], function(
   EditAtPlace,
   Record,
   Deferred
) {
   'use strict';

   describe('Controls.EditAtPlace', function() {
      var
         eventQueue,
         instance,
         cfg = {
            editWhenFirstRendered: true,
            editObject: Record.fromObject({
               text: 'qwerty'
            })
         },
         cfg2 = {
            editWhenFirstRendered: false,
            editObject: Record.fromObject({
               text: 'test'
            })
         };
      beforeEach(function() {
         eventQueue = [];
         instance = new EditAtPlace();
      });
      afterEach(function() {
         instance = null;
      });

      function mockNotify(returnValue) {
         return function(event, eventArgs, eventOptions) {
            eventQueue.push({
               event: event,
               eventArgs: eventArgs,
               eventOptions: eventOptions
            });
            return returnValue;
         };
      }

      it('_beforeMount', function() {
         instance._beforeMount(cfg);
         assert.equal(cfg.isEditing, instance.editWhenFirstRendered);
         assert.isTrue(cfg.editObject.isEqual(instance._editObject));
         assert.isFalse(cfg.editObject === instance._editObject);
      });

      it('_beforeUpdate', function() {
         instance._beforeMount(cfg);
         assert.isTrue(cfg.editObject.isEqual(instance._editObject));
         assert.isFalse(cfg.editObject === instance._editObject);
         instance._beforeUpdate(cfg2);
         assert.isTrue(cfg2.editObject.isEqual(instance._editObject));
         assert.isFalse(cfg2.editObject === instance._editObject);
      });

      it('_afterUpdate', function() {
         var focusCalled = false;
         instance._startEditTarget = {
            getElementsByTagName: function(tagName) {
               if (tagName === 'input') {
                  return [{
                     focus: function() {
                        focusCalled = true;
                     }
                  }];
               }
            }
         };
         instance._afterUpdate();
         assert.isTrue(focusCalled);
         assert.isNull(instance._startEditTarget);
      });

      describe('_onClickHandler', function() {
         it('isEditing: true', function() {
            var result = false;
            instance.saveOptions({
               enabled: true
            });
            instance._beforeMount(cfg);
            instance.startEdit = function() {
               result = true;
            };
            instance._onClickHandler();
            assert.isFalse(result);
         });
         it('isEditing: false', function() {
            var result = false;
            instance.saveOptions({
               enabled: true
            });
            instance._beforeMount(cfg2);
            instance.startEdit = function() {
               result = true;
            };
            instance._onClickHandler();
            assert.isTrue(result);
         });
      });

      describe('_onDeactivatedHandler', function() {
         var result = null;
         beforeEach(function() {
            instance.commitEdit = function() {
               result = true;
            };
            instance.cancelEdit = function() {
               result = false;
            };
         });
         afterEach(function() {
            result = null;
         });

         it('commitOnDeactivate: true, isEditing: true', function() {
            instance.saveOptions({
               enabled: true,
               commitOnDeactivate: true
            });
            instance._beforeMount(cfg);
            instance._onDeactivatedHandler();
            assert.isTrue(result);
         });

         it('commitOnDeactivate: false, isEditing: true', function() {
            instance.saveOptions({
               enabled: true,
               commitOnDeactivate: false
            });
            instance._beforeMount(cfg);
            instance._onDeactivatedHandler();
            assert.isFalse(result);
         });
      });

      describe('_onKeyDown', function() {
         it('Enter', function() {
            var result = false;
            instance._beforeMount(cfg);
            instance.commitEdit = function() {
               result = true;
            };
            instance._onKeyDown({
               nativeEvent: {
                  keyCode: 13
               }
            });
            assert.isTrue(result);
         });
         it('Esc', function() {
            var result = false;
            instance._beforeMount(cfg);
            instance.cancelEdit = function() {
               result = true;
            };
            instance._onKeyDown({
               nativeEvent: {
                  keyCode: 27
               }
            });
            assert.isTrue(result);
         });
      });

      describe('startEdit', function() {
         var
            event = {
               target: {
                  closest: function(selector) {
                     if (selector === '.controls-EditAtPlaceV__editorWrapper') {
                        return true;
                     }
                  }
               }
            };

         it('without cancelling', function() {
            instance._beforeMount(cfg);
            instance._notify = mockNotify();
            instance.startEdit(event);
            assert.equal(eventQueue[0].event, 'beforeEdit');
            assert.isTrue(eventQueue[0].eventArgs[0].isEqual(instance._editObject));
            assert.isTrue(eventQueue[0].eventOptions.bubbling);
            assert.isTrue(instance._isEditing);
            assert.isTrue(instance._startEditTarget);
         });

         it('cancel', function() {
            instance._beforeMount(cfg2);
            instance._notify = mockNotify('Cancel');
            instance.startEdit(event);
            assert.equal(eventQueue[0].event, 'beforeEdit');
            assert.isTrue(eventQueue[0].eventArgs[0].isEqual(instance._editObject));
            assert.isTrue(eventQueue[0].eventOptions.bubbling);
            assert.isFalse(instance._isEditing);
            assert.isNotOk(instance._startEditTarget);
         });
      });

      describe('cancelEdit', function() {
         it('without cancelling', function() {
            instance._beforeMount(cfg);
            instance._notify = mockNotify();
            instance._editObject.acceptChanges();
            instance._editObject.set('text', 'changed');
            instance.cancelEdit();
            assert.equal(eventQueue[0].event, 'beforeEndEdit');
            assert.isTrue(eventQueue[0].eventArgs[0].isEqual(instance._editObject));
            assert.equal(instance._editObject.get('text'), 'qwerty');
            assert.isFalse(instance._isEditing);
         });

         it('cancel', function() {
            instance._beforeMount(cfg);
            instance._notify = mockNotify('Cancel');
            instance._editObject.acceptChanges();
            instance._editObject.set('text', 'changed');
            instance.cancelEdit();
            assert.equal(eventQueue.length, 1);
            assert.equal(eventQueue[0].event, 'beforeEndEdit');
            assert.isTrue(eventQueue[0].eventArgs[0].isEqual(instance._editObject));
            assert.equal(instance._editObject.get('text'), 'changed');
         });
      });

      describe('commitEdit', function() {
         it('without cancelling, successful validation', function(done) {
            instance._children = {
               formController: {
                  submit: function() {
                     return Deferred.success({});
                  }
               }
            };
            instance._beforeMount(cfg);
            instance._notify = mockNotify();
            instance.commitEdit();
            setTimeout(function() {
               assert.equal(eventQueue[0].event, 'beforeEndEdit');
               assert.isTrue(eventQueue[0].eventArgs[0].isEqual(instance._editObject));
               assert.isFalse(instance._isEditing);
               done();
            }, 0);
         });

         it('cancel, successful validation', function(done) {
            instance._children = {
               formController: {
                  submit: function() {
                     return Deferred.success({});
                  }
               }
            };
            instance._beforeMount(cfg);
            instance._notify = mockNotify('Cancel');
            instance.commitEdit();
            setTimeout(function() {
               assert.equal(eventQueue.length, 1);
               assert.equal(eventQueue[0].event, 'beforeEndEdit');
               assert.isTrue(eventQueue[0].eventArgs[0].isEqual(instance._editObject));
               assert.isTrue(instance._isEditing);
               done();
            }, 0);
         });

         it('unsuccessful validation', function(done) {
            instance._children = {
               formController: {
                  submit: function() {
                     return Deferred.success({
                        0: 'Поле является обязательным для заполнения'
                     });
                  }
               }
            };
            instance._beforeMount(cfg);
            instance._notify = mockNotify();
            instance.commitEdit();
            setTimeout(function() {
               assert.equal(eventQueue.length, 0);
               assert.isTrue(instance._isEditing);
               done();
            }, 0);
         });
      });
   });
});
