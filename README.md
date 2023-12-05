# bare-inspector

V8 inspector support for Bare.

```
npm i bare-inspector
```

## Usage

``` js
const inspector = require('bare-inspector')

try {
  const session = new inspector.Session()
  session.connect()

  const { result } = await session.post('Runtime.evaluate', { expression: '1 + 2' })

  console.log(result)
} catch (err) {
  console.error(err)
}
```

## License

Apache-2.0
