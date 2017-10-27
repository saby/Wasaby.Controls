/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!Controls/List/resources/utils/KbLayoutRevert'], function (KbLayoutRevertUtil) {
   
   'use strict';
   describe('WSControls/Utils/KbLayoutRevert', function () {
      
      
      it('Привет! => Ghbdtn!', function (){
         assert.equal(KbLayoutRevertUtil('Привет!'), 'Ghbdtn!');
      });
      
      it('Ghbdtn! => Привет!', function (){
         assert.equal(KbLayoutRevertUtil('Ghbdtn!'), 'Привет!');
      });
      
      it('привет Алекс! => ghbdtn Fktrc!', function (){
         assert.equal(KbLayoutRevertUtil('привет Алекс!'), 'ghbdtn Fktrc!');
      });
      
      it('ghbdtn Fktrc! => привет Алекс!', function (){
         assert.equal(KbLayoutRevertUtil('ghbdtn Fktrc!'), 'привет Алекс!');
      });
      
      it('привет Alex! => ghbdtn Фдуч!', function (){
         assert.equal(KbLayoutRevertUtil('привет Alex!'), 'ghbdtn Фдуч!');
      });
      
      it('ghbdtn Alex! => привет Фдуч!', function (){
         assert.equal(KbLayoutRevertUtil('ghbdtn Alex!'), 'привет Фдуч!');
      });
   });
});