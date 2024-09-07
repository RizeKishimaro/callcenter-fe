export interface activeAgentProps {
  id: number;
  name: string;
  email: string;
  gender: "Male" | "Female" | "Non-binary";
  img: string;
  isActive: boolean;
  address: string;
  callTime: number;
  rating: string;
  callCount: number[];
}

export interface AgentDto {
  name: string;
  sipName: string;
  password: string;
  profile?: string;
  campaignId?: number;
  sipProviderId?: number;
}
