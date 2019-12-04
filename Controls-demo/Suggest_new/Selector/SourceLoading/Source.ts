import * as Deferred from 'Core/Deferred';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';
import {Memory} from 'Types/source';

const SEARCH_DELAY = 3000;

export default class DelaySuggestSource {
   private source: Memory = null;
   private _mixins: Array = [];
   constructor(opts) {
      this.source = new SearchMemory(opts);
      this['[Types/_source/ICrud]'] = true;
   }

   getModel() {
      return this.source.getModel();
   }

   getKeyProperty() {
      return this.source.getKeyProperty();
   }


   query(query) {
      const origQuery = this.source.query.apply(this.source, arguments);
      const loadDef = new Deferred();

      setTimeout(() => {
         if (!loadDef.isReady()) {
            loadDef.callback();
         }
      }, SEARCH_DELAY);
      loadDef.addCallback(() => {
         return origQuery;
      });
      return loadDef;
   }

   static '[Types/_source/ICrud]': boolean = true;
}