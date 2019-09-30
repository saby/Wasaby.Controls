const
    reDateMaskChars: RegExp = /[YMD]+/,
    reTimeMaskChars: RegExp = /[Hms]+/;

export const DATE_MASK_TYPE = 'date';
export const TIME_MASK_TYPE = 'time';
export const DATE_TIME_MASK_TYPE = 'datetime';

/**
 * Get the type of displayed data: date / time / date and time.
 * @returns (String) Data type ('date' || 'time' || 'datetime').
 */
export function getMaskType(mask: string): string {
  if (reDateMaskChars.test(mask)) {
     if (reTimeMaskChars.test(mask)) {
        return DATE_TIME_MASK_TYPE;
     }
     return DATE_MASK_TYPE;
  }
  if (reTimeMaskChars.test(mask)) {
     return TIME_MASK_TYPE;
  }
}
