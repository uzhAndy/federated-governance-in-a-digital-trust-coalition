function registerCredentialDefinitions() {
    if [  -z "$schema_id" ]; then
        schema_id=$(
            curl -s -X GET "http://127.0.0.1:8038/schemas/created" \
                -H "accept: application/json" \
            | jq -r ".schema_ids[] | select(. | split(\":\")[2] == \"${SCHEMA_NAME}\" and split(\":\")[3] == \"${SCHEMA_VERSION}\")"
        )
    fi
    if [  -z "$schema_id_user" ]; then
        schema_id_user=$(
            curl -s -X GET "http://127.0.0.1:8038/schemas/created" \
                -H "accept: application/json" \
            | jq -r ".schema_ids[] | select(. | split(\":\")[2] == \"$SCHEMA_NAME_USER\" and split(\":\")[3] == \"${SCHEMA_VERSION}\")"
        )
    fi
    curl -s -f -X POST "http://127.0.0.1:8038/credential-definitions" \
        -H "accept: application/json" \
        -H "Content-Type: application/json" \
        -d "{ \
                \"tag\": \"employee standard registration\", \
                \"schema_id\": \"$schema_id\", \
                \"support_revocation\": true, \
                \"revocation_registry_size\": 100\
            }"
    
    curl -s -f -X POST "http://127.0.0.1:8038/credential-definitions" \
        -H "accept: application/json" \
        -H "Content-Type: application/json" \
        -d "{ \
                \"tag\": \"controller user registration\", \
                \"schema_id\": \"$schema_id_user\", \
                \"support_revocation\": true, \
                \"revocation_registry_size\": 100 \
            }"
}

function registerSchemas() {
    echo "Registering Schemas"
    SCHEMA_VERSION="1.0"
    SCHEMA_NAME="standard-claims"
    
        curl -s -f -X POST "http://127.0.0.1:8038/schemas" \
            -H  "accept: application/json" \
            -H  "Content-Type: application/json" \
            -d "{ \
                \"schema_name\": \"${SCHEMA_NAME}\", \
                \"schema_version\": \"${SCHEMA_VERSION}\", \
                \"attributes\": [\"sub\", \"family_name\", \"given_name\", \"name\", \"email\", \"updated_at\", \"employee_id\", \"department\", \"role\"]}" \
        | jq -r ".schema_id"
    
    SCHEMA_NAME_USER="controller-user"
    
        curl -s -f -X POST "http://127.0.0.1:8038/schemas" \
            -H  "accept: application/json" \
            -H  "Content-Type: application/json" \
            -d "{\"schema_name\": \"${SCHEMA_NAME_USER}\", \"schema_version\": \"${SCHEMA_VERSION}\", \"attributes\": [\"first_name\", \"last_name\", \"employee_id\", \"role\"]}" \
        | jq -r ".schema_id"
}

registerSchemas
registerCredentialDefinitions