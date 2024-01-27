import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

const RootLayout = () => {
	return (
		<TRPCProvider>
			<Stack />
		</TRPCProvider>
	);
};

export default RootLayout;
