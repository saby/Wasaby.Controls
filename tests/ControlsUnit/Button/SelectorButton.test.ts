import {assert} from 'chai';
import * as chai from 'chai';
// @ts-ignore
import * as Clone from 'Core/core-clone';
import SelectorButton, {ISelectorButtonOptions} from 'Controls/_lookup/Button';

interface ITestOptions extends ISelectorButtonOptions {
   multiSelect: boolean;
   keyProperty: string;
   displayProperty: string;
   caption: string;
   maxVisibleItems: number;
   readOnly?: boolean;
}

describe('Controls/_lookup/Button/', (): void => {
   const config: ITestOptions = {
      ...SelectorButton.getDefaultOptions(),
      multiSelect: true,
      keyProperty: 'id',
      displayProperty: 'title',
      caption: 'Выберите запись',
      maxVisibleItems: 2
   };

   const getButton = (config: ITestOptions): SelectorButton => {
      const selButton: SelectorButton = new SelectorButton(config);
      selButton.saveOptions(config);
      return selButton;
   };

   const setTrue = (assert: typeof chai.assert): void => {
      assert.equal(true, true);
   };

   it('_itemClickHandler check open selector', (): void => {
      let isShowSelector: boolean = false;
      const singleConfig: ITestOptions = Clone(config);

      singleConfig.multiSelect = false;
      singleConfig.readOnly = true;

      const button = getButton(singleConfig);

      // @ts-ignore
      button._notify = (eventName: string) => {
         if (eventName === 'showSelector') {
            isShowSelector = true;
         }
      };
      // @ts-ignore
      button._children = { 'selectorOpener': { open: setTrue.bind(this, assert) } };
      // @ts-ignore
      button._itemClickHandler();
      assert.isFalse(isShowSelector);

      // @ts-ignore
      button._options.readOnly = false;
      // @ts-ignore
      button._itemClickHandler();
      assert.isTrue(isShowSelector);
   });

   it('_itemClickHandler check notify itemClick', (): void => {
      const button = getButton(config);
      let item: object = {id : 1};
      let dataItemClick: object[] = null;

      // @ts-ignore
      button._notify = (eventName: string, data: object[]) => {
         if (eventName === 'itemClick') {
            dataItemClick = data;
         }
      };
      // @ts-ignore
      button._itemClickHandler(null, item);
      assert.equal(dataItemClick[0], item)

      dataItemClick = null;
      // @ts-ignore
      button._options.readOnly = true;
      // @ts-ignore
      button._itemClickHandler(null, item);
      assert.equal(dataItemClick[0], item)
   });
});
