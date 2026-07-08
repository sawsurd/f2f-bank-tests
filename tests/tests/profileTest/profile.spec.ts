import { test } from '../../fixtures/fixtures';

test.describe('Профиль пользователя', () => {

    // Проверка корректности отображения данных пользователя в профиле после успешной авторизации
    // Входные данные: зарегистрированный пользователь с валидными учетными данными
    // Ожидаемый результат: открывается страница профиля, отображаются корректные имя, фамилия и email пользователя
    // Критичность - Высокий
    test('Отображение корректных данных в профиле', async ({ registeredUser, profilePage, loginPage }) => {
        //Act
        await loginPage.open();
        await loginPage.login(registeredUser.email, registeredUser.password);
        await loginPage.assertLogin();
        await profilePage.open();
        //Assert
        await profilePage.assertProfileData({
            name: registeredUser.name,
            surname: registeredUser.surname,
            email: registeredUser.email
        });
    });
});