import { JSDOM } from "jsdom";

// Explicitly declare the global window object
declare global {
  namespace NodeJS {
    interface Global {
      document: Document;
      window: Window;
      navigator: Navigator;
      localStorage: Storage;
      HTMLElement: HTMLElement;
      HTMLDivElement: HTMLDivElement;
      Element: Element;
      isTest: boolean;
    }
  }
}

export class MockHandler {
  private html: string;

  constructor(html: string) {
    this.html = html;
  }

  updateHtml() {
    const { window } = new JSDOM(this.html, {
      url: "http://localhost/",
    });
    global.document = window.document;
    global.document.cookie = "devicePixelRatio=1; path=/";
    global.window = window.window;
    global.localStorage = window.localStorage;
    global.sessionStorage = window.sessionStorage;
    global.HTMLElement = window.HTMLElement;
    global.HTMLDivElement = window.HTMLDivElement;
    global.navigator = window.navigator;
    global.Element = window.Element;
    global.window.devicePixelRatio = window.devicePixelRatio;
    global.devicePixelRatio = window.devicePixelRatio;
    global.isTest = true;
    return global;
  }
}
