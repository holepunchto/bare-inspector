/** Options for `dir()`: `colors`, `depth`, and `showHidden`, matching `util.inspect()`'s options of the same names. */
interface DirOptions {
  colors?: number
  depth?: number
  showHidden?: boolean
}

/** A console implementation that sends messages to the V8 inspector's remote console, mirroring Node's `inspector.console`. Each method matches its `console` counterpart (`log`, `error`, `warn`, `dir`, `table`, `time`/`timeEnd`, `group`/`groupEnd`, `count`, `trace`, etc.). */
declare class InspectorConsole {
  /**
   * @param data - The values to log.
   */
  debug(...data: unknown[]): void
  /**
   * @param data - The values to log.
   */
  error(...data: unknown[]): void
  /**
   * @param data - The values to log.
   */
  info(...data: unknown[]): void
  /**
   * @param data - The values to log.
   */
  log(...data: unknown[]): void
  /**
   * @param data - The values to log.
   */
  warn(...data: unknown[]): void

  /**
   * @param condition - The value to test; the assertion logs only when it is falsy.
   * @param data - The values to log when `condition` is falsy.
   */
  assert(condition: unknown, ...data: unknown[]): void
  clear(): void
  /**
   * @param label - The label of the counter.
   */
  count(label?: string): void
  /**
   * @param label - The label of the counter to reset.
   */
  countReset(label?: string): void
  /**
   * @param object - The object to inspect.
   * @param opts - Inspection options: `colors`, `depth`, and `showHidden`.
   */
  dir(object: unknown, opts?: DirOptions): void
  /**
   * @param data - The values to log.
   */
  dirxml(...data: unknown[]): void
  /**
   * @param data - The values to log as the group heading.
   */
  group(...data: unknown[]): void
  /**
   * @param data - The values to log as the group heading.
   */
  groupCollapsed(...data: unknown[]): void
  groupEnd(): void
  /**
   * @param data - The tabular data to display.
   * @param props - The property names to include as columns.
   */
  table(data: unknown, props?: string[]): void
  /**
   * @param label - The label of the timer.
   */
  time(label?: string): void
  /**
   * @param label - The label of the timer to stop.
   */
  timeEnd(label?: string): void
  /**
   * @param label - The label of the timer.
   * @param data - Additional values to log alongside the elapsed time.
   */
  timeLog(label?: string, ...data: unknown[]): void
  /**
   * @param data - The values to log with the stack trace.
   */
  trace(...data: unknown[]): void

  /**
   * @param label - The label of the profile.
   */
  profile(label?: string): void
  /**
   * @param label - The label of the profile to stop.
   */
  profileEnd(label?: string): void
  /**
   * @param label - The label of the timestamp marker.
   */
  timeStamp(label?: string): void
}

declare namespace InspectorConsole {
  export { type DirOptions }
}

export = InspectorConsole
