import Context from './Context';
import {
  Subject,
  SubjectActionHandler,
  SubjectContextValue,
  SubjectInstance,
  Props,
  PropsBuilder,
} from './types';

class SubjectContext<P extends Props, R>
  extends Context<SubjectContextValue<P, R>>
  implements Subject<P, R>
{
  build(): Promise<SubjectInstance<P, R>> {
    return this._value.build();
  }

  buildWith(props: P): SubjectInstance<P, R> {
    return this._value.buildWith(props);
  }

  props(builder: PropsBuilder<P>): this {
    this._value.props(builder);
    return this;
  }

  action(handler: SubjectActionHandler<P, R>): this {
    this._value.action(handler);
    return this;
  }
}

export default SubjectContext;
