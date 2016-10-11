gemini.suite('SBIS3.CONTROLS.CheckBox Presto', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_check_box_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.box = '[name="CheckBox 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.box, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.box);
            })

            .capture('checked', function (actions) {
                actions.click(this.box);
            })
			
			.capture('disabled_and_checked', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 1').setEnabled(false);
                });
            })

            .capture('disabled_and_not_checked', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 1').setEnabled(true);
                });
                actions.click(this.box);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 1').setEnabled(false);
                });
            })
    });

    gemini.suite('three_state', function (test) {

        test.setUrl('/regression_check_box_presto_2.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.box = '[name="CheckBox 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.box, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('checked_null', function (actions) {
                actions.click(this.box);
				actions.click(this.box);
            })
			
			.capture('disabled_and_checked_null', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 1').setEnabled(false);
                });
            })
    });
});