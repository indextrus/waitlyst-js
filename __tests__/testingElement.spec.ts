import {Waitlyst} from "../src";
import {Element} from "../src/elements";
import {
    ElementDoesNotExist,
    ErrorDuplicateIDsNotAllowed,
} from "../src/exceptions";
import {MockHandler} from "../__mocks__/clientWithData";
import runAllTimers = jest.runAllTimers;


describe("Testing feedback elements", () => {
    beforeAll(() => {
        console.error = jest.fn();
        jest.useFakeTimers();
    });
    afterAll(() => {
        jest.useRealTimers();
    });
    it("Should be able to retrieve an element", () => {
        const elementId = "element-id";
        // Set new mock data
        const html =
            "<html lang='en'><body><div data-waitlyst='feedback' id='element-id'></div></body></html>";
        const mockHandler = new MockHandler(html);
        mockHandler.updateHtml();

        const publishableKey = "pk_test_12345";
        const waitlyst = new Waitlyst(publishableKey);

        expect(waitlyst.elements.list().length).toEqual(1);
        expect(waitlyst.elements.get(elementId)).toBeInstanceOf(Element);
    });

    it("Should raise an error when element does not exist", () => {
        const elementId = "element-id";
        // Set new mock data
        const html =
            "<html lang='en'><body><div data-waitlyst='feedback' id='invalid-id'></div></body></html>";
        const mockHandler = new MockHandler(html);
        mockHandler.updateHtml();

        // Initialize waitlyst
        const publishableKey = "pk_test_12345";
        const waitlyst = new Waitlyst(publishableKey, true);

        expect(waitlyst.elements.list().length).toEqual(1);
        expect(() => {
            waitlyst.elements.get(elementId);
        }).toThrowError(ElementDoesNotExist);
    });

    it("Should create a waitlyst-component container div", () => {
        const elementId = "element-id";
        // Set new mock data
        const html =
            "<html lang='en'><body><div data-waitlyst='feedback' id='element-id'></div></body></html>";
        const mockHandler = new MockHandler(html);
        mockHandler.updateHtml();

        // Initialize waitlyst
        const publishableKey = "pk_test_12345";
        const waitlyst = new Waitlyst(publishableKey);
        const element = waitlyst.elements.get(elementId);
        const container = document.getElementById(element.containerId);
        expect(container).toBeDefined();
    });

    it("Users can open and close an element manually", () => {
        const elementId = "feedback-element";
        // Set new mock data
        const html =
            "<html lang='en'><body><div data-waitlyst='feedback' id='feedback-element'></div></body></html>";
        const mockHandler = new MockHandler(html);
        mockHandler.updateHtml();

        // Initialize waitlyst
        const publishableKey = "pk_test_12345";
        const waitlyst = new Waitlyst(publishableKey);
        const element = waitlyst.elements.get(elementId);
        expect(element.visible).toBeFalsy();
        element.open();
        setTimeout(() => {
            expect(element.visible).toBeTruthy();
        }, 1000);
        element.close();
        expect(element.visible).toBeFalsy();
    });

    it("Test that widget.js is within DOM", () => {
        const elementId = "feedback-element";
        // Set new mock data
        const html =
            "<html lang='en'><body><div data-waitlyst='feedback' id='feedback-element'></div></body></html>";
        const mockHandler = new MockHandler(html);
        mockHandler.updateHtml();

        const publishableKey = "pk_test_12345";
        const waitlyst = new Waitlyst(publishableKey);
        expect(document.getElementById("waitlyst-feedback-widget")).toBeDefined();
    });

    it("Test that spinner is within unopen widget", () => {
        const elementId = "feedback-element";
        // Set new mock data
        const html =
            "<html lang='en'><body><div data-waitlyst='feedback' id='feedback-element'></div></body></html>";
        const mockHandler = new MockHandler(html);
        mockHandler.updateHtml();
        const publishableKey = "pk_test_12345";
        const waitlyst = new Waitlyst(publishableKey);
        const elem = waitlyst.elements.get("feedback-element");
        const spinner = document.getElementById(`${elem.containerId}-spinner`);
        expect(spinner).toBeTruthy();
    });

    it("Test that widget is visible when a user clicks open", () => {
        const elementId = "feedback-element";
        // Set new mock data
        const html =
            "<html lang='en'><body><div data-waitlyst='feedback' id='feedback-element'></div></body></html>";
        const mockHandler = new MockHandler(html);
        mockHandler.updateHtml();
        const publishableKey = "pk_test_12345";
        const waitlyst = new Waitlyst(publishableKey);
        const noElement = document.getElementsByTagName("waitlyst-widget")[0];
        expect(noElement).toBeFalsy();
        waitlyst.elements.open("feedback-element");
        setTimeout(() => {
            const element = document.getElementsByTagName("waitlyst-widget")[0];
            expect(element).toBeTruthy();
        }, 1000);
    });

    it("Test that user can identify a user", () => {
        const elementId = "feedback-element";
        // Set new mock data
        const html =
            "<html lang='en'><body><div data-waitlyst='feedback' id='feedback-element'></div></body></html>";
        const mockHandler = new MockHandler(html);
        mockHandler.updateHtml();
        const publishableKey = "pk_test_12345";
        const waitlyst = new Waitlyst(publishableKey, true)
        waitlyst.identify("user-id");
        setTimeout(() => {
            const identity = waitlyst.getIdentity();
            expect(identity["anonymousId"]).toBeDefined();
        }, 100);
    });

    it("Test that the right identity is added to waitlyst widget", () => {
        const elementId = "feedback-element";
        // Set new mock data
        const html =
            "<html lang='en'><body><div data-waitlyst='feedback' id='feedback-element'></div></body></html>";
        const mockHandler = new MockHandler(html);
        mockHandler.updateHtml();
        const publishableKey = "pk_test_12345";
        const waitlyst = new Waitlyst(publishableKey, true);
        waitlyst.identify("user-id", {
            email: 'test@example.com'
        });
        waitlyst.elements.open("feedback-element");
        setTimeout(() => {
            const elem = document.getElementsByTagName("waitlyst-widget")[0];
            expect(elem).toBeTruthy();
            const identity = waitlyst.getIdentity();
            expect(elem).toBeTruthy();
            expect(elem.getAttribute("publishable-key")).toEqual(
                waitlyst.publishableKey
            );
            expect(identity.traits).toBeTruthy();
            expect(identity.traits.email).toBeTruthy();
            expect(elem.getAttribute("default-email")).toEqual(identity.traits.email);
        }, 1000);
    });
});
