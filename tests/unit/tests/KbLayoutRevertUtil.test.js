/**
 * Created by am.gerasimov on 18.10.2016.
 */
/**
 * Created by am.gerasimov on 12.10.2016.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.Utils.KbLayoutRevertUtil'], function (KbLayoutRevertUtil) {

   'use strict';
   describe('SBIS3.CONTROLS.Utils.KbLayoutRevertUtil', function () {

      describe('.process', function (){

         it('Привет! => Ghbdtn!', function (){
            assert.equal(KbLayoutRevertUtil.process('Привет!'), 'Ghbdtn!');
         });

         it('Ghbdtn! => Привет!', function (){
            assert.equal(KbLayoutRevertUtil.process('Ghbdtn!'), 'Привет!');
         });

         it('привет Алекс! => ghbdtn Fktrc!', function (){
            assert.equal(KbLayoutRevertUtil.process('привет Алекс!'), 'ghbdtn Fktrc!');
         });

         it('ghbdtn Fktrc! => привет Алекс!', function (){
            assert.equal(KbLayoutRevertUtil.process('ghbdtn Fktrc!'), 'привет Алекс!');
         });

         it('привет Alex! => ghbdtn Фдуч!', function (){
            assert.equal(KbLayoutRevertUtil.process('привет Alex!'), 'ghbdtn Фдуч!');
         });

         it('ghbdtn Alex! => привет Фдуч!', function (){
            assert.equal(KbLayoutRevertUtil.process('ghbdtn Alex!'), 'привет Фдуч!');
         });
      });
   });
});