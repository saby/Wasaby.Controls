/**
 * Created by am.gerasimov on 29.08.2016.
 */
define('js!SBIS3.CONTROLS.SelectorDefaultComponent', [
       'js!SBIS3.CONTROLS.SelectorController',
       'html!SBIS3.CONTROLS.SelectorDefaultComponent'
    ],
    function (SelectorController, SelectorDefaultComponent) {
       'use strict';
       /**
        * Класс, который описывает действие открытия окна с заданным шаблоном.
        * Из этого окна можно осуществлять выбор.
        * @class SBIS3.CONTROLS.DialogActionBase
        * @public
        * @extends SBIS3.CONTROLS.ActionBase
        * @author Герасимов Александр Максимович
        */
       var SelectorDefaultComponent = SelectorController.extend([], {
          _dotTplFn: SelectorDefaultComponent,
          $protected: {
             _options: {
                content: null,
                topContent: null
             }
          },
          _modifyOptions: function() {
             var cfg = SelectorDefaultComponent.superclass._modifyOptions.apply(this, arguments);
             return cfg;
          }
       });
       return SelectorDefaultComponent;
    });