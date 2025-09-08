export class ValidationStrategy {
    
  constructor(validators = []) {
    this.validators = validators;
  }

  addValidator(validator) {
    this.validators.push(validator);
  }

  async validate(data) {
    const errors = [];
    
    for (const validator of this.validators) {
      try {
        await validator.validate(data);
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return true;
  }
}

export class CardNumberValidator {
  async validate(cardData) {
    if (!cardData.cardNumber || !/^\d{16}$/.test(cardData.cardNumber)) {
      throw new Error('Número de tarjeta inválido');
    }
  }
}

export class CardHolderValidator {
  async validate(cardData) {
    if (!cardData.cardHolder || cardData.cardHolder.trim().split(' ').length < 2) {
      throw new Error('Nombre del titular inválido');
    }
  }
}