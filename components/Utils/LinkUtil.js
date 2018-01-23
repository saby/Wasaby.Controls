define('SBIS3.CONTROLS/Utils/LinkUtil', [],
    /**
     * @class SBIS3.CONTROLS/Utils/LinkUtil
     * @public
     */
    function () /** @lends SBIS3.CONTROLS/Utils/LinkUtil.prototype */{
        return {
            preparedClassFromOptions: function (opts, attrToMerge) {
                var classes = ['mainLink', 'mainLink__2', 'mainLink__3', 'additionalLink', 'additionalLink__2', 'additionalLink__3', 'additionalLink__4', 'additionalLink__5'],
                    className = (attrToMerge && attrToMerge.class) || (opts.element && opts.element.className) || opts.className || '',
                    color = 'mainLink',
                    colorClass = ' controls-Link_';

                if (className) {
                    classes.forEach(function (type) {
                        if (className.indexOf(type) !== -1) {
                            color = type;
                        }
                    });
                }
                switch(color){
                    case 'mainLink': colorClass += 'main'; break;
                    case 'mainLink__2': colorClass += 'main-2'; break;
                    case 'mainLink__3': colorClass += 'main-3'; break;
                    case 'additionalLink': colorClass += 'additional'; break;
                    case 'additionalLink__2': colorClass += 'additional-2'; break;
                    case 'additionalLink__3': colorClass += 'additional-3'; break;
                    case 'additionalLink__4': colorClass += 'additional-4'; break;
                    case 'additionalLink__5': colorClass += 'additional-5'; break;
                }
                opts.cssClassName += colorClass;
            }
        };
    });