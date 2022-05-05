import { render } from '@testing-library/react';

import Client from './client';

describe('Client', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Client />);
    expect(baseElement).toBeTruthy();
  });
});
