import { buildOdataQuery } from '../build-query'
import { ODataSort, ODataOperator } from '../types'

interface SimpleModel {
	id: number
	name: string
	address: AddressModel
}
interface UppercaseSimpleModel {
	Id: number
	Name: string
	Address: AddressModel
}
interface AddressModel {
	line1: string
	line2: string
}

describe('OData', () => {
	it('should build select', () => {
		const result = buildOdataQuery<SimpleModel>({
			select: ['id', 'name']
		})
		expect(result).toEqual('$select=id,name')
	})
	it('should build orderBy', () => {
		const result = buildOdataQuery<SimpleModel>({
			orderBy: { id: ODataSort.Descending, name: ODataSort.Ascending }
		})

		expect(result).toEqual('$orderby=id desc,name asc')
	})

	it('should build filter equals', () => {
		const result = buildOdataQuery<SimpleModel>({
			filter: { id: { operator: ODataOperator.Equals, value: 10 } }
		})

		expect(result).toEqual('$filter=id eq 10')
	})
	it('should build filter equals case insensitive', () => {
		const result = buildOdataQuery<UppercaseSimpleModel>({
			filter: { Id: { operator: ODataOperator.Equals, value: 10 } }
		})

		expect(result).toEqual('$filter=Id eq 10')
	})
	it('should build filter greater than', () => {
		const result = buildOdataQuery<SimpleModel>({
			filter: { id: { operator: ODataOperator.GreaterThan, value: 10 } }
		})

		expect(result).toEqual('$filter=id gt 10')
	})
	it('should build filter less than', () => {
		const result = buildOdataQuery<SimpleModel>({
			filter: { id: { operator: ODataOperator.LessThan, value: 10 } }
		})

		expect(result).toEqual('$filter=id lt 10')
	})
	it('should build filter less than or equal', () => {
		const result = buildOdataQuery<SimpleModel>({
			filter: { id: { operator: ODataOperator.LessThanOrEqual, value: 10 } }
		})

		expect(result).toEqual('$filter=id le 10')
	})
	it('should build filter greater than or equal', () => {
		const result = buildOdataQuery<SimpleModel>({
			filter: { id: { operator: ODataOperator.GreaterThanOrEqual, value: 10 } }
		})

		expect(result).toEqual('$filter=id ge 10')
	})
	it('should build filter not equals', () => {
		const result = buildOdataQuery<SimpleModel>({
			filter: { id: { operator: ODataOperator.NotEquals, value: 10 } }
		})

		expect(result).toEqual('$filter=id neq 10')
	})
	it('should build filter not equals', () => {
		const result = buildOdataQuery<SimpleModel>({
			filter: { id: { operator: ODataOperator.Not, value: 10 } }
		})

		expect(result).toEqual('$filter=id not 10')
	})
	it('should build filter not', () => {
		const result = buildOdataQuery<SimpleModel>({
			filter: { id: { operator: ODataOperator.Not, value: true } }
		})

		expect(result).toEqual('$filter=id not true')
	})
	it('should build filter nested', () => {
		const result = buildOdataQuery<SimpleModel>({
			filter: {
				id: {
					operator: ODataOperator.GreaterThan,
					value: 10,
					and: {
						property: 'name',
						operator: ODataOperator.Equals,
						value: 'test',
						or: {
							property: 'id',
							operator: ODataOperator.LessThan,
							value: 20
						}
					}
				}
			}
		})

		expect(result).toEqual('$filter=id gt 10 and name eq test or id lt 20')
	})
	it('should take top', () => {
		const result = buildOdataQuery<SimpleModel>({
			top: 10
		})

		expect(result).toEqual('$top=10')
	})
	it('should skip', () => {
		const result = buildOdataQuery<SimpleModel>({
			skip: 10
		})

		expect(result).toEqual('$skip=10')
	})

	it('should expand simple', () => {
		const result = buildOdataQuery<SimpleModel>({
			expand: 'address'
		})

		expect(result).toEqual('$expand=address')
	})
	it('should expand complex', () => {
		const result = buildOdataQuery<SimpleModel>({
			expand: {
				address: {
					select: ['line1'],
					filter: {
						line2: {
							operator: ODataOperator.Equals,
							value: 'test'
						}
					}
				}
			}
		})

		expect(result).toEqual('$expand=address($select=line1;$filter=line2 eq test)')
	})
	it('should chain', () => {
		const result = buildOdataQuery<SimpleModel>({
			select: ['id', 'name'],
			orderBy: { id: ODataSort.Descending, name: ODataSort.Ascending }
		})

		expect(result).toEqual('$select=id,name&$orderby=id desc,name asc')
	})

	describe('Casing', () => {
		interface CamelCaseModel {
			userId: number
			userName: string
			payload: {
				id: number
			}
		}
		interface TitleCaseModel {
			UserId: number
			UserName: string
			Payload: {
				Id: number
			}
		}

		it('should change the correct case', () => {
			const camelResult = buildOdataQuery<TitleCaseModel>(
				{
					select: ['UserId', 'UserName'],
					orderBy: {
						UserName: ODataSort.Descending
					},
					expand: 'UserId',
					filter: {
						UserId: {
							operator: ODataOperator.Equals,
							value: true
						}
					}
				},
				'camel'
			)
			expect(camelResult).toEqual(
				'$select=userId,userName&$orderby=userName desc&$filter=userId eq true&$expand=userId'
			)
			const titleResult = buildOdataQuery<CamelCaseModel>(
				{
					select: ['userId', 'userName'],
					orderBy: {
						userName: ODataSort.Descending
					},
					expand: 'userId',
					filter: {
						userId: {
							operator: ODataOperator.Equals,
							value: true
						}
					}
				},
				'pascal'
			)
			expect(titleResult).toEqual(
				'$select=UserId,UserName&$orderby=UserName desc&$filter=UserId eq true&$expand=UserId'
			)
		})
		it('should change the advanced expansion case', () => {
			const camelResult = buildOdataQuery<TitleCaseModel>(
				{
					expand: {
						Payload: {
							select: ['Id']
						}
					}
				},
				'camel'
			)
			expect(camelResult).toEqual('$expand=payload($select=id)')
			const titleResult = buildOdataQuery<CamelCaseModel>(
				{
					expand: {
						payload: {
							select: ['id']
						}
					}
				},
				'pascal'
			)
			expect(titleResult).toEqual('$expand=Payload($select=Id)')
		})
	})
})
