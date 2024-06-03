export const mockMinioRepo = {
    createBucketIfNotExists: jest.fn(),
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
    deleteFile: jest.fn(),
    // Add other necessary methods that your service uses
};