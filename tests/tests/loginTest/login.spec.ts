import { test } from '../../fixtures/fixtures';

test.describe('Авторизация пользователя', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.open();
    });

    // Основной тест авторизации с валидными учетными данными
    // Входные данные: зарегистрированный email и корректный пароль
    // Ожидаемый результат: успешная авторизация пользователя и переход на главную страницу
    // Критичность - Критический
    test('Вход с валидными данными', async ({ registeredUser, loginPage }) => {
        //Arrange
        const user = registeredUser;
        // Act
        await loginPage.open();
        await loginPage.login(user.email, user.password);
        // Assert
        await loginPage.assertLogin();
    });

    // Проверка обработки неверного пароля при авторизации
    // Входные данные: существующий email и некорректный пароль
    // Ожидаемый результат: сервер возвращает 401 Unauthorized, пользователь остается на странице входа
    // Критичность - Критический
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

    // Проверка авторизации с незарегистрированным email
    // Входные данные: несуществующий email и произвольный пароль
    // Ожидаемый результат: сервер возвращает 401 Unauthorized, пользователь остается на странице входа
    // Критичность - Критический
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

    // Проверка валидации обязательных полей формы авторизации
    // Входные данные: пустые поля email и пароль
    // Ожидаемый результат: форма не отправляется, пользователь остается на странице входа
    // Критичность - Средний
    test('Попытка входа с пустыми полями', async ({ loginPage }) => {
        // Act
        await loginPage.resetAllFields();
        await loginPage.submitForm();
        // Assert
        await loginPage.assertNotAuthenticated();
        await loginPage.assertFormValidationError();
    });

    // Проверка валидации формата email при авторизации
    // Входные данные: email некорректного формата и валидный пароль
    // Ожидаемый результат: браузерная валидация предотвращает отправку формы, пользователь остается на странице входа
    // Критичность - Высокий
    test('Валидация некорректного формата email', async ({ loginPage }) => {
        // Act
        await loginPage.login('invalid-email', 'Password123');
        // Assert
        await loginPage.assertNotAuthenticated();
        await loginPage.assertFormValidationError();
    });

    // Проверка корректности выхода пользователя из системы
    // Входные данные: авторизованный пользователь
    // Ожидаемый результат: пользователь выходит из аккаунта и перенаправляется на страницу входа
    // Критичность - Критичный
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