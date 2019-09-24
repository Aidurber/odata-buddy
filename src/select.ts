import { ValueKeys, ToCase } from './types'
import { convertToCase } from './utils'

/**
 * Build select query
 *
 * @export
 * @template T
 * @param {ValueKeys<T>} select
 * @returns
 */
export function buildSelect<T>(select: ValueKeys<T>, casing: ToCase) {
	const values = convertToCase(select as string[], casing) as string[]
	return `$select=${values.join(',')}`
}
