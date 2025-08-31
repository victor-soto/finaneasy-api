/**
 * Domain DTO for creating a user
 * Contains validation rules and business constraints
 */
export class CreateUserDto {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly password: string,
  ) {}

  /**
   * Domain validation: Check if all required fields are present
   */
  isValid(): boolean {
    return (
      this.email.trim().length > 0 &&
      this.firstName.trim().length > 0 &&
      this.lastName.trim().length > 0 &&
      this.password.length >= 6
    );
  }

  /**
   * Domain validation: Check if email format is valid
   */
  hasValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  /**
   * Domain validation: Get all validation errors
   */
  getValidationErrors(): string[] {
    const errors: string[] = [];

    if (!this.email.trim()) {
      errors.push('Email is required');
    } else if (!this.hasValidEmail()) {
      errors.push('Email format is invalid');
    }

    if (!this.firstName.trim()) {
      errors.push('First name is required');
    }

    if (!this.lastName.trim()) {
      errors.push('Last name is required');
    }

    if (this.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  }
}
