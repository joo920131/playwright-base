import test from "@playwright/test";

/**
 * Decorate class method as a test.step in Playwright POM and objects
 *
 * @param {string?} stepName - Optional - the name of the test step.
 * @returns A decorator function that can be used to decorate test methods.
 *
 * @example
 *
 * ```typescript
 * class TodoPage {
 *   @step
 *   async addTodo(item: string) {
 *     /// test steps to add todo item
 *   }
 *   @step("Remove todo item")
 *   async removeTodo(item: string) {
 *     /// test steps to remove todo item
 *   }
 * }
 *
 * /// In the report, this should show as a test step name either
 * /// using the name of method, or the custom name entered.
 * ```
 */
export function step(stepName?: string) {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    target: Function,
    context: ClassMethodDecoratorContext
  ) {
    return function decorator(this: typeof target, ...args: unknown[]) {
      const className = this.constructor?.name;
      const functionName = `${context.name as string}`;
      const argsPrintable = (() => {
        const params: string[] = [];
        for (const arg of args) {
          if (
            typeof arg === "string" ||
            typeof arg === "bigint" ||
            typeof arg === "number" ||
            typeof arg === "boolean" ||
            typeof arg === "undefined"
          ) {
            params.push(`${String(arg)}`);
          } else {
            params.push(`'${typeof arg}'`);
          }
        }
        return params.map((i, index) => `p${index}='${i}'`).join(",");
      })();

      const stepPrintable = [
        className ? `[${className}]` : "",
        stepName || functionName,
        argsPrintable,
      ]
        .filter((i) => i !== "")
        .join(" ");

      return test.step(stepPrintable, async () => {
        return await target.call(this, ...args);
      });
    };
  };
}
