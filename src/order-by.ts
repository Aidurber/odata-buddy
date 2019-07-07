import { ValueKeys, KeyedCollection, ODataSort } from './types'

/**
 * Build order by query
 *
 * @export
 * @template T
 * @param {KeyedCollection<T, ODataSort>} orderBy
 * @returns
 */
export function buildOrderBy<T>(orderBy: KeyedCollection<T, ODataSort>) {
	const orderByKeys = Object.keys(orderBy).map(
		(key: string) => `${key} ${orderBy![key as keyof T]}`
	)

	return `$orderBy=${orderByKeys}`
}
