import type { UserRole } from '@/types/auth';

export function canCapture(_role: UserRole): boolean {
  return true;
}

export function canReview(role: UserRole): boolean {
  return role === 'reviewer' || role === 'admin';
}

export function canApprove(role: UserRole): boolean {
  return role === 'admin';
}

export function canSeeExactLocation(role: UserRole): boolean {
  return role === 'reviewer' || role === 'admin';
}

export function formatCoordinates(
  latitude: number,
  longitude: number,
  role: UserRole,
): { latitude: number; longitude: number } {
  const digits = canSeeExactLocation(role) ? 6 : 2;
  const factor = 10 ** digits;

  return {
    latitude: Math.round(latitude * factor) / factor,
    longitude: Math.round(longitude * factor) / factor,
  };
}
