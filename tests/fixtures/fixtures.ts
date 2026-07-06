import { test as base } from '@playwright/test';
import {RegisterPage} from "../pages/registerPage/registerPage";
import {generateUser, TestUser} from "../utils/testData";
import {LoginPage} from "../pages/loginPage/loginPage";
import {ProfilePage} from "../pages/profilePage/profilePage";

type Fixtures = {
    registerPage: RegisterPage;
    testUser: TestUser;
    registeredUser: TestUser;
    loginPage: LoginPage;
    profilePage: ProfilePage;
};

export const test = base.extend<Fixtures>({
    registerPage: async ({page}, use ) => {
        const register = new RegisterPage(page);
        await register.open();
        await page.waitForLoadState('networkidle');
        await use(register);
    },
    testUser: async ({}, use) => {
        const user = generateUser();
        await use(user);
    },
    registeredUser: async ({ page, testUser }, use) => {
        const register = new RegisterPage(page);
        await register.open();
        await register.fillName(testUser.name);
        await register.fillSurname(testUser.surname);
        await register.fillEmail(testUser.email);
        await register.fillPassword(testUser.password);
        await register.submitForm();
        await register.assertRegister();
        await register.open();
        await use(testUser);
    },
    loginPage: async ({page}, use) => {
        const login = new LoginPage(page);
        await login.open();
        await page.waitForLoadState('networkidle');
        await use(login);
    },
    profilePage: async ({page}, use) => {
        const profile = new ProfilePage(page);
        await use(profile);
    }
});