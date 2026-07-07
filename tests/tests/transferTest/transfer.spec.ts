import { test } from '../../fixtures/fixtures';

test.describe('Перевод средств', () => {

    test.beforeEach(async ({ registeredUser, loginPage }) => {
        const user = registeredUser;
        await loginPage.open();
        await loginPage.login(user.email, user.password);
        await loginPage.assertLogin();
    });

    // Нулевой баланс, перевод
    test('Попытка перевода средств при нулевом балансе', async ({ mainPage }) => {
        // Act
        await mainPage.open();
        await mainPage.fillPhone(await mainPage.generatePhoneInput());
        await mainPage.fillPurpose(await mainPage.generatePurpose());
        await mainPage.fillAmount(String(await mainPage.generateAmount()));
        await mainPage.submitForm();
        // Assert
        await mainPage.assertZeroBalanceTransfer();
        await mainPage.assertErrorMessage('Transfer failed. Check your balance.');
    });

    // Валидный перевод при ненулевом балансе
    test('Попытка перевода средств при ненулевом балансе', async ({ mainPage }) => {
        // TODO ДОБАВИТЬ БАЛАНС
        // Act
        await mainPage.open();
        await mainPage.fillPhone(await mainPage.generatePhoneInput());
        await mainPage.fillPurpose(await mainPage.generatePurpose());
        await mainPage.fillAmount(String(await mainPage.generateAmount()));
        await mainPage.submitForm();
        // Assert
        await mainPage.assertTransferSuccess();
    });

    // Проверка валидации номера телефона с разными форматами
    test('Валидация номера телефона со скобками и дефисами', async ({ mainPage, page }) => {
        // TODO ДОБАВИТЬ БАЛАНС


        // Arrange
        const responsePromise = page.waitForResponse(
            res => res.url().includes('/transfer') && res.request().method() === 'POST'
        ).catch(() => null);
        // Act
        await mainPage.open();
        await mainPage.fillPhone('+7 (999) 123-45-67');
        await mainPage.fillAmount('100');
        await mainPage.fillPurpose('Возврат долга');
        await mainPage.submitForm();
        // Assert
        const response = await responsePromise;
        if (response) {
            await mainPage.assertResponseStatus(response, 400);
        }
    });

    // Номер телефона без + в начале
    test('Ошибка валидации номера телефона без знака плюс в начале', async ({ mainPage }) => {
        // Act
        await mainPage.open();
        await mainPage.fillPhone('89991234567');
        await mainPage.fillAmount('50');
        await mainPage.fillPurpose('Тест');
        await mainPage.submitForm();
        // Assert
        await mainPage.assertErrorMessage('Must start with + and country code. Example: +7 999 123-45-67');
    });

    // Перевод суммы равной 0
    test('Ошибка валидации при попытке перевода суммы равной нулю', async ({ mainPage }) => {
        // Act
        await mainPage.open();
        await mainPage.fillPhone(await mainPage.generatePhoneInput());
        await mainPage.fillAmount('0');
        await mainPage.fillPurpose('Перевод нуля');
        await mainPage.submitForm();
        // Assert
        await mainPage.assertErrorMessage("Amount must be greater than zero");
    });

    // Перевод суммы меньше 0
    test('Ошибка валидации при попытке перевода отрицательной суммы', async ({ mainPage }) => {
        // Act
        await mainPage.open();
        await mainPage.fillPhone(await mainPage.generatePhoneInput());
        await mainPage.fillAmount('-50');
        await mainPage.fillPurpose('neg test');
        await mainPage.submitForm();
        // Assert
        await mainPage.assertErrorMessage("Amount must be greater than zero");
    });
});