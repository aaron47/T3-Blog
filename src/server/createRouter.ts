import superjson from 'superjson';
import { Context } from './createContext';
import { router } from '@trpc/server';

export const createRouter = () => router<Context>().transformer(superjson);
