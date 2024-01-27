import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

const Index = () => {
	return (
		<SafeAreaView className="bg-[#1F104A]">
			<View className="h-full w-full p-4">
				<View className="py-2">
					<Card className="p-10">
						<Button variant={"destructive"}>Button</Button>
					</Card>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Index;
