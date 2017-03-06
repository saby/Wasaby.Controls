/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.Utils.SourceUtil', 'js!WS.Data/Source/Memory', 'Core/core-instance'], function (SourceUtil, Memory, cInstance) {

   'use strict';

   describe('SBIS3.CONTROLS.Utils.SourceUtil', function () {

      describe('.prepareSource', function () {

         var getSourceFromFunc = function() {
            return new Memory();
         };

         var sourceOpts = {
           module: 'js!WS.Data/Source/Memory',
           options: {}
         };

         var createdSource = new Memory();

         it('source from function', function (){
            assert.equal(cInstance.instanceOfMixin(SourceUtil.prepareSource(getSourceFromFunc), 'WS.Data/Source/ISource'), true);
         });

         it('source from options', function (){
            assert.equal(cInstance.instanceOfMixin(SourceUtil.prepareSource(sourceOpts), 'WS.Data/Source/ISource'), true);
         });

         it('created Source', function (){
            assert.equal(cInstance.instanceOfMixin(SourceUtil.prepareSource(createdSource), 'WS.Data/Source/ISource'), true);
         });
      });
   });
});