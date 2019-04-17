import {decimalSplitters} from 'Controls/_input/Number/constant';

export interface IParsedNumber {
    negative: number;
    integer: string;
    fractional: string;
}

export function parse(value: string): IParsedNumber {
    const tokens: string[] = lexicalValidate(value);
    const validValue: string = syntaxValidate(tokens);

    return calcParts(validValue);
}

function lexicalValidate(value: string): string[] {
    const matchingValues: string[] | null = value.match(validValues);

    return matchingValues === null ? [] : matchingValues;
}

/**
 * <Minus>|<Digits_sequence>|<Decimal_splitter>
 */
const validValues: RegExp = new RegExp(`^-|[0-9]+|[${decimalSplitters}]`, 'g');

function syntaxValidate(value: string[]): string {
    let foundFirstSplitter: boolean = false;

    return value.filter((item) => {
        if (decimalSplitters.includes(item)) {
            if (!foundFirstSplitter) {
                foundFirstSplitter = true;

                return true;
            }

            return false;
        }

        return true;
    }).join('');
}

function calcParts(value: string): IParsedNumber {
    const splitterPosition: number = calcSplitterPosition(value);

    const negative: number = +(value[0] === '-');
    const integer: string = value.substring(negative, splitterPosition);
    const fractional: string = value.substring(splitterPosition + 1);

    return {negative, integer, fractional};
}

function calcSplitterPosition(value: string): number {
    let position: number;

    for (let i = 0; i < decimalSplitters.length; i++) {
        const splitter = decimalSplitters[0];

        position = value.indexOf(splitter);

        if (position !== -1) {
            return position;
        }
    }

    return value.length;
}
