/**
 * Extracts all Numbers for a certain key from an array of objects.
 * First creates an array of all values for that key, then converts
 * everything to a Number, subsequently filtering out all NaN values.
 *
 * Returns only an array with numbers. If array is not found or it somehow
 * would fail, it returns an array with [0] as default value.
 */
const safelyGetValuesForKey = (data: Array<{ [key: string]: any }>, key: string): number[] => {
  try {
    if (!data || !Array.isArray(data)) return [0];
    return data
      .map((dataObject) => dataObject[key])
      .map((val) => Number(val))
      .filter((val) => !Number.isNaN(val));
  } catch {
    return [0];
  }
};

/**
 * Gets the lowest value from specific keys within a data array.
 * The data array should be an array with objects. All arguments
 * after the first one are used as keys from the object, which are
 * used to get the lowest value based on all these keys.
 *
 * Eg: lowestValue([{val: 3, val: 5}], 'val') ==> 3
 */
export const lowestValue = (data: Array<{}>, ...keys: string[]) => {
  const defaultValue = 0;

  const values = keys.length ? keys.map((key) => safelyGetValuesForKey(data, key)) : [];
  const allValues = ([] as number[]).concat(...values);
  if (!allValues.length) return defaultValue;

  return Math.min(...allValues);
};

export const highestValue = (data: Array<{}>, ...keys: string[]) => {
  const defaultValue = 0;

  const values = keys.length ? keys.map((key) => safelyGetValuesForKey(data, key)) : [];
  const allValues = ([] as number[]).concat(...values);
  if (!allValues.length) return defaultValue;

  return Math.max(...allValues);
};

/**
 * Gets the highest and lowest value + 10% from specific keys within an array of data arrays (2 dimensional like multiline charts) or a data array (1 dimensional).
 * The data array should be an array with objects. All arguments
 * after the first one are used as keys from the object, which are
 * used to get the highest value based on all these keys.
 *
 * Eg: highestValueWithPadding([[{val: 3}], [{val:8}]], 'val') ==> 8
 * @param data An array of arrays of objects
 */
export const getMinMaxWithPadding = (data: Array<Array<{}>> | Array<{}>, ...keys: string[]) => {
  let array: Array<{}>;
  if (arrayIsTwoDimensional(data)) {
    // reduce the two dimensional array to a single dimensional array
    array = data.reduce((acc, curr) => [...acc, ...curr], [] as any[]);
  } else {
    array = data;
  }

  const highest = highestValue(array, ...keys);
  const lowest = lowestValue(array, ...keys);
  const difference = highest - lowest;
  let lowestWithPadding = lowest - difference / 10;
  if (lowest >= 0 && lowestWithPadding < 0) lowestWithPadding = 0;
  const highestWithPadding = highest + difference / 10;
  return { min: lowestWithPadding, max: highestWithPadding };
};

const arrayIsTwoDimensional = (arr: Array<Array<{}>> | Array<{}>): arr is Array<Array<{}>> => {
  return Array.isArray(arr?.[0]);
};
