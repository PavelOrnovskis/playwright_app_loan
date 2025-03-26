import { test, expect } from "@playwright/test";
import { SmallLoanPage } from "../page-objects/pages/SmallLoanPage";
import { LoanDecisionPage } from "../page-objects/pages/LoanDecisionPage";

test.describe("Loan app tests", async () => {
  test("TL-20 base test", async ({ page }) => {
    const smallLoanPage = new SmallLoanPage(page);
    const loanDecisionPage = new LoanDecisionPage(page);
    await smallLoanPage.open();
    const prefilledAmount = await smallLoanPage.amountInput.getCurrentValue();
    const prefilledPeriod = await smallLoanPage.getFirstPeriodOption();
    await smallLoanPage.applyButton.click();
    await smallLoanPage.usernameInput.fill("1234124");
    await smallLoanPage.passwordInput.fill("test");
    await smallLoanPage.continueButton.click();
    const finalAmount = await loanDecisionPage.getFinalAmountValue();
    const finalPeriod = await loanDecisionPage.getFinalPeriodValue();

    expect(finalAmount).toEqual(prefilledAmount);
    expect(finalPeriod).toEqual(prefilledPeriod);
  });
  test("TL-20 scroll test", async ({ page }) => {
    const smallLoanPage = new SmallLoanPage(page);
    const image1 = smallLoanPage.applyImage1;
    const image2 = smallLoanPage.applyImage2;
    await smallLoanPage.open();
    await image1.button.scrollIntoViewIfNeeded();
    await image1.click();
    await expect(smallLoanPage.applyButton.button).toBeInViewport();
    await image2.button.scrollIntoViewIfNeeded();
    await expect(image2.button).toBeVisible();
    await image2.button.click({ force: true });
    await expect(smallLoanPage.applyButton.button).toBeInViewport();
  });
});
