import { test } from '../../fixtures/fixtures';

test.describe('Регистрация пользователя', () => {

    test.beforeEach(async ({ registerPage }) => {
        await registerPage.open();
    });

    // Основной тест регистрации с валидными данными, проверка успешного редиректа на страницу входа
    // Входные данные: корректные имя, фамилия, email и пароль
    // Ожидаемый результат: пользователь зарегистрирован и перенаправлен на /login
    // Критичность - Критический
    test('Регистрация пользователя с валидными данными', async ({ registerPage, testUser }) => {
        //Act
        await registerPage.fillName(testUser.name);
        await registerPage.fillSurname(testUser.surname);
        await registerPage.fillEmail(testUser.email);
        await registerPage.fillPassword(testUser.password);
        await registerPage.submitForm();
        //Assert
        await registerPage.assertRegister();
    });

    // Проверка валидации уникальности email, тестирование попытки регистрации с существующим email
    // Входные данные: существующий email, другие данные
    // Ожидаемый результат: ошибка 409 Conflict, сообщение об ошибке: "User with this email already exists"
    // Критичность - Критический
    test('Регистрация с существующим email', async ({ registerPage, registeredUser, page }) => {
        //Act
        await registerPage.fillName('Другое Имя');
        await registerPage.fillSurname('Другая Фамилия');
        await registerPage.fillEmail(registeredUser.email);
        await registerPage.fillPassword('anotherPassword123');
        //Assert
        await registerPage.assertEmailErrorWithStatus();
    });

    // Проверка валидации пустых полей, тестирование отправки пустой формы
    // Входные данные: все поля пустые
    // Ожидаемый результат: форма не отправляется, остаемся на странице регистрации
    // Критичность - Критический
    test('Регистрация с пустыми полями', async ({ registerPage }) => {
        //Act
        await registerPage.resetAllFields();
        await registerPage.submitForm();
        //Assert
        await registerPage.assertEmptyFields();
    });

    // Проверка валидации формата email, тестирование отправки email без символа @
    // Входные данные: email без @, остальные данные валидные
    // Ожидаемый результат: браузерная валидация предотвращает отправку, остаемся на /register
    // Критичность - Высокий
    test('Регистрация с некорректным форматом email', async ({ registerPage, testUser }) => {
        //Act
        await registerPage.fillName(testUser.name);
        await registerPage.fillSurname(testUser.surname);
        await registerPage.fillEmail('invalid-email.ru');
        await registerPage.fillPassword(testUser.password);
        await registerPage.submitForm();
        //Assert
        await registerPage.assertEmailValidationError();
    });

    // Проверка валидации длины пароля, тестирование пароля короче 8 символов
    // Входные данные: пароль '123' (3 символа), остальные данные валидные
    // Ожидаемый результат: форма не отправляется, остаемся на странице регистрации
    // Критичность - Высокий
    test('Регистрация со слишком коротким паролем', async ({ registerPage, testUser }) => {
        //Act
        await registerPage.fillName(testUser.name);
        await registerPage.fillSurname(testUser.surname);
        await registerPage.fillEmail(testUser.email);
        await registerPage.fillPassword('123');
        await registerPage.submitForm();
        //Assert
        await registerPage.assertPasswordValidationError();
    });
});