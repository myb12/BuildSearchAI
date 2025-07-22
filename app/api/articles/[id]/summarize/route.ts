import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';

// This is a MOCK summarization API.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = verifyToken(request);

  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  const articleId = params.id;
  const { articleBody } = await request.json(); 

  if (!articleBody) {
    return NextResponse.json({ message: 'Article body is required for summarization.' }, { status: 400 });
  }

  try {
    // simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // mock summary logic
    const mockSummary = `This is a mock summary for article "${articleId}". It highlights key points from the provided content, demonstrating how an AI would condense information. For instance, if the article discussed software development, this summary would mention frameworks, methodologies, and best practices in a concise manner. (Actual content: "${articleBody.substring(0, Math.min(articleBody.length, 100))}...")`;

    return NextResponse.json({ summary: mockSummary }, { status: 200 });

  } catch (error) {
    console.error('Mock summarization error:', error);
    return NextResponse.json({ message: 'Internal Server Error during summarization' }, { status: 500 });
  }
}