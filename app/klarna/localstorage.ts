import { v4 as uuidv4 } from "uuid";

interface StateData {
  fcId?: string;
  status?: "pending" | "completed" | "failed";
  [key: string]: any;
}

export interface CustomerData {
  id: string;
  email?: string | null;
  name?: string | null;
  testmode: boolean;
  stateIds: {
    [stateId: string]: StateData;
  };
}

const CUSTOMERS_KEY = "michaelyangd_klarna_Customers";
const ACTIVE_CUSTOMER_KEY = "michaelyangd_klarna_activeCustomerId";
const PASSWORD_KEY = "michaelyangd_klarna_Password";

export function setPassword(password: string): void {
  localStorage.setItem(PASSWORD_KEY, password);
}

export function getPassword(): string | null {
  return localStorage.getItem(PASSWORD_KEY);
}

export function setActiveCustomerId(customerId: string): void {
  localStorage.setItem(ACTIVE_CUSTOMER_KEY, customerId);
}

export function getActiveCustomerId(): string | null {
  return localStorage.getItem(ACTIVE_CUSTOMER_KEY);
}

export function clearActiveCustomerId(): void {
  localStorage.removeItem(ACTIVE_CUSTOMER_KEY);
}

export function saveCustomerData(customerData: CustomerData): void {
  const customers = getAllCustomers();
  customers[customerData.id] = customerData;
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

export function getAllCustomers(): { [customerId: string]: CustomerData } {
  const customersJson = localStorage.getItem(CUSTOMERS_KEY);
  return customersJson ? JSON.parse(customersJson) : {};
}

export function getCustomerData(customerId: string): CustomerData | null {
  const customers = getAllCustomers();
  return customers[customerId] || null;
}

function saveAllCustomers(customers: {
  [customerId: string]: CustomerData;
}): void {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

export function generateStateId(
  customerId: string,
  initialData: StateData = {}
): string {
  const stateId = uuidv4();
  const customers = getAllCustomers();

  if (!customers[customerId]) {
    throw new Error("Customer not found");
  }

  customers[customerId].stateIds[stateId] = { ...initialData, id: stateId };
  saveAllCustomers(customers);
  return stateId;
}

export function updateStateData(
  customerId: string,
  stateId: string,
  data: Partial<StateData>
): void {
  const customers = getAllCustomers();
  if (customers[customerId] && customers[customerId].stateIds[stateId]) {
    customers[customerId].stateIds[stateId] = {
      ...customers[customerId].stateIds[stateId],
      ...data,
    };
    saveAllCustomers(customers);
  }
}

export function getStateData(
  customerId: string,
  stateId: string
): StateData | null {
  const customers = getAllCustomers();
  return customers[customerId]?.stateIds[stateId] || null;
}

export function clearStateData(customerId: string, stateId: string): void {
  const customers = getAllCustomers();
  if (customers[customerId] && customers[customerId].stateIds[stateId]) {
    delete customers[customerId].stateIds[stateId];
    saveAllCustomers(customers);
  }
}

export function getAllStateIds(customerId: string): string[] {
  const customers = getAllCustomers();
  return customers[customerId]
    ? Object.keys(customers[customerId].stateIds)
    : [];
}

export function updateCustomerData(
  customerId: string,
  data: Partial<Omit<CustomerData, "stateIds">>
): void {
  const customers = getAllCustomers();
  if (!customers[customerId]) {
    throw new Error("Customer not found");
  } else {
    customers[customerId] = { ...customers[customerId], ...data };
  }
  saveAllCustomers(customers);
}

export function getStateStatus(
  customerId: string,
  stateId: string
): StateData["status"] | null {
  const customers = getAllCustomers();
  return customers[customerId]?.stateIds[stateId]?.status || null;
}

export function getStateDataByStateId(
  stateId: string
): { customerId: string; stateData: StateData } | null {
  const customers = getAllCustomers();
  for (const customerId in customers) {
    if (customers[customerId].stateIds[stateId]) {
      return {
        customerId,
        stateData: customers[customerId].stateIds[stateId],
      };
    }
  }
  return null;
}
