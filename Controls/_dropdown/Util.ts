import rk = require('i18n!Controls');
export default function prepareEmpty(emptyText) {
   if (emptyText) {
      return emptyText === true ? rk('Не выбрано') : emptyText;
   }
}
