import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { ConnectionStatus } from 'src/app/enums/connection-status';
import { Connection } from 'src/app/models/connection';
import {
  Attribute,
  CredentialIssueBody,
  CredentialProposal,
  FilterWrapper,
  IndyFilter,
} from 'src/app/models/credential';
import { Schema, SchemaAttributes } from 'src/app/models/schema';
import { AgentService } from 'src/app/services/agent.service';
import {
  createAttributesFromSchema,
  getSchemaMetas,
} from 'src/app/shared/helpers/schemaHelpers';

@Component({
  selector: 'app-issue-credentials',
  templateUrl: './issue-credentials.component.html',
  styleUrls: ['./issue-credentials.component.scss'],
})
export class IssueCredentialsExchangeComponent {
  schemaAttributes: Attribute[];
  testAttributes: Attribute[];
  connections: Connection[];
  schemas: Schema[];
  selectedSchema: SchemaAttributes;
  selectedSchemaId: string;
  credDefId: string;
  submitDisabled: boolean = true;
  validated: boolean = false;
  selectedConnectionId: string;

  constructor(private agentService: AgentService, private router: Router) {}

  ngOnInit() {
    this.agentService
      .getConnections()
      .pipe(
        map(
          (connections: Connection[]) =>
            (this.connections = connections.filter(
              (connection: Connection) =>
                connection.state === ConnectionStatus.ACTIVE && connection.alias != "login connection"
            ))
        )
      )
      .subscribe();

    this.agentService
      .getSchemas()
      .pipe(
        map((schemaIds: any) => {
          this.schemas = getSchemaMetas(schemaIds);
        })
      )
      .subscribe();
  }

  handleAttributes($event: boolean) {
    this.submitDisabled = !$event;
  }

  handleChange($event: Event) {
    const htmlElement = $event.target as HTMLSelectElement;
    this.selectedSchemaId = htmlElement.value;

    this.agentService
      .getCredentialDefinitions(this.selectedSchemaId)
      .pipe(
        map((cred_ids: string[]) => {
          this.credDefId = cred_ids[0];
        })
      ).subscribe();
    this.agentService
      .getSchema(this.selectedSchemaId)
      .pipe(
        map((el: SchemaAttributes) => {
          this.selectedSchema = el;
          this.schemaAttributes = createAttributesFromSchema(el.attrNames);
        })
      )
      .subscribe();
  }

  handleSubmit() {

    const schemaId = this.selectedSchemaId;
    const issuerDid = schemaId.split(':')[0];
    const schemaVersion = this.selectedSchema.version;
    const schemaName = this.selectedSchema.name;
    const comment = `Issuing credentials for schema ${schemaName}`;
    const trace = false;

    const submitAttributes: Attribute[] = [];

    this.validated = true;
    this.schemaAttributes.forEach((att: Attribute) => {
      if (!att.value) {
        att.error =
          'Cannot be empty';
        this.validated = false;
      } else {
        submitAttributes.push({ name: att.name, value: att.value });
      }
    });

    if (this.validated) {
      const credentialProposal: CredentialProposal = {
        '@type': 'issue-credential/2.0/credential-preview',
        attributes: submitAttributes,
      };

      const filter: IndyFilter = {
        cred_def_id: this.credDefId,
        issuer_did: issuerDid,
        schema_id: this.selectedSchemaId,
        schema_issuer_did: issuerDid,
        schema_name: schemaName,
        schema_version: schemaVersion,
      };

      const filterWrapper: FilterWrapper = {
        indy: filter,
      };

      const body: CredentialIssueBody = {
        auto_remove: true,
        comment: comment,
        connection_id: this.selectedConnectionId,
        credential_preview: credentialProposal,
        filter: filterWrapper,
        trace: trace,
      };

      this.agentService
        .issueCredential(body)
        .pipe(map(() => this.router.navigateByUrl("/credentials/view-credentials")))
        .subscribe();
    }
  }
}
