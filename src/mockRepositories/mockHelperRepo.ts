import { HelperService } from 'src/helper/helper.service';
import { UserReq } from 'src/strategy/jwt.strategy';

export class MockHelperService extends HelperService {
    checkOwnership = jest.fn().mockImplementation((user: UserReq, documentId: string) => Promise.resolve());
    checkIsReviewerOrOwner = jest.fn().mockImplementation((user: UserReq, documentId: string) => Promise.resolve('owner'));
    changeDocumentStatus = jest.fn().mockImplementation((documentId: string, status: string) => Promise.resolve());
}