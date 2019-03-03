export default class AlexaUser {
  private _id: string;
  private _domain: string;
  private _raw: string;

  constructor(user: string) {
    let userParts = user.split('.');
    this._id = userParts.pop();
    this._domain = userParts.join(".");
    this._raw = user;
  }

  public get raw() {
    return this._raw;
  }

  public toString = (): string => {
    return this._id.substring(0,4) + "..." + this._id.slice(-2);
  }
}
