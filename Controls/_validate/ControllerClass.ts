import {Logger} from 'UI/Utils';
import {default as ValidateContainer, IValidateConfig} from 'Controls/_validate/Container';

interface IValidateResult {
    [key: number]: boolean;
    hasErrors?: boolean;
}

/**
 * Класс, регулирующий валидацию формы.
 * @class Controls/_validate/ControllerClass
 * @extends Core/Control
 * @public
 * @author Красильников А.С.
 */

class ControllerClass {
    _validates: ValidateContainer[] = [];

    addValidator(control: ValidateContainer): void {
        this._validates.push(control);
    }

    removeValidator(control: ValidateContainer): void {
        this._validates = this._validates.filter((validate) => {
            return validate !== control;
        });
    }

    submit(): Promise<IValidateResult | Error> {
        const validatePromises = [];

        // The infobox should be displayed on the first not valid field.
        this._validates.reverse();
        const config: IValidateConfig = {
            hideInfoBox: true
        };
        this._validates.forEach((validate: ValidateContainer) => {
            if (!(validate._options && validate._options.readOnly)) {
                validatePromises.push(validate.validate(config));
            }
        });

        const resultPromise = Promise.all(validatePromises);

        return resultPromise.then((results: IValidateResult) => {
            let key: string;
            let needValid: ValidateContainer;
            let resultCounter: number = 0;

            // Walking through object with errors and focusing first not valid field.
            for (key in this._validates) {
                if (this._validates.hasOwnProperty(key) && !this._validates[key]._options.readOnly) {
                    if (results[resultCounter]) {
                        needValid = this._validates[key];
                    }
                    resultCounter++;
                }
            }
            if (!!needValid) {
                results.hasErrors = true;
                this._activateValidator(needValid);
            }
            this._validates.reverse();
            return results;
        }).catch((e: Error) => {
            Logger.error('Form: Submit error', this, e);
            return e;
        });
    }

    setValidationResult(): void {
        this._validates.forEach((validate: ValidateContainer) => {
            validate.setValidationResult(null);
        });
    }

    getValidationResult(): IValidateResult {
        const results: IValidateResult = {};
        let i: number = 0;
        this._validates.forEach((validate: ValidateContainer) => {
            results[i++] = validate.isValid();
        });
        return results;
    }

    isValid(): boolean {
        for (const item in this._validates) {
            if (!this._validates[item].isValid()) {
                return false;
            }
        }
        return true;
    }

    destroy(): void {
        this._validates = null;
    }

    private _activateValidator(control: ValidateContainer): void {
        control.activate({enableScrollToElement: true});
    }
}

export default ControllerClass;
