import React from 'react';
import {
  BackHandler,
  Pressable,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type LayoutRectangle,
} from 'react-native';
import { StoreApi, createStore, useStore } from 'zustand';
import {
  useRelativePosition,
  type LayoutPosition,
} from '../hooks/useRelativePosition';
import { Portal as RNPPortal } from '../portal';
import * as Slot from '../slot';
import type {
  PositionedContentProps,
  PressableRef,
  SlottablePressableProps,
  SlottableViewProps,
  ViewRef,
} from '../types';
import type {
  TooltipOverlayProps,
  TooltipPortalProps,
  TooltipRootProps,
} from './types';

interface RootStoreContext {
  triggerPosition: LayoutPosition | null;
  setTriggerPosition: (triggerPosition: LayoutPosition | null) => void;
  contentLayout: LayoutRectangle | null;
  setContentLayout: (contentLayout: LayoutRectangle | null) => void;
  nativeID: string;
}

const RootContext = React.createContext<TooltipRootProps | null>(null);
const RootStoreContext = React.createContext<StoreApi<RootStoreContext> | null>(
  null
);

const Root = React.forwardRef<ViewRef, SlottableViewProps & TooltipRootProps>(
  (
    {
      asChild,
      open,
      onOpenChange,
      delayDuration: _delayDuration,
      skipDelayDuration: _skipDelayDuration,
      disableHoverableContent: _disableHoverableContent,
      ...viewProps
    },
    ref
  ) => {
    const nativeID = React.useId();
    const storeRef = React.useRef<StoreApi<RootStoreContext> | null>(null);
    if (!storeRef.current) {
      storeRef.current = createStore((set) => ({
        triggerPosition: null,
        setTriggerPosition: (triggerPosition: LayoutPosition | null) =>
          set({ triggerPosition }),
        contentLayout: null,
        setContentLayout: (contentLayout: LayoutRectangle | null) =>
          set({ contentLayout }),
        nativeID,
      }));
    }

    const Component = asChild ? Slot.View : View;
    return (
      <RootStoreContext.Provider value={storeRef.current}>
        <RootContext.Provider value={{ open, onOpenChange }}>
          <Component ref={ref} {...viewProps} />
        </RootContext.Provider>
      </RootStoreContext.Provider>
    );
  }
);

Root.displayName = 'RootNativeTooltip';

function useTooltipContext() {
  const context = React.useContext(RootContext);
  if (!context) {
    throw new Error(
      'Tooltip compound components cannot be rendered outside the Tooltip component'
    );
  }
  return context;
}

function useRootStoreContext<T>(selector: (state: RootStoreContext) => T): T {
  const store = React.useContext(RootStoreContext);
  if (!store) {
    throw new Error(
      'Tooltip compound components cannot be rendered outside the Tooltip component'
    );
  }
  return useStore(store, selector);
}

function useGetRootStore() {
  const store = React.useContext(RootStoreContext);
  if (!store) {
    throw new Error(
      'Tooltip compound components cannot be rendered outside the Tooltip component'
    );
  }
  return store;
}

const Trigger = React.forwardRef<PressableRef, SlottablePressableProps>(
  ({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const triggerRef = React.useRef<View>(null);
    const { open, onOpenChange } = useTooltipContext();
    const setTriggerPosition = useRootStoreContext(
      (state) => state.setTriggerPosition
    );

    React.useImperativeHandle(
      ref,
      () => {
        if (!triggerRef.current) {
          return new View({});
        }
        return triggerRef.current;
      },
      [triggerRef.current]
    );

    function onPress(ev: GestureResponderEvent) {
      if (disabled) return;
      triggerRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
        setTriggerPosition({ width, pageX, pageY: pageY, height });
      });
      const newValue = !open;
      onOpenChange(newValue);
      onPressProp?.(ev);
    }

    const Component = asChild ? Slot.Pressable : Pressable;
    return (
      <Component
        ref={triggerRef}
        aria-disabled={disabled ?? undefined}
        role='button'
        onPress={onPress}
        disabled={disabled ?? undefined}
        {...props}
      />
    );
  }
);

Trigger.displayName = 'TriggerNativeTooltip';

/**
 * @warning when using a custom `<PortalHost />`, you might have to adjust the Content's sideOffset to account for nav elements like headers.
 */
function Portal({ forceMount, hostName, children }: TooltipPortalProps) {
  const value = useTooltipContext();
  const triggerPosition = useRootStoreContext((state) => state.triggerPosition);
  const nativeID = useRootStoreContext((state) => state.nativeID);
  const store = useGetRootStore();

  if (!triggerPosition) {
    return null;
  }

  if (!forceMount) {
    if (!value.open) {
      return null;
    }
  }

  return (
    <RNPPortal hostName={hostName} name={`${nativeID}_portal`}>
      <RootStoreContext.Provider value={store}>
        <RootContext.Provider value={value}>{children}</RootContext.Provider>
      </RootStoreContext.Provider>
    </RNPPortal>
  );
}

const Overlay = React.forwardRef<
  PressableRef,
  SlottablePressableProps & TooltipOverlayProps
>(
  (
    {
      asChild,
      forceMount,
      onPress: OnPressProp,
      closeOnPress = true,
      ...props
    },
    ref
  ) => {
    const { open, onOpenChange } = useTooltipContext();
    const setTriggerPosition = useRootStoreContext(
      (state) => state.setTriggerPosition
    );
    const setContentLayout = useRootStoreContext(
      (state) => state.setContentLayout
    );

    function onPress(ev: GestureResponderEvent) {
      if (closeOnPress) {
        setTriggerPosition(null);
        setContentLayout(null);
        onOpenChange(false);
      }
      OnPressProp?.(ev);
    }

    if (!forceMount) {
      if (!open) {
        return null;
      }
    }

    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} onPress={onPress} {...props} />;
  }
);

Overlay.displayName = 'OverlayNativeTooltip';

/**
 * @info `position`, `top`, `left`, and `maxWidth` style properties are controlled internally. Opt out of this behavior on native by setting `disablePositioningStyle` to `true`.
 */
const Content = React.forwardRef<
  ViewRef,
  SlottableViewProps & PositionedContentProps
>(
  (
    {
      asChild = false,
      forceMount,
      align = 'center',
      side = 'top',
      sideOffset = 0,
      alignOffset = 0,
      avoidCollisions = true,
      onLayout: onLayoutProp,
      insets,
      style,
      disablePositioningStyle,
      ...props
    },
    ref
  ) => {
    const { open, onOpenChange } = useTooltipContext();
    const nativeID = useRootStoreContext((state) => state.nativeID);
    const triggerPosition = useRootStoreContext(
      (state) => state.triggerPosition
    );
    const setTriggerPosition = useRootStoreContext(
      (state) => state.setTriggerPosition
    );
    const contentLayout = useRootStoreContext((state) => state.contentLayout);
    const setContentLayout = useRootStoreContext(
      (state) => state.setContentLayout
    );

    React.useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          setTriggerPosition(null);
          setContentLayout(null);
          onOpenChange(false);
          return true;
        }
      );

      return () => {
        setContentLayout(null);
        backHandler.remove();
      };
    }, []);

    const positionStyle = useRelativePosition({
      align,
      avoidCollisions,
      triggerPosition,
      contentLayout,
      alignOffset,
      insets,
      sideOffset,
      side,
      disablePositioningStyle,
    });

    function onLayout(event: LayoutChangeEvent) {
      setContentLayout(event.nativeEvent.layout);
      onLayoutProp?.(event);
    }

    if (!forceMount) {
      if (!open) {
        return null;
      }
    }

    const Component = asChild ? Slot.View : View;
    return (
      <Component
        ref={ref}
        role='tooltip'
        nativeID={nativeID}
        aria-modal={true}
        style={[positionStyle, style]}
        onLayout={onLayout}
        onStartShouldSetResponder={onStartShouldSetResponder}
        {...props}
      />
    );
  }
);

Content.displayName = 'ContentNativeTooltip';

export { Content, Overlay, Portal, Root, Trigger };

function onStartShouldSetResponder() {
  return true;
}
