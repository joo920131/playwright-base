import { test, expect } from "lib/fixtures/demo-todo-app";

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(baseURL!);
});

test.describe("Counter", () => {
  test("should display the current number of todo items", async ({
    todoPage,
  }) => {
    const { todoCount } = todoPage;
    await expect(todoCount).not.toBeVisible();
    await todoPage.addRandomTodo();
    await todoPage.addRandomTodo();
    await expect(todoCount).toContainText("2");
    await todoPage.checkNumberOfTodosInLocalStorage(2);
  });
});
