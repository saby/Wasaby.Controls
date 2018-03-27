define('SBIS3.CONTROLS/Utils/IconButtonUtil', [],
    /**
     * @class SBIS3.CONTROLS/Utils/IconButtonUtil
     * @public
     */
    function () /** @lends SBIS3.CONTROLS/Utils/IconButton.prototype */{
        return {
            setStyleByConfig: function (opts, attrToMerge) {
                var types = ['controls-IconButton__border', 'controls-IconButton__round-border', 'controls-IconButton__round-border-24', 'controls-IconButton__round-border-32'],
                    className = (attrToMerge && attrToMerge.class || '') + (opts.element && opts.element.className || '') + (opts.className || ''),
                    style  = '',
                    type = '',
                    size;

                if (className) {
                    types.forEach(function (rawType) {
                        if (className.indexOf(rawType) !== -1) {
                            type = rawType;
                        }
                    });
                }
                switch(type){
                    case 'controls-IconButton__border': style = 'bordered'; break;
                    case 'controls-IconButton__round-border': style = 'bordered';  size='m'; break;
                    case 'controls-IconButton__round-border-24': style = 'bordered'; size='s'; break;
                    case 'controls-IconButton__round-border-32': style = 'bordered'; size='l'; break;
                    default: style = 'standard'; break;
                }
                opts.style = !!opts.style ? opts.style : style;
                opts.size = !size ? opts.size : size;
            },

            getBorderColorState: function(style, opts) {
                var  iconClass = opts.icon,
                     borderHoverClass = '';

                if (iconClass && style !== 'standard') {
                    borderHoverClass = 'standard';
                    if (((iconClass.indexOf('icon-error') >= 0) || (iconClass.indexOf('icon-done') >= 0))){
                        if (iconClass.indexOf('icon-error') >= 0) {
                            borderHoverClass = 'error';
                        }
                        else {
                            borderHoverClass = 'done';
                        }
                    }
                }
                return borderHoverClass;
            },

            getClassState: function(opts) {
                var classes = '',
                    borderState = this.getBorderColorState(opts.style, opts);

                classes += ' controls-IconButton_' + opts.style + '_size_' + opts.size;
                classes += ' controls-IconButton_' + opts.style;

                classes += opts.enabled ? (' controls-IconButton__' + borderState + 'Border') : '';

                return classes;
            }
        };
    });