gemini.suite('SBIS3.CONTROLS.Link Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_link_online.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.link = '[name="Link 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.link, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('with_icon16', function (test) {

        test.setUrl('/regression_link_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.link = '[name="Link 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.link, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_link_online_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.link = '[name="Link 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.link, 40000);
				actions.waitForElementToShow(this.input, 5000);
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

            .capture('disable', function (actions) {
                actions.mouseUp(this.link);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Link 1').setEnabled(false);
                });
            })

            .capture('disable_and_hovered', function (actions) {
                actions.mouseMove(this.link);
            })
    });

    gemini.suite('ellipsis', function (test) {

        test.setUrl('/regression_link_online_3.html').setCaptureElements('[name="Link 1"]')

            .before(function (actions) {
				
				this.link = '[name="Link 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.link, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Link 1').setEnabled(false);
                });
            })
    });
});