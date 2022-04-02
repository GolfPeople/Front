/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
export class User {
  constructor(
    private access_token: string,
    private expires_at: string,
    public message: string,
    private token_type: string
  ) {}

  get token() {

    return this.access_token;
  }
}
