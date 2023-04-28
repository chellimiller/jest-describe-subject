import { ContextValue, Context as ContextApi } from './types';

class Context<T extends ContextValue> implements ContextApi<T> {
  protected _value: T;

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get(): T {
    return this._value;
  }

  run<R>(callback: () => R): R {
    const originalValue = this._value;
    this._value = this._value.copy();

    const result = callback();

    this._value = originalValue;
    return result;
  }
}

export default Context;
