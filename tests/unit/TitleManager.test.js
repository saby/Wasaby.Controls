/**
 * Created by ganshinyao on 27.06.2017.
 */
define(['js!SBIS3.CONTROLS.TitleManager', 'js!SBIS3.CONTROLS.Control'], function (TitleManager, Control) {
   describe('SBIS3.CONTROLS.TitleManager', function () {
      var oldTitle;
      beforeEach(function () {
         global.document = global.document || {title:''};
         TitleManager._store = [];
         oldTitle = global.document.title;
      });
      afterEach(function () {
          global.document.title = oldTitle;
      });

      describe('set', function () {
         it('should set title', function () {
            TitleManager.set('title', (new Control({})));
            assert.equal(global.document.title, 'title');
         });
         it('should not set title when control is destroyed', function () {
            var control = new Control({});
            control.destroy();
            TitleManager.set('title', control);
            assert.equal(global.document.title, oldTitle);
         });
      });
      describe('_onDestroyHandler', function () {
         it('should revert to default title', function () {
            var control = new Control({});
            TitleManager.set('title', control);
            control.destroy();
            assert.equal(global.document.title, TitleManager._defaultTitle);
         });
         it('should revert to previous title', function () {
            var control = new Control({}),
               control2 = new Control({});
            TitleManager.set('title', control);
            TitleManager.set('title2', control2);
            control2.destroy();
            assert.equal(global.document.title, 'title');
         });
         it('should not push once to store if set title the same control', function () {
            var control = new Control({});
            TitleManager.set('title', control);
            TitleManager.set('title2', control);
            assert.equal(global.document.title, 'title2');
            assert.equal(TitleManager._store.length, 1);
         });
      });
   });
});