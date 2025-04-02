export interface UserProfileInterface {
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  email: string;

  getFormattedLastAccessData(): string;
}
