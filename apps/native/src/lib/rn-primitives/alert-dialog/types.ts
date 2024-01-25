import type { ForceMountable } from '../types';

type AlertDialogRootProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

interface AlertDialogPortalProps extends ForceMountable {
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
type AlertDialogOverlayProps = ForceMountable & {
  closeOnPress?: boolean;
};
type AlertDialogContentProps = ForceMountable & {
  /**
   * Platform: WEB ONLY
   */
  onOpenAutoFocus?: (ev: Event) => void;
  /**
   * Platform: WEB ONLY
   */
  onCloseAutoFocus?: (ev: Event) => void;
  /**
   * Platform: WEB ONLY
   */
  onEscapeKeyDown?: (ev: Event) => void;
};

export type {
  AlertDialogRootProps,
  AlertDialogPortalProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
};
