import { faker } from '@faker-js/faker';

export type TestUser = {
    name: string;
    surname: string;
    email: string;
    password: string;
    phone: string;
};

export function generateUser(): TestUser {
    return {
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: `test_${Date.now()}_${faker.string.alphanumeric(6)}@mail.ru`,
        password: 'Password123!',
        phone: generatePhone(),
    };
}

export function generatePhone(): string {
    const digits = faker.string.numeric(10);
    return `+7${digits}`;
}

export function generateAmountToTransfer(): number {
    return faker.number.float({min: 100, max: 10000});
}


export function generatePurpose(): string {
    return faker.lorem.sentence();
}