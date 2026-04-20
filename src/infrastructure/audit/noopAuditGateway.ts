import { AuditGateway } from '../../entities/gateways/auditGateway';

const createNoopAuditGateway = (): AuditGateway => ({
  publish: async (): Promise<void> => {
    // intentionally empty - used when audit sink is not configured
  },
});

export { createNoopAuditGateway };
