import { DescribeSubjectHandler, SubjectOptions, Props, Given, When, Should } from './types';
import SubjectContext from './SubjectContext';
import Subject from './Subject';

function describeSubject<P extends Props, R>(
  name: string,
  handler: DescribeSubjectHandler<P, R>,
  options: SubjectOptions<P, R>,
) {
  const subject = new SubjectContext(new Subject(options));

  const given: Given = (givenName, fn) => {
    subject.run(() => describe(`given ${givenName}`, fn));
  };

  const when: When = (whenName, fn) => {
    subject.run(() => describe(`when ${whenName}`, fn));
  };

  const should: Should<P, R> = (shouldName, fn) => {
    const subjectCopy = subject.get().copy();
    test(`should ${shouldName}`, () =>
      subjectCopy.build().then(async (instance) => {
        await fn(instance);
        await instance.teardown();
      }));
  };

  describe(name, () => {
    handler({ subject, given, when, should });
  });
}

export default describeSubject;
