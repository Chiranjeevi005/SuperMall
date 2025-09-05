import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import logger from '@/utils/logger';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();

    const { id } = context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    logger.info('Category fetched', { categoryId: id });

    return NextResponse.json({ category });
  } catch (error: unknown) {
    logger.error('Error fetching category', {
      error: error instanceof Error ? error.message : 'Unknown error',
      categoryId: context.params.id,
    });
    return NextResponse.json(
      { error: 'Something went wrong while fetching category' },
      { status: 500 }
    );
  }
}
