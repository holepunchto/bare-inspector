/* eslint-disable no-debugger */
const test = require('brittle')
const inspector = require('.')
const HeapSnapshot = require('./lib/heap-snapshot')

test('basic', async (t) => {
  const session = new inspector.Session()

  session.connect()

  const { result } = await session.post('Runtime.evaluate', { expression: '1 + 2' })

  t.alike(result, {
    type: 'number',
    value: 3,
    description: '3'
  })

  session.destroy()
})

test('pause', async (t) => {
  const session = new inspector.Session()

  session.connect()

  await session.post('Debugger.enable')

  let paused = false

  session.on('Debugger.paused', () => { paused = true })

  debugger

  t.ok(paused)

  session.destroy()
})

test('pause with handler', async (t) => {
  const session = new inspector.Session(() => {
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

test('heap snapshot', async (t) => {
  const session = new inspector.Session()

  session.connect()

  const snapshot = new HeapSnapshot(session)

  for await (const chunk of snapshot) {
    t.ok(chunk)
  }
})
