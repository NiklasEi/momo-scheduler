export { MongoSchedule } from './schedule/MongoSchedule';
export { MomoConnectionOptions } from './connect';
export { MomoError } from './logging/error/MomoError';
export { MomoErrorType } from './logging/error/MomoErrorType';
export { MomoEvent, MomoErrorEvent, MomoEventData } from './logging/MomoEvents';
export { MomoJob } from './job/MomoJob';
export { ExecutionStatus } from './job/ExecutionInfo';
export { ExecutionInfo } from './job/ExecutionInfo';
export { isConnected } from './isConnected';
export { check } from './job/check';
export { clear } from './job/clear';
export { list } from './job/list';

import { connect as connectInternal, MomoConnectionOptions } from './connect';

export async function connect(options: MomoConnectionOptions): Promise<void> {
  await connectInternal(options);
}
