const test = require('brittle')
const Console = require('./lib/console')
const Session = require('./lib/session')
const HeapSnapshot = require('./lib/heap-snapshot')

test('basic', async (t) => {
  const session = new Session()

  session.connect()

  const { result } = await session.post('Runtime.evaluate', {
    expression: '1 + 2'
  })

  t.alike(result, {
    type: 'number',
    value: 3,
    description: '3'
  })

  session.destroy()
})

test('pause', async (t) => {
  const session = new Session()

  session.connect()

  await session.post('Debugger.enable')

  let paused = false

  session.on('Debugger.paused', () => {
    paused = true
  })

  debugger

  t.ok(paused)

  session.destroy()
})

test('pause with handler', async (t) => {
  const session = new Session(() => {
    if (paused) return false
    else {
      paused = true

      return true
    }
  })

  session.connect()

  await session.post('Debugger.enable')

  let paused = false

  debugger

  t.ok(paused)

  session.destroy()
})

test('console', async (t) => {
  t.plan(1)

  const console = new Console()
  const session = new Session()

  session.connect()

  await session.post('Console.enable')

  session.on('Console.messageAdded', (n) => {
    for (const [key, value] of Object.entries(n.params.message)) {
      t.comment(key + ':', value)
    }

    t.pass()
  })

  console.log('Hello world!')

  session.destroy()
})

test('heap snapshot', async (t) => {
  const session = new Session()

  session.connect()

  const snapshot = new HeapSnapshot(session)

  const chunks = []

  for await (const chunk of snapshot) {
    chunks.push(chunk)
  }

  t.ok(chunks.length > 0, 'yields at least one chunk')

  session.destroy()
})
