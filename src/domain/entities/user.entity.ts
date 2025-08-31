import { IUser, ITransaction } from './interfaces/domain.entities.interface';

export class User implements IUser {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly transactions: ITransaction[],
  ) {}

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  updatePassword(newPassword: string): IUser {
    return new User(
      this.id,
      this.email,
      this.firstName,
      this.lastName,
      newPassword,
      this.createdAt,
      new Date(),
      this.transactions,
    );
  }
}
