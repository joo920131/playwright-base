import { test, expect } from "lib/fixtures/demo-todo-app";

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(baseURL!);
});

test.describe("Persistence", () => {
  test("should persist its data", async ({ page, todoPage }) => {
    const { todoItems } = todoPage;
    const item1 = await todoPage.addRandomTodo();
    const item2 = await todoPage.addRandomTodo();

    const firstTodoCheck = todoItems.nth(0).getByRole("checkbox");
    await firstTodoCheck.check();

    const assertStoredData = async () => {
      await expect(todoItems).toHaveText([item1, item2]);
      await expect(firstTodoCheck).toBeChecked();
      await expect(todoItems).toHaveClass(["completed", ""]);
      // Ensure there is 1 incomplete and 1 completed item
      await todoPage.checkNumberOfTodosInLocalStorage(2);
      await todoPage.checkNumberOfCompletedTodosInLocalStorage(1);
    };

    await assertStoredData();
    // Reload page and check again
    await page.reload();
    await assertStoredData();
  });
});
