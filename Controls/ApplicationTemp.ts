import * as Base from 'Controls/Application';
import * as template from 'wml!Controls/Application/BootstrapPage';

export default // @ts-ignore
class Application extends Base {
   constructor() {
      super();
      // @ts-ignore
      this._template = template;
   }
}
