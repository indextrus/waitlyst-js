/*
 * Handles all Waitlyst package related files
 */

export class PackageHandler {
  public static FEEDBACK = {
    id: "waitlyst-feedback-widget",
    path: "https://cdn.waitlyst.co/sdk/widget.js",
    type: "js",
  };

  private urls = [PackageHandler.FEEDBACK];

  public static createScript(id: string, src: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.id = id;
      script.addEventListener("load", resolve);
      script.addEventListener("error", (e) => reject(e.error));
      document.head.appendChild(script);
    });
  }

  /*
   * Checks to see if script is already loaded
   */
  public static fileExists(id: string): boolean {
    return document.getElementById(id) !== null;
  }
}
