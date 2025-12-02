const binding = require('../binding')

module.exports = class InspectorConsole {
  constructor() {
    for (const method of Object.keys(binding.console)) {
      this[method] = binding.console[method]
    }
  }

  _bind(console) {
    function proxyMethod(consoleMethodA, consoleMethodB, ...args) {
      consoleMethodA.call(this, ...args)
      consoleMethodB.call(this, ...args)
    }

    for (const method of Object.keys(binding.console)) {
      if (method in console) {
        console[method] = proxyMethod.bind(console, console[method], this[method])
      } else {
        console[method] = this[method]
      }
    }
  }
}
