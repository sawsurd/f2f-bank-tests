import { test } from '../../fixtures/fixtures';

test.describe('Регистрация пользователя', () => {

    test.beforeEach(async ({ registerPage }) => {
        await registerPage.open();
    });

    // Валидные данные
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

    // Повторяющийся email
    test('Регистрация с существующим email', async ({ registerPage, registeredUser }) => {
        //Act
        await registerPage.fillName('Другое Имя');
        await registerPage.fillSurname('Другая Фамилия');
        await registerPage.fillEmail(registeredUser.email);
        await registerPage.fillPassword('anotherPassword123');
        //Assert
        await registerPage.assertEmailErrorWithStatus();
    });

    test('Регистрация с пустыми полями', async ({ registerPage }) => {
        //Act
        await registerPage.resetAllFields();
        await registerPage.submitForm();
        //Assert
        await registerPage.assertEmptyFields();
    });

    // Невалидный email
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

    // Слишком короткий пароль
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