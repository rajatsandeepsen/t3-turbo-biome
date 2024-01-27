import { useColorScheme } from "nativewind";
import React from "react";
import type { ViewStyle } from "react-native";
import { Text, View, StyleSheet } from "react-native";

import { cn } from "~/lib/utils";

const Card = React.forwardRef<
	React.ElementRef<typeof View>,
	Omit<React.ComponentPropsWithoutRef<typeof View>, "style"> & {
		style?: ViewStyle;
	}
>(({ className, style: styleProp, ...props }, ref) => {
	const { colorScheme } = useColorScheme();
	const [style, setStyle] = React.useState<ViewStyle>(styleProp ?? {});

	React.useEffect(() => {
		setStyle(
			StyleSheet.flatten([
				colorScheme === "dark" ? styles.shadowDark : styles.shadowLight,
				styleProp,
			]),
		);
	}, [styleProp, colorScheme]);

	return (
		<View
			ref={ref}
			className={cn(
				"rounded-lg border border-border bg-card px-0.5 py-2",
				className,
			)}
			style={style}
			{...props}
		/>
	);
});

Card.displayName = "Card";

const CardHeader = React.forwardRef<
	React.ElementRef<typeof View>,
	React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
	<View ref={ref} className={cn("gap-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
	React.ElementRef<typeof Text>,
	React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
	<Text
		ref={ref}
		className={cn(
			"text-2xl native:text-3xl font-semibold leading-none tracking-tight text-foreground",
			className,
		)}
		{...props}
	/>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
	React.ElementRef<typeof Text>,
	React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
	<Text
		ref={ref}
		className={cn("text-sm native:text-base text-muted-foreground", className)}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
	React.ElementRef<typeof View>,
	React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
	<View ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
	React.ElementRef<typeof View>,
	React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
	<View
		ref={ref}
		className={cn("flex items-center p-6 pt-0", className)}
		{...props}
	/>
));
CardFooter.displayName = "CardFooter";

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
};

const styles = StyleSheet.create({
	shadowLight: {
		shadowColor: "#000000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	shadowDark: {
		shadowColor: "#FFFFFF",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.03,
		shadowRadius: 8,
		elevation: 1,
	},
});
