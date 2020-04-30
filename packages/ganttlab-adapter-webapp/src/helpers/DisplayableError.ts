import { hashCode } from '.';

export class DisplayableError {
  public message: string;
  public hash: number;
  constructor(
    public _message: Error | string,
    public title: string = 'An error occured',
  ) {
    if (_message instanceof Error) {
      this.message = _message.message;
    } else {
      this.message = _message;
    }
    this.hash = hashCode(`${this.message}${title}`);
  }
}
