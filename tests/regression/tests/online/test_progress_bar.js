var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.ProgressBar Online', function () {

    gemini.suite('default', function (test) {

        test.setUrl('/regression_progressbar_online.html')

            .setCaptureElements('[name="ProgressBar 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ProgressBar 1"]', 40000);
                this.progress = find('[name="ProgressBar 1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.progress);
            })

            .capture('half progress', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setProgress(50);
                });
            })

            .capture('full progress', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setProgress(100);
                });
            })
    });

    gemini.suite('disable_default', function (test) {

        test.setUrl('/regression_progressbar_online.html').setCaptureElements('[name="ProgressBar 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ProgressBar 1"]', 40000);
                this.progress = find('[name="ProgressBar 1"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.progress);
            })
    });

    gemini.suite('disable_with_progress', function (test) {

        test.setUrl('/regression_progressbar_online.html').setCaptureElements('[name="ProgressBar 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ProgressBar 1"]', 40000);
                this.progress = find('[name="ProgressBar 1"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setProgress(20);
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.progress);
            })
    });

    gemini.suite('align_left', function (test) {

        test.setUrl('/regression_progressbar_online.html')

            .setCaptureElements('[name="ProgressBar 2"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ProgressBar 2"]', 40000);
                this.progress = find('[name="ProgressBar 2"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.progress);
            })

            .capture('half progress', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 2').setProgress(50);
                });
            })

            .capture('full progress', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 2').setProgress(100);
                });
            })
    });

    gemini.suite('disable_align_left', function (test) {

        test.setUrl('/regression_progressbar_online.html').setCaptureElements('[name="ProgressBar 2"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ProgressBar 2"]', 40000);
                this.progress = find('[name="ProgressBar 2"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 2').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.progress);
            })
    });

    gemini.suite('disable_align_left_with_progress', function (test) {

        test.setUrl('/regression_progressbar_online.html').setCaptureElements('[name="ProgressBar 2"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ProgressBar 2"]', 40000);
                this.progress = find('[name="ProgressBar 2"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 2').setProgress(20);
                    window.$ws.single.ControlStorage.getByName('ProgressBar 2').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.progress);
            })
    });

    gemini.suite('align_right', function (test) {

        test.setUrl('/regression_progressbar_online.html')

            .setCaptureElements('[name="ProgressBar 3"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ProgressBar 3"]', 40000);
                this.progress = find('[name="ProgressBar 3"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.progress);
            })

            .capture('half progress', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 3').setProgress(50);
                });
            })

            .capture('full progress', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 3').setProgress(100);
                });
            })
    });

    gemini.suite('disable_align_right', function (test) {

        test.setUrl('/regression_progressbar_online.html').setCaptureElements('[name="ProgressBar 3"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ProgressBar 3"]', 40000);
                this.progress = find('[name="ProgressBar 3"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 3').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.progress);
            })
    });

    gemini.suite('disable_align_right_with_progress', function (test) {

        test.setUrl('/regression_progressbar_online.html').setCaptureElements('[name="ProgressBar 3"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ProgressBar 3"]', 40000);
                this.progress = find('[name="ProgressBar 3"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 3').setProgress(20);
                    window.$ws.single.ControlStorage.getByName('ProgressBar 3').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.progress);
            })
    });
});