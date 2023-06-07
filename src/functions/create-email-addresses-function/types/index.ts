export interface CreateEmailAddressEvent {
  version: string;
  id: string;
  detailType: string;
  source: string;
  account: string;
  time: string;
  region: string;
  resources: string[];
  detail: {
    eventType: string;
    eventData: {
      emailAddresses: string[];
    };
  };
}

export interface EmailAddressesCreated {
  emailAddresses: string[];
}
