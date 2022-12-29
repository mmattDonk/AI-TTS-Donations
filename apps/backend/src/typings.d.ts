export interface subscriptionEvent {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	tier: string;
	message: {
		text: string;
		emotes: [];
	};
	cumulative_months: number;
	streak_months: number;
	duration_months: number;
}

export interface cheerEvent {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	is_anonymous: boolean;
	message: string;
	bits: number;
}

export interface redemptionEvent {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	user_input: string;
	status: string;
	reward: {
		id: string;
		title: string;
		prompt: string;
		cost: number;
	};
	redeemed_at: string;
}

export interface streamer {
	message: string;
	streamer: {
		id: string;
		overlayId: string;
		ttsmessages: [];
		user: {
			id: string;
			name: string;
			email: string;
			emailVerified?: boolean;
			image: string;
		};
		config: {
			id: string;
			channelPointsName: string?;
			channelPointsEnabled: boolean;
			bitsEnabled: boolean;
			resubsEnabled: boolean;
			maxMsgLength: number;
			minBitAmount: number;
			minTipAmount: number;
			minMonthsAmount: number;
			blacklistedWords: string[];
			blacklistedVoices: string[];
			blacklistedUsers: string[];
			blacklistedVoiceEffects: string[];
			fallbackVoice: string;
		}[];
	};
}
