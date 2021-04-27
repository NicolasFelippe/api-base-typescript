import { Request } from 'express';
import { User } from '../entities/User';

export interface RequestModel extends Request{
    auth: User
}