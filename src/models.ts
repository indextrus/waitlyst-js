import {ErrorPublishableKeyRequired} from "./exceptions";
import {EventManager} from "./events";

export class Waitlyst {
    public publishableKey: string;
    public eventManager: EventManager | undefined;

    constructor(publishableKey: string) {
        /* Throw error if publishable key is not provided */
        if (!publishableKey) {
            throw new ErrorPublishableKeyRequired(
                "You must provide a Publishable key"
            );
        }
        this.publishableKey = publishableKey;
        this.initialize();
    }

    private initialize() {
        this.eventManager = new EventManager(this.publishableKey);
    }

    public identify(id: string, traits: any) {
        return this.eventManager?.identify(id, traits);
    }

    public track(event: string, properties: any) {
        return this.eventManager?.track(event, properties);
    }

    public page(properties: any) {
        return this.eventManager?.page(properties);
    }
}
