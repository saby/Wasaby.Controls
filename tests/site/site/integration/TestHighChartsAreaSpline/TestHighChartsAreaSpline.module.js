define('js!SBIS3.TestHighChartsAreaSpline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestHighChartsAreaSpline',
        'css!SBIS3.TestHighChartsAreaSpline',
        'js!SBIS3.CONTROLS.HighCharts'
    ], function (CompoundControl, dotTplFn) {

        var moduleClass = CompoundControl.extend({

            _dotTplFn: dotTplFn,

            $protected: {
                _options: {}
            },

            $constructor: function () {
            },

            init: function () {
                moduleClass.superclass.init.call(this);
            }

        });

        moduleClass.webPage = {
            outFileName: "integration_highcharts_area_spline",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
