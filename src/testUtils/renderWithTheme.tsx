import React, { ReactElement } from 'react';

import { render } from '@testing-library/react';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';

export const renderWithTheme = (component: ReactElement) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <CacheProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  );

  return render(component, { wrapper: Wrapper });
};
