import EventEmitter, { EventMap } from 'bare-events'

/** An inspector protocol notification: the `method` name and its `params`. */
interface SessionMessage {
  method: string
  params: Record<string, unknown>
}

/**
 * The events a `Session` emits: `inspectorNotification` for every inspector notification, and one
 * event per inspector protocol method name (for example `'Debugger.paused'`) carrying the same
 * message.
 */
interface InspectorSessionEvents extends EventMap {
  inspectorNotification: [message: SessionMessage]
  [method: string]: [message: SessionMessage]
}

interface InspectorSession<
  M extends InspectorSessionEvents = InspectorSessionEvents
> extends EventEmitter<M> {
  /** Whether the session is connected and not destroyed. */
  readonly connected: boolean
  /** Whether the session has been destroyed. */
  readonly destroyed: boolean

  /**
   * Connects the session to the inspector back-end, enabling `post()` to send messages. A no-op if
   * already connected or destroyed.
   */
  connect(): void

  /**
   * Posts `method` (with optional `params`) to the inspector back-end. Resolves or calls `cb` with
   * the result, or with an `Error` if the inspector returns one.
   */
  post<T extends unknown = unknown>(method: string, cb: (err: Error, result: T) => void): Promise<T>

  post<T extends unknown = unknown>(
    method: string,
    params?: Record<string, unknown>,
    cb?: (err: Error, result: T) => void
  ): Promise<T>

  /**
   * Destroys the session, releasing its inspector back-end handle. A no-op if already destroyed.
   */
  destroy(): void
}

declare class InspectorSession {
  /**
   * @param onpaused - Called whenever the debugger pauses; return `true` to keep the pause, or a
   * falsy value to resume immediately (the default resumes).
   */
  constructor(onpaused?: () => boolean)
}

/**
 * Dispatches messages to the V8 inspector back-end and receives responses and notifications,
 * mirroring Node's `inspector.Session`. `onpaused` is called whenever the debugger pauses; return
 * `true` to keep the pause, or a falsy value to resume immediately.
 */
declare namespace InspectorSession {
  export { type SessionMessage, type InspectorSessionEvents }
}

export = InspectorSession
