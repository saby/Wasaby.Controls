import Control = require('Core/Control');
import template = require('wml!Controls/_search/Misspell/Container');

/**
 * Контрол-контейнер для {@link Controls/list:Container}, который обеспечивает загрузку и отображение {@link Controls/search:Misspell}, если поиск был произведён в неправильной раскладке.
 * @remark
 * Подробнее об организации поиска и фильтрации в реестре читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/ здесь}.
 * Подробнее о классификации контролов Wasaby и схеме их взаимодействия читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list-environment/component-kinds/ здесь}.
 * @class Controls/_search/Misspell/Container
 * @extends Core/Control
 * @control
 * @public
 * @author Крайнов Д.О.
 */
export = Control.extend({
   _template: template,

   _misspellClick: function () {
      this._notify('misspellCaptionClick', [], {bubbling: true});
   }
});

