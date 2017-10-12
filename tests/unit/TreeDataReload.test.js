define(['js!SBIS3.CONTROLS.Utils.TreeDataReload', 'WS.Data/Collection/RecordSet', 'WS.Data/Relation/Hierarchy'], function (TreeDataReload, RecordSet, HierarchyRelation) {

   'use strict';

   describe('SBIS3.CONTROLS.Utils.TreeDataReload', function () {
      var
         hierarchyRelation = new HierarchyRelation({
            idProperty: 'id',
            parentProperty: 'parent'
         }),
         items = new RecordSet({
            rawData: [
               { id: '1',     parent: null,  nodeProp: true  },
               { id: '11',    parent: '1',   nodeProp: true  },
               { id: '111',   parent: '11',  nodeProp: true  },
               { id: '1111',  parent: '111', nodeProp: null  },
               { id: '12',    parent: '1',   nodeProp: false },
               { id: '121',   parent: '12',  nodeProp: null  },
               { id: '122',   parent: '12',  nodeProp: null  },
               { id: '2',     parent: null,  nodeProp: true  },
               { id: '21',    parent: '2',   nodeProp: true  },
               { id: '22',    parent: '2',   nodeProp: null  },
               { id: '23',    parent: '2',   nodeProp: false }
            ],
            idProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'nodeProp'
         }),
         updatedItems = new RecordSet({
            rawData: [
               { id: '1',     parent: null,  nodeProp: true  },
               { id: '11',    parent: '1',   nodeProp: true  },
               { id: '111',   parent: '11',  nodeProp: null  },
               { id: '12',    parent: '1',   nodeProp: true  },
               { id: '13',    parent: '1',   nodeProp: false },
               { id: '131',   parent: '13',  nodeProp: null  },
               { id: '132',   parent: '13',  nodeProp: null  }
            ],
            idProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'nodeProp'
         }),
         resultPrepareReloadableNodes = {
            '1': 0,
            '11': 0,
            '111': 0,
            '12': 0
         },
         resultApplyUpdatedData = [
            { id: '1',     parent: null,  nodeProp: true  },
            { id: '11',    parent: '1',   nodeProp: true  },
            { id: '111',   parent: '11',  nodeProp: null  },
            { id: '12',    parent: '1',   nodeProp: true  },
            { id: '2',     parent: null,  nodeProp: true  },
            { id: '21',    parent: '2',   nodeProp: true  },
            { id: '22',    parent: '2',   nodeProp: null  },
            { id: '23',    parent: '2',   nodeProp: false },
            { id: '13',    parent: '1',   nodeProp: false },
            { id: '131',   parent: '13',  nodeProp: null  },
            { id: '132',   parent: '13',  nodeProp: null  }
         ];
      it('Check method "prepareReloadableNodes"', function () {
         var
            prepareResult = TreeDataReload.prepareReloadableNodes({
               hierarchyRelation: hierarchyRelation,
               item: items.at(0),
               items: items,
               direction: 'inside',
               nodeProperty: 'nodeProp'
            });
         assert.deepEqual(prepareResult, resultPrepareReloadableNodes);
      });
      it('Check method "applyUpdatedData"', function () {
         TreeDataReload.applyUpdatedData({
            hierarchyRelation: hierarchyRelation,
            item: items.at(0),
            items: items,
            direction: 'inside',
            nodeProperty: 'nodeProp',
            updatedItems: updatedItems
         });
         assert.deepEqual(items.getRawData(), resultApplyUpdatedData);
      });
   });
});