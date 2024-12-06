import { injectable, multiInject, optional } from "inversify";
import { CONTAINER_TYPES } from "../interfaces/constants/container.types";
import { IConsumers } from "../interfaces/messaging/consumers.interface";

@injectable()
export class ConsumerRegistrar {
  constructor(
    @multiInject(CONTAINER_TYPES.IConsumers) @optional() private consumers: IConsumers[]
  ) {}

  registerAll(): void {
    this.consumers.forEach(consumerModule => {
      try {
        consumerModule.startListening();
        console.log(`Registered consumer for: ${consumerModule.constructor.name}`);
      } catch (error) {
        console.error(`Failed to register consumer for ${consumerModule.constructor.name}:`, error);
      }
    });
  }
}