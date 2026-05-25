'use client';

import { useUser } from '@clerk/nextjs';
import { ReactNode } from 'react';

type Role = 'CLIENT' | 'SHOP' | 'ADMIN';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: Role | Role[];
  fallback?: ReactNode;
}

/**
 * Componente para proteger partes da UI baseado na role do usuário no Clerk.
 */
export function RoleGuard({ children, requiredRole, fallback = null }: RoleGuardProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const userRole = (user?.publicMetadata?.role as Role) || 'CLIENT';
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!roles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
