import { ToCase } from './types'
/**
 * Check if a given object is numeric
 * @param obj - Value
 */
const isNumerical = function(obj: any): boolean {
	obj = obj - 0
	return obj === obj
}
/**
 * Convert a string to camel case
 * @param str - Value
 */
const camelize = (str: string) => {
	if (isNumerical(str)) {
		return str
	}
	str = str.replace(/[\-_\s]+(.)?/g, function(match, chr) {
		return chr ? chr.toUpperCase() : ''
	})
	// Ensure 1st char is always lowercase
	return str.substr(0, 1).toLowerCase() + str.substr(1)
}
/**
 * Convert a given string to pascal case
 * @param str - Value
 */
const pascalize = (str: string) => {
	const camelized = camelize(str)
	// Ensure 1st char is always uppercase
	return camelized.substr(0, 1).toUpperCase() + camelized.substr(1)
}

const conversionMap = {
	'as-is': (str: string) => str,
	camel: camelize,
	pascal: pascalize
}

/**
 * Convert the casing of a string or a collection of strings
 *
 * @export
 * @param {(string | string[])} value
 * @param {ToCase} [casing='as-is']
 * @returns {(string | string[])}
 */
export function convertToCase(
	value: string | string[],
	casing: ToCase = 'as-is'
): string | string[] {
	const formatter = conversionMap[casing] || conversionMap['as-is']
	return Array.isArray(value) ? value.map(formatter) : formatter(value)
}
