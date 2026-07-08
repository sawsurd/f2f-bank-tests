import { Page, Locator, expect, Response } from '@playwright/test';
import { generateAmountToTransfer, generatePhone, generatePurpose } from "../../utils/testData";

export class MainPage {
    readonly page: Page;
    readonly phoneInput: Locator;
    readonly amountInput: Locator;
    readonly purposeInput: Locator;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;
    readonly errors: Locator;
    readonly successMessage: Locator;
    readonly balance: Locator;

    constructor(page: Page) {
        this.page = page;
        this.phoneInput = page.locator('input[class*="input"][name="phone"]');
        this.amountInput = page.locator('input[class*="input"][name="amount"]');
        this.purposeInput = page.locator('input[class*="input"][name="purpose"]');
        this.submitButton = page.locator('button[type="submit"]');
        this.cancelButton = page.locator('button[type="button"]');
        this.errors = page.locator('[class*="error"]');
        this.successMessage = page.locator('[class*="success-text"]');
        this.balance = page.locator('[class="header__link"]').nth(0);
    }

    async open() {
        await this.page.goto('/');
    }

    async fillPhone(phone: string) {
        await this.phoneInput.fill(phone);
    }

    async fillAmount(amount: string) {
        await this.amountInput.fill(amount);
    }

    async fillPurpose(purpose: string) {
        await this.purposeInput.fill(purpose);
    }

    async submitForm() {
        await this.submitButton.click();
    }

    async resetAllFields() {
        await this.phoneInput.fill('');
        await this.amountInput.fill('');
        await this.purposeInput.fill('');
    }

    async assertResponseStatus(response: Response, expectedStatus: number) {
        expect(response.status()).toBe(expectedStatus);
    }

    async assertFormValidationError() {
        const isFormValid = await this.page.$eval('form', (form: HTMLFormElement) => form.checkValidity());
        expect(isFormValid).toBe(false);
    }

    async generatePhoneInput() {
        return generatePhone();
    }

    async generatePurpose() {
        return generatePurpose();
    }

    async generateAmount() {
        return generateAmountToTransfer();
    }

    async assertZeroBalanceTransfer() {
        await expect(await this.balance.textContent()).toBe("Balance: 0");
        await expect(this.page).toHaveURL('/');
        await expect(this.successMessage).not.toBeVisible();
    }

    async assertErrorMessage(expectedErrorText: string) {
        await expect(this.errors.first()).toBeVisible({ timeout: 3000 });
        await expect(this.errors).toContainText(expectedErrorText);
    }

    async assertTransferSuccess(expectedText: string = 'Transfer completed') {
        await expect(this.page).toHaveURL('/');
        await expect(this.successMessage).toBeVisible({ timeout: 5000 });
        await expect(this.successMessage).toContainText(expectedText);
    }
}