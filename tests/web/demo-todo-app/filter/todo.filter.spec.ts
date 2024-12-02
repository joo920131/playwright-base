import { test, expect } from "lib/fixtures/demo-todo-app";

const originalItems: string[] = [];

test.beforeEach(async ({ page, baseURL, todoPage }) => {
  originalItems.splice(0, originalItems.length);
  await page.goto(baseURL!);
  originalItems.push(
    await todoPage.addRandomTodo(),
    await todoPage.addRandomTodo(),
    await todoPage.addRandomTodo()
  );
  await todoPage.checkNumberOfTodosInLocalStorage(3);
});

test.describe("Filter", () => {
  test("should allow me to display items by the status", async ({
    todoPage,
  }) => {
    const { todoItems } = todoPage;
    const firstItem = todoItems.nth(1);
    await firstItem.getByRole("checkbox").check();
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(1);

    await todoPage.filterBy("Completed");
    await expect(todoItems).toHaveCount(1);
    await expect(todoItems).toHaveText([originalItems[1]]);

    await todoPage.filterBy("Active");
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toHaveText([originalItems[0], originalItems[2]]);

    await todoPage.filterBy("All");
    await expect(todoItems).toHaveCount(3);
    await expect(todoItems).toHaveText([...originalItems]);
  });

  test("should change filter by back button", async ({ page, todoPage }) => {
    const { todoItems } = todoPage;
    const firstItem = todoItems.nth(1);
    await firstItem.getByRole("checkbox").check();
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(1);

    await todoPage.filterBy("All");
    await todoPage.filterBy("Active");
    await todoPage.filterBy("Completed");

    await expect(todoItems).toHaveCount(1);
    await page.goBack();
    await expect(todoItems).toHaveCount(2);
    await page.goBack();
    await expect(todoItems).toHaveCount(3);
  });

  test("should highlight the currently applied filter", async ({
    todoPage,
  }) => {
    const { filterAll, filterActive, filterCompleted } = todoPage;
    // default filter option
    await expect(filterAll).toHaveClass("selected");

    await todoPage.filterBy("Active");
    await expect(filterActive).toHaveClass("selected");

    await filterCompleted.click();
    await expect(filterCompleted).toHaveClass("selected");
  });
});
