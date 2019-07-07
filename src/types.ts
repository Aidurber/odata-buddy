import { Filter } from './filter'

export enum ODataSort {
	Ascending = 'asc',
	Descending = 'desc'
}
export enum ODataOperator {
	Equals = 'eq',
	NotEquals = 'neq',
	GreaterThan = 'gt',
	GreaterThanOrEqual = 'ge',
	LessThan = 'lt',
	LessThanOrEqual = 'le',
	Not = 'not',
	In = 'in'
}

/**
 * Type for a collection of keys on the given model
 */
export type ValueKeys<T> = Array<keyof T>
/**
 * Dictionary using keys from the model and the value TValue
 */
export type KeyedCollection<TObj, TValue> = {
	[key in keyof Partial<TObj>]: TValue
}

export interface OData<T = any> {
	select?: ValueKeys<T>
	orderBy?: KeyedCollection<T, ODataSort>
	filter?: KeyedCollection<T, Filter<T>>
	top?: number
	skip?: number
	expand?: keyof T | KeyedCollection<any, OData<any>>
}
