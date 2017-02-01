/**
 * Created by im.dubrovin on 30.01.2017.
 */
/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'js!SBIS3.CONTROLS.TargetRelativePositionModel'
], function (
   TargetRelativePositionModel
) {
   'use strict';

   describe('SBIS3.CONTROLS.TargetRelativePositionModel', function() {
      var TRPModel,
      testVariantsOf_Offset = [123,undefined, 'abc', [123,'abc'], {},null,
         {tap:10, left:10}, {top:10, loft:10},
         {top:'10', left:10},{top:10, left:'10'},
         {top:'10', left:10},{top:10, left:'10'},
         {top:undefined, left:10},{top:10, left:undefined},
      ],

      testVariantsOf_Corner = [123, 'abc', [123,'abc'], {}, undefined,
         {vertical: 'top', хorizontal: 'left'},{wertical: 'top', horizontal: 'left'},
         {vertical: 'tap', horizontal: 'left'},{vertical: 'top', horizontal: 'loft'}
      ],


      MockAdapter,
      mockAdapter,

      sizes = {
         target: {
            width : 10, height: 10
         },
         targetRelative:{
            width : 100, height: 100
         },
         parentContainer: {
            width : 1000, height: 1000
         }
      },

      offsets = {
         target: {
            top:100, left:100
         },
         targetRelative:{
            top:100, left:100
         },
         parentContainer: {
            top:10, left:10
         }
      },

      MockAdapter = function(sizes , offsets){
         this.sizes = sizes;
         this.offsets = offsets;
         this.coordinates = undefined;
      };
      MockAdapter.prototype.getContainerSize = function(containerName, dimensionName){
         return this.sizes[containerName][dimensionName];
      };
      MockAdapter.prototype.getContainerOffset = function(containerName){
         return this.offsets[containerName];
      };
      MockAdapter.prototype.setOffsetOfTargetRelative = function(coordinatesType , coordinates){
         this.coordinates = coordinates;
      };


      beforeEach(function() {
         mockAdapter = new MockAdapter(sizes, offsets);
         TRPModel = new TargetRelativePositionModel({
            adapter: mockAdapter,
            originCornerOfTarget: {
               horizontal: 'right',
               vertical: 'bottom'
            },
            coordinatesType: {
               horizontal: 'right',
               vertical: 'bottom'
            },
            cornerToCornerOffset: {
               top: 100,
               left: 50
            }
         });
      });

      afterEach(function() {
      });

      describe('.constructor(options)', function() {
         it('should throw an error for invalid options name', function() {
            assert.throws(function() {
               new TargetRelativePositionModel({wrongOptionName: 'some value'});
            }, Error);
         });
      });

      describe('.setOriginCornerOfTarget(originCorner)', function() {
         it('should throw an error for invalid "originCorner" argument', function() {
            for(var i=0; i<testVariantsOf_Corner.length; i++){
               assert.throws(function() {
                  TRPModel.setOriginCornerOfTarget(testVariantsOf_Corner[i]);
               }, TypeError);
            }
            assert.throws(function() {
               TRPModel.setOriginCornerOfTarget(null);
            }, TypeError);
         });
      });

      describe('.setOriginCornerOfTargetRelative(originCorner)', function() {
         it('should throw an error for invalid "originCorner" argument', function() {
            for(var i=0; i < testVariantsOf_Corner.length; i++){
               assert.throws(function() {
                  TRPModel.setOriginCornerOfTargetRelative(testVariantsOf_Corner[i]);
               }, TypeError);
            }
            assert.throws(function() {
               TRPModel.setOriginCornerOfTargetRelative(null);
            }, TypeError);
         });
      });

      // coordinates type have same structure with corner (for example {vertical: top, horizontal: right}), so i can use same test variants
      describe('.setCoordinatesType(coordinatesType)', function() {
         it('should throw an error for invalid "coordinatesType" argument', function() {
            for(var i=0; i < testVariantsOf_Corner.length; i++){
               assert.throws(function() {
                  TRPModel.setCoordinatesType(testVariantsOf_Corner[i]);
               }, TypeError);
            }
         });
      });

      describe('.setCornerToCornerOffset(offset)', function() {
         it('should throw an error for invalid "offset" argument', function() {
            for(var i=0; i < testVariantsOf_Offset.length; i++){
               assert.throws(function() {
                  TRPModel.setCornerToCornerOffset(testVariantsOf_Offset[i]);
               }, TypeError);
            }
         });
      });

      describe('.recalculate() && .getCoordinates()', function() {
         it('should return correct coordinates by each coordinates type', function() {
            var testScenario = [
               {// this scenario checks recalculate method
                  coordinatesType: null, // css offset
                  rightAnswer: {top: 210, left: 160}
               },

               {// scenarios below checks getCoordinates method
                  coordinatesType: {vertical:'top', horizontal:'left'},
                  rightAnswer: {top: 200, left: 150}
               },{
                  coordinatesType: {vertical:'top', horizontal:'right'},
                  rightAnswer: {top: 200, right: 750}
               },{
                  coordinatesType: {vertical:'bottom', horizontal:'left'},
                  rightAnswer: {bottom: 700, left: 150}
               },{
                  coordinatesType: {vertical:'bottom', horizontal:'right'},
                  rightAnswer: {bottom: 700, right: 750}
               }
            ];

            TRPModel.recalculate();

            for(var i =0; i < testScenario.length; i++){
               TRPModel.setCoordinatesType(testScenario[i].coordinatesType);
               assert.deepEqual(testScenario[i].rightAnswer , TRPModel.getCoordinates());
            };
         });
      });

      describe('.move(offset)', function() {
         it('should move container into correct coordinates(recalculate and pass coordinates using adapter)', function() {
            TRPModel.move({top: 99, left: 51});
            assert.deepEqual({bottom: 701, right: 749}, mockAdapter.coordinates);
         });

      });

      describe('.setOriginCornerOfTarget(originCorner) + move', function() {
         it('same as .move(offset) test but origin corner of target was changed', function() {
            TRPModel.setOriginCornerOfTarget({vertical:'top', horizontal:'left'});
            TRPModel.move({top: 99, left: 51});
            assert.deepEqual({bottom: 711, right: 759}, mockAdapter.coordinates);
         });
      });

      describe('.setOriginCornerOfTarget(originCorner) + move', function() {
         it('same as .move(offset) test but origin corner of targetRelative was changed', function() {
            TRPModel.setOriginCornerOfTargetRelative({vertical:'bottom', horizontal:'right'});
            TRPModel.move({top: 99, left: 51});
            assert.deepEqual({bottom: 801, right: 849}, mockAdapter.coordinates);
         });
      });
   });
});
