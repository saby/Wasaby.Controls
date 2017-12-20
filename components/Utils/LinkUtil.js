define('SBIS3.CONTROLS/Utils/LinkUtil', [],
    /**
     * @class SBIS3.CONTROLS/Utils/LinkUtil
     * @public
     */
    function () /** @lends SBIS3.CONTROLS/Utils/LinkUtil.prototype */{
        return {
            getStyleByConfig: function(opts, attrToMerge){
                var classes = ['mainLink', 'mainLink__2', 'mainLink__3', 'additionalLink', 'additionalLink__2', 'additionalLink__3', 'additionalLink__4', 'additionalLink__5'],
                    className = (attrToMerge && attrToMerge.class) || (opts.element && opts.element.className) || opts.className || '',
                    color = 'mainLink',
                    state = 'mainLink';

                if (className) {
                    classes.forEach(function (type) {
                        if (className.indexOf(type) !== -1) {
                            color = type;
                        }
                    });
                }
                switch(color){
                    case 'mainLink': state = 'main'; break;
                    case 'mainLink__2': state = 'main-2'; break;
                    case 'mainLink__3': state = 'main-3'; break;
                    case 'additionalLink': state = 'additional'; break;
                    case 'additionalLink__2': state = 'additional-2'; break;
                    case 'additionalLink__3': state = 'additional-3'; break;
                    case 'additionalLink__4': state = 'additional-4'; break;
                    case 'additionalLink__5': state = 'additional-5'; break;
                }
                return state;
            }
        };
    });