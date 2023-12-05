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
