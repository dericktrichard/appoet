import { NextRequest } from 'next/server';

export function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return false;
  }

  // Extract the token from "Bearer TOKEN"
  const token = authHeader.replace('Bearer ', '');
  
  // Compare with environment variable
  const adminToken = process.env.ADMIN_TOKEN;
  
  if (!adminToken) {
    console.error('ADMIN_TOKEN not set in environment variables');
    return false;
  }

  return token === adminToken;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_token', token);
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
}