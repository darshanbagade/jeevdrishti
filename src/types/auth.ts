export type UserRole = 'field' | 'reviewer' | 'admin';

export type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};
