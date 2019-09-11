import { OData, KeyedCollection } from './types'
import { buildSelect } from './select'
import { buildOrderBy } from './order-by'
import { buildFilter } from './filter'

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

export function buildOdataQuery<T>(
	schema: OData<T>,
	expanding: boolean = false
) {
	let queries: string[] = []
	if (schema.select) {
		queries.push(buildSelect(schema.select))
	}
	if (schema.orderBy) {
		queries.push(buildOrderBy(schema.orderBy))
	}
	if (schema.filter) {
		queries.push(`$filter=${buildFilter<T>(schema.filter).join(',')}`)
	}
	if (schema.top) {
		queries.push(`$top=${schema.top}`)
	}
	if (schema.skip) {
		queries.push(`$skip=${schema.skip}`)
	}
	if (schema.expand) {
		queries = [...queries, ...buildExpansion<T>(schema.expand)]
	}
	// If expanding is true it means that we have recursed and inside an expansion query, we need to join by semi-colons not ampersands
	const joinCharacter = expanding ? ';' : '&'
	return queries.join(joinCharacter)
}