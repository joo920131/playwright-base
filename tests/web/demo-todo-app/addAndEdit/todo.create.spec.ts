import { test, expect } from "lib/fixtures/demo-todo-app";
import { exampleTodoItems } from "lib/constants/todo.items";

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(baseURL!);
});

test.describe("New Todo", () => {
  test("should allow me to add todo items", async ({ todoPage }) => {
    const todos: string[] = [];
    for (const todo of exampleTodoItems) {
      await todoPage.addToDo(todo);
      todos.push(todo);
      await expect(todoPage.todoItems).toHaveText([...todos]);
      await todoPage.checkNumberOfTodosInLocalStorage(todos.length);
    }
  });

  test("should clear text input field when an item is added", async ({
    todoPage,
  }) => {
    // create a new todo locator
    await todoPage.addToDo("random item");
    // Check that input is empty.
    await expect(todoPage.inputBox).toBeEmpty();
  });

  test("should append new items to the bottom of the list", async ({
    todoPage,
  }) => {
    // Create 3 items.
    const newItems = await todoPage.createExampleTodos();

    // Check test using different methods.
    const { todoCount, todoItems } = todoPage;

    const message = `${newItems.length} items left`;
    await expect(todoCount).toBeVisible();
    await expect(todoCount).toHaveText(message);

    // Check all items in one call.
    await expect(todoItems).toHaveText([
      ...(await todoPage.getExampleTodoItems()),
    ]);
    await todoPage.checkNumberOfTodosInLocalStorage(3);
  });
});
