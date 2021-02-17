import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_explorer/PathController/PathController';
import {EventUtils} from 'UI/Events';
import HeadingPathBack from 'Controls/_explorer/HeadingPathBack';
import * as GridIsEqualUtil from 'Controls/Utils/GridIsEqualUtil';

export default class PathController extends Control<IControlOptions> {
   protected _template: TemplateFunction = template;
   protected _header: object;
   protected _needShadow: boolean = false;
   private _itemsAndHeaderPromise: Promise<object>;
   private _itemsAndHeaderPromiseResolver: () => object;

   protected _notifyHandler: EventUtils.tmplNotify = EventUtils.tmplNotify;

   protected _beforeMount(options) {
      this._itemsAndHeaderPromise = new Promise((resolve) => {
         this._itemsAndHeaderPromiseResolver = resolve;
      });
      this._header = this._getHeader(options, options.items);
      options.itemsPromise.then((items) => {
         this._needShadow = this._isNeedShadow(this._header, options.header);
         this._itemsAndHeaderPromiseResolver({
            items,
            header: this._header
         });
      });
   }

   protected _beforeUpdate(newOptions) {
      if (this._options.rootVisible !== newOptions.rootVisible || newOptions.items !== this._options.items || !GridIsEqualUtil.isEqualWithSkip(this._options.header, newOptions.header, { template: true })) {
         this._itemsAndHeaderPromise = new Promise((resolve) => {
            this._itemsAndHeaderPromiseResolver = resolve;
         });
         this._header = this._getHeader(newOptions, newOptions.items);
         this._itemsAndHeaderPromiseResolver({
            items: newOptions.items,
            header: this._header
         });
         this._needShadow = this._isNeedShadow(this._header, newOptions.header);
      }
   }

   protected _onBackButtonClick(e): void {
      require(['Controls/breadcrumbs'], (breadcrumbs) => {
         breadcrumbs.HeadingPathCommon.onBackButtonClick.call(this, e);
      });
   }

   private _getHeader(options, items): object {
      let newHeader;

      if (options.header && options.header.length && !(options.header[0].title || options.header[0].caption) && !options.header[0].template) {
         newHeader = options.header.slice();
         newHeader[0] = {
            ...options.header[0],
            template: HeadingPathBack,
            templateOptions: {
               itemsAndHeaderPromise: this._itemsAndHeaderPromise,
               showActionButton: !!options.showActionButton,
               showArrowOutsideOfBackButton: !!options.showActionButton,
               backButtonStyle: options.backButtonStyle,
               backButtonIconStyle: options.backButtonIconStyle,
               backButtonFontColorStyle: options.backButtonFontColorStyle,
               displayProperty: options.displayProperty,
               items
            },

            // TODO: удалить эту опцию после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
            isBreadCrumbs: true
         };
      } else {
         newHeader = options.header;
      }
      return newHeader;
   }

   private _isNeedShadow(header, headerCfg): boolean {
      // если есть заголовок, то тень будет под ним, и нам не нужно рисовать ее под хлебными крошками
      return !(header || headerCfg);
   }
}