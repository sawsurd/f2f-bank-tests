import { Page, Locator, expect } from '@playwright/test';

export class TransactionsPage {
    readonly page: Page;
    readonly addBalanceButton: Locator;
    readonly emptyMessage: Locator;
    readonly tableRows: Locator;
    readonly balanceLocator: Locator;
    readonly modalContainer: Locator;
    readonly balanceInput: Locator;
    readonly confirmButton: Locator;
    readonly cancelButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addBalanceButton = page.locator('.transactions__card button:has-text("Add balance")');
        this.emptyMessage = page.locator('p.empty');
        this.tableRows = page.locator('.transactions__table tbody tr');
        this.balanceLocator = page.locator('[class="header__link"]').nth(0);
        this.modalContainer = page.locator('.modal');
        this.balanceInput = page.locator('.modal input[name="balance"]');
        this.confirmButton = page.locator('button[class="confirm-btn"]');
        this.cancelButton = page.locator('button[class="cancel-btn"]');
        this.errorMessage = page.locator('[class*="error"]');
    }

    async open() {
        await this.page.goto('/transactions');
    }

    async clickAddBalance() {
        await this.addBalanceButton.click();
        await expect(this.modalContainer).toBeVisible();
    }

    async topUpBalance(amount: string) {
        await this.balanceInput.fill(amount);
        await this.confirmButton.click();
    }

    async assertModalNotVisible() {
        await expect(this.modalContainer).not.toBeVisible();
    }

    async assertModalVisible() {
        await expect(this.modalContainer).toBeVisible();
    }

    async assertErrorMessage(errorText: string) {
        await expect(this.errorMessage).toBeVisible();
        const allErrors = await this.page.locator('[class*="error"]').allTextContents();
        const hasError = allErrors.some(text => text.includes(errorText));
        expect(hasError).toBeTruthy();
    }

    async assertNoTransactionsYet() {
        await expect(this.page).toHaveURL('/transactions');
        await expect(this.emptyMessage).toBeVisible();
        await expect(this.tableRows).toHaveCount(0);
    }

    async assertTransactionsTableNotEmpty() {
        await expect(this.emptyMessage).not.toBeVisible();
        await expect(this.tableRows.first()).toBeVisible({ timeout: 3000 });
    }

    async assertBalanceChanged(expectedBalanceText: string) {
        const currentBalance = await this.balanceLocator.textContent();
        expect(currentBalance).toBe(expectedBalanceText);
    }
}