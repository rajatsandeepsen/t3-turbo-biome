import { ForceMountable } from '../types';

type Option =
  | {
      value: string;
      label: string;
    }
  | undefined;

interface SelectRootProps {
  value: Option;
  onValueChange: (option: Option) => void;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  disabled?: boolean;
  /**
   * Platform: WEB ONLY
   */
  dir?: 'ltr' | 'rtl';
  /**
   * Platform: WEB ONLY
   */
  name?: string;
  /**
   * Platform: WEB ONLY
   */
  required?: boolean;
}

interface SelectValueProps {
  placeholder: string;
}

interface SelectPortalProps extends ForceMountable {
  children: React.ReactNode;
  /**
   * Platform: NATIVE ONLY
   */
  hostName?: string;
  /**
   * Platform: WEB ONLY
   */
  container?: HTMLElement | null | undefined;
}

interface SelectOverlayProps extends ForceMountable {
  closeOnPress?: boolean;
}

interface SelectContentProps {
  /**
   * Platform: WEB ONLY
   */
  position?: 'popper' | 'item-aligned' | undefined;
}

interface SelectItemProps {
  value: string;
  label: string;
  closeOnPress?: boolean;
}

interface SelectSeparatorProps {
  decorative?: boolean;
}

export type {
  Option,
  SelectContentProps,
  SelectItemProps,
  SelectOverlayProps,
  SelectPortalProps,
  SelectRootProps,
  SelectSeparatorProps,
  SelectValueProps,
};
