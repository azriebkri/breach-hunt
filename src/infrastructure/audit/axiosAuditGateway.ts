import axios from 'axios';
import { AuditGateway } from '../../entities/gateways/auditGateway';
import { Clock } from '../../entities/gateways/clock';
import { LoggerGateway } from '../../entities/gateways/logger';

interface AxiosAuditGatewayDependencies {
  readonly auditUrl: string;
  readonly clock: Clock;
  readonly logger: LoggerGateway;
}

const createAxiosAuditGateway = (
  deps: AxiosAuditGatewayDependencies,
): AuditGateway => {
  const publish = async (
    event: string,
    payload: Record<string, unknown>,
  ): Promise<void> => {
    try {
      await axios.post(deps.auditUrl, {
        event,
        payload,
        at: deps.clock.now().toISOString(),
      });
    } catch (error) {
      deps.logger.error('failed to publish audit event', {
        activity: 'auditPublishFailed',
        event,
        reason: (error as Error).message,
      });
      throw error;
    }
  };

  return { publish };
};

export { createAxiosAuditGateway, AxiosAuditGatewayDependencies };
