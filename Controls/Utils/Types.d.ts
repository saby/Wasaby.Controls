/**
 * Exclude non-optional properties from T.
 */
export type OptionalProperties<T> = Exclude<{
   [K in keyof T]: T extends Record<K, T[K]>
      ? never
      : K
}[keyof T], undefined>;

/**
 * Construct a type with only optional properties of T.
 */
export type PickOptionalProperties<T> = Required<Pick<T, OptionalProperties<T>>>;

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
