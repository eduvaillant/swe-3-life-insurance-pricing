export class PremiumValidator {
  static isValid(premium: number, capital: number): boolean {
    return premium > 0 && premium < capital * 0.3;
  }
}
