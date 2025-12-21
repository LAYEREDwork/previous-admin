import { BiMoon, BiSun } from 'react-icons/bi';
import { HiComputerDesktop } from 'react-icons/hi2';

// Components
import { PASegmentedControl } from './PASegmentedControl';

// Hooks
import { useTheme } from '../../contexts/PAThemeContext';
import { useControlSize } from '../../hooks/useControlSize';

/**
 * Theme Switcher Component
 * PA prefix for Previous Admin
 */
export function PAThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const controlSize = useControlSize('sm');

  return (
    <PASegmentedControl
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