import EventEmitter, { EventMap } from 'bare-events'
import { type TCPSocketAddress } from 'bare-tcp'
import URL from 'bare-url'

/** The events an inspector `Server` emits: `listening`, once the server starts listening. */
interface InspectorServerEvents extends EventMap {
  listening: []
}

/** Options for `Server`: `path`, the entry-point URL reported to DevTools as the URL of the inspected script. */
interface InspectorServerOptions {
  path: URL | string
}

interface InspectorServer<
  M extends InspectorServerEvents = InspectorServerEvents
> extends EventEmitter<M> {
  /** Whether the server is currently listening for connections. */
  readonly listening: boolean

  /** Returns the address the server is listening on. */
  address(): TCPSocketAddress
  /** Stops the server from accepting new connections, destroys existing connections and the underlying debugger session, and calls `cb` once closed. */
  close(cb?: (err?: Error | null) => void): this
  /** Marks the server so the event loop won't exit while it's listening. */
  ref(): this
  /** Unmarks the server so the event loop can exit even while it's listening. */
  unref(): this
}

declare class InspectorServer {
  /**
   * @param opts - Options; `path` is the script URL reported to DevTools and defaults to `require.main.path`.
   */
  constructor(opts: InspectorServerOptions)
  constructor(port: number, opts: InspectorServerOptions)
  constructor(port: number, host: string, opts?: InspectorServerOptions)
}

/** A WebSocket server exposing a `Session` for remote debugging, compatible with Chrome DevTools and mirroring the endpoints Node's `--inspect` exposes (`/json/list` and a WebSocket debugger URL). */
declare namespace InspectorServer {
  export { type InspectorServerEvents, type InspectorServerOptions }
}

export = InspectorServer
