import { UserProfileInterface } from '@domain/interfaces';

export class UserProfileModel implements UserProfileInterface {
  constructor(
    public picture: string,
    public given_name: string,
    public family_name: string,
    public iat: number,
    public email: string,
  ) {
  }

  getFormattedLastAccessData(): string {
    const lastAccessDate = new Date(this.iat * 1000);

    return lastAccessDate.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
  }
}
