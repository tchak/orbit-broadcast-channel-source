import {
  Source,
  Pushable,
  Syncable,
  pullable,
  pushable,
  syncable,
  Transform,
  TransformOrOperations,
  SourceSettings
} from '@orbit/data';
import BroadcastChannel from 'broadcast-channel';

export interface BroadcastChannelSourceSettings extends SourceSettings {
  channel?: string;
}

@pullable
@pushable
@syncable
export default class BroadcastChannelSource extends Source
  implements Pushable, Syncable {
  channel: BroadcastChannel<Transform>;
  protected _channelName: string;

  // Pushable interface stubs
  push: (
    transformOrOperations: TransformOrOperations,
    options?: object,
    id?: string
  ) => Promise<Transform[]>;

  // Syncable interface stubs
  sync: (transformOrTransforms: Transform | Transform[]) => Promise<void>;

  constructor(settings: BroadcastChannelSourceSettings = {}) {
    super(settings);
    this._channelName = settings.channel || 'orbit';
  }

  /////////////////////////////////////////////////////////////////////////////
  // Pushable interface implementation
  /////////////////////////////////////////////////////////////////////////////
  async _push(transform: Transform): Promise<Transform[]> {
    if (!this.transformLog.contains(transform.id)) {
      await this.channel.postMessage(transform);
      await this.transformed([transform]);
      return [transform];
    }
    return [];
  }

  /////////////////////////////////////////////////////////////////////////////
  // Syncable interface implementation
  /////////////////////////////////////////////////////////////////////////////

  async _sync(transform: Transform): Promise<void> {
    if (!this.transformLog.contains(transform.id)) {
      await this.channel.postMessage(transform);
      await this.transformed([transform]);
    }
  }

  async _activate(): Promise<void> {
    await super._activate();
    this.channel = new BroadcastChannel<Transform>(this._channelName, {
      webWorkerSupport: true
    });
    this.channel.addEventListener('message', (transform: Transform): void => {
      this.sync(transform);
    });
  }

  async deactivate(): Promise<void> {
    await this.channel.close();
    await super.deactivate();
  }
}
