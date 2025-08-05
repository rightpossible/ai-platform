'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginButton() {
  return (
    <Button asChild>
      <a href="/auth/login">Login</a>
    </Button>
  );
}