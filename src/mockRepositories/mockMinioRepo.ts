export const mockMinioRepo = {
    createBucketIfNotExists: jest.fn(),
    uploadFile: jest.fn(),
    getFileStream: jest.fn(),
    deleteFile: jest.fn(),
    // Add other necessary methods that your service uses
};