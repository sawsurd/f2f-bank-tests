import { test } from '../../fixtures/fixtures';

test.describe('Авторизация пользователя', () => {

    test('Вход с валидными данными', async ({ registeredUser, loginPage }) => {
        //Arrange
        const user = registeredUser;
        // Act
        await loginPage.login(user.email, user.password);
        // Assert
        await loginPage.assertLogin();
    });

    test('Вход с неверным паролем', async ({ registeredUser, page, loginPage }) => {
        // Arrange
        const responsePromise = page.waitForResponse(
            res => res.url().includes('/login') && res.request().method() === 'POST'
        );
        // Act
        await loginPage.login(registeredUser.email, 'WrongPassword123!');
        const response = await responsePromise;
        // Assert
        await loginPage.assertNotAuthenticated();
        await loginPage.assertResponseStatus(response, 401);
    });

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

    test('Попытка входа с пустыми полями', async ({ loginPage }) => {
        // Act
        await loginPage.resetAllFields();
        await loginPage.submitForm();
        // Assert
        await loginPage.assertNotAuthenticated();
        await loginPage.assertFormValidationError();
    });

    test('Валидация некорректного формата email', async ({ loginPage }) => {
        // Act
        await loginPage.login('invalid-email', 'Password123');
        // Assert
        await loginPage.assertNotAuthenticated();
        await loginPage.assertFormValidationError();
    });});