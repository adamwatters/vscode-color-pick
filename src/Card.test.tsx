import * as React from 'react';
import { create } from 'react-test-renderer';
import Card from './Card';


describe('Card component', () => {
  it('matches snapshot', () => {
    const Component = create(<Card><p>Card</p></Card>);
    expect(Component.toJSON()).toMatchSnapshot();
  });
});
