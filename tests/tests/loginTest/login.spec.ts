import { test } from '../../fixtures/fixtures';

test.describe('Авторизация пользователя', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.open();
    });

    // Вход в аккаунт с валидными данными
    test('Вход с валидными данными', async ({ registeredUser, loginPage }) => {
        //Arrange
        const user = registeredUser;
        // Act
        await loginPage.open();
        await loginPage.login(user.email, user.password);
        // Assert
        await loginPage.assertLogin();
    });

    // Вход в аккаунт с неверным паролем
    test('Вход с неверным паролем', async ({ registeredUser, page, loginPage }) => {
        // Arrange
        const responsePromise = page.waitForResponse(
            res => res.url().includes('/login') && res.request().method() === 'POST'
        );
        const user = registeredUser;
        // Act
        await loginPage.open();
        await loginPage.login(user.email, 'WrongPassword123!');
        const response = await responsePromise;
        // Assert
        await loginPage.assertNotAuthenticated();
        await loginPage.assertResponseStatus(response, 401);
    });

    // Вход в аккаунт с незарегистрированным email
    test('Вход с несуществующим email', async ({ page, loginPage }) => {
        // Arrange
        const responsePromise = page.waitForResponse(
            res => res.url().includes('/login') && res.request().method() === 'POST'
        );
        // Act
        await loginPage.login('idk@mail.ru', 'SomePassword123');
        const response = await responsePromise;
        // Assert
        await loginPage.assertNotAuthenticated();
        await loginPage.assertResponseStatus(response, 401);
    });

    // Попытка входа с пустыми полями
    test('Попытка входа с пустыми полями', async ({ loginPage }) => {
        // Act
        await loginPage.resetAllFields();
        await loginPage.submitForm();
        // Assert
        await loginPage.assertNotAuthenticated();
        await loginPage.assertFormValidationError();
    });

    // Проверка некорректного email
    test('Валидация некорректного формата email', async ({ loginPage }) => {
        // Act
        await loginPage.login('invalid-email', 'Password123');
        // Assert
        await loginPage.assertNotAuthenticated();
        await loginPage.assertFormValidationError();
    });

    // Выход из аккаунта через кнопку выхода
    test('Выход из аккаунта через кнопку выхода', async ({ registeredUser, loginPage }) => {
        // Arrange
        const user = registeredUser;
        // Act
        await loginPage.open();
        await loginPage.login(user.email, user.password);
        await loginPage.assertLogin();
        await loginPage.logout();
        // Assert
        await loginPage.assertNotAuthenticated();
    });
});