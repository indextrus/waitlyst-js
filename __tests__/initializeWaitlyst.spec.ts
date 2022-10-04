import { Waitlyst } from "../src";
import { MockHandler } from "../__mocks__/clientWithData";

describe("Initializing waitlyst", () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  it("should initialize waitlyst", () => {
    const publishableKey = "pk_test_12345";
    const waitlyst = new Waitlyst(publishableKey);
    expect(waitlyst).toBeDefined();
    expect(waitlyst.publishableKey).toEqual(publishableKey);
    expect(waitlyst.elements).toBeDefined();
    expect(waitlyst.elements.list().length).toEqual(0);
  });

  it("Should return a list of elements", () => {
    // Set new mock data
    const html =
      "<html lang='en'><body><div data-waitlyst='feedback'></div><div data-waitlyst='feedback'></div><div data-waitlyst='feedback'></div></body></html>";
    const mockHandler = new MockHandler(html);
    mockHandler.updateHtml();

    // Initialize waitlyst
    const publishableKey = "pk_test_12345";
    const waitlyst = new Waitlyst(publishableKey);

    // Gets elements
    expect(waitlyst.elements.list().length).toEqual(3);
  });
});
