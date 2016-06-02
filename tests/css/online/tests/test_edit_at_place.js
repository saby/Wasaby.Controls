var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.EditAtPlace Online', function () {

	gemini.suite('group_float', function (test) {

        test.setUrl('/regression_edit_at_place_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="poop"]', 40000);
                this.item1 = find('[sbisname="ololo2"]');
				this.item2 = find('[sbisname="ololo3"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

			.capture('open_editor', function (actions) {
                actions.click(this.item1);
				actions.wait(500);
				actions.mouseMove(this.input);
            })
    });

	gemini.suite('group', function (test) {

        test.setUrl('/regression_edit_at_place_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="poop"]', 40000);
                this.item1 = find('[sbisname="ololo2"]');
				this.item2 = find('[sbisname="ololo3"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

			.capture('open_editor', function (actions) {
                actions.click(this.item1);
				actions.wait(500);
				actions.mouseMove(this.input);
            })
    });

	gemini.suite('with_panel', function (test) {

        test.setUrl('/regression_edit_at_place_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="poop"]', 40000);
                this.item1 = find('[sbisname="ololo2"]');
				this.item2 = find('[sbisname="ololo3"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

			.capture('open_editor', function (actions) {
                actions.click(this.item1);
				actions.wait(500);
				actions.mouseMove(this.input);
            })
    });
	
	gemini.suite('with_tabs', function (test) {

        test.setUrl('/regression_edit_at_place_online_4.html').setTolerance(250).setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TabControl"]', 40000);
				this.fam = find('.controls-TabButtons__leftContainer [sbisname="fam"]');
				this.name_inp = find('[sbisname="EditName"] input');
				this.fam_inp = find('[sbisname="EditFam"] input');
				this.ot_inp = find('[sbisname="EditSon"] input');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

			.capture('open_editor', function (actions) {
                actions.click(this.fam);
				actions.wait(500);
				actions.sendKeys(this.fam_inp, '123456789');
				actions.sendKeys(this.fam_inp, gemini.TAB);
				actions.sendKeys(this.name_inp, '123456789');
				actions.sendKeys(this.name_inp, gemini.TAB);
				actions.sendKeys(this.ot_inp, '123456789');
				actions.sendKeys(this.ot_inp, gemini.CONTROL+gemini.SHIFT+gemini.ARROW_LEFT);
				actions.wait(500);
				actions.mouseMove(this.fam_inp);
            })
			
			.capture('validation_error', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('EditName').markControl();
                });
				actions.wait(500);
            })
    });

	gemini.suite('with_tabs_date_range', function (test) {

        test.setUrl('/regression_edit_at_place_online_5.html').setTolerance(250).setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TabControl"]', 40000);
				this.fam = find('.controls-TabButtons__leftContainer [sbisname="fam"]');
				this.name_inp = find('[sbisname="EditName"] input');
				this.fam_inp = find('[sbisname="EditFam"] input');
				this.ot_inp = find('[sbisname="EditSon"] input');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

			.capture('open_editor', function (actions) {
                actions.click(this.fam);
				actions.wait(500);
				actions.sendKeys(this.fam_inp, '123456789');
				actions.sendKeys(this.fam_inp, gemini.TAB);
				actions.sendKeys(this.name_inp, '123456789');
				actions.sendKeys(this.name_inp, gemini.TAB);
				actions.sendKeys(this.ot_inp, '123456789');
				actions.sendKeys(this.ot_inp, gemini.CONTROL+gemini.SHIFT+gemini.ARROW_LEFT);
				actions.wait(500);
				actions.mouseMove(this.fam_inp);
            })
			
			.capture('validation_error', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('drange').markControl();
                });
				actions.wait(500);
            })
    });
});