// @ts-ignore
import * as Control from 'Core/Control';
// @ts-ignore
import template = require('wml!Controls-demo/Async/AsyncTabsDemo/AsyncTabs/AsyncTabs');

import 'css!Controls-demo/Async/AsyncTabsDemo/AsyncTabs/AsyncTabs';

interface ITabsBlockOptions {
   asyncTab?: string;
}

class TabsBlock extends Control {
   _template: Function = template;

   private _tabCount: number = 4;
   private _tabTemplates: string[] = [
       'Controls-demo/Async/AsyncTabsDemo/AsyncTabs/Tab0',
       'Controls-demo/Async/AsyncTabsDemo/AsyncTabs/Tab1',
       'Controls-demo/Async/AsyncTabsDemo/AsyncTabs/Tab2',
       'Controls-demo/Async/AsyncTabsDemo/AsyncTabs/Tab3'
   ];
   protected _asyncTabId: number = 0;
   protected _asyncTabTemplate: string;

   _beforeMount(cfg: ITabsBlockOptions): void {
      this._setAsyncTab(Number.parseInt(cfg.asyncTab, 10));
   }

   _beforeUpdate(cfg: ITabsBlockOptions): void {
      this._setAsyncTab(Number.parseInt(cfg.asyncTab, 10));
   }

   private _setAsyncTab(asyncTab: number): void {
      if (asyncTab >= 0 && asyncTab < this._tabCount) {
         this._asyncTabId = asyncTab;
      } else {
         this._asyncTabId = 0;
      }
      this._asyncTabTemplate = this._tabTemplates[this._asyncTabId];
   }
}

export = TabsBlock;
