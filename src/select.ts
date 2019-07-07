import { ValueKeys } from './types'

/**
 * Build select query
 *
 * @export
 * @template T
 * @param {ValueKeys<T>} select
 * @returns
 */
export function buildSelect<T>(select: ValueKeys<T>) {
	return `$select=${select.join(',')}`
}
