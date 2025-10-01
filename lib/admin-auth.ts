import { cookies } from 'next/headers';

const ADMIN_PASSWORD = 'MileHighClub1';
const ADMIN_COOKIE_NAME = 'signalsgeo_admin_auth';

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  return adminCookie?.value === 'authenticated';
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

