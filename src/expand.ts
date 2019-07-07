import { KeyedCollection, OData } from './types'
import { buildOdataQuery } from './index'
/**
 * Build expansion query, this is a recursive method
 *
 * @export
 * @template T
 * @param {(keyof T | KeyedCollection<any, OData<any>>)} expansion
 * @returns
 */
export function buildExpansion<T>(
	expansion: keyof T | KeyedCollection<any, OData<any>>
) {
	const queries: string[] = []

	if (typeof expansion === 'string') {
		queries.push(`$expand=${expansion}`)
	} else {
		const expansionQueries = Object.keys(expansion as OData<any>).map(
			key =>
				`$expand=${key}(${buildOdataQuery<any>(
					(<any>expansion)[key] as OData<any>,
					true
				)})`
		)
		queries.push(expansionQueries.join(';'))
	}

	return queries
}
