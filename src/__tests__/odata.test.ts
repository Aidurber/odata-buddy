import { ODataQuery } from '..'
import { ODdataSort } from '../index'

interface SimpleModel {
	id: number
	name: string
}

describe('OData', () => {
	it('should build select', () => {
		const result = new ODataQuery<SimpleModel>().select(['id', 'name']).execute()

		expect(result).toEqual('$select=id,name')
	})
	it('should build orderBy', () => {
		const result = new ODataQuery<SimpleModel>()
			.orderBy({
				id: ODdataSort.Descending,
				name: ODdataSort.Ascending
			})
			.execute()

		expect(result).toEqual('$select=id,name')
	})
})
