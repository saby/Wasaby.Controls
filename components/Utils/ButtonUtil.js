define('SBIS3.CONTROLS/Utils/ButtonUtil', [],
    /**
     * @class SBIS3.CONTROLS/Utils/ButtonUtil
     * @public
     */
    function () /** @lends SBIS3.CONTROLS/Utils/ButtonUtil.prototype */{
        return {
            preparedClassFromOptions: function (opts) {
                opts.cssClassName += ' controls-Button';
                opts.cssClassName += this.getClassState(opts);
            },

            getClassState: function(opts) {
                var classes = '',
                    state;

                classes += ' controls-Button_size-' + (!!opts.size ? opts.size : 'm');
                if(!opts.enabled){
                    state = 'disabled';
                }else {
                    state = (!!opts.primary ? 'primary' : 'standard');
                }
                classes += ' controls-Button_state-' + state;
                return classes;
            }
        }
    });