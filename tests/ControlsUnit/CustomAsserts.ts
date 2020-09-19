import {assert, AssertionError} from 'chai';

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

function toStringArray(value: string | string[]): string[] {
    let array: string[];
    if (typeof value === 'string') {
        array = value.split(' ');
    } else if (value instanceof Array) {
        value.forEach((e) => {
            if (!(typeof e === 'string')) {
                throw Error('Classes array must contains only string values.');
            }
        });
        array = value;
    } else {
        throw Error('Argument must be must typeof string or Array of string.');
    }
    return array.filter((e) => e.trim().length > 0);
}

class CssClasses {
    static include(superset: string | string[], subset: string | string[], message?: string): void {
        const supersetArray = toStringArray(superset);
        const subsetArray = toStringArray(subset);
        try {
            assert.includeMembers(supersetArray, subsetArray);
        } catch (error) {
            const missed = subsetArray.filter((e) => supersetArray.indexOf(e) === -1);
            throw new AssertionError(`${error.message}. ` + (message ? `${message}. ` : '') +
                `\nMissed classes: ${CssClasses.toString(missed)}.`
            );
        }
    }

    static notInclude(superset: string | string[], subset: string | string[], message?: string): void {
        const supersetArray = toStringArray(superset);
        const subsetArray = toStringArray(subset);
        const contained = subsetArray.filter((e) => supersetArray.indexOf(e) !== -1);

        if (contained.length) {
            throw new AssertionError(
                `expected ${CssClasses.toString(supersetArray)} to have not the same members as ${CssClasses.toString(subsetArray)}. ` +
                (message ? `${message}.` : '') +
                `\nContained classes: ${CssClasses.toString(contained)}.`
            );
        }
    }

    static isSame(actual: string | string[], expected: string | string[], message?: string): void {
        const actualArray = toStringArray(actual);
        const expectedArray = toStringArray(expected);
        try {
            assert.sameMembers(actualArray, expectedArray);
        } catch (error) {
            const dA = CssClasses.toString(actualArray.filter((e) => expectedArray.indexOf(e) === -1));
            const dB = CssClasses.toString(expectedArray.filter((e) => actualArray.indexOf(e) === -1));
            throw new AssertionError(`${error.message}. ` + (message ? `${message}. ` : '') +
                `\nDiff in sets: ${dA} <-> ${dB}.`
            );
        }
    }

    private static toString(array: unknown[]): string {
        return '[ ' + array.map((e) => `'${e}'`).join(', ') + ']';
    }
}

export {
    hasNoClasses,
    CssClasses as CssClassesAssert
};
