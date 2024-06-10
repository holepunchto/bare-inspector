/* global Bare */
const url = require('bare-url')
const ws = require('bare-ws')
const http = require('bare-http1')
const Session = require('./session')

module.exports = class InspectorServer {
  constructor (port, host) {
    this._server = new ws.Server({
      server: new http.Server(this._onrequest.bind(this)).listen({ port, host })
    })

    this._server.on('connection', this._onconnection.bind(this))
  }

  address () {
    return this._server.address()
  }

  close (cb) {
    return this._server.close(cb)
  }

  _onrequest (req, res) {
    if (req.url === '/json/list') return this._onlist(req, res)

    res.writeHead(404)
    res.end()
  }

  _onconnection (socket) {
    const session = new Session()

    session
      .on('inspectorNotification', onnotification)
      .connect()

    socket
      .on('close', onclose)
      .on('data', ondata)

    function onnotification (message) {
      socket.write(JSON.stringify(message))
    }

    function onclose () {
      session.destroy()
    }

    function ondata (data) {
      const { id, method, params } = JSON.parse(data)

      session.post(method, params, (err, result) => {
        const response = err ? { id, error: err } : { id, result }

        socket.write(JSON.stringify(response))
      })
    }
  }

  _onlist (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' })

    const { address, port } = this._server.address()

    res.end(JSON.stringify([
      {
        title: `bare[${Bare.pid}]`,
        id: `${Bare.pid}`,
        type: 'node',
        url: url.pathToFileURL(require.main.path),
        devtoolsFrontendUrl: `devtools://devtools/bundled/js_app.html?ws=${address}:${port}`,
        webSocketDebuggerUrl: `ws://${address}:${port}`,
        faviconUrl: 'https://holepunch.to/favicon.ico'
      }
    ]))
  }
}
