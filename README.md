# bare-inspector

V8 inspector support for Bare.

```
npm i bare-inspector
```

## Usage

```js
const { Session } = require('bare-inspector')

const session = new Session()
session.connect()

try {
  const { result } = await session.post('Runtime.evaluate', {
    expression: '1 + 2'
  })

  console.log(result)
} catch (err) {
  console.error(err)
}
```

### Heap snapshots

```js
const { Session, HeapSnapshot } = require('bare-inspector')
const fs = require('bare-fs')

const session = new Session()
session.connect()

const snapshot = new HeapSnapshot(session)

snapshot.pipe(fs.createWriteStream('profile.heapsnapshot'))
```

## API

See the [full API reference](https://docs.pears.com/reference/bare/modules/bare-inspector).

## License

Apache-2.0
