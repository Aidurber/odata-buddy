import { OData, KeyedCollection, ToCase } from './types'
import { buildSelect } from './select'
import { buildOrderBy } from './order-by'
import { buildFilter } from './filter'
import { convertToCase } from './utils'

/**
 * Build expansion query, this is a recursive method
 *
 * @export
 * @template T
 * @param {(keyof T | KeyedCollection<any, OData<any>>)} expansion
 * @returns
 */
export function buildExpansion<T>(
	expansion: keyof T | KeyedCollection<any, OData<any>>,
	casing: ToCase
) {
	const queries: string[] = []

	if (typeof expansion === 'string') {
		queries.push(`$expand=${convertToCase(expansion, casing)}`)
	} else {
		const expansionQueries = Object.keys(expansion as OData<any>).map(
			key =>
				`$expand=${convertToCase(key, casing)}(${buildOdataQuery<any>(
					(<any>expansion)[key] as OData<any>,
					casing,
					true
				)})`
		)
		queries.push(expansionQueries.join(';'))
	}

	return queries
}

export function buildOdataQuery<T>(
	schema: OData<T>,
	casing: ToCase = 'as-is',
	expanding: boolean = false
) {
	let queries: string[] = []
	if (schema.select) {
		queries.push(buildSelect(schema.select, casing))
	}
	if (schema.orderBy) {
		queries.push(buildOrderBy(schema.orderBy, casing))
	}
	if (schema.filter) {
		queries.push(`$filter=${buildFilter<T>(schema.filter, casing).join(',')}`)
	}
	if (schema.top) {
		queries.push(`$top=${schema.top}`)
	}
	if (schema.skip) {
		queries.push(`$skip=${schema.skip}`)
	}
	if (schema.expand) {
		queries = [...queries, ...buildExpansion<T>(schema.expand, casing)]
	}
	// If expanding is true it means that we have recursed and inside an expansion query, we need to join by semi-colons not ampersands
	const joinCharacter = expanding ? ';' : '&'
	return queries.join(joinCharacter)
}
