var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.SelectorButton Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_selector_button_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="SelectorButton 1"]', 40000);
                this.button = find('[sbisname="SelectorButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 4356"]', 40000);
                this.input = find('[sbisname="TextBox 4356"] input');
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
            })
			
			.capture('hovered', function (actions) {
				actions.mouseMove(this.button);
            })
			
			.capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('SelectorButton 1').setSelectedKeys([0])
                });
				actions.click(this.input);
            })

            .capture('hovered_text', function (actions) {
                actions.mouseMove('.controls-SelectorButton__text');
            })

            .capture('hovered_close_icon', function (actions) {
                actions.mouseMove('.controls-SelectorButton__cross');
            })
    });

	gemini.suite('multiselect', function (test) {

        test.setUrl('/regression_selector_button_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="SelectorButton 1"]', 40000);
                this.button = find('[sbisname="SelectorButton 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 4356"]', 40000);
                this.input = find('[sbisname="TextBox 4356"] input');
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
            })
			
			.capture('hovered', function (actions) {
				actions.mouseMove(this.button);
            })
			
			.capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('SelectorButton 1').setSelectedKeys([0, 1, 2])
                });
				actions.click(this.input);
            })

            .capture('hovered_text', function (actions) {
                actions.mouseMove('.controls-SelectorButton__text');
            })

            .capture('hovered_close_icon', function (actions) {
                actions.mouseMove('.controls-SelectorButton__cross');
            })
    });
});