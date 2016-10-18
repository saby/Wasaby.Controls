gemini.suite('SBIS3.CONTROLS.EditAtPlace Presto', function () {

	gemini.suite('group_float', function (test) {

        test.setUrl('/regression_edit_at_place_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.poop = '[sbisname="poop"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.item1 = '[sbisname="ololo2"]';
				this.item2 = '[sbisname="ololo3"]';
				
                actions.waitForElementToShow(this.poop, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

			.capture('open_editor', function (actions) {
                actions.click(this.item1);
				actions.mouseMove(this.input);
            })
    });

	gemini.suite('group', function (test) {

        test.setUrl('/regression_edit_at_place_presto_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.poop = '[sbisname="poop"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.item1 = '[sbisname="ololo2"]';
				this.item2 = '[sbisname="ololo3"]';
				
                actions.waitForElementToShow(this.poop, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

			.capture('open_editor', function (actions) {
                actions.click(this.item1);
				actions.mouseMove(this.input);
            })

            .capture('disabled', function (actions) {
                actions.click(this.input);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('poop').setEnabled(false)
                });
            })
    });

	gemini.suite('with_panel', function (test) {

        test.setUrl('/regression_edit_at_place_presto_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.poop = '[sbisname="poop"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.item1 = '[sbisname="ololo2"]';
				this.item2 = '[sbisname="ololo3"]';
				this.ok = '.controls-EditAtPlace__okButton';
				this.cancel = '.controls-EditAtPlace__cancel';
				
                actions.waitForElementToShow(this.poop, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

			.capture('open_editor', function (actions) {
                actions.click(this.item1);
				actions.waitForElementToShow(this.ok, 5000);
				actions.waitForElementToShow(this.cancel, 5000);
				actions.mouseMove(this.input);
            })
    });
	
	gemini.suite('with_tabs', function (test) {

        test.setUrl('/regression_edit_at_place_presto_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.poop = '[sbisname="TabControl"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.fam = '.controls-TabButtons__leftContainer [sbisname="fam"]';
				this.name_inp = '[sbisname="EditName"] input';
				this.fam_inp = '[sbisname="EditFam"] input';
				this.ot_inp = '[sbisname="EditSon"] input';
				
                actions.waitForElementToShow(this.poop, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

			.capture('open_editor', function (actions) {
                actions.click(this.fam);
				actions.waitForElementToShow(this.fam_inp, 5000);
				actions.waitForElementToShow(this.ot_inp, 5000);
				actions.sendKeys(this.fam_inp, '123456789');
				actions.sendKeys(this.fam_inp, gemini.TAB);
				actions.sendKeys(this.name_inp, '123456789');
				actions.sendKeys(this.name_inp, gemini.TAB);
				actions.sendKeys(this.ot_inp, '123456789');
				actions.sendKeys(this.ot_inp, gemini.CONTROL+gemini.SHIFT+gemini.ARROW_LEFT);
				actions.mouseMove(this.fam_inp);
            })
			
			.capture('validation_error', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('EditName').markControl();
                });
            })
    });

	gemini.suite('with_tabs_date_range', function (test) {

        test.setUrl('/regression_edit_at_place_presto_5.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.poop = '[sbisname="TabControl"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.fam = '.controls-TabButtons__leftContainer [sbisname="fam"]';
				this.name_inp = '[sbisname="EditName"] input';
				this.fam_inp = '[sbisname="EditFam"] input';
				this.ot_inp = '[sbisname="EditSon"] input';
				
                actions.waitForElementToShow(this.poop, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

			.capture('open_editor', function (actions) {
                actions.click(this.fam);
				actions.waitForElementToShow(this.fam_inp, 5000);
				actions.waitForElementToShow(this.ot_inp, 5000);
				actions.sendKeys(this.fam_inp, '123456789');
				actions.sendKeys(this.fam_inp, gemini.TAB);
				actions.sendKeys(this.name_inp, '123456789');
				actions.sendKeys(this.name_inp, gemini.TAB);
				actions.sendKeys(this.ot_inp, '123456789');
				actions.sendKeys(this.ot_inp, gemini.CONTROL+gemini.SHIFT+gemini.ARROW_LEFT);
				actions.mouseMove(this.fam_inp);
            })
			
			.capture('validation_error', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('drange').markControl();
                });
            })
    });
});