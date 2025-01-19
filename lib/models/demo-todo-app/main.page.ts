import { type Page } from "@playwright/test";
import { exampleTodoItems } from "../../constants/todo.items";
import { createRandomString } from "../../utils/random.utils";
import { step } from "lib/utils/playwright.utils";

export class TodoPage {
  constructor(
    public readonly page: Page,
    readonly inputBox = page.locator("input.new-todo"),
    readonly todoItems = page.getByTestId("todo-item"),
    readonly todoTitles = page.getByTestId("todo-title"),
    readonly todoCount = page.getByTestId("todo-count"),
    readonly markAllAsCompleted = page.locator("#toggle-all"),
    readonly filterAll = page.getByRole("link", { name: "All" }),
    readonly filterActive = page.getByRole("link", { name: "Active" }),
    readonly filterCompleted = page.getByRole("link", {
      name: "Completed",
    })
  ) {}

  @step("Add todo item")
  async addToDo(text: string) {
    await this.inputBox.fill(text);
    await this.inputBox.press("Enter");
  }

  @step("Remove todo item")
  async remove(text: string) {
    const todo = this.todoItems.filter({ hasText: text });
    await todo.hover();
    await todo.getByLabel("Delete").click();
  }

  @step("Remove all todos")
  async removeAll() {
    while ((await this.todoItems.count()) > 0) {
      await this.todoItems.first().hover();
      await this.todoItems.getByLabel("Delete").first().click();
    }
  }

  @step()
  async getExampleTodoItems(): Promise<typeof exampleTodoItems> {
    return exampleTodoItems;
  }

  @step()
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
  @step()
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
  @step("Add random todo item")
  async addRandomTodo(length: number = 5): Promise<string> {
    const randomTodo = createRandomString(length);
    await this.addToDo(randomTodo);
    return randomTodo;
  }

  @step()
  async checkNumberOfTodosInLocalStorage(expected: number) {
    return await this.page.waitForFunction((e) => {
      return JSON.parse(localStorage["react-todos"]).length === e;
    }, expected);
  }

  @step()
  async checkNumberOfCompletedTodosInLocalStorage(expected: number) {
    return await this.page.waitForFunction((e) => {
      return (
        JSON.parse(localStorage["react-todos"]).filter(
          (todo: unknown) => (todo as { completed: never }).completed
        ).length === e
      );
    }, expected);
  }

  @step()
  async checkTodosInLocalStorage(title: string) {
    return await this.page.waitForFunction((t) => {
      return JSON.parse(localStorage["react-todos"])
        .map((todo: { title: never }) => todo.title)
        .includes(t);
    }, title);
  }
}
