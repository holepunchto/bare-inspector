const EventEmitter = require('bare-events')
const url = require('bare-url')
const ws = require('bare-ws')
const http = require('bare-http1')
const Session = require('./session')

module.exports = class InspectorServer extends EventEmitter {
  constructor(port, host, opts = {}) {
    if (typeof port === 'object' && port !== null) {
      opts = port
      port = 0
      host = 'localhost'
    } else if (typeof host === 'object' && host !== null) {
      opts = host
      host = 'localhost'
    }

    const { path = require.main.path } = opts

    super()

    this._path = typeof path === 'string' ? url.pathToFileURL(path) : path
    this._connections = new Set()
    this._replay = []

    this._session = new Session()
    this._session.on('inspectorNotification', this._onnotification.bind(this)).connect()
    this._session.post('Debugger.enable')

    this._server = new ws.Server(
      {
        server: new http.Server(this._onrequest.bind(this)).listen(
          { port, host },
          this._onlistening.bind(this)
        )
      },
      this._onconnection.bind(this)
    )
  }

  get listening() {
    return this._server.listening
  }

  address() {
    return this._server.address()
  }

  close(cb) {
    for (const connection of this._connections) connection.destroy()

    this._session.destroy()
    this._server.close(cb)

    return this
  }

  ref() {
    this._server.ref()

    return this
  }

  unref() {
    this._server.unref()

    return this
  }

  _onnotification(message) {
    if (message.method === 'Debugger.scriptParsed') {
      this._replay.push(message)
    }
  }

  _onlistening() {
    this.emit('listening')
  }

  _onrequest(req, res) {
    if (req.url === '/json/list') return this._onlist(req, res)

    res.writeHead(404)
    res.end()
  }

  _onconnection(socket) {
    new InspectorConnection(this, socket)
  }

  _onlist(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' })

    const { address, port } = this.address()

    res.end(
      JSON.stringify([
        {
          title: `bare[${Bare.pid}]`,
          id: `${Bare.pid}`,
          type: 'node',
          url: this._path,
          devtoolsFrontendUrl: `devtools://devtools/bundled/js_app.html?ws=${address}:${port}`,
          webSocketDebuggerUrl: `ws://${address}:${port}`,
          faviconUrl: 'https://holepunch.to/favicon.ico'
        }
      ])
    )
  }
}

class InspectorConnection {
  constructor(server, socket) {
    this._server = server
    this._server._connections.add(this)

    this._socket = socket
    this._socket.on('close', this._onclose.bind(this)).on('data', this._ondata.bind(this))

    this._session = new Session()
    this._session.on('inspectorNotification', this._onnotification.bind(this)).connect()

    for (const message of this._server._replay) {
      this._onnotification(message)
    }
  }

  destroy() {
    this._socket.destroy()
  }

  _onnotification(message) {
    this._socket.write(JSON.stringify(message))
  }

  _onclose() {
    this._session.destroy()

    this._server._connections.delete(this)
  }

  _ondata(data) {
    const { id, method, params } = JSON.parse(data)

    this._session.post(method, params, (err, result) => {
      const response = err ? { id, error: err } : { id, result }

      this._socket.write(JSON.stringify(response))
    })
  }
}
