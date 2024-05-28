import { BaseInterfaceRepository } from "src/common/base.interface";
import { User } from "./user.entity";

export interface IUserRepository extends BaseInterfaceRepository<User> {}

export const IUserRepository = Symbol('IUserRepository');