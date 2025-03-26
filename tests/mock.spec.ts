import { test } from "@playwright/test";
import { SmallLoanPage } from "../page-objects/pages/SmallLoanPage";

test.describe("Loan app mock tests", async () => {
  test("TL-21-1 positive test", async ({ page }) => {
    const expectedMonthlyAmount = 100005;
    const smallLoanPage = new SmallLoanPage(page);

    await page.route("**/api/loan-calc*", async (request) => {
      const responseBody = { paymentAmountMonthly: expectedMonthlyAmount };
      await request.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(responseBody),
      });
    });
    const loanCalcResponse = page.waitForResponse("**/api/loan-calc*");
    await smallLoanPage.open();
    await loanCalcResponse;
    await smallLoanPage.checkMonthlyAmount(expectedMonthlyAmount);
    console.log(expectedMonthlyAmount);
  });
  test("TL-21-2 status 500 with no response body", async ({ page }) => {
    const smallLoanPage = new SmallLoanPage(page);

    await page.route("**/api/loan-calc*", async (request) => {
      await request.fulfill({
        status: 500,
        contentType: "application/json",
      });
    });
    const loanCalcResponse = page.waitForResponse("**/api/loan-calc*");
    await smallLoanPage.open();
    await loanCalcResponse;
    await smallLoanPage.messageError();
  });
  test("TL-21-3 status 200 with no response body", async ({ page }) => {
    const smallLoanPage = new SmallLoanPage(page);

    await page.route("**/api/loan-calc*", async (request) => {
      await request.fulfill({
        status: 200,
        contentType: "application/json",
      });
    });
    const loanCalcResponse = page.waitForResponse("**/api/loan-calc*");
    await smallLoanPage.open();
    await loanCalcResponse;
    await smallLoanPage.undefinedError();
  });
  test("TL-21-4 status 200 with incorrect key", async ({ page }) => {
    const smallLoanPage = new SmallLoanPage(page);

    await page.route("**/api/loan-calc*", async (request) => {
      const responseBody = { incorrectKey: 123121253535 };
      await request.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(responseBody),
      });
    });
    const loanCalcResponse = page.waitForResponse("**/api/loan-calc*");
    await smallLoanPage.open();
    await loanCalcResponse;
    await smallLoanPage.undefinedError();
  });
});
