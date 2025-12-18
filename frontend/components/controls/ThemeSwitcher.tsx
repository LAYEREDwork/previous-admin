import { BiMoon, BiSun } from 'react-icons/bi';
import { HiComputerDesktop } from 'react-icons/hi2';

// Components
import { AnimatedSegmentedControl } from './AnimatedSegmentedControl';

// Hooks
import { useTheme } from '../../contexts/ThemeContext';
import { useControlSize } from '../../hooks/useControlSize';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const controlSize = useControlSize('sm');

  return (
    <AnimatedSegmentedControl
      options={[
        { value: 'system', icon: <HiComputerDesktop size={18} />, label: 'System theme' },
        { value: 'light', icon: <BiSun size={18} />, label: 'Light mode' },
        { value: 'dark', icon: <BiMoon size={18} />, label: 'Dark mode' },
      ]}
      value={theme}
      onChange={setTheme}
      iconOnly
      size={controlSize}
    />
  );
}