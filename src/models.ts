import {DocumentNotFoundError, ElementDoesNotExist, ErrorPublishableKeyRequired} from "./exceptions";
import {EventManager} from "./events";
import {Element, ElementManager} from "./elements";
import { styles } from "./styles";
import {v4 as uuidv4} from "uuid";
import {ElementData, ElementType} from "./types";

export class Waitlyst {
    public publishableKey: string;
    public isTest: boolean;
    public elements: ElementManager;
    public eventManager: EventManager;


    constructor(publishableKey: string, isTest = false) {
        /* Throw error if publishable key is not provided */
        if (!publishableKey) {
            throw new ErrorPublishableKeyRequired(
                "You must provide a Publishable key"
            );
        }
        this.isTest = isTest;
        this.publishableKey = publishableKey;
        this.elements = new ElementManager(this.publishableKey);
        this.eventManager = new EventManager(this.publishableKey, this.isTest);
        this.initialize();
    }

    /* Generate initial set of elements */
    private generateElements() {
        if (!document) {
            throw new DocumentNotFoundError("Document not found");
        }
        const elements = document.querySelectorAll(
            "[data-waitlyst=feedback]"
        );
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            let elementId = element.id;
            if (!elementId) {
                elementId = uuidv4();
                element.id = elementId;
            }
            // If there is another element available then skip this;
            const container = document.getElementById(`${elementId}-0`);
            if (container) {
                continue;
            }
            try {
                // Check if element already exists
                this.elements.get(elementId, true);
            } catch (e) {
                if (e instanceof ElementDoesNotExist) {
                    const data: ElementData = {
                        id: elementId,
                        index: i,
                        type: ElementType.FEEDBACK,
                    };
                    this.elements.addElement(new Element(this.elements, data));
                }
            }
        }
    }



    /*
     * Creates base styles for elements
     */
    private static addStyle(styling: string) {
        const style = document.createElement("style");
        style.textContent = styling;
        document.head.append(style);
    }

    /* Load analytics and widget modules */
    private initialize() {
        /* Enable events */

        /* Enable widgets */
        this.elements.setEventManager(this.eventManager);
        this.generateElements();

        /* Apply styles */
        Waitlyst.addStyle(styles);
    }

    /* Retrieve identity */
    public getIdentity() {
        return this.eventManager.events.user();
    }

    /* Identify a user - returns a Promise */
    public identify(id: string, traits?: any): Promise<any> {
        return this.eventManager.identify(id, traits);
    }

    /* Track an event - returns a Promise */
    public track(event: string, properties?: any): Promise<any>{
        return this.eventManager.track(event, properties);
    }

    /* Page event - returns a Promise */
    public page(properties?: any): Promise<any> {
        return this.eventManager.page(properties);
    }
}
