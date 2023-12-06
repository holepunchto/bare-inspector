/* eslint-disable no-debugger */
const test = require('brittle')
const inspector = require('.')

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
