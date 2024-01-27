import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { View } from "react-native";
import * as Slot from "~/lib/rn-primitives/slot";
import type { SlottableViewProps } from "~/lib/rn-primitives/types";
import { cn } from "~/lib/utils";
import { TextClassContext } from "~/components/universal-ui/typography";

const badgeVariants = cva(
	"web:inline-flex items-center rounded-full border border-border px-2.5 py-0.5 web:transition-colors web:focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary hover:opacity-80 active:opacity-80",
				secondary:
					"border-transparent bg-secondary hover:opacity-80 active:opacity-80",
				destructive:
					"border-transparent bg-destructive hover:opacity-80 active:opacity-80",
				outline: "text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const badgeTextVariants = cva("text-xs font-semibold ", {
	variants: {
		variant: {
			default: "text-primary-foreground",
			secondary: "text-secondary-foreground",
			destructive: "text-destructive-foreground",
			outline: "text-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

type BadgeProps = SlottableViewProps & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
	const Component = asChild ? Slot.View : View;
	return (
		<TextClassContext.Provider value={badgeTextVariants({ variant })}>
			<Component
				className={cn(badgeVariants({ variant }), className)}
				{...props}
			/>
		</TextClassContext.Provider>
	);
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
