import { NextRequest, NextFetchEvent } from 'next/server';
import { authorize } from './authMiddleware';

export async function adminMiddleware(request: NextRequest, event: NextFetchEvent) {
  return await authorize(['admin'])(request, event);
}