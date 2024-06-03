import { find } from "rxjs";

export const mockPublicDocumentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    remove: jest.fn(),
    unpublishDocument: jest.fn(),
    publishDocument: jest.fn(),
    getPublicDocumentsByUserId: jest.fn(),
    getAllPublicDocuments: jest.fn(),
    updatePublicDocumentStatus: jest.fn(),
};