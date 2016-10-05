gemini.suite('SBIS3.CONTROLS.BackButton Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_back_button_online.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.item4 = '[data-id="4"]';
                this.item13 = '[data-id="13"]';
				this.item14 = '[data-id="14"]';
				this.item21 = '[data-id="21"]';
                this.button = '.controls-BackButton';
				this.caption = '.controls-BackButton__caption';
				
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.item4, 5000);
            })

            .capture('plain')
			
			.capture('in_folder', function (actions) {
				actions.click(this.item4);
				actions.waitForElementToShow(this.item14, 5000);
                actions.click(this.item13);
				actions.waitForElementToShow(this.item21, 5000);
			})

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button)
            })
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('BackButton').setEnabled(false);
                });
				actions.mouseMove(this.item21);
			})

            .capture('disabled_and_hovered_caption', function (actions) {
                actions.mouseMove(this.caption)
            })
    });
	
	gemini.suite('with_arrow', function (test) {

        test.setUrl('/regression_back_button_online_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.item4 = '[data-id="4"]';
                this.item13 = '[data-id="13"]';
				this.item14 = '[data-id="14"]';
				this.item21 = '[data-id="21"]';
                this.button = '.controls-BackButton';
				this.caption = '.controls-BackButton__caption';
				this.arrow = '.controls-BackButton__arrow';
				
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.item4, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.item4);
				actions.waitForElementToShow(this.item14, 5000);
                actions.click(this.item13);
				actions.waitForElementToShow(this.item21, 5000);
			})

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button)
            })
			
			.capture('hovered_arrow', function (actions) {
                actions.mouseMove(this.arrow)
            })
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('BackButton').setEnabled(false);
                });
				actions.mouseMove(this.item21);
			})

            .capture('disabled_and_hovered_caption', function (actions) {
                actions.mouseMove(this.caption)
            })
			
			.capture('disabled_and_hovered_arrow', function (actions) {
                actions.mouseMove(this.arrow)
            })
    });

    gemini.suite('with_empty_caption', function (test) {

        test.setUrl('/regression_back_button_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.item4 = '[data-id="4"]';
                this.item13 = '[data-id="13"]';
				this.item14 = '[data-id="14"]';
				this.item21 = '[data-id="21"]';
                this.button = '.controls-BackButton';
				
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.item4, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.item4);
				actions.waitForElementToShow(this.item14, 5000);
                actions.click(this.item13);
				actions.waitForElementToShow(this.item21, 5000);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('BackButton').setCaption();
                });
			})
    });
});