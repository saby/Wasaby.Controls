/**
 * Created by am.gerasimov on 25.12.2017.
 */
define('Controls/Input/resources/SuggestShowAll/SuggestShowAll',
   [
      'Core/Control',
      'tmpl!Controls/Input/resources/SuggestShowAll/SuggestShowAll',
      'css!Controls/Input/resources/SuggestShowAll/SuggestShowAll'
   ], function(Control, template) {
      
      'use strict';
      
      var SuggestShowAll = Control.extend({
         _template: template,
         
         constructor: function(options) {
            SuggestShowAll.superclass.constructor.call(this, options);

            //TODO переписать, как список переведут на актуальное апи навигации
            //так задаем дефолтные настройки для навигации в списке
            if (options.navigation && options.navigation.sourceConfig) {
               options.navigation.sourceConfig.pageSize = 20;
               options.navigation.view = 'infinity';
               options.navigation.viewConfig = options.navigation.viewConfig || {};
               options.navigation.viewConfig.pagingMode = true;
            }
         },
         
         _onItemClickHandler: function(event, item) {
            this._notify('sendResult', [item], {bubbling: true});
            this._notify('close', [], {bubbling: true});
         }
      });
      
      return SuggestShowAll;
   });
