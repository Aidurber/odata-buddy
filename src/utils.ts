import * as humps from 'humps'
import { ToCase } from './types'

const conversionMap = {
	'as-is': (str: string) => str,
	camel: humps.camelize,
	pascal: humps.pascalize
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
