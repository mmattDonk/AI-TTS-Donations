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
