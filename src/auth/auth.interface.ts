import { Auth } from "src/auth/auth.entity";
import { BaseInterfaceRepository } from "src/common/base.interface";

export interface IAuthRepository extends BaseInterfaceRepository<Auth> {}

export const IAuthRepository = Symbol('IAuthRepository');