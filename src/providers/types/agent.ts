export interface activeAgentProps {
    id: number;
    name: string;
    email: string;
    gender: 'Male' | 'Female' | 'Non-binary';
    img: string;
    isActive: boolean;
    address: string;
    callTime: number;
    rating: string;
    callCount: number[]
  }