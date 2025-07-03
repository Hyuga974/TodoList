import { create } from "domain";
import { db } from '../db/index';

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}
