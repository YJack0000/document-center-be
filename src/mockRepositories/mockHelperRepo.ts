import { HelperService } from 'src/helper/helper.service';

export class MockHelperService extends HelperService {
    checkOwnership = jest.fn();
    checkIsReviewerOrOwner = jest.fn();
    changeDocumentStatus = jest.fn();
}
