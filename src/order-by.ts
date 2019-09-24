import { KeyedCollection, ODataSort, ToCase } from './types'
import { convertToCase } from './utils'

/**
 * Build order by query
 *
 * @export
 * @template T
 * @param {KeyedCollection<T, ODataSort>} orderBy
 * @returns
 */
export function buildOrderBy<T>(
	orderBy: KeyedCollection<T, ODataSort>,
	casing: ToCase
) {
	const orderByKeys = Object.keys(orderBy).map(
		(key: string) => `${convertToCase(key, casing)} ${orderBy![key as keyof T]}`
	)

	return `$orderby=${orderByKeys}`
}
