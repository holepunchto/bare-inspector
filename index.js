const EventEmitter = require('bare-events')
const binding = require('./binding')

exports.Session = class Session extends EventEmitter {
  constructor () {
    super()

    this._nextId = 1
    this._requests = new Map()

    this._handle = binding.create(this, this._onresponse)
  }

  _onresponse (string) {
    const message = JSON.parse(string)

    if (message.method) {
      this.emit('inspectorNotification', message)
      this.emit(message.method, message)
    } else {
      const req = this._requests.get(message.id)

      if (req) {
        this._requests.delete(message.id)

        let err = null

        if (message.error) {
          err = new Error(message.error.message)
          err.code = message.error.code
        }

        req.callback(err, message.result)
      }
    }
  }

  connect () {
    binding.connect(this._handle)
  }

  post (method, params, callback) {
    if (typeof params === 'function') {
      callback = params
      params = null
    }

    let result

    if (typeof callback !== 'function') {
      result = new Promise((resolve, reject) => {
        callback = (err, result) => {
          if (err) reject(err)
          else resolve(result)
        }
      })
    }

    const id = this._nextId++

    const req = {
      id,
      callback
    }

    this._requests.set(id, req)

    binding.post(this._handle, JSON.stringify({
      id,
      method,
      params
    }))

    return result
  }
}
