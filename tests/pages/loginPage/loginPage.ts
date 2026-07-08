import { Page, Locator, expect, Response } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly errors: Locator;


    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('input[class*="input"][type="email"]');
        this.passwordInput = page.locator('input[class*="input"][type="password"]');
        this.submitButton = page.locator('button[type="submit"][class*="app-button"]');
        this.errors = page.locator('[class="error"]');
    }

    async open() {
        await this.page.goto('/login');
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async submitForm() {
        await this.submitButton.click();
    }

    async login(email: string, password: string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.submitForm();
    }

    async assertLogin(){
        await expect(this.page).toHaveURL(/\/$/, { timeout: 5000 });
    }

    async resetAllFields() {
        await this.emailInput.fill('');
        await this.passwordInput.fill('');
    }

    async assertNotAuthenticated() {
        await expect(this.page).toHaveURL(/\/login/);
    }

    async assertResponseStatus(response: Response, expectedStatus: number) {
        expect(response.status()).toBe(expectedStatus);
    }

    async assertFormValidationError() {
        const isFormValid = await this.page.$eval('form', (form: HTMLFormElement) => form.checkValidity());
        expect(isFormValid).toBe(false);
    }

    async logout() {
        const logoutButton = this.page.locator('button[type="button"][class*="app-button"]').first();
        await logoutButton.click();
    }
}