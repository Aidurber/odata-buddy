# OData Buddy 🤘

OData Buddy is a utility for generating type-safe OData URLs. It's built in TypeScript so first-class TypeScript support is guaranteed.

**Note**
This probably isn't production ready and doesn't cover advanced OData usage.

## Installation

Install the package from NPM

**NPM**

```bash
npm install odata-buddy
```

**Yarn**

```bash
yarn add odata-buddy
```

## Usage

We'll be using this simple model for the following usage demo.

```typescript
// An example model
interface SimpleModel {
	id: number
	name: string
}
```

### Select

Select is an array of fields from the given model that you would like to select.

```typescript
import { buildOdataQuery } from 'odata-buddy'

const odataUrl = buildOdataQuery<SimpleModel>({
	select: ['id', 'name']
}) // => $select=id,name
```

### Order by

Order by is dictionary of properties from the given model, in this case the `name`, and the value is an `ODataSort` (imported alongside buildOdataQuery)

```typescript
import { buildOdataQuery, ODataSort } from 'odata-buddy'

const odataUrl = buildOdataQuery<SimpleModel>({
	orderBy: { name: ODataSort.Ascending }
}) // $orderBy=name asc
```

### Filter

Filter is a dictionary that takes an object with the operator and the value for the filter.

```typescript
import { buildOdataQuery, ODataOperator } from 'odata-buddy'

const odataUrl = buildOdataQuery<SimpleModel>({
	filter: { id: { operator: ODataOperator.Equals, value: 10 } }
}) // $filter=id eq 10
```

#### Supported filter operators

- Equals
- Not Equals
- Not
- Greater Than
- Greater Than or Equal To
- Less Than
- Less Than or Equal To
- And
- Or

#### Using conditional operators (And/Or)

```typescript
buildOdataQuery<SimpleModel>({
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
}) // => $filter=id gt 10 and name eq test or id lt 20
```

### Top

Using top

```typescript
buildOdataQuery<SimpleModel>({
	top: 10
}) // => $top=10
```

### Skip

Using skip

```typescript
buildOdataQuery<SimpleModel>({
	skip: 10
}) // => $skip=10
```

### Expands

Expands is a little more complicated

You can do a simple expansion

```typescript
const result = buildOdataQuery<SimpleModel>({
	expand: 'address'
}) // => $expand=address
```

Or if you have a more complicated model such as an AddressModel. The expand object offers the same support as the top level odata query such as selecting, filtering, top, skip etc.

```typescript
interface AddressModel {
	line1: string
	line2: string
}

interface SimpleModel {
	id: number
	name: string
	address: AddressModel
}
//...
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
}) // => $expand=address($select=line1;$filter=line2 eq test)
```

### Combining

Of course you can use combine as many as you want

```typescript
const result = buildOdataQuery<SimpleModel>({
	select: ['id', 'name'],
	orderBy: { name: ODataSort.Ascending }
	// filter, expand, top, skip
})
```

Type safety breaks down in nested objects, I couldn't figure out how to do a recursive `keyof T` 😅

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
