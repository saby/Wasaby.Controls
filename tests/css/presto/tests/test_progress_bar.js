/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.ProgressBar Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_progress_bar_online.html').setCaptureElements('.capture')

            .before(function (actions) {
                actions.waitForElementToShow('[name="ProgressBar 1"]', 40000);
            })

            .capture('plain')

            .capture('with_progress', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setProgress(50);
                });
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_progress_bar_online.html').setCaptureElements('.capture')

            .before(function (actions) {
                actions.waitForElementToShow('[name="ProgressBar 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setEnabled(false);
                });
                actions.wait(500);
            })

            .capture('plain')
    });

    gemini.suite('left_align', function (test) {

        test.setUrl('/regression_progress_bar_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {
                actions.waitForElementToShow('[name="ProgressBar 1"]', 40000);
            })

            .capture('plain')

            .capture('with_progress', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setProgress(50);
                });
            })
    });

    gemini.suite('right_align', function (test) {

        test.setUrl('/regression_progress_bar_online_3.html').setCaptureElements('.capture')

            .before(function (actions) {
                actions.waitForElementToShow('[name="ProgressBar 1"]', 40000);
            })

            .capture('plain')

            .capture('with_progress', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setProgress(50);
                });
            })
    });
});*/