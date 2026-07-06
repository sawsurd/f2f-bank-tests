import {Page, Locator, expect} from '@playwright/test';

export class RegisterPage {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly surnameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly errors: Locator;


    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator('input[class*="input"][name="name"]');
        this.surnameInput = page.locator('input[class*="input"][name="surname"]');
        this.emailInput = page.locator('input[class*="input"][type="email"]');
        this.passwordInput = page.locator('input[class*="input"][type="password"]');
        this.submitButton = page.locator('button[type="submit"][class*="app-button"]');
        this.errors = page.locator('[class="error"]');
    }

    async open() {
        await this.page.goto('/register');
    }

    async fillName(name: string) {
        await this.nameInput.fill(name);
    }

    async fillSurname(surname: string) {
        await this.surnameInput.fill(surname);
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

    async assertRegister(){
        await expect(this.page).toHaveURL('/login');
    }

    async resetAllFields() {
        await this.nameInput.fill('');
        await this.surnameInput.fill('');
        await this.emailInput.fill('');
        await this.passwordInput.fill('');
    }

    async assertEmailErrorWithStatus() {
        const responsePromise = this.page.waitForResponse(
            response => response.url().includes('/register')
        );
        await this.submitForm();
        const response = await responsePromise;
        expect(response.status()).toBe(409);
        await expect(this.errors).toHaveText('User with this email already exists');
    }

    async assertNotNavigateToLogin() {
        await this.page.waitForTimeout(2000);
        await expect(this.page).toHaveURL('/register');
        await expect(this.page).not.toHaveURL('/login');
    }

    async assertEmptyFields() {
        await this.assertNotNavigateToLogin();
    }

    async assertPasswordValidationError() {
        await this.assertNotNavigateToLogin();
    }

    async assertEmailValidationError() {
        await this.assertNotNavigateToLogin();
    }
}