import { expect, Locator, Page } from "@playwright/test";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";

const url = "https://loan-app.tallinn-learning.ee/small-loan";

export class SmallLoanPage {
  readonly page: Page;
  readonly applyButton: Button;
  readonly applyImage1: Button;
  readonly applyImage2: Button;
  readonly amountInput: Input;
  readonly periodSelect: Locator;
  readonly periodOptions: Locator;
  readonly usernameInput: Input;
  readonly passwordInput: Input;
  readonly continueButton: Button;
  readonly monthlyAmountSpan: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.applyButton = new Button(page, "id-small-loan-calculator-field-apply");
    this.applyImage1 = new Button(page, "id-image-element-button-image-1");
    this.applyImage2 = new Button(page, "id-image-element-button-image-2");
    this.amountInput = new Input(page, "id-small-loan-calculator-field-amount");
    this.periodSelect = page.getByTestId(
      "ib-small-loan-calculator-field-period",
    );
    this.periodOptions = this.periodSelect.locator("option");
    this.usernameInput = new Input(page, "login-popup-username-input");
    this.passwordInput = new Input(page, "login-popup-password-input");
    this.continueButton = new Button(page, "login-popup-continue-button");
    this.monthlyAmountSpan = page.getByTestId(
      "ib-small-loan-calculator-field-monthlyPayment",
    );
    this.errorMessage = page.getByTestId(
      "id-small-loan-calculator-field-error",
    );
  }
  async open(): Promise<void> {
    await this.page.goto(url);
  }

  async getFirstPeriodOption(): Promise<string> {
    const allOptions = await this.periodOptions.all();

    return await allOptions[0].innerText();
  }
  async checkMonthlyAmount(expected: number): Promise<void> {
    const innerText = await this.monthlyAmountSpan.innerText();
    const sum = +innerText.split(" ")[0];
    expect(expected).toEqual(sum);
  }

  async messageError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText("Oops, something went wrong");
  }
  async undefinedError(): Promise<void> {
    const innerText = await this.monthlyAmountSpan.innerText();
    const undefinedMessage = innerText.split(" ")[0];
    expect(innerText).toContain(undefinedMessage);
  }
}
