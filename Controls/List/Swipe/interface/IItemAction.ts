// @ts-ignore
import { Model } from 'Types/entity';

export enum ShowType {
   MENU,
   MENU_TOOLBAR,
   TOOLBAR
}

/**
 * Configuration object for a button which will be shown when the user hovers over a list item.
 */
export interface IItemAction {
   /**
    * Identifier of the action.
    */
   id?: unknown;

   /**
    * Location of the action.
    * @default MENU
    */
   showType?: ShowType;

   /**
    * Action's name.
    */
   title?: string;

   /**
    * Action's style.
    */
   style?: string;

   /**
    * Action's icon.
    */
   icon?: string;

   /**
    * Style of the action's icon.
    * @default secondary
    */
   iconStyle?: 'secondary' | 'warning' | 'danger' | 'success';

   /**
    * Action's handler.
    * @param item Corresponding list item.
    */
   handler?: (item: Model) => void;

   /**
    * Determines whether the action opens menu.
    * @private
    */
   _isMenu?: boolean;
}
