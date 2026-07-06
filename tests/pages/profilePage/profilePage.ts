import { Page, Locator, expect } from '@playwright/test';

export class ProfilePage {
    readonly page: Page;
    readonly profileCard: Locator;

    constructor(page: Page) {
        this.page = page;
        this.profileCard = page.locator('div[class="profile__info"]');
    }

    async open() {
        await this.page.goto('/profile');
    }

    async assertProfileData(user: { name: string; surname: string; email: string }) {
        await expect(this.page).toHaveURL('/profile');
        await expect(this.profileCard).toContainText(new RegExp(user.name));
        await expect(this.profileCard).toContainText(new RegExp(user.surname));
        await expect(this.profileCard).toContainText(new RegExp(user.email));
    }
}