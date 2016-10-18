/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.TabButtons Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_tab_buttons_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('#buttons', 40000);
                this.tab3 = find('[data-id="3"]');
                this.tab4 = find('[data-id="4"]');
                this.add1 = find('.controls-TabButton__additionalText1');
                this.add2 = find('.controls-TabButton__additionalText2');
            })

            .capture('plain')

            .capture('hovered_tab', function (actions) {
                actions.mouseMove(this.tab3);
            })
			
			.capture('hovered_tab_with_add_text', function (actions) {
                actions.mouseMove(this.tab4);
            })

            .capture('hovered_add_text_1', function (actions) {
                actions.click(this.tab4);
                actions.mouseMove(this.add1);
            })

            .capture('hovered_add_text_2', function (actions) {
                actions.mouseMove(this.add2);
            })

            .capture('checked', function (actions) {
                actions.click(this.tab3);
            })
    });
	
	gemini.suite('with_main_tab', function (test) {

        test.setUrl('/regression_tab_buttons_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('#buttons', 40000);
                this.tab3 = find('[data-id="3"]');
                this.tab4 = find('[data-id="4"]');
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TabButton 1').setEnabled(true);
                });
            })

            .capture('plain')

            .capture('hovered_tab', function (actions) {
                actions.mouseMove(this.tab3);
            })

            .capture('checked', function (actions) {
                actions.click(this.tab3);
            })
    });
	
	gemini.suite('with_main_tab_and_left_align', function (test) {

        test.setUrl('/regression_tab_buttons_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('#buttons', 40000);
                this.tab3 = find('[data-id="3"]');
                this.tab4 = find('[data-id="4"]');
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TabButton 1').setEnabled(true);
                });
            })

            .capture('plain')

            .capture('hovered_tab', function (actions) {
                actions.mouseMove(this.tab3);
            })

            .capture('checked', function (actions) {
                actions.click(this.tab3);
            })
    });

    gemini.suite('left_align', function (test) {

        test.setUrl('/regression_tab_buttons_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('#buttons', 40000);
                this.tab3 = find('[data-id="3"]');
                this.tab4 = find('[data-id="4"]');
            })

            .capture('plain')

            .capture('hovered_tab', function (actions) {
                actions.mouseMove(this.tab3);
            })

            .capture('checked', function (actions) {
                actions.click(this.tab3);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_tab_buttons_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('#buttons', 40000);
                this.tab3 = find('[data-id="3"]')
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TabButton 1').setEnabled(false);
                });
				actions.wait(500);
            })

            .capture('plain')

            .capture('hovered_tab', function (actions) {
                actions.mouseMove(this.tab3);
            })
    });
	
	gemini.suite('disabled_with_main_tab', function (test) {

        test.setUrl('/regression_tab_buttons_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('#buttons', 40000);
                this.tab3 = find('[data-id="3"]')
				actions.wait(500);
            })

            .capture('plain')

            .capture('hovered_tab', function (actions) {
                actions.mouseMove(this.tab3);
            })
    });
	
	gemini.suite('disabled_with_main_tab_and_left_align', function (test) {

        test.setUrl('/regression_tab_buttons_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('#buttons', 40000);
                this.tab3 = find('[data-id="3"]')
				actions.wait(500);
            })

            .capture('plain')

            .capture('hovered_tab', function (actions) {
                actions.mouseMove(this.tab3);
            })
    });
	
	gemini.suite('with_menu_link', function (test) {

        test.setUrl('/regression_tab_buttons_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('#buttons', 40000);
                this.tab3 = find('[data-id="3"]');
                this.tab4 = find('[data-id="4"]');
				this.menu = find('[sbisname="MenuLink 1"]');
				actions.click(this.tab4);
				actions.mouseMove(this.tab3);
            })

            .capture('plain')
			
			.capture('hovered_menu_link', function (actions) {
				actions.mouseMove(this.menu);
            })
			
			.capture('opened_menu_link', function (actions) {
				actions.click(this.menu);
            })
    });
	
	gemini.suite('with_add_text_and_left_align', function (test) {

        test.setUrl('/regression_tab_buttons_online_6.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('#buttons', 40000);
                this.tab3 = find('[data-id="3"]');
                this.tab4 = find('[data-id="4"]');
                this.add1 = find('.controls-TabButton__additionalText1');
                this.add2 = find('.controls-TabButton__additionalText2');
            })

			.capture('hovered_add_text_1', function (actions) {
                actions.mouseMove(this.add1);
            })

            .capture('hovered_add_text_2', function (actions) {
                actions.mouseMove(this.add2);
            })
	});
});*/