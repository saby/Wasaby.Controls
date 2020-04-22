import cInstance = require('Core/core-instance');
import { relation } from 'Types/entity';
import { Record } from 'Types/entity';
import { RecordSet, List } from 'Types/collection';
import { TKeySelection as TKey } from 'Controls/interface';
import { Model } from 'Types/entity';
import { ISelectionModel } from '../interface';

export function isNode(item: Record, model: ISelectionModel, hierarchyRelation: relation.Hierarchy): boolean {
   if (cInstance.instanceOfModule(model, 'Controls/display:Tree')) {
      return model.getItemBySourceKey(item.getKey()).isNode();
   } else {
      return hierarchyRelation ? hierarchyRelation.isNode(item) !== null : false;
   }
}

export function isHasChildren(item: Record, model: ISelectionModel, hierarchyRelation: relation.Hierarchy): boolean {
   if (cInstance.instanceOfModule(model, 'Controls/display:Tree')) {
      return model.getItemBySourceKey(item.getKey()).isHasChildren();
   } else {
      return hierarchyRelation ? hierarchyRelation.hasDeclaredChildren(item) !== false : false;
   }
}

export function getItems(model: ISelectionModel): RecordSet|List {
   if (cInstance.instanceOfModule(model, 'Controls/display:Collection')) {
      return model.getCollection();
   } else {
      return model.getItems();
   }
}

export function getChildren(nodeId: TKey, model: ISelectionModel, hierarchyRelation: relation.Hierarchy): Model[] {
   let children: Model[] = [];

   if (cInstance.instanceOfModule(model, 'Controls/display:Tree')) {
      // Корня может и не быть в коллекции, поэтому ищем сами
      const parentProperty: string = model.getParentProperty();

      model.getCollection().forEach((item) => {
         if (item.get(parentProperty) === nodeId) {
            children.push(item);
         }
      });
   } else if (hierarchyRelation) {
      children = hierarchyRelation.getChildren(nodeId, getItems(model));
   }

   return children;
}
