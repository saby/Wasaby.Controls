define('SBIS3.CONTROLS/Utils/ButtonUtil', [],

   /**
     * @class SBIS3.CONTROLS/Utils/ButtonUtil
     * @public
     */
   function() /** @lends SBIS3.CONTROLS/Utils/ButtonUtil.prototype */{
      return {
         getStyleByConfig: function(opts, attrToMerge) {
            var className = (attrToMerge && attrToMerge.class) || (opts.element && opts.element.className) || opts.className || '';

            if (className.indexOf('controls-Button__big') !== -1) {
               opts.size = 'l';
            }
            if (className.indexOf('controls-Button__primary') !== -1) {
               opts.style = 'primary';
            }
            if (className.indexOf('controls-Button__withoutCaption') !== -1) {
               opts.withoutCaption = true;
            }
         },

         preparedClassFromOptions: function(opts) {
            opts.cssClassName += ' controls-Button';
            opts.cssClassName += this.getClassState(opts);

            this.checkSVG(opts);
         },

         getClassState: function(opts) {
            var classes = '',
               state;

            classes += ' controls-Button_size-' + (!!opts.size ? opts.size : 'default');
            if (!opts.enabled) {
               state = 'disabled';
            } else {
               state = (!!opts.primary ? 'primary' : opts.style);
            }
            classes += ' controls-Button_state-' + state;

            this.checkSVG(opts);
            return classes;
         },
         // TODO откатить все правки по svg, когда Андрей Голубев будет грузить статику первее БЛ-запросов
         checkSVG: function(opts) {
            opts._svgIcon = opts.icon && opts.icon.indexOf('icon-AddButtonNew') !== -1 ? true : false;
         }
      };
   });
