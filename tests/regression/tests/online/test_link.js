var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.Link Online', function () {

    gemini.suite('default', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('#Link1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 1"]', 40000);
                this.link = find('[name="Link 1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.link);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.link);
            })
    });

    gemini.suite('disabled_default', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('#Link1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 1"]', 40000);
                this.link = find('[name="Link 1"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Link 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })
    });

    gemini.suite('with_icon16', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('#Link2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 2"]', 40000);
                this.link = find('[name="Link 2"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.link);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.link);
            })
    });

    gemini.suite('disabled_with_icon16', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('#Link2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 2"]', 40000);
                this.link = find('[name="Link 2"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Link 2').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })
    });

    gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('#Link3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 3"]', 40000);
                this.link = find('[name="Link 3"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.link);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.link);
            })
    });

    gemini.suite('disabled_with_icon24', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('#Link3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 3"]', 40000);
                this.link = find('[name="Link 3"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Link 3').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })
    });

    gemini.suite('with_icon32', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('#Link4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 4"]', 40000);
                this.link = find('[name="Link 4"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.link);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.link);
            })
    });

    gemini.suite('disabled_with_icon32', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('#Link4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 4"]', 40000);
                this.link = find('[name="Link 4"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Link 4').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })
    });

    gemini.suite('dotted', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('#Link5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 5"]', 40000);
                this.link = find('[name="Link 5"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.link);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.link);
            })
    });

    gemini.suite('disabled_dotted', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('#Link5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 5"]', 40000);
                this.link = find('[name="Link 5"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Link 5').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })
    });
});