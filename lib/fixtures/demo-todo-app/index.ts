import { test as base } from "@playwright/test";
import { TodoPage } from "../../models/demo-todo-app/main.page";

// Declare the types of your fixtures.
type BaseFixture = {
  todoPage: TodoPage;
};

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<BaseFixture>({
  todoPage: async ({ page }, use) => {
    // Set up the fixture.
    const todoPage = new TodoPage(page);
    // Use the fixture value in the test.
    await use(todoPage);
  },
  baseURL: "https://demo.playwright.dev/todomvc",
});

export { expect } from "@playwright/test";
