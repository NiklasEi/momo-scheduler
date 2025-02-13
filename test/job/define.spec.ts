import { mockJobRepository } from '../utils/mockJobRepository';
import { JobRepository } from '../../src/repository/JobRepository';
import { deepEqual, verify, when } from 'ts-mockito';
import { define } from '../../src/job/define';
import { createJobEntity } from '../utils/createJobEntity';
import { DateTime } from 'luxon';
import { ExecutionInfo } from '../../src';
import { withDefaults } from '../../src/job/withDefaults';

describe('define', () => {
  const job = { name: 'test', interval: '1 minute', handler: () => 'finished' };

  let jobRepository: JobRepository;

  it('saves a job', async () => {
    jobRepository = mockJobRepository();

    when(jobRepository.find(deepEqual({ name: job.name }))).thenResolve([]);

    await define(withDefaults(job));

    verify(jobRepository.save(deepEqual(createJobEntity(job)))).once();
  });

  it('updates a job', async () => {
    jobRepository = mockJobRepository();

    when(jobRepository.find(deepEqual({ name: job.name }))).thenResolve([createJobEntity(job)]);

    const newInterval = '2 minutes';
    await define(withDefaults({ ...job, interval: newInterval }));

    verify(jobRepository.updateJob(job.name, deepEqual(createJobEntity({ ...job, interval: newInterval })))).once();
  });

  it('cleans up duplicate jobs but keeps latest job', async () => {
    const duplicate = createJobEntity(job);
    const latest = createJobEntity(job);
    latest.executionInfo = { lastFinished: DateTime.now().toISO() } as ExecutionInfo;
    when(jobRepository.find(deepEqual({ name: job.name }))).thenResolve([duplicate, latest]);

    const newInterval = 'two minutes';
    await define(withDefaults({ ...job, interval: newInterval }));

    verify(jobRepository.remove(deepEqual([duplicate]))).once();
    verify(jobRepository.updateJob(job.name, deepEqual(createJobEntity({ ...job, interval: newInterval })))).once();
  });
});
