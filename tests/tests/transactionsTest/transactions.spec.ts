import { test } from '../../fixtures/fixtures';

test.describe('История транзакций и пополнение баланса', () => {

    test.beforeEach(async ({ registeredUser, loginPage }) => {
        //Act
        await loginPage.open();
        await loginPage.login(registeredUser.email, registeredUser.password);
        //Assert
        await loginPage.assertLogin();
    });

    // Пустая история транзакций
    test('Отображение пустой истории транзакций у нового пользователя', async ({ transactionsPage }) => {
        //Act
        await transactionsPage.open();
        //Assert
        await transactionsPage.assertNoTransactionsYet();
        await transactionsPage.assertBalanceChanged('Balance: 0');
    });

    //Успешное пополнение баланса
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

    //Неуспешное пополнение баланса - пустой ввод
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

    //Неуспешное пополнение баланса - отрицательная сумма
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

    //Неуспешное пополнение баланса - нулевая сумма
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