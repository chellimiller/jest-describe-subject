export interface ContextValue {
  copy(): this;
}

export interface Context<T extends ContextValue> {
  get(): T;
  run<R>(callback: () => R): R;
}

export interface Subject<P extends Props, R> {
  build(): Promise<SubjectInstance<P, R>>;

  buildWith(props: P): SubjectInstance<P, R>;

  props(builder: PropsBuilder<P>): this;

  action(handler: SubjectActionHandler<P, R>): this;
}

export interface SubjectContextValue<P extends Props, R> extends Subject<P, R>, ContextValue {}

export type Props = Record<string, unknown>;

export type SubjectResultBuilder<P extends Props, R> = {
  (props: P): { result: R; teardown?: () => void };
};

export interface SubjectInstance<P extends Props, R> {
  props: P;
  result: R;
  teardown(): Promise<void> | void;
}

export interface SubjectInstanceTeardown<P extends Props, R> {
  (instance: { props: P; result: R }): Promise<void> | void;
}

export interface SubjectActionHandler<P extends Props, R = unknown> {
  (instance: { props: P; result: R }):
    | Promise<SubjectInstanceTeardown<P, R> | void>
    | SubjectInstanceTeardown<P, R>
    | void;
}

export interface PropsBuilder<P extends Props> {
  (prev: P): P;
}

export interface Given {
  (name: string, fn: () => void): void;
}

export interface When {
  (name: string, fn: () => void): void;
}

export interface Should<P extends Props, R> {
  (name: string, fn: (instance: SubjectInstance<P, R>) => void | Promise<void>): void;
}

export interface DescribeSubjectHandler<P extends Props, R> {
  (params: { subject: Subject<P, R>; given: Given; when: When; should: Should<P, R> }): void;
}

export interface SubjectOptions<P extends Props, R = unknown> {
  defaultProps: P;
  builder: SubjectResultBuilder<P, R>;
}

export interface DescribeSubject {
  <P extends Props = Props, R = unknown>(
    name: string,
    handler: DescribeSubjectHandler<P, R>,
    options: SubjectOptions<P, R>,
  ): void;
}
