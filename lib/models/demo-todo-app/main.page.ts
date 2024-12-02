import type { Page, Locator } from "@playwright/test";
import { exampleTodoItems } from "../../constants/todo.items";
import { createRandomString } from "../../utils/random.utils";

export class TodoPage {
  readonly inputBox: Locator;
  readonly todoItems: Locator;
  readonly todoTitles: Locator;
  readonly todoCount: Locator;
  readonly markAllAsCompleted: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;

  constructor(public readonly page: Page) {
    this.inputBox = this.page.locator("input.new-todo");
    this.todoItems = this.page.getByTestId("todo-item");
    this.todoTitles = this.page.getByTestId("todo-title");
    this.todoCount = this.page.getByTestId("todo-count");
    this.markAllAsCompleted = this.page.locator("#toggle-all");
    this.filterAll = this.page.getByRole("link", { name: "All" });
    this.filterActive = this.page.getByRole("link", { name: "Active" });
    this.filterCompleted = this.page.getByRole("link", { name: "Completed" });
  }

  async goto() {
    await this.page.goto("https://demo.playwright.dev/todomvc/");
  }

  async addToDo(text: string) {
    await this.inputBox.fill(text);
    await this.inputBox.press("Enter");
  }

  async remove(text: string) {
    const todo = this.todoItems.filter({ hasText: text });
    await todo.hover();
    await todo.getByLabel("Delete").click();
  }

  async removeAll() {
    while ((await this.todoItems.count()) > 0) {
      await this.todoItems.first().hover();
      await this.todoItems.getByLabel("Delete").first().click();
    }
  }

  async getExampleTodoItems(): Promise<typeof exampleTodoItems> {
    return exampleTodoItems;
  }

  async filterBy(name: "All" | "Active" | "Completed") {
    const locator = (() => {
      switch (name) {
        case "All":
          return this.filterAll;
        case "Active":
          return this.filterActive;
        case "Completed":
          return this.filterCompleted;
      }
    })();
    await locator.click();
  }

  /**
   * Creates example todo items in the application.
   *
   * This function interacts with the page to fill in and submit example todo items
   * into the todo input field, and enters a new record
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of strings representing
   * the newly entered todo items.
   */
  async createExampleTodos() {
    const enteredRecords: string[] = [];
    for (const item of exampleTodoItems) {
      await this.inputBox.fill(item);
      await this.inputBox.press("Enter");
      enteredRecords.push(item);
    }

    return enteredRecords;
  }

  /**
   * Adds a random todo item to the list.
   *
   * @param {number} length - The length of the random string to be generated.
   * @returns {Promise<string>} A promise that resolves to the random string added as a todo item.
   */
  async addRandomTodo(length: number = 5): Promise<string> {
    const randomTodo = createRandomString(length);
    await this.addToDo(randomTodo);
    return randomTodo;
  }

  async checkNumberOfTodosInLocalStorage(expected: number) {
    return await this.page.waitForFunction((e) => {
      return JSON.parse(localStorage["react-todos"]).length === e;
    }, expected);
  }

  async checkNumberOfCompletedTodosInLocalStorage(expected: number) {
    return await this.page.waitForFunction((e) => {
      return (
        JSON.parse(localStorage["react-todos"]).filter(
          (todo: unknown) => (todo as { completed: never }).completed
        ).length === e
      );
    }, expected);
  }

  async checkTodosInLocalStorage(title: string) {
    return await this.page.waitForFunction((t) => {
      return JSON.parse(localStorage["react-todos"])
        .map((todo: { title: never }) => todo.title)
        .includes(t);
    }, title);
  }
}
