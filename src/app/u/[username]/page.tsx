import { Metadata } from 'next';
import ProfileClient from '@/components/ProfileClient';

type Props = {
  params: Promise<{ username: string }>; 
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; //
  const username = decodeURIComponent(resolvedParams.username);

  return {
    title: `Send a message to ${username}`,
    description: `Ask ${username} anything anonymously on Whisper Box!`,
    openGraph: {
      title: `Send a secret message to ${username}`,
      description: 'Click to send an anonymous message now. No login required.',
      images: ['/og-image.png'],
    },
  };
}


export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  
  // Pass the unwrapped username to interactive client component
  return <ProfileClient username={resolvedParams.username} />;
}