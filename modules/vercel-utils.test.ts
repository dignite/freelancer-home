import { getAbsoluteUrl } from "./vercel-utils";

describe("getAbsoluteUrl", () => {
  describe("browser: window is defined", () => {
    it("returns location.origin", () => {
      expect.assertions(1);
      // jsdom provides window.location.origin = "http://localhost"
      expect(getAbsoluteUrl()).toBe(window.location.origin);
    });
  });

  describe("server: window is undefined", () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(global, "window");

    beforeEach(() => {
      jest.resetModules();
      Object.defineProperty(global, "window", {
        value: undefined,
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      if (originalDescriptor) {
        Object.defineProperty(global, "window", originalDescriptor);
      }
      delete process.env.VERCEL_URL;
    });

    it("returns https URL using VERCEL_URL when set", () => {
      expect.assertions(1);
      process.env.VERCEL_URL = "my-app.vercel.app";
      // Re-import after resetting modules so IS_SERVER reflects window=undefined
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getAbsoluteUrl: serverGet } = require("./vercel-utils");
      expect(serverGet()).toBe("https://my-app.vercel.app");
    });

    it("returns http://localhost:3000 when VERCEL_URL is not set", () => {
      expect.assertions(1);
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getAbsoluteUrl: serverGet } = require("./vercel-utils");
      expect(serverGet()).toBe("http://localhost:3000");
    });
  });
});
