export interface Credential{
    created_at: string;
    modified_at: string | null;
    connection_id: string;
    is_valid: boolean;
    name: string;
    value: string;
    type: string;
    thread_id: string;
    credential_exchange_id: string;
}