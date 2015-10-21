define('js!SBIS3.TestHighChartsAreaSplineRange', ['js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestHighChartsAreaSplineRange',
        'css!SBIS3.TestHighChartsAreaSplineRange',
        'js!SBIS3.CONTROLS.HighCharts'
    ],
    function(CompoundControl, dotTplFn) {

        var moduleClass = CompoundControl.extend({

            _dotTplFn: dotTplFn,

            $protected: {
                _options: {}
            },

            $constructor: function() {},

            init: function() {
                moduleClass.superclass.init.call(this);
            }

        });

        moduleClass.webPage = {
            outFileName: "integration_highcharts_area_spline_range",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
