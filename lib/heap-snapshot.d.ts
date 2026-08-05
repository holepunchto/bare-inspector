import { Readable } from 'bare-stream'
import Session from './session'

interface InspectorHeapSnapshot extends Readable {}

declare class InspectorHeapSnapshot {
  /**
   * @param session - The connected `Session` to take the snapshot over.
   */
  constructor(session: Session)
}

export = InspectorHeapSnapshot
