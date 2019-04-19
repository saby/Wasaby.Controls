/**
 * Created by kraynovdo on 02.03.2018.
 */
define([
   'Controls/list'
], function(lists){
   describe('Controls.List.Paging', function () {
      var result = false;
      it('initArrowDefaultStates', function () {
         var pg = new lists.Paging();

         lists.Paging._private.initArrowDefaultStates(pg, {});
         assert.equal('disabled', pg._stateBegin, 'Wrong default state');
         assert.equal('disabled', pg._stateEnd, 'Wrong default state');
         assert.equal('disabled', pg._stateNext, 'Wrong default state');
         assert.equal('disabled', pg._statePrev , 'Wrong default state');


         lists.Paging._private.initArrowDefaultStates(pg, {stateEnd : 'normal', stateNext: 'normal'});
         assert.equal('normal', pg._stateEnd, 'Wrong default state');
         assert.equal('normal', pg._stateNext, 'Wrong default state');
      });

      it('initArrowStateBySelectedPage', function () {
         var cfg = {
            pagesCount: 5
         };
         var pg = new lists.Paging(cfg);

         lists.Paging._private.initArrowStateBySelectedPage(pg, 1, cfg);
         assert.equal('disabled', pg._stateBegin, 'Wrong arrow state in begin position');
         assert.equal('normal', pg._stateEnd, 'Wrong arrow state in begin position');
         assert.equal('normal', pg._stateNext, 'Wrong arrow state in begin position');
         assert.equal('disabled', pg._statePrev , 'Wrong arrow state in begin position');

         lists.Paging._private.initArrowStateBySelectedPage(pg, 3, cfg);
         assert.equal('normal', pg._stateBegin, 'Wrong arrow state in middle position');
         assert.equal('normal', pg._stateEnd, 'Wrong arrow state in middle position');
         assert.equal('normal', pg._stateNext, 'Wrong arrow state in middle position');
         assert.equal('normal', pg._statePrev , 'Wrong arrow state in middle position');

         lists.Paging._private.initArrowStateBySelectedPage(pg, 5, cfg);
         assert.equal('normal', pg._stateBegin, 'Wrong arrow state in end position');
         assert.equal('disabled', pg._stateEnd, 'Wrong arrow state in end position');
         assert.equal('disabled', pg._stateNext, 'Wrong arrow state in end position');
         assert.equal('normal', pg._statePrev , 'Wrong arrow state in end position');
      });

      it('changePage', function () {
         var cfg = {
            selectedPage: 3
         };
         var pg = new lists.Paging(cfg);
         pg.saveOptions(cfg);

         //определяем нотифай, чтоб понять произошел ли он
         pg._notify = function() {
            result = true;
         };

         result = false;
         lists.Paging._private.changePage(pg, 1);
         assert.isTrue(result, 'Wasn\'t notify after change page');

         result = false;
         lists.Paging._private.changePage(pg, 3);
         assert.isFalse(result, 'Was notify without change page');
      });
      it('life cycle', function () {
         var cfg1 = {
            showDigits: true,
            selectedPage: 3,
            pagesCount: 5
         };
         var cfg2 = {
         };
         var pg = new lists.Paging(cfg1);
         pg.saveOptions(cfg1);
         pg._beforeMount(cfg1);

         assert.equal('normal', pg._stateBegin, 'Wrong arrow state in _beforeMount');
         assert.equal('normal', pg._stateEnd, 'Wrong arrow state in _beforeMount');
         assert.equal('normal', pg._stateNext, 'Wrong arrow state in _beforeMount');
         assert.equal('normal', pg._statePrev , 'Wrong arrow state in _beforeMount');

         cfg1.selectedPage = 5;
         pg._beforeUpdate(cfg1);
         assert.equal('normal', pg._stateBegin, 'Wrong arrow state in _beforeUpdate');
         assert.equal('disabled', pg._stateEnd, 'Wrong arrow state in _beforeUpdate');
         assert.equal('disabled', pg._stateNext, 'Wrong arrow state in _beforeUpdate');
         assert.equal('normal', pg._statePrev , 'Wrong arrow state in _beforeUpdate');

         pg = new lists.Paging(cfg1);
         pg.saveOptions(cfg1);
         pg._beforeMount(cfg2);
         assert.equal('disabled', pg._stateBegin, 'Wrong default state');
         assert.equal('disabled', pg._stateEnd, 'Wrong default state');
         assert.equal('disabled', pg._stateNext, 'Wrong default state');
         assert.equal('disabled', pg._statePrev , 'Wrong default state');

         pg = new lists.Paging(cfg1);
         pg.saveOptions(cfg1);
         pg._beforeUpdate(cfg2);
         assert.equal('disabled', pg._stateBegin, 'Wrong default state');
         assert.equal('disabled', pg._stateEnd, 'Wrong default state');
         assert.equal('disabled', pg._stateNext, 'Wrong default state');
         assert.equal('disabled', pg._statePrev , 'Wrong default state');
      });

      it('click', function () {
         var cfg1 = {
            showDigits: true,
            selectedPage: 3,
            pagesCount: 5
         };

         var pg = new lists.Paging(cfg1);
         pg.saveOptions(cfg1);
         //определяем нотифай, чтоб понять произошел ли он
         pg._notify = function(eName, args) {
            if (eName === 'selectedPageChanged') {
               result = args[0];
            }
         };

         //проверяем клик на цифру
         result = null;
         pg.__digitClick({}, 1);
         assert.equal(1, result, 'Wrong page after change page');

         //проверяем клики на стрелки
         result = null;
         pg.__arrowClick({}, 'Begin');
         assert.equal(1, result, 'Wrong page after change page');
         pg.__arrowClick({}, 'End');
         assert.equal(5, result, 'Wrong page after change page');
         pg.__arrowClick({}, 'Prev');
         assert.equal(2, result, 'Wrong page after change page');
         pg.__arrowClick({}, 'Next');
         assert.equal(4, result, 'Wrong page after change page');

         //проверяем клики на задизабленные стрелки
         cfg1 = {
            showDigits: true,
            selectedPage: 1,
            pagesCount: 5
         };
         pg._beforeUpdate(cfg1);
         pg.saveOptions(cfg1);

         result = 0;
         pg.__arrowClick({}, 'Begin');
         assert.equal(0, result, 'Arrow was clicked in disabled state');
      });
   });


});