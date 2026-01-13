
import { NextResponse } from 'next/server';
import { questions } from '@/lib/questions'; 

export const runtime = 'edge';
function shuffleArray<T>(items: T[]): T[] {
  const array = [...items]; 
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export async function POST(req: Request) {
  try {
    // 1. Shuffle the array randomly
   const shuffledQuestions = shuffleArray(questions);

    // Pick first N questions 
    const selectedQuestions = shuffledQuestions.slice(0, 3);

    // Join for prompt / storage
    const messageString = selectedQuestions.join("||");


    // 4. Return as a plain text string 
    return new NextResponse(messageString);
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { message: 'Error processing request', success: false },
      { status: 500 }
    );
  }
}