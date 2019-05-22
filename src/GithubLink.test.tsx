import * as React from 'react';
import { create } from 'react-test-renderer';
import GithubLink from './GithubLink';


describe('GithubLink component', () => {
  it('matches snapshot', () => {
  const Component = create(<GithubLink link={"link"}/>);
    expect(Component.toJSON()).toMatchSnapshot();
  });
});
