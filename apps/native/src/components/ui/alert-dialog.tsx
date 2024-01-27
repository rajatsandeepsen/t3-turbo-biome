import { useColorScheme } from "nativewind";
import React from "react";
import {
	GestureResponderEvent,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from "react-native";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import * as Slot from "~/lib/rn-primitives/slot/slot-native";

interface AlertDialogProps {
	children: React.ReactNode;
	closeOnOverlayPress?: boolean;
	defaultOpen?: boolean;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
interface AlertDialogContext {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	closeOnOverlayPress: boolean;
}

const AlertDialogContext = React.createContext<AlertDialogContext>(
	{} as AlertDialogContext,
);

const AlertDialog = React.forwardRef<
	React.ElementRef<typeof View>,
	React.ComponentPropsWithoutRef<typeof View> & AlertDialogProps
>(
	(
		{
			open,
			setOpen,
			closeOnOverlayPress = false,
			defaultOpen = false,
			...props
		},
		ref,
	) => {
		const [visible, setVisible] = React.useState(defaultOpen ?? false);
		return (
			<AlertDialogContext.Provider
				value={{
					visible: open ?? visible,
					setVisible: setOpen ?? setVisible,
					closeOnOverlayPress,
				}}
			>
				<View ref={ref} {...props} />
			</AlertDialogContext.Provider>
		);
	},
);

AlertDialog.displayName = "AlertDialog";

function useAlertDialogContext() {
	const context = React.useContext(AlertDialogContext);
	if (!context) {
		throw new Error(
			"AlertDialog compound components cannot be rendered outside the AlertDialog component",
		);
	}
	return context;
}

const AlertDialogTrigger = React.forwardRef<
	React.ElementRef<typeof Button>,
	React.ComponentPropsWithoutRef<typeof Button> & {
		asChild?: boolean;
	}
>(({ onPress, asChild = false, ...props }, ref) => {
	const { setVisible } = useAlertDialogContext();
	function handleOnPress(event: GestureResponderEvent) {
		setVisible(true);
		onPress?.(event);
	}

	const Trigger = asChild ? Slot.Pressable : Button;
	return <Trigger ref={ref} onPress={handleOnPress} {...props} />;
});

AlertDialogTrigger.displayName = "AlertDialogTrigger";

const AlertDialogContent = React.forwardRef<
	React.ElementRef<typeof Modal>,
	React.ComponentPropsWithoutRef<typeof Modal> & { overlayClass?: string }
>(
	(
		{
			className,
			children,
			animationType = "fade",
			style: styleProp,
			overlayClass,
			...props
		},
		ref,
	) => {
		const { colorScheme } = useColorScheme();
		const { visible, setVisible, closeOnOverlayPress } =
			useAlertDialogContext();
		const [style, setStyle] = React.useState<ViewStyle>(
			StyleSheet.flatten(styleProp),
		);

		React.useEffect(() => {
			setStyle(
				StyleSheet.flatten([
					colorScheme === "dark" ? styles.shadowDark : styles.shadowLight,
					styleProp,
				]),
			);
		}, [styleProp, colorScheme]);

		return (
			<Modal
				ref={ref}
				animationType={animationType}
				transparent={true}
				visible={visible}
				onRequestClose={() => {
					setVisible((prev) => !prev);
				}}
				statusBarTranslucent
				{...props}
			>
				<Pressable
					onPressOut={
						closeOnOverlayPress
							? () => {
									setVisible(false);
							  }
							: undefined
					}
					className={cn(
						"flex-1  justify-center items-center p-2",
						animationType !== "slide" && "bg-zinc-50/80 dark:bg-zinc-900/80",
						overlayClass,
					)}
				>
					<Pressable
						style={style}
						className={cn(
							"bg-background rounded-2xl p-8 border border-border",
							className,
						)}
						role={"alertdialog"}
					>
						{children}
					</Pressable>
				</Pressable>
			</Modal>
		);
	},
);

AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = React.forwardRef<
	React.ElementRef<typeof View>,
	React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => {
	return <View className={cn("gap-2", className)} ref={ref} {...props} />;
});

AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogTitle = React.forwardRef<
	React.ElementRef<typeof Text>,
	React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => {
	return (
		<Text
			className={cn("text-xl text-foreground font-semibold", className)}
			ref={ref}
			role="heading"
			{...props}
		/>
	);
});

AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef<
	React.ElementRef<typeof Text>,
	React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => {
	return (
		<Text
			className={cn("text-lg text-muted-foreground", className)}
			ref={ref}
			{...props}
		/>
	);
});

AlertDialogDescription.displayName = "AlertDialogDescription";

const AlertDialogFooter = React.forwardRef<
	React.ElementRef<typeof View>,
	React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => {
	return (
		<View
			className={cn("flex-row justify-end gap-3 pt-8", className)}
			ref={ref}
			{...props}
		/>
	);
});

AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogCancel = React.forwardRef<
	React.ElementRef<typeof Button>,
	React.ComponentPropsWithoutRef<typeof Button> & {
		asChild?: boolean;
	}
>(({ variant = "outline", asChild = false, ...props }, ref) => {
	const { setVisible } = useAlertDialogContext();
	const Trigger = asChild ? Slot.Pressable : Button;
	return (
		<Trigger
			variant={variant}
			onPress={() => {
				setVisible(false);
			}}
			ref={ref}
			{...props}
		/>
	);
});

AlertDialogCancel.displayName = "AlertDialogCancel";

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

const AlertDialogAction = React.forwardRef<
	React.ElementRef<typeof Pressable>,
	Omit<ButtonProps, "onPress"> & {
		asChild?: boolean;
		onPress?:
			| ((event: GestureResponderEvent) => void)
			| ((event: GestureResponderEvent) => Promise<void>);
	}
>(({ onPress, asChild, ...props }, ref) => {
	const { setVisible } = useAlertDialogContext();
	async function onPressAction(ev: GestureResponderEvent) {
		await onPress?.(ev);
		setVisible(false);
	}

	const Trigger = asChild ? Slot.Pressable : Button;
	return <Trigger onPress={onPressAction} ref={ref} {...props} />;
});

AlertDialogAction.displayName = "AlertDialogAction";

export {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
};

const styles = StyleSheet.create({
	shadowLight: {
		shadowColor: "#000000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
	shadowDark: {
		shadowColor: "#000000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 5,
	},
});
