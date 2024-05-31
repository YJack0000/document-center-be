export const mockCommentRepository = () => ({
    count: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});