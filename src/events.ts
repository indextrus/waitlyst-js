import Analytics, { PageData } from "analytics";
import { template } from "./template";
import { AnalyticsEvent } from "./types";
import axios from "axios";
import { ErrorEventRequired, ErrorUserIdRequired } from "./exceptions";

export class EventManager {
  public endpoint: string;
  public url: string;
  private isTest: boolean;
  public override: boolean | undefined;

  public events = Analytics({
    app: "waitlyst",
    version: "1.0.0",
  });

  constructor(private publishableKey: string, isTest = false) {
    this.publishableKey = publishableKey;
    this.isTest = isTest;

    if (isTest) {
      this.endpoint = "http://localhost:8000";
    } else {
      this.endpoint = "https://api.waitlyst.co";
    }
    this.url = `${this.endpoint}/v1/events/process/`;
  }

  /* Constructs a payload in the appropriate format */
  public constructPayload(e: AnalyticsEvent) {
    const state = this.events.getState();
    const payload = Object.assign({}, template);
    const translate = {
      trackEnd: "track",
      pageEnd: "page",
      identifyEnd: "identify",
      alias: "alias",
      screen: "screen",
      group: "group",
    };
    payload.anonymousId = e.payload.anonymousId;
    payload.context = state.context;
    payload.context.page = state.page.last.properties;
    payload.messageId = e.payload.meta.rid;
    payload.receivedAt = new Date(e.payload.meta.ts).toISOString();
    payload.sentAt = new Date(e.payload.meta.ts).toISOString();
    payload.timestamp = new Date(e.payload.meta.ts).toISOString();
    payload.type = translate[e.payload.type];
    payload.userId = e.payload.userId;

    /* If it's a track event, add the event name & properties */
    if (e.payload.type === "trackEnd") {
      payload.event = e.payload.event;
      payload.properties = e.payload.properties;
    }

    /* If it's an identify event, add the traits */
    if (e.payload.type === "identifyEnd") {
      payload.traits = e.payload.traits;
    }

    /* If it's a page event, add the properties */
    if (e.payload.type === "pageEnd") {
      payload.properties = e.payload.properties;
    }

    /* If it's a group event, add the traits */
    if (e.payload.type === "group") {
      payload.traits = e.payload.traits;
      payload.groupId = e.payload.groupId;
    }

    /* If it's a screen event, add the name & properties */
    if (e.payload.type === "screen") {
      payload.name = e.payload.event;
      payload.properties = e.payload.properties;
    }

    /* If it's an alias event, add the previousId */
    if (e.payload.type === "alias") {
      payload.previousId = e.payload.previousId;
    }

    return payload;
  }

  public identify(id: string, traits: any): Promise<any> {
    if (!id) {
      throw new ErrorUserIdRequired("You must provide an id");
    }
    return this.events.identify(id, traits).then((res) => {
      const payload = this.constructPayload(res);
      return this.process(payload);
    });
  }

  public track(event: string, properties: any): Promise<any> {
    if (!event) {
      throw new ErrorEventRequired("You must provide an event name");
    }
    return this.events.track(event, properties).then((res: AnalyticsEvent) => {
      const payload = this.constructPayload(res);
      return this.process(payload);
    });
  }

  public page(properties: PageData): Promise<any> {
    return this.events.page(properties).then((res) => {
      const payload = this.constructPayload(res);
      return this.process(payload);
    });
  }

  public group(groupId: string, traits: any): Promise<any> {
    return this.events.track(groupId, traits).then((res: AnalyticsEvent) => {
      res.payload.type = "group";
      res.payload.groupId = groupId;
      const payload = this.constructPayload(res);
      return this.process(payload);
    });
  }

  public alias(newId: string): Promise<any> {
    const previousId = this.events.getState().user.userId;
    return this.events.identify(newId).then((res: AnalyticsEvent) => {
      res.payload.type = "alias";
      res.payload.previousId = previousId;
      res.payload.userId = newId;
      const payload = this.constructPayload(res);
      return this.process(payload);
    });
  }

  public screen(name: string, properties: any): Promise<any> {
    return this.events.track(name, properties).then((res: AnalyticsEvent) => {
      res.payload.type = "screen";
      const payload = this.constructPayload(res);
      return this.process(payload);
    });
  }

  public process(data: any) {
    if (this.override) {
      return Promise.resolve(data);
    }
    return axios.post(this.url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.publishableKey}`,
      },
    });
  }
}
