import { deepEqual, instance, verify, mock } from 'ts-mockito';

import { SchedulePing } from '../../src/schedule/SchedulePing';
import { ExecutionsRepository } from '../../src/repository/ExecutionsRepository';
import { sleep } from '../utils/sleep';
import { JobRepository } from '../../src/repository/JobRepository';

let jobRepository: JobRepository;
let executionsRepository: ExecutionsRepository;
jest.mock('../../src/repository/getRepository', () => {
  return {
    getJobRepository: () => instance(jobRepository),
    getExecutionsRepository: () => instance(executionsRepository),
  };
});

describe('SchedulePing', () => {
  const scheduleId = '123';
  const schedulePing = new SchedulePing(scheduleId, { debug: jest.fn(), error: jest.fn() });

  beforeAll(() => {
    SchedulePing.interval = 1000;
    executionsRepository = mock(ExecutionsRepository);
  });

  it('starts, pings, cleans and stops', async () => {
    schedulePing.start();
    await sleep(SchedulePing.interval);

    verify(executionsRepository.ping(scheduleId)).once();
    verify(executionsRepository.clean()).once();

    await schedulePing.stop();
    await sleep(SchedulePing.interval);

    verify(executionsRepository.ping(scheduleId)).once();
    verify(executionsRepository.deleteOne(deepEqual({ scheduleId: scheduleId }))).once();
  });
});
