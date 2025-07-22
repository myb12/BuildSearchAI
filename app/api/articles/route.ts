import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../lib/auth';
import prisma from '../../lib/db'; 

// List User's Articles & Search
export async function GET(request: NextRequest) {
  const authResult = verifyToken(request); 

  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  const userId = authResult.userId;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const tagsParam = searchParams.get('tags'); 

    const whereClause: any = { userId };

    // Add keyword search (title or body)
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } }, // Case-insensitive search
        { body: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Add tag filter
    if (tagsParam) {
      const tagsArray = tagsParam.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      if (tagsArray.length > 0) {
        whereClause.tags = {
          hasEvery: tagsArray,
        };
      }
    }

    const articles = await prisma.article.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }, 
    });

    return NextResponse.json({ articles }, { status: 200 });

  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Create New Article
export async function POST(request: NextRequest) {
  const authResult = verifyToken(request); 

  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  const userId = authResult.userId;

  try {
    const { title, body, tags } = await request.json();

    if (!title || !body) {
      return NextResponse.json({ message: 'Title and body are required' }, { status: 400 });
    }

    const articleTags = Array.isArray(tags) ? tags.map(String) : typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];

    const article = await prisma.article.create({
      data: {
        title,
        body,
        tags: articleTags,
        userId,
      },
    });

    return NextResponse.json({ message: 'Article created successfully', article }, { status: 201 });

  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}