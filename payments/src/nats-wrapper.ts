import nats, { Stan, StanOptions } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  connect = (clusterID: string, clientID: string, opts?: StanOptions): Promise<void> => {
    this._client = nats.connect(clusterID, clientID, { url: opts?.url });
    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => reject(err));
    });
  };
  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._client;
  }
}
export const natsWrapper = new NatsWrapper();
