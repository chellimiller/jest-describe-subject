import {
  SubjectContextValue,
  Props,
  SubjectInstance,
  SubjectActionHandler,
  PropsBuilder,
  SubjectInstanceTeardown,
  SubjectOptions,
} from './types';

type InternalSubjectState<P extends Props, R> = {
  props: PropsBuilder<P>[];
  actions: SubjectActionHandler<P, R>[];
};

class Subject<P extends Props, R> implements SubjectContextValue<P, R> {
  private _options: SubjectOptions<P, R>;

  private _state: InternalSubjectState<P, R>;

  constructor(options: SubjectOptions<P, R>) {
    this._options = options;
    this._state = {
      props: [],
      actions: [],
    };
  }

  props(builder: PropsBuilder<P>): this {
    this._state.props.push(builder);
    return this;
  }

  action(handler: SubjectActionHandler<P, R>): this {
    this._state.actions.push(handler);
    return this;
  }

  copy(): this {
    const { props, actions } = this._state;
    const copy = new Subject(this._options);
    copy._state = {
      props: [...props],
      actions: [...actions],
    };
    return copy as this;
  }

  async build(): Promise<SubjectInstance<P, R>> {
    const props = this._buildProps();
    const instance = this.buildWith(props);
    const actionTeardown = await this._applyActions(instance);

    if (!actionTeardown) return instance;

    const teardown = async () => {
      await actionTeardown();
      instance.teardown();
    };

    return { ...instance, teardown };
  }

  buildWith(props: P): SubjectInstance<P, R> {
    const { result, teardown = () => {} } = this._options.builder(props);
    return { props, result, teardown };
  }

  private _buildProps(): P {
    const { defaultProps } = this._options;
    const [...builders] = this._state.props;
    return builders.reduce<P>((props, builder) => ({ ...props, ...builder(props) }), defaultProps);
  }

  private async _applyActions(instance: {
    result: R;
    props: P;
  }): Promise<SubjectInstance<P, R>['teardown'] | null> {
    const [...actionHandlers] = this._state.actions;

    const teardownHandlers: SubjectInstanceTeardown<P, R>[] = (await Promise.all(
      actionHandlers.map(async (handler) => handler(instance)),
    ).then((results) => results.filter(Boolean))) as SubjectInstanceTeardown<P, R>[];

    if (!teardownHandlers.length) return null;

    return async () => {
      await Promise.all(teardownHandlers.map((handler) => handler && handler(instance)));
    };
  }
}

export default Subject;
