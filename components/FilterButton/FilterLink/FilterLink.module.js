/**
 * Created by am.gerasimov on 05.07.2016.
 */
define('js!SBIS3.CONTROLS.FilterLink',
    [
       'js!SBIS3.CONTROLS.Link'
    ], function(Link) {
       'use strict';

       var FilterLink = Link.extend({
          $protected: {
             _options: {
                invertedVisible: false
             }
          },
          _modifyOptions: function() {
             var opts = FilterLink.superclass._modifyOptions.apply(this, arguments);
             opts.className += ' controls__filterButton__filterLink';
             return opts;
          },

          setInvertedVisible: function(invertedVisible) {
             this._options.invertedVisible = invertedVisible;
             this.toggle(!invertedVisible);
             this._notifyOnSizeChanged(this);
             this._notifyOnPropertyChanged('invertedVisible');
          },

          getInvertedVisible: function() {
             return this._options.invertedVisible
          }
       });

       return FilterLink;
    });