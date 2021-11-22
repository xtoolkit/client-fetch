export abstract class State<T> {
  abstract getValue(): T;
  abstract update(): void;
}

export type StateBuilder = new <T>(data: T) => State<T>;
