import { test } from '../../fixtures/fixtures';

test.describe('Перевод средств', () => {

    test.beforeEach(async ({ registeredUser, loginPage }) => {
        const user = registeredUser;
        await loginPage.open();
        await loginPage.login(user.email, user.password);
        await loginPage.assertLogin();
    });

    // Проверка невозможности перевода средств при нулевом балансе
    // Входные данные: валидный номер телефона, назначение платежа, корректная сумма, баланс пользователя равен 0
    // Ожидаемый результат: перевод не выполняется, отображается сообщение "Transfer failed. Check your balance."
    // Критичность - Критический
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

    // Проверка успешного перевода средств при достаточном балансе
    // Входные данные: баланс пользователя пополнен, валидный номер телефона, назначение платежа и сумма перевода
    // Ожидаемый результат: перевод успешно выполнен, отображается сообщение об успешном переводе
    // Критичность - Критический
    test('Попытка перевода средств при ненулевом балансе', async ({ mainPage, transactionsPage }) => {
        // Act
        await transactionsPage.open();
        await transactionsPage.clickAddBalance();
        await transactionsPage.topUpBalance('5000');
        await mainPage.open();
        await mainPage.fillPhone(await mainPage.generatePhoneInput());
        await mainPage.fillPurpose(await mainPage.generatePurpose());
        await mainPage.fillAmount('500');
        await mainPage.submitForm();
        // Assert
        await mainPage.assertTransferSuccess();
    });

    // Проверка валидации формата номера телефона со скобками и дефисами
    // Входные данные: пополненный баланс, номер телефона в формате "+7 (999) 123-45-67", валидная сумма
    // и назначение платежа
    // Ожидаемый результат: перевод успешно совершен, отображается сообщение об успешном переводе
    // Критичность - Средний
    test('Валидация номера телефона со скобками и дефисами', async ({ mainPage, transactionsPage }) => {
        // Act
        await transactionsPage.open();
        await transactionsPage.clickAddBalance();
        await transactionsPage.topUpBalance('5000');
        await mainPage.open();
        await mainPage.fillPhone('+7 (999) 123-45-67');
        await mainPage.fillAmount('100');
        await mainPage.fillPurpose('Возврат долга');
        await mainPage.submitForm();
        // Assert
        await mainPage.assertTransferSuccess();
    });

    // Проверка валидации номера телефона без знака "+" в начале
    // Входные данные: номер телефона без символа "+", валидная сумма и назначение платежа
    // Ожидаемый результат: отображается сообщение об ошибке формата номера телефона
    // Критичность - Высокий
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

    // Проверка валидации суммы перевода, равной нулю
    // Входные данные: валидный номер телефона, сумма "0", назначение платежа
    // Ожидаемый результат: перевод не выполняется, отображается сообщение "Amount must be greater than zero"
    // Критичность - Высокий
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

    // Проверка валидации отрицательной суммы перевода
    // Входные данные: валидный номер телефона, отрицательная сумма "-50", назначение платежа
    // Ожидаемый результат: перевод не выполняется, отображается сообщение "Amount must be greater than zero"
    // Критичность - Высокий
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