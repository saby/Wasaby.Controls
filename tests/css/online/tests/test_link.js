var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.Link Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 1"]', 40000);
                this.link = find('[name="Link 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.link);
            })

            .after(function (actions) {
                actions.mouseUp(this.link);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 1"]', 40000);
                this.link = find('[name="Link 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
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

        test.setUrl('/regression_link_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 1"]', 40000);
                this.link = find('[name="Link 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.link);
            })

            .after(function (actions) {
                actions.mouseUp(this.link);
            })
    });

    gemini.suite('disabled_with_icon16', function (test) {

        test.setUrl('/regression_link_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 1"]', 40000);
                this.link = find('[name="Link 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Link 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })
    });

    gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_link_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 1"]', 40000);
                this.link = find('[name="Link 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.link);
            })

            .after(function (actions) {
                actions.mouseUp(this.link);
            })
    });

    gemini.suite('disabled_with_icon24', function (test) {

        test.setUrl('/regression_link_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 1"]', 40000);
                this.link = find('[name="Link 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Link 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })
    });

    gemini.suite('ellipsis', function (test) {

        test.setUrl('/regression_link_online_3.html').skip('chrome').setCaptureElements('[name="Link 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 1"]', 40000);
                this.link = find('[name="Link 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.link);
            })

            .after(function (actions) {
                actions.mouseUp(this.link);
            })
    });

    gemini.suite('disabled_ellipsis', function (test) {

        test.setUrl('/regression_link_online_3.html').setCaptureElements('[name="Link 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Link 1"]', 40000);
                this.link = find('[name="Link 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Link 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.link);
            })
    });
});