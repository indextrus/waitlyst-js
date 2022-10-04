import { v4 as uuidv4 } from "uuid";
import {ElementData, ElementType} from "./types";
import {DocumentNotFoundError, ElementDoesNotExist, MissingElementParams} from "./exceptions";
import {createPopper} from "@popperjs/core";
import {PackageHandler} from "./package";
import {EventManager} from "./events";

export class ElementManager {
    packageHandler: PackageHandler;
    publishableKey: string;
    public eventManager: EventManager | undefined;

    constructor(publishableKey: string) {
        this.publishableKey = publishableKey;
        this.packageHandler = new PackageHandler();
    }


    private elements: Element[] = [];

    public setEventManager(eventManager: EventManager) {
        this.eventManager = eventManager;
    }

    public addElement(element: Element): void {
        this.elements.push(element);
    }

    public get(id: string, silent = false): Element {
        const element = this.elements.find((element) => element.id === id);
        if (!element) {
            throw new ElementDoesNotExist(
                `An element with this ID does not exist: ${id}`,
                silent
            );
        }
        return element;
    }

    public open(id: string) {
        const elem = this.get(id);
        elem.open();
    }

    public close(id: string) {
        const elem = this.get(id);
        elem.close();
    }

    public list(): Element[] {
        return this.elements;
    }
}

export class Element {
    PARAMS: string[] = ["type", "index", "id"];
    public type: ElementType;
    public index: number;
    public id: string;
    public containerId: string;
    public visible = false;
    private popper: any;
    private parent: ElementManager;

    constructor(manager: ElementManager, args: ElementData) {
        this.validateArgs(args);
        this.id = args.id;
        this.index = args.index;
        this.type = args.type;
        this.containerId = `${this.id}-${this.index}`;
        this.parent = manager;
        this.initialize();
    }

    private initialize() {
        const mainElement = document.getElementById(this.id);
        if (!mainElement) {
            return;
        }
        document.addEventListener("mousedown", (event) => {
            this.close();
            event.stopPropagation();
        });

        mainElement.addEventListener("mousedown", (event) => {
            const elems = this.parent.list().filter((elem) => elem.id !== this.id);
            elems.forEach((elem) => {
                elem.close();
            });
            this.toggle();
            event.stopPropagation();
        });

        const containerElement = document.createElement("div");
        containerElement.id = this.containerId;
        containerElement.innerHTML = `<div class='wt-loading-card'><div class='spinner' id='${this.containerId}-spinner'></div></div>`;
        containerElement.style.opacity = "hidden";
        containerElement.classList.add("wt-container");
        containerElement.addEventListener("mousedown", (event) => {
            event.stopPropagation();
        });
        const mainElementContainer = document.createElement("div");
        mainElementContainer.appendChild(containerElement);
        mainElementContainer.style.position = "absolute";
        mainElementContainer.style.pointerEvents = "none";
        mainElement.insertAdjacentElement("afterend", mainElementContainer);
        const virtualElement = {
            getBoundingClientRect: function () {
                return mainElement.getBoundingClientRect();
            },
        };
        this.popper = createPopper(virtualElement, mainElementContainer, {
            placement: "auto",
            modifiers: [
                {
                    name: "offset",
                    options: {
                        offset: [20, 20],
                    },
                },
            ],
        });
        return;
    }

    private toggle() {
        if (this.visible) {
            this.close();
        } else {
            this.popper.update();
            this.open();
        }
    }

    public open() {
        if (this.visible) {
            return;
        }
        const elem = document.getElementById(this.containerId);
        if (elem) {
            if (PackageHandler.fileExists(PackageHandler.FEEDBACK.id)) {
                this.loadWidget(elem);
            } else {
                PackageHandler.createScript(
                    PackageHandler.FEEDBACK.id,
                    PackageHandler.FEEDBACK.path
                )
                    .then(() => {
                        this.loadWidget(elem);
                    })
                    .catch((error: any) => {
                        console.error(error);
                    });
            }
        }
    }

    public loadWidget(elem: HTMLElement) {
        const widget = document.createElement("waitlyst-widget");
        const publishableKey = this.parent.publishableKey;
        if (publishableKey) {
            widget.setAttribute("publishable-key", publishableKey);
        }
        if (this.parent.eventManager?.events.user()) {
            const email = this.parent.eventManager.events.user('traits.email');
            if (email) {
                widget.setAttribute("default-email", email);
            }
        }
        elem.classList.add("opened");
        setTimeout(() => {
            elem.innerHTML = widget.outerHTML;
            this.visible = true;
        }, 300);
    }

    public close() {
        if (!this.visible) {
            return;
        }
        const elem = document.getElementById(this.containerId);
        if (elem) {
            elem.classList.remove("opened");
            this.visible = false;
            setTimeout(() => {
                elem.innerHTML = `<div class='wt-loading-card'><div class='spinner' id='${this.containerId}-spinner'></div></div>`;
            }, 200);
        }
    }

    /**
     * Validates the argument provided.
     */
    private validateArgs(args: object) {
        for (const param of this.PARAMS) {
            if (!Object.prototype.hasOwnProperty.call(args, param)) {
                throw new MissingElementParams(`Missing argument: ${param}`);
            }
        }
    }
}
