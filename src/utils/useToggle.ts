import { useState } from 'react';

export function useToggle(initial: boolean): [boolean, () => void] {
  const [isToggled, setIsToggled] = useState(initial);
  const toggle = () => setIsToggled(!isToggled);
  return [isToggled, toggle];
}
