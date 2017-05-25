/**
 * Created by im.dubrovin on 27.01.2017.
 */
/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'js!SBIS3.CONTROLS.ContainerModel'
], function (
   ContainerModel
) {
   'use strict';

   describe('SBIS3.CONTROLS.ContainerModel', function() {
      var containerModel;

      beforeEach(function() {
         containerModel = new ContainerModel();
      });

      afterEach(function() {
      });

      describe('.setHeight(val)', function() {
         it('should throw an error if argument is not number', function() {
            assert.throws(function() {
               containerModel.setHeight('abc');
            }, TypeError);
            assert.throws(function() {
               containerModel.setHeight(undefined);
            }, TypeError);
            assert.throws(function() {
               containerModel.setHeight(true);
            }, TypeError);
         });
      });

      describe('.setWidth(val)', function() {
         it('should throw an error if argument is not number', function() {
            assert.throws(function() {
               containerModel.setWidth('abc');
            }, TypeError);
            assert.throws(function() {
               containerModel.setWidth(undefined);
            }, TypeError);
            assert.throws(function() {
               containerModel.setWidth(true);
            }, TypeError);
         });
      });



      describe('.getWidth()', function() {
         it('getter should get setted value', function() {
            var val = 333;
            containerModel.setWidth(val);
            assert.isTrue(val === containerModel.getWidth());
         });
      });

      describe('.getHeight()', function() {
         it('getter should get setted value', function() {
            var val = 333;
            containerModel.setHeight(val);
            assert.isTrue(val === containerModel.getHeight());
         });
      });



      describe('.setOffsetByCorner(corner, offset)', function() {
         it('should throw an error for invalid "offset" argument', function() {
            var corner = {vertical: 'top', horizontal: 'left'};
            assert.throws(function() {
               containerModel.setOffsetByCorner(corner , 'abc');
            }, TypeError);
            assert.throws(function() {
               containerModel.setOffsetByCorner(corner , 124);
            }, TypeError);
            assert.throws(function() {
               containerModel.setOffsetByCorner(corner ,['123', '456']);
            }, TypeError);
            assert.throws(function() {
               containerModel.setOffsetByCorner(corner , {});
            }, TypeError);
            assert.throws(function() {
               containerModel.setOffsetByCorner(corner , {tap: 1, left: 2});
            }, TypeError);
            assert.throws(function() {
               containerModel.setOffsetByCorner(corner , {top: 1, loft: 2});
            }, TypeError);
         });

         it('should throw an error for invalid "corner" argument', function() {
            var offset = {top: 1, left: 2};
            assert.throws(function() {
               containerModel.setOffsetByCorner(undefined, offset);
            }, TypeError);
            assert.throws(function() {
               containerModel.setOffsetByCorner('abc', offset);
            }, TypeError);
            assert.throws(function() {
               containerModel.setOffsetByCorner(124, offset);
            }, TypeError);
            assert.throws(function() {
               containerModel.setOffsetByCorner(['123', '456'], offset);
            }, TypeError);
            assert.throws(function() {
               containerModel.setOffsetByCorner({}, offset);
            }, TypeError);

            assert.throws(function() {
               containerModel.setOffsetByCorner({vertical: 'top', хorizontal: 'left'}, offset);
            }, TypeError);
            assert.throws(function() {
               containerModel.setOffsetByCorner({wertical: 'top', horizontal: 'left'}, offset);
            }, TypeError);

            assert.throws(function() {
               containerModel.setOffsetByCorner({vertical: 'tap', horizontal: 'left'}, offset);
            }, TypeError);
            assert.throws(function() {
               containerModel.setOffsetByCorner({vertical: 'top', horizontal: 'loft'}, offset);
            }, TypeError);
         });
      });


      describe('.getOffsetByCorner(corner)', function() {
         it('should throw an error for invalid "corner" argument', function() {
            assert.throws(function() {
               containerModel.getOffsetByCorner(undefined);
            }, TypeError);
            assert.throws(function() {
               containerModel.getOffsetByCorner('abc');
            }, TypeError);
            assert.throws(function() {
               containerModel.getOffsetByCorner(124);
            }, TypeError);
            assert.throws(function() {
               containerModel.getOffsetByCorner(['123', '456']);
            }, TypeError);
            assert.throws(function() {
               containerModel.getOffsetByCorner({});
            }, TypeError);

            assert.throws(function() {
               containerModel.getOffsetByCorner({vertical: 'top', хorizontal: 'left'});
            }, TypeError);
            assert.throws(function() {
               containerModel.getOffsetByCorner({wertical: 'top', horizontal: 'left'});
            }, TypeError);

            assert.throws(function() {
               containerModel.getOffsetByCorner({vertical: 'tap', horizontal: 'left'});
            }, TypeError);
            assert.throws(function() {
               containerModel.getOffsetByCorner({vertical: 'top', horizontal: 'loft'});
            }, TypeError);
         });


         it('set offset of container using random corner then get offset of random corner(all combinations is checked)', function() {
            var
               size = {height: 3, width: 30},
               offsetByCorner = {
                  topLeft: {top:10, left:100},
                  topRight: {top:10, left:130},
                  bottomLeft: {top:13, left:100},
                  bottomRight:{top:13, left:130}
               },

               CORNERS = {
                  topLeft: {vertical: 'top', horizontal: 'left'},
                  topRight: {vertical: 'top', horizontal: 'right'},
                  bottomLeft: {vertical: 'bottom', horizontal: 'left'},
                  bottomRight:{vertical: 'bottom', horizontal: 'right'}
               },
               setCorner, getCorner, checkOffset;

            containerModel.setHeight(size.height);
            containerModel.setWidth(size.width);


            // goal of this test is to check all combination of getOffsetByCorner and setOffsetByCorner
            // for example set container offset by bottom right corner, then get offset of top left corner, any combination should work correct
            for(setCorner in CORNERS) if(CORNERS.hasOwnProperty(setCorner)){

               containerModel.setOffsetByCorner(CORNERS[setCorner], offsetByCorner[setCorner]);

               for(getCorner in CORNERS) if(CORNERS.hasOwnProperty(getCorner)){

                  checkOffset = containerModel.getOffsetByCorner(CORNERS[getCorner]);

                  assert.isTrue( checkOffset.left === offsetByCorner[getCorner].left && checkOffset.top === offsetByCorner[getCorner].top );
               }
            }
         });
      });
   });
});
