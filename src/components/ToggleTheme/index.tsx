'use client';
import { useColorMode } from '@chakra-ui/color-mode';
import { IconButton } from '@chakra-ui/button';
import { FaMoon, FaSun } from 'react-icons/fa';

export const ToggleTheme = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      onClick={toggleColorMode}
      aria-label="Toggle Theme"
      data-testid={'icon-' + colorMode}
      icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
    />
  );
};
