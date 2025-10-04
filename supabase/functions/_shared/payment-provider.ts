// Payment Provider Abstraction Layer
// This allows easy switching between Vipps and other providers

export interface PaymentProvider {
  createAgreement(params: CreateAgreementParams): Promise<AgreementResponse>;
  cancelAgreement(agreementId: string): Promise<void>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
}

export interface CreateAgreementParams {
  userId: string;
  planType: 'basic' | 'premium';
  priceNok: number;
  callbackUrl: string;
}

export interface AgreementResponse {
  agreementId: string;
  redirectUrl: string;
}

// Vipps MobilePay Implementation
export class VippsProvider implements PaymentProvider {
  private clientId: string;
  private clientSecret: string;
  private merchantSerialNumber: string;
  private subscriptionKey: string;
  private baseUrl: string;

  constructor(config: any) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.merchantSerialNumber = config.merchantSerialNumber;
    this.subscriptionKey = config.subscriptionKey;
    this.baseUrl = config.testMode 
      ? 'https://apitest.vipps.no' 
      : 'https://api.vipps.no';
  }

  async getAccessToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/accesstoken/get`, {
      method: 'POST',
      headers: {
        'client_id': this.clientId,
        'client_secret': this.clientSecret,
        'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get Vipps access token');
    }

    const data = await response.json();
    return data.access_token;
  }

  async createAgreement(params: CreateAgreementParams): Promise<AgreementResponse> {
    const token = await this.getAccessToken();
    
    const agreement = {
      merchantSerialNumber: this.merchantSerialNumber,
      interval: 'MONTH',
      intervalCount: 1,
      currency: 'NOK',
      productName: params.planType === 'premium' ? 'Premium Hyttelisting' : 'Standard Hyttelisting',
      productDescription: `Månedlig abonnement for å liste hytte`,
      price: params.priceNok * 100, // Convert to øre
      merchantAgreementUrl: params.callbackUrl,
    };

    const response = await fetch(`${this.baseUrl}/recurring/v3/agreements`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        'Merchant-Serial-Number': this.merchantSerialNumber,
      },
      body: JSON.stringify(agreement),
    });

    if (!response.ok) {
      throw new Error('Failed to create Vipps agreement');
    }

    const data = await response.json();
    return {
      agreementId: data.agreementId,
      redirectUrl: data.vippsConfirmationUrl,
    };
  }

  async cancelAgreement(agreementId: string): Promise<void> {
    const token = await this.getAccessToken();
    
    const response = await fetch(
      `${this.baseUrl}/recurring/v3/agreements/${agreementId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Merchant-Serial-Number': this.merchantSerialNumber,
        },
        body: JSON.stringify({ status: 'STOPPED' }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to cancel Vipps agreement');
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    // TODO: Implement Vipps webhook signature verification
    // For now, return true (INSECURE - implement in production)
    console.warn('Webhook signature verification not implemented');
    return true;
  }
}

// Mock Provider for Development (no real payment)
export class MockProvider implements PaymentProvider {
  async createAgreement(params: CreateAgreementParams): Promise<AgreementResponse> {
    const agreementId = `mock_${Date.now()}`;
    
    // Return a mock redirect URL that auto-approves
    return {
      agreementId,
      redirectUrl: `/api/mock-payment-callback?agreementId=${agreementId}&status=approved`,
    };
  }

  async cancelAgreement(agreementId: string): Promise<void> {
    console.log('Mock: Cancelled agreement', agreementId);
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    return true; // Mock always verifies
  }
}

// Provider factory
export function getPaymentProvider(config: any): PaymentProvider {
  if (config.provider === 'vipps' && !config.testMode) {
    return new VippsProvider(config);
  }
  
  // Use mock provider by default for development
  return new MockProvider();
}
