import { assert } from 'chai';

/**
 * Проверяет строку css классов на эквивалентность.
 * @param actual
 * @param expected
 * @param message
 */
function isClassesEqual(actual: string, expected: string, message?: string): void {
    assert.isString(actual, 'Argument "actual" must be a string!');
    assert.isString(expected, 'Argument "expected" must be a string!');

    const classesToArray = (classes: string) => classes.trim().split(' ').filter((className) => className.trim() !== '');

    const actualClasses: string[] = classesToArray(actual);
    const expectedClasses: string[] = classesToArray(expected);
    const failingClasses = [];

    expectedClasses.forEach((className) => {
        if (actualClasses.indexOf(className) === -1) {
            failingClasses.push(className)
        }
    });
    assert.isTrue(failingClasses.length === 0, `${message}. Missing classes: ${failingClasses.join(', ')}.`);
}

function hasNoClasses(actualClasses: string, missingClasses: string, message: string = ''): void {
    assert.isString(actualClasses, 'Argument "actualClasses" must be a string!');
    assert.isString(missingClasses, 'Argument "missingClasses" must be a string!');

    const classesToArray = (classes: string) => classes.trim().split(' ').filter((className) => className.trim() !== '');

    const actualClassesArr: string[] = classesToArray(actualClasses);
    const missingClassesArr: string[] = classesToArray(missingClasses);
    const existingClasses = [];

    missingClassesArr.forEach((className) => {
        if (actualClassesArr.indexOf(className) !== -1) {
            existingClasses.push(className);
        }
    });

    assert.isTrue(existingClasses.length === 0, `Existing classes: ${existingClasses.join(', ')}. ${message}`);
}
export {
    isClassesEqual,
    hasNoClasses
}
