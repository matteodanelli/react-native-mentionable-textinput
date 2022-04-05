import DeviceInfo from 'react-native-device-info';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

const useXiaomiWorkaround = () => {
  const needsXiaomiWorkaround = useCallback(() => {
    return (
      DeviceInfo.getBrand() !== undefined &&
      ['redmi', 'xiaomi', 'poco', 'pocophone'].includes(
        DeviceInfo.getBrand().toLowerCase()
      ) &&
      Platform.Version > 28
    );
  }, []);

  const [hackCaretHidden, setHackCaretHidden] = useState<boolean>(
    needsXiaomiWorkaround()
  );

  const onFocus = useCallback(() => {
    if (needsXiaomiWorkaround()) {
      setHackCaretHidden(false);
    }
  }, [needsXiaomiWorkaround]);

  return { hackCaretHidden, onFocus };
};

export default useXiaomiWorkaround;
