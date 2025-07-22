import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';
import prisma from '../../../lib/db';

// get single article
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

// delete article
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = verifyToken(request);

  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  const userId = authResult.userId;
  const articleId = params.id; 

  try {
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }

    if (existingArticle.userId !== userId) {
      return NextResponse.json({ message: 'Forbidden: You do not own this article' }, { status: 403 });
    }

    await prisma.article.delete({
      where: { id: articleId },
    });

    return NextResponse.json({ message: 'Article deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}