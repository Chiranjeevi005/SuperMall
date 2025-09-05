import { NextRequest, NextFetchEvent } from 'next/server';
import { authorize } from './authMiddleware';

export async function vendorMiddleware(request: NextRequest, event: NextFetchEvent) {
  return await authorize(['admin', 'merchant'])(request, event);
}