import {Memory, CrudEntityKey} from 'Types/source';

export class RemoveDemoSource extends Memory {
   destroy(keys: CrudEntityKey | CrudEntityKey[], meta?: object): Promise<void> {
      if (keys.indexOf(6) !== -1) {
         return Promise.reject('Unable to delete entry with key " 6"');

      } else if (keys.indexOf(7) !== -1) {
         return new Promise((resolve) => {

            //We simulate the long deletion of records.
            setTimeout(() => {
               super.destroy.apply(this, arguments);
               resolve(true);
            }, 2500);
         });
      }

      return super.destroy.apply(this, arguments);
   }
}
