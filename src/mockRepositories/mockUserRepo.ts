export class MockUserRepository {
    public async count() {
        return 50;
    }

    public async findAll(options: { skip: number; take: number }) {
        return Array(options.take).fill({
            id: 'id',
            email: 'emily@gmail.com',
            name: 'emily',
            isManager: false,
            createAt: new Date(),
        });
    }

    public async findOneById(id: string) {
        return {
            id: id,
            email: 'emily@gmail.com',
            name: 'emily',
            isManager: false,
            createAt: new Date(),
        };
    }
}
