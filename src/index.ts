import { OData } from './types'
import { buildSelect } from './select'
import { buildOrderBy } from './order-by'
import { buildFilter } from './filter'
import { buildExpansion } from './expand'

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
