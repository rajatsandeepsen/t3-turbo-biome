import {
	AlignJustify,
	Check,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	type LucideIcon,
	MoonStar,
	Sun,
	X,
} from "lucide-react-native";
import { cssInterop } from "nativewind";

function interopIcon(icon: LucideIcon) {
	cssInterop(icon, {
		interopIcon: true,
	});
	//     // class: {
	//     //   target: 'style',
	//     //   nativeStyleToProp: {
	//     //     color: true,
	//     //     opacity: true,
	//     //   },
	//     // },
	// });
}

interopIcon(ChevronUp);
interopIcon(ChevronDown);
interopIcon(Check);
interopIcon(AlignJustify);
interopIcon(ChevronRight);
interopIcon(Sun);
interopIcon(MoonStar);
interopIcon(X);

export {
	Check,
	ChevronDown,
	ChevronUp,
	AlignJustify,
	Sun,
	MoonStar,
	ChevronRight,
	X,
};
export type { LucideIcon };
