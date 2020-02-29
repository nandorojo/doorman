type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type PromiseOf<T> = ThenArg<T>
