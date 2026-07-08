import { test } from '../../fixtures/fixtures';

test.describe('История транзакций и пополнение баланса', () => {

    test.beforeEach(async ({ registeredUser, loginPage }) => {
        //Act
        await loginPage.open();
        await loginPage.login(registeredUser.email, registeredUser.password);
        //Assert
        await loginPage.assertLogin();
    });

    // Проверка отображения пустой истории транзакций для нового пользователя
    // Входные данные: новый зарегистрированный пользователь без выполненных операций
    // Ожидаемый результат: отображается сообщение об отсутствии транзакций, баланс равен 0
    // Критичность - Средний
    test('Отображение пустой истории транзакций у нового пользователя', async ({ transactionsPage }) => {
        //Act
        await transactionsPage.open();
        //Assert
        await transactionsPage.assertNoTransactionsYet();
        await transactionsPage.assertBalanceChanged('Balance: 0');
    });

    // Проверка успешного пополнения баланса
    // Входные данные: пользователь авторизирован, положительная сумма пополнения
    // Ожидаемый результат: баланс увеличивается на указанную сумму, модальное окно закрывается,
    // в истории появляется запись о транзакции
    // Критичность - Критический
    test('Успешное пополнение баланса', async ({ transactionsPage }) => {
        //Arrange
        const amount = '1500';
        //Act
        await transactionsPage.open();
        await transactionsPage.assertNoTransactionsYet();
        await transactionsPage.clickAddBalance();
        await transactionsPage.topUpBalance(amount);
        // Assert
        await transactionsPage.assertModalNotVisible();
        await transactionsPage.assertTransactionsTableNotEmpty();
        await transactionsPage.assertBalanceChanged(`Balance: ${amount}`);
    });

    // Проверка валидации пустого значения при пополнении баланса
    // Входные данные: пользователь авторизирован, пустое поле суммы
    // Ожидаемый результат: отображается сообщение об ошибке по типу "Please enter an amount",
    // пополнение не выполняется, баланс остается неизменным
    // Критичность - Высокий
    test('Пополнение баланса, пустой ввод', async ({ transactionsPage }) => {
        //Act
        await transactionsPage.open();
        await transactionsPage.assertNoTransactionsYet();
        await transactionsPage.clickAddBalance();
        await transactionsPage.topUpBalance('');
        // Assert
        await transactionsPage.assertErrorMessage('Please enter an amount');
        await transactionsPage.assertModalVisible();
        await transactionsPage.assertNoTransactionsYet();
        await transactionsPage.assertBalanceChanged(`Balance: 0`);
    });

    // Проверка валидации отрицательной суммы при пополнении баланса
    // Входные данные: пользователь авторизирован, отрицательная сумма
    // Ожидаемый результат: отображается сообщение об ошибке по типу "Amount must be positive",
    // пополнение не выполняется, баланс остается неизменным
    // Критичность - Высокий
    test('Пополнение баланса отрицательной суммой', async ({ transactionsPage }) => {
        //Arrange
        const amount = '-1500';
        //Act
        await transactionsPage.open();
        await transactionsPage.assertNoTransactionsYet();
        await transactionsPage.clickAddBalance();
        await transactionsPage.topUpBalance(amount);
        // Assert
        await transactionsPage.assertErrorMessage('Amount must be positive');
        await transactionsPage.assertModalVisible();
        await transactionsPage.assertNoTransactionsYet();
        await transactionsPage.assertBalanceChanged(`Balance: 0`);
    });

    // Проверка валидации нулевой суммы при пополнении баланса
    // Входные данные: пользователь авторизирован, сумма пополнения равна 0
    // Ожидаемый результат: отображается сообщение об ошибке по типу "Amount must be greater than zero",
    // пополнение не выполняется, баланс остается неизменным
    // Критичность - Средний
    test('Пополнение баланса нулевой суммой', async ({ transactionsPage }) => {
        //Arrange
        const amount = '0';
        //Act
        await transactionsPage.open();
        await transactionsPage.assertNoTransactionsYet();
        await transactionsPage.clickAddBalance();
        await transactionsPage.topUpBalance(amount);
        // Assert
        await transactionsPage.assertErrorMessage('Amount must be greater than zero');
        await transactionsPage.assertModalVisible();
        await transactionsPage.assertNoTransactionsYet();
        await transactionsPage.assertBalanceChanged(`Balance: 0`);
    });

});