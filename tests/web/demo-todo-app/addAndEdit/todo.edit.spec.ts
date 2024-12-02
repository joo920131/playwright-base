import { test, expect } from "lib/fixtures/demo-todo-app";
import { createRandomString } from "lib/utils/random.utils";

test.beforeEach(async ({ page, todoPage, baseURL }) => {
  await page.goto(baseURL!);
  await todoPage.addRandomTodo();
  await todoPage.addRandomTodo();
  await todoPage.addRandomTodo();
  await todoPage.checkNumberOfTodosInLocalStorage(3);
});

test.describe("Editing", () => {
  test("should hide other controls when editing", async ({ todoPage }) => {
    const { todoItems, todoTitles } = todoPage;
    const originalItems = await todoTitles.allTextContents();

    const todoItem = todoItems.nth(1);
    await todoItem.dblclick();
    await expect(todoItem.getByRole("checkbox")).not.toBeVisible();
    await expect(
      todoItem.locator("label", { hasText: originalItems[1] })
    ).not.toBeVisible();
  });

  test("should save edits on blur", async ({ todoPage }) => {
    const { todoItems, todoTitles } = todoPage;

    const originalItems = await todoTitles.allTextContents();

    // Edit the 2nd item
    await todoItems.nth(1).dblclick();
    const todoItemEditing = todoItems
      .nth(1)
      .getByRole("textbox", { name: "Edit" });

    const newMessage = createRandomString();

    await todoItemEditing.fill(newMessage);
    await todoItemEditing.dispatchEvent("blur");

    await expect(todoItems).toHaveText([
      originalItems[0],
      newMessage,
      originalItems[2],
    ]);

    await todoPage.checkTodosInLocalStorage(newMessage);
  });

  test("should trim entered text", async ({ todoPage }) => {
    const { todoItems, todoTitles } = todoPage;

    const originalItems = await todoTitles.allTextContents();

    await todoItems.nth(1).dblclick();
    const todoItemEditing = todoItems
      .nth(1)
      .getByRole("textbox", { name: "Edit" });

    const newMessage = "     " + createRandomString() + "      ";

    await todoItemEditing.fill(newMessage);
    await todoItemEditing.dispatchEvent("blur");

    await expect(todoItems).toHaveText([
      originalItems[0],
      newMessage.trim(),
      originalItems[2],
    ]);

    await todoPage.checkTodosInLocalStorage(newMessage.trim());
  });

  test("should remove the item if an empty text string was entered", async ({
    todoPage,
  }) => {
    const { todoItems, todoTitles } = todoPage;

    const originalItems = await todoTitles.allTextContents();

    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).getByRole("textbox", { name: "Edit" }).fill("");
    await todoItems
      .nth(1)
      .getByRole("textbox", { name: "Edit" })
      .press("Enter");

    await expect(todoItems).toHaveText([originalItems[0], originalItems[2]]);
  });

  test("should cancel edits on escape", async ({ todoPage }) => {
    const { todoItems, todoTitles } = todoPage;

    const originalItems = await todoTitles.allTextContents();

    // Edit the 2nd item
    await todoItems.nth(1).dblclick();
    const todoItemEditing = todoItems
      .nth(1)
      .getByRole("textbox", { name: "Edit" });

    const newMessage = createRandomString();

    await todoItemEditing.fill(newMessage);
    await todoItemEditing.press("Escape");

    await expect(todoItems).toHaveText(originalItems);
  });
});
