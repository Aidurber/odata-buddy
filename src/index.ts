interface OData<T = any> {
	select?: Array<keyof T>
}

interface Model {
	name: string
	id: number
}

export enum ODdataSort {
	Ascending = 'asc',
	Descending = 'desc'
}

export class ODataQuery<T> {
	private model: OData<T> = {}
	public select(values: Array<keyof T> = []) {
		this.model.select = values

		return this
	}

	public execute(): string {
		let result: string = ''
		if (this.model.select) {
			result += `$select=${this.model.select.join(',')}`
		}
		return result
	}
}

const query = new ODataQuery<Model>().select(['id', 'name'])

const result = query.select(['name']).execute()
