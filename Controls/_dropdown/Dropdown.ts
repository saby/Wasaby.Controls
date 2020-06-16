import {Control, IControlOptions} from 'UI/Base';
import isEmpty = require('Core/helpers/Object/isEmpty');

class Dropdown extends Control<IControlOptions> {
   _beforeMount(options, recievedState) {
      if (!options.lazyItemsLoading) {
         if (!recievedState || isEmpty(recievedState)) {
            return this._controller.loadItems();
         } else {
            this._controller.setItems(recievedState);
         }
      }
   }
}

export = Dropdown;
