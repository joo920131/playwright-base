import { test, expect } from "lib/fixtures/demo-todo-app";

test.beforeEach(async ({ page, todoPage, baseURL }) => {
  await page.goto(baseURL!);
  const records = await todoPage.createExampleTodos();
  await todoPage.checkNumberOfTodosInLocalStorage(records.length);
});

test.describe("Mark all as completed", () => {
  test("should allow me to mark all items as completed", async ({
    todoPage,
  }) => {
    const { markAllAsCompleted, todoItems } = todoPage;
    // Complete all todos.
    await markAllAsCompleted.check();

    // Ensure all todos have 'completed' class.
    await expect(todoItems).toHaveClass([
      "completed",
      "completed",
      "completed",
    ]);
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(3);
  });

  test("should allow me to clear the complete state of all items", async ({
    todoPage,
  }) => {
    const { markAllAsCompleted, todoItems } = todoPage;
    // Check and then immediately uncheck.
    await markAllAsCompleted.check();
    await markAllAsCompleted.uncheck();

    // Should be no completed classes.
    await expect(todoItems).toHaveClass(["", "", ""]);
  });

  test("complete all checkbox should update state when items are completed / cleared", async ({
    todoPage,
  }) => {
    const { markAllAsCompleted } = todoPage;
    await markAllAsCompleted.check();
    await expect(markAllAsCompleted).toBeChecked();
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(3);

    // Uncheck first todo.
    const firstTodo = todoPage.todoItems.nth(0);
    await firstTodo.getByRole("checkbox").uncheck();

    // Reuse toggleAll locator and make sure its not checked.
    await expect(markAllAsCompleted).not.toBeChecked();

    await firstTodo.getByRole("checkbox").check();
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(3);

    // Assert the toggle all is checked again.
    await expect(markAllAsCompleted).toBeChecked();
  });
});

test.describe("Item", () => {
  test("should allow me to mark items as complete", async ({ todoPage }) => {
    await todoPage.addRandomTodo();
    await todoPage.addRandomTodo();

    // Check first item.
    const firstTodo = todoPage.todoItems.nth(0);
    await firstTodo.getByRole("checkbox").check();
    await expect(firstTodo).toHaveClass("completed");

    // Check second item.
    const secondTodo = todoPage.todoItems.nth(1);
    await expect(secondTodo).not.toHaveClass("completed");
    await secondTodo.getByRole("checkbox").check();

    // Assert completed class.
    await expect(firstTodo).toHaveClass("completed");
    await expect(secondTodo).toHaveClass("completed");
  });

  test("should allow me to un-mark items as complete", async ({ todoPage }) => {
    await todoPage.addRandomTodo();
    await todoPage.addRandomTodo();

    const firstTodo = todoPage.todoItems.nth(0);
    const secondTodo = todoPage.todoItems.nth(1);

    const firstTodoCheckbox = firstTodo.getByRole("checkbox");

    await firstTodoCheckbox.check();
    await expect(firstTodo).toHaveClass("completed");
    await expect(secondTodo).not.toHaveClass("completed");
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(1);

    await firstTodoCheckbox.uncheck();
    await expect(firstTodo).not.toHaveClass("completed");
    await expect(secondTodo).not.toHaveClass("completed");
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(0);
  });
});
