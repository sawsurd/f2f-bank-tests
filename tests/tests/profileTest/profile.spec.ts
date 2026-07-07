import { test } from '../../fixtures/fixtures';

test.describe('Профиль пользователя', () => {

    // Проверка данных в профиле после входа
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