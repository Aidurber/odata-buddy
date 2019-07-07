import { ODataOperator, ODataSort } from './types'

/**
 * Filter type
 *
 * @interface Filter
 * @template T
 */
interface Filter<T> {
	operator: ODataOperator
	value: string | number | boolean | Filter<T>
	and?: LogicalFilter<T>
	or?: LogicalFilter<T>
	top?: number
	skip?: number
}

/**
 * Logical filter type has additional fields
 *
 * @interface LogicalFilter
 * @extends {Filter<T>}
 * @template T
 */
interface LogicalFilter<T> extends Filter<T> {
	property: keyof T
}

interface OData<T = any> {
	select?: ValueKeys<T>
	orderBy?: KeyedCollection<T, ODataSort>
	filter?: KeyedCollection<T, Filter<T>>
	top?: number
	skip?: number
	expand?: keyof T | KeyedCollection<any, OData<any>>
}

/**
 * Type for a collection of keys on the given model
 */
type ValueKeys<T> = Array<keyof T>
/**
 * Dictionary using keys from the model and the value TValue
 */
type KeyedCollection<TObj, TValue> = { [key in keyof Partial<TObj>]: TValue }

export function buildOdataQuery<T>(
	schema: OData<T>,
	expanding: boolean = false
) {
	const queries: string[] = []
	if (schema.select) {
		queries.push(`$select=${schema.select.join(',')}`)
	}

	if (schema.orderBy) {
		const orderBy = Object.keys(schema.orderBy).map(
			(key: string) => `${key} ${schema.orderBy![key as keyof T]}`
		)
		queries.push(`$orderBy=${orderBy}`)
	}

	if (schema.filter) {
		const filters = buildFilter<T>(schema.filter)
		queries.push(`$filter=${filters.join(',')}`)
	}

	if (schema.top) {
		queries.push(`$top=${schema.top}`)
	}
	if (schema.skip) {
		queries.push(`$skip=${schema.skip}`)
	}

	if (schema.expand) {
		if (typeof schema.expand === 'string') {
			queries.push(`$expand=${schema.expand}`)
		} else {
			const expansionQueries = Object.keys(schema.expand as OData<any>).map(
				key =>
					`$expand=${key}(${buildOdataQuery<any>(
						(<any>schema.expand)[key] as OData<any>,
						true
					)})`
			)
			queries.push(expansionQueries.join(';'))
		}
	}
	const joinCharacter = expanding ? ';' : '&'
	return queries.join(joinCharacter)
}

function buildFilter<T>(filter: KeyedCollection<T, Filter<T>>): string[] {
	const filters: string[] = []
	for (let key in filter) {
		if (!filter.hasOwnProperty(key)) {
			continue
		}
		const value = filter[key]

		// Work recursively
		if (value.value.hasOwnProperty('operator')) {
			filters.concat(buildFilter<T>(value.value as any))
			continue
		}

		let filterValue = `${key} ${value.operator} ${value.value}`

		if (value.and) {
			filterValue += buildLogicalFilter('and', value.and)
		}

		if (value.or) {
			filterValue += buildLogicalFilter('or', value.or)
		}

		filters.push(filterValue)
	}

	return filters
}

function buildLogicalFilter<T>(
	operator: 'and' | 'or',
	filter: LogicalFilter<T>
): string {
	let value: string[] = []

	value.push(
		` ${operator} ${filter.property} ${filter.operator} ${filter.value}`
	)

	if (filter.and) {
		value.push(buildLogicalFilter<T>('and', filter.and).trim())
	}
	if (filter.or) {
		value.push(buildLogicalFilter<T>('or', filter.or).trim())
	}
	return value.join(' ')
}
