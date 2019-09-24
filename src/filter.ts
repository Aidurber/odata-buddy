import { KeyedCollection, ODataOperator, ToCase } from './types'
import { convertToCase } from './utils'

/**
 * Filter type
 *
 * @interface Filter
 * @template T
 */
export interface Filter<T> {
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
export interface LogicalFilter<T> extends Filter<T> {
	property: keyof T
}
/**
 * Build filter query
 *
 * @export
 * @template T
 * @param {KeyedCollection<T, Filter<T>>} filter
 * @returns {string[]}
 */
export function buildFilter<T>(
	filter: KeyedCollection<T, Filter<T>>,
	casing: ToCase
): string[] {
	const filters: string[] = []
	for (let key in filter) {
		if (!filter.hasOwnProperty(key)) {
			continue
		}
		const value = filter[key]

		// Work recursively
		if (value.value.hasOwnProperty('operator')) {
			filters.concat(buildFilter<T>(value.value as any, casing))
			continue
		}

		let filterValue = `${convertToCase(key, casing)} ${value.operator} ${
			value.value
		}`

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
