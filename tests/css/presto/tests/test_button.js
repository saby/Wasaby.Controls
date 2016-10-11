gemini.suite('SBIS3.CONTROLS.Button Presto', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_button_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('filled_base', function (test) {

        test.setUrl('/regression_button_presto_12.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .capture('disabled', function (actions) {
                actions.mouseUp(this.button);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_base', function (test) {

        test.setUrl('/regression_button_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
				actions.click(this.input);
            })
    });

    gemini.suite('big_base', function (test) {

        test.setUrl('/regression_button_presto_5.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('filled_big_base', function (test) {

        test.setUrl('/regression_button_presto_13.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .capture('disabled', function (actions) {
                actions.mouseUp(this.button);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_big_base', function (test) {

        test.setUrl('/regression_button_presto_5.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
				actions.click(this.input);
            })
    });

    gemini.suite('with_icon16', function (test) {

        test.setUrl('/regression_button_presto_3.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('primary_with_icon16', function (test) {

        test.setUrl('/regression_button_presto_3.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
				actions.click(this.input);
            })
    });

    gemini.suite('big_with_icon16', function (test) {

        test.setUrl('/regression_button_presto_7.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('primary_big_with_icon16', function (test) {

        test.setUrl('/regression_button_presto_7.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
				actions.click(this.input);
            })
    });

    gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_button_presto_4.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .capture('disabled', function (actions) {
                actions.mouseUp(this.button);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_with_icon24', function (test) {

        test.setUrl('/regression_button_presto_4.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
				actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .capture('disabled', function (actions) {
                actions.mouseUp(this.button);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('big_with_icon24', function (test) {

        test.setUrl('/regression_button_presto_8.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .capture('disabled', function (actions) {
                actions.mouseUp(this.button);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('primary_big_with_icon24', function (test) {

        test.setUrl('/regression_button_presto_8.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
				actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.button);
            })

            .capture('disabled', function (actions) {
                actions.mouseUp(this.button);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered', function (actions) {
                actions.mouseMove(this.button);
            })
    });

    gemini.suite('with_empty_caption', function (test) {

        test.setUrl('/regression_button_presto_2.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })
    });

    gemini.suite('primary_with_empty_caption', function (test) {

        test.setUrl('/regression_button_presto_2.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
				actions.click(this.input);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setEnabled(false);
                });
            })
    });

    gemini.suite('ellipsis', function (test) {

        test.setUrl('/regression_button_presto_9.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('primary_ellipsis', function (test) {

        test.setUrl('/regression_button_presto_9.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
				actions.click(this.input);
            })
    });

    gemini.suite('big_ellipsis', function (test) {

        test.setUrl('/regression_button_presto_11.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('primary_big_ellipsis', function (test) {

        test.setUrl('/regression_button_presto_11.html').setCaptureElements('[sbisname="Button 1"]')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);
                });
				actions.click(this.input);
            })
    });
});