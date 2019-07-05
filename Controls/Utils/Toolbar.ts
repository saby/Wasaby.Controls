/**
 * Утилита для Toolbar
 *  - содержит константы
 *  - фильтр для элементов меню
 */
import {factory, Abstract as ChainAbstract} from 'Types/chain';
import {RecordSet} from 'Types/collection';

export const showType = {

   // show only in Menu
   MENU: 0,

   // show in Menu and Toolbar
   MENU_TOOLBAR: 1,

   // show only in Toolbar
   TOOLBAR: 2

};

export function getMenuItems<T>(items: RecordSet<T> | T[]): ChainAbstract<T> {
   return factory(items).filter((item) => {
      return item.get('showType') !== this.showType.TOOLBAR;
   });
}
