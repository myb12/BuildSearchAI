import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';
import prisma from '../../../lib/db';

// Get Single Article
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = verifyToken(request);

  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  const userId = authResult.userId;
  const articleId = params.id;

  try {
    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
        userId: userId,
      },
    });

    if (!article) {
      return NextResponse.json({ message: 'Article not found or you do not have permission' }, { status: 404 });
    }

    return NextResponse.json({ article }, { status: 200 });

  } catch (error) {
    console.error('Error fetching single article:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

