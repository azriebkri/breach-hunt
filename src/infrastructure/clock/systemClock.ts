import { Clock } from '../../entities/gateways/clock';

const createSystemClock = (): Clock => ({
  now: () => new Date(),
});

export { createSystemClock };
